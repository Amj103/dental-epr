import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvoice(clinicId: string, userId: string, dto: CreateInvoiceDto) {
    // Verify patient belongs to clinic
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: dto.patientId,
        clinicId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found in this clinic');
    }

    // Validate treatment plan if supplied
    if (dto.treatmentPlanId) {
      const plan = await this.prisma.treatmentPlan.findFirst({
        where: {
          id: dto.treatmentPlanId,
          clinicId,
          patientId: dto.patientId,
        },
      });

      if (!plan) {
        throw new NotFoundException(
          'Treatment plan not found for this patient',
        );
      }
    }

    // Calculate invoice items
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    const items = dto.items.map((item) => {
      const quantity = item.quantity;
      const unitPrice = item.unitPrice;
      const discount = item.discount ?? 0;
      const taxRate = item.taxRate ?? 0;

      const baseAmount = quantity * unitPrice;

      if (discount > baseAmount) {
        throw new BadRequestException(
          'Item discount cannot exceed its base amount',
        );
      }

      const taxableAmount = baseAmount - discount;
      const itemTax = Number(((taxableAmount * taxRate) / 100).toFixed(2));
      const itemTotal = Number((taxableAmount + itemTax).toFixed(2));

      subtotal += baseAmount;
      discountAmount += discount;
      taxAmount += itemTax;

      return {
        description: item.description,
        quantity,
        unitPrice,
        discount,
        taxRate,
        taxAmount: itemTax,
        totalAmount: itemTotal,
        treatmentProcedureId: item.treatmentProcedureId,
      };
    });

    subtotal = Number(subtotal.toFixed(2));
    discountAmount = Number(discountAmount.toFixed(2));
    taxAmount = Number(taxAmount.toFixed(2));

    const totalAmount = Number(
      (subtotal - discountAmount + taxAmount).toFixed(2),
    );

    // Create invoice and items atomically

    return this.prisma.$transaction(async (tx) => {
      // Atomically allocate the next invoice number for this clinic
      const counter = await tx.invoiceCounter.upsert({
        where: { clinicId },
        update: {
          lastNumber: { increment: 1 },
        },
        create: {
          clinicId,
          lastNumber: 1,
        },
      });

      const invoiceNumber = `INV-${String(counter.lastNumber).padStart(6, '0')}`;

      // Create invoice and items atomically
      // Create invoice and items atomically
      const invoice = await tx.invoice.create({
        data: {
          clinicId,
          patientId: dto.patientId,
          treatmentPlanId: dto.treatmentPlanId,
          invoiceNumber,
          subtotal,
          discountAmount,
          taxAmount,
          totalAmount,
          paidAmount: 0,
          dueAmount: totalAmount,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          notes: dto.notes,
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });

      // Record invoice creation in audit log
      await this.createBillingAuditLog(tx, {
        clinicId,
        userId,
        entity: 'INVOICE',
        entityId: invoice.id,
        action: 'INVOICE_CREATED',
        description: `Invoice ${invoice.invoiceNumber} created`,
        newValues: {
          invoiceNumber: invoice.invoiceNumber,
          patientId: invoice.patientId,
          totalAmount: invoice.totalAmount.toString(),
          status: invoice.status,
        },
      });

      return invoice;
    });
  }
  async issueInvoice(clinicId: string, invoiceId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: {
          id: invoiceId,
          clinicId,
        },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      if (invoice.status !== 'DRAFT') {
        throw new BadRequestException('Only draft invoices can be issued');
      }

      const updatedInvoice = await tx.invoice.update({
        where: {
          clinicId_id: {
            clinicId,
            id: invoiceId,
          },
        },
        data: {
          status: 'ISSUED',
          issuedAt: new Date(),
        },
      });

      await this.createBillingAuditLog(tx, {
        clinicId,
        userId,
        entity: 'INVOICE',
        entityId: invoice.id,
        action: 'INVOICE_ISSUED',
        description: `Invoice ${invoice.invoiceNumber} issued`,
        oldValues: {
          status: invoice.status,
        },
        newValues: {
          status: updatedInvoice.status,
          issuedAt: updatedInvoice.issuedAt?.toISOString(),
        },
      });

      return updatedInvoice;
    });
  }

  async recordPayment(
    clinicId: string,
    invoiceId: string,
    userId: string,
    dto: import('./dto/create-payment/create-payment.js').CreatePayment,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Lock the invoice row until this transaction finishes
      await tx.$queryRaw`
        SELECT "id"
        FROM "Invoice"
        WHERE "clinicId" = ${clinicId}::uuid
        AND "id" = ${invoiceId}::uuid
        FOR UPDATE
        `;

      // Fetch invoice after acquiring the lock
      const invoice = await tx.invoice.findUnique({
        where: {
          clinicId_id: {
            clinicId,
            id: invoiceId,
          },
        },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      if (!['ISSUED', 'PARTIALLY_PAID'].includes(invoice.status)) {
        throw new BadRequestException(
          'Payments can only be recorded for issued invoices',
        );
      }

      const amount = new Prisma.Decimal(dto.amount);
      const dueAmount = new Prisma.Decimal(invoice.dueAmount);

      if (amount.greaterThan(dueAmount)) {
        throw new BadRequestException(
          'Payment cannot exceed the outstanding invoice amount',
        );
      }

      const paidAmount = new Prisma.Decimal(invoice.paidAmount).plus(amount);
      const remainingAmount = new Prisma.Decimal(invoice.totalAmount).minus(
        paidAmount,
      );
      const paymentCounter = await tx.paymentCounter.upsert({
        where: { clinicId },
        update: {
          lastNumber: { increment: 1 },
        },
        create: {
          clinicId,
          lastNumber: 1,
        },
      });

      const paymentNumber = `PAY-${String(paymentCounter.lastNumber).padStart(6, '0')}`;
      const payment = await tx.payment.create({
        data: {
          clinicId,
          invoiceId,
          paymentNumber,
          amount,
          method: dto.method,
          transactionId: dto.transactionId,
          reference: dto.reference,
          notes: dto.notes,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: {
          clinicId_id: {
            clinicId,
            id: invoiceId,
          },
        },
        data: {
          paidAmount,
          dueAmount: remainingAmount,
          status: remainingAmount.equals(0) ? 'PAID' : 'PARTIALLY_PAID',
        },
      });

      // ADD AUDIT LOG HERE
      await this.createBillingAuditLog(tx, {
        clinicId,
        userId,
        entity: 'PAYMENT',
        entityId: payment.id,
        action: 'PAYMENT_RECORDED',
        description: `Payment ${payment.paymentNumber} recorded`,
        newValues: {
          paymentNumber: payment.paymentNumber,
          invoiceId,
          amount: payment.amount.toString(),
          method: payment.method,
          status: payment.status,
          invoicePaidAmount: updatedInvoice.paidAmount.toString(),
          invoiceDueAmount: updatedInvoice.dueAmount.toString(),
        },
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });
  }

  async getInvoices(clinicId: string) {
    return this.prisma.invoice.findMany({
      where: { clinicId },
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createRefund(
    clinicId: string,
    invoiceId: string,
    paymentId: string,
    userId: string,
    dto: CreateRefundDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Lock invoice to serialize payment/refund operations
      await tx.$queryRaw`
      SELECT "id"
      FROM "Invoice"
      WHERE "clinicId" = ${clinicId}::uuid
        AND "id" = ${invoiceId}::uuid
      FOR UPDATE
    `;

      const invoice = await tx.invoice.findUnique({
        where: {
          clinicId_id: {
            clinicId,
            id: invoiceId,
          },
        },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      const payment = await tx.payment.findFirst({
        where: {
          clinicId,
          invoiceId,
          id: paymentId,
        },
      });

      if (!payment || payment.status !== 'COMPLETED') {
        throw new BadRequestException(
          'Refunds can only be processed for completed payments',
        );
      }

      const amount = new Prisma.Decimal(dto.amount);

      const existingRefunds = await tx.refund.aggregate({
        where: {
          clinicId,
          paymentId,
        },
        _sum: {
          amount: true,
        },
      });

      const alreadyRefunded = new Prisma.Decimal(
        existingRefunds._sum.amount ?? 0,
      );

      const refundableAmount = new Prisma.Decimal(payment.amount).minus(
        alreadyRefunded,
      );

      if (amount.greaterThan(refundableAmount)) {
        throw new BadRequestException(
          'Refund cannot exceed the remaining refundable payment amount',
        );
      }

      const refundCounter = await tx.refundCounter.upsert({
        where: { clinicId },
        update: {
          lastNumber: { increment: 1 },
        },
        create: {
          clinicId,
          lastNumber: 1,
        },
      });

      const refundNumber = `REF-${String(refundCounter.lastNumber).padStart(6, '0')}`;

      const refund = await tx.refund.create({
        data: {
          clinicId,
          paymentId,
          refundNumber,
          amount,
          reason: dto.reason,
          reference: dto.reference,
          notes: dto.notes,
        },
      });
      const totalRefunded = alreadyRefunded.plus(amount);

      const updatedPayment = await tx.payment.update({
        where: {
          clinicId_id: {
            clinicId,
            id: paymentId,
          },
        },
        data: {
          status: totalRefunded.equals(payment.amount)
            ? 'REFUNDED'
            : 'PARTIALLY_REFUNDED',
        },
      });

      // Reduce net amount paid on invoice
      const paidAmount = new Prisma.Decimal(invoice.paidAmount).minus(amount);

      const dueAmount = new Prisma.Decimal(invoice.totalAmount).minus(
        paidAmount,
      );

      const updatedInvoice = await tx.invoice.update({
        where: {
          clinicId_id: {
            clinicId,
            id: invoiceId,
          },
        },
        data: {
          paidAmount,
          dueAmount,
          status: dueAmount.equals(0)
            ? 'PAID'
            : paidAmount.equals(0)
              ? 'ISSUED'
              : 'PARTIALLY_PAID',
        },
      });
      // Create refund audit log
      await this.createBillingAuditLog(tx, {
        clinicId,
        userId,
        entity: 'REFUND',
        entityId: refund.id,
        action: 'REFUND_CREATED',
        description: `Refund ${refund.refundNumber} created`,
        oldValues: {
          paymentStatus: payment.status,
          invoicePaidAmount: invoice.paidAmount.toString(),
          invoiceDueAmount: invoice.dueAmount.toString(),
        },
        newValues: {
          refundNumber: refund.refundNumber,
          paymentId,
          invoiceId,
          amount: refund.amount.toString(),
          reason: refund.reason,
          paymentStatus: updatedPayment.status,
          invoicePaidAmount: updatedInvoice.paidAmount.toString(),
          invoiceDueAmount: updatedInvoice.dueAmount.toString(),
        },
      });

      return {
        refund,
        invoice: updatedInvoice,
      };
    });
  }
  async getInvoice(clinicId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        clinicId_id: {
          clinicId,
          id: invoiceId,
        },
      },
      include: {
        patient: true,
        items: true,
        payments: {
          orderBy: {
            receivedAt: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getPayments(clinicId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        clinicId_id: {
          clinicId,
          id: invoiceId,
        },
      },
      select: { id: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return this.prisma.payment.findMany({
      where: {
        clinicId,
        invoiceId,
      },
      orderBy: {
        receivedAt: 'desc',
      },
    });
  }

  async reconcilePaymentStatus(
    clinicId: string,
    invoiceId: string,
    paymentId: string,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: {
          clinicId,
          invoiceId,
          id: paymentId,
        },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      const refunds = await tx.refund.aggregate({
        where: {
          clinicId,
          paymentId,
        },
        _sum: {
          amount: true,
        },
      });

      const totalRefunded = new Prisma.Decimal(refunds._sum.amount ?? 0);

      const status = totalRefunded.equals(0)
        ? 'COMPLETED'
        : totalRefunded.equals(payment.amount)
          ? 'REFUNDED'
          : 'PARTIALLY_REFUNDED';

      const updatedPayment = await tx.payment.update({
        where: {
          clinicId_id: {
            clinicId,
            id: paymentId,
          },
        },
        data: {
          status,
        },
      });

      await this.createBillingAuditLog(tx, {
        clinicId,
        userId,
        entity: 'PAYMENT',
        entityId: payment.id,
        action: 'PAYMENT_RECONCILED',
        description: `Payment ${payment.paymentNumber} reconciled`,
        oldValues: {
          status: payment.status,
        },
        newValues: {
          status: updatedPayment.status,
          totalRefunded: totalRefunded.toString(),
        },
      });

      return updatedPayment;
    });
  }

  async getInvoiceRefunds(clinicId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        clinicId_id: {
          clinicId,
          id: invoiceId,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return this.prisma.refund.findMany({
      where: {
        clinicId,
        payment: {
          invoiceId,
        },
      },
      orderBy: {
        refundedAt: 'desc',
      },
    });
  }
  async getPaymentRefunds(
    clinicId: string,
    invoiceId: string,
    paymentId: string,
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        clinicId,
        invoiceId,
        id: paymentId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.refund.findMany({
      where: {
        clinicId,
        paymentId,
      },
      orderBy: {
        refundedAt: 'desc',
      },
    });
  }
  private async createBillingAuditLog(
    tx: Prisma.TransactionClient,
    data: {
      clinicId: string;
      userId: string;
      entity: 'INVOICE' | 'PAYMENT' | 'REFUND';
      entityId: string;
      action:
        | 'INVOICE_CREATED'
        | 'INVOICE_ISSUED'
        | 'PAYMENT_RECORDED'
        | 'REFUND_CREATED'
        | 'INVOICE_CANCELLED'
        | 'PAYMENT_RECONCILED';
      description: string;
      oldValues?: Prisma.InputJsonValue;
      newValues?: Prisma.InputJsonValue;
    },
  ) {
    return tx.billingAuditLog.create({
      data: {
        clinicId: data.clinicId,
        userId: data.userId,
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        description: data.description,
        oldValues: data.oldValues,
        newValues: data.newValues,
      },
    });
  }
}
