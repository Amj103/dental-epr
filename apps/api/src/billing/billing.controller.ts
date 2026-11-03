import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';

import { CreateRefundDto } from './dto/create-refund.dto.js';
import { CreatePayment } from './dto/create-payment/create-payment.js';
import { BillingService } from './billing.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics/:clinicId/invoices')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  createInvoice(
    @Param('clinicId') clinicId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(clinicId, req.user.userId, dto);
  }

  @Patch(':invoiceId/issue')
  issueInvoice(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.billingService.issueInvoice(
      clinicId,
      invoiceId,
      req.user.userId,
    );
  }

  @Post(':invoiceId/payments')
  recordPayment(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePayment,
  ) {
    return this.billingService.recordPayment(
      clinicId,
      invoiceId,
      req.user.userId,
      dto,
    );
  }

  @Get()
  getInvoices(@Param('clinicId') clinicId: string) {
    return this.billingService.getInvoices(clinicId);
  }

  @Get(':invoiceId')
  getInvoice(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.billingService.getInvoice(clinicId, invoiceId);
  }

  @Get(':invoiceId/payments')
  getPayments(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.billingService.getPayments(clinicId, invoiceId);
  }
  @Post(':invoiceId/payments/:paymentId/refunds')
  createRefund(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
    @Param('paymentId') paymentId: string,
    @Body() dto: CreateRefundDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.billingService.createRefund(
      clinicId,
      invoiceId,
      paymentId,
      req.user.userId,
      dto,
    );
  }
  @Post(':invoiceId/payments/:paymentId/reconcile')
  reconcilePaymentStatus(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
    @Param('paymentId') paymentId: string,
    @Req() req: any,
  ) {
    return this.billingService.reconcilePaymentStatus(
      clinicId,
      invoiceId,
      paymentId,
      req.user.userId,
    );
  }
  @Get(':invoiceId/refunds')
  getInvoiceRefunds(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.billingService.getInvoiceRefunds(clinicId, invoiceId);
  }
  @Get(':invoiceId/payments/:paymentId/refunds')
  getPaymentRefunds(
    @Param('clinicId') clinicId: string,
    @Param('invoiceId') invoiceId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.billingService.getPaymentRefunds(
      clinicId,
      invoiceId,
      paymentId,
    );
  }
}
