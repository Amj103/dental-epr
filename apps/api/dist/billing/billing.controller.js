var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, Param, Req, UseGuards, Patch, Get, } from '@nestjs/common';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { CreatePayment } from './dto/create-payment/create-payment.js';
import { BillingService } from './billing.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    createInvoice(clinicId, req, dto) {
        return this.billingService.createInvoice(clinicId, req.user.userId, dto);
    }
    issueInvoice(clinicId, invoiceId, req) {
        return this.billingService.issueInvoice(clinicId, invoiceId, req.user.userId);
    }
    recordPayment(clinicId, invoiceId, req, dto) {
        return this.billingService.recordPayment(clinicId, invoiceId, req.user.userId, dto);
    }
    getInvoices(clinicId) {
        return this.billingService.getInvoices(clinicId);
    }
    getInvoice(clinicId, invoiceId) {
        return this.billingService.getInvoice(clinicId, invoiceId);
    }
    getPayments(clinicId, invoiceId) {
        return this.billingService.getPayments(clinicId, invoiceId);
    }
    createRefund(clinicId, invoiceId, paymentId, dto, req) {
        return this.billingService.createRefund(clinicId, invoiceId, paymentId, req.user.userId, dto);
    }
    reconcilePaymentStatus(clinicId, invoiceId, paymentId, req) {
        return this.billingService.reconcilePaymentStatus(clinicId, invoiceId, paymentId, req.user.userId);
    }
    getInvoiceRefunds(clinicId, invoiceId) {
        return this.billingService.getInvoiceRefunds(clinicId, invoiceId);
    }
    getPaymentRefunds(clinicId, invoiceId, paymentId) {
        return this.billingService.getPaymentRefunds(clinicId, invoiceId, paymentId);
    }
};
__decorate([
    Post(),
    __param(0, Param('clinicId')),
    __param(1, Req()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createInvoice", null);
__decorate([
    Patch(':invoiceId/issue'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "issueInvoice", null);
__decorate([
    Post(':invoiceId/payments'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __param(2, Req()),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, CreatePayment]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "recordPayment", null);
__decorate([
    Get(),
    __param(0, Param('clinicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getInvoices", null);
__decorate([
    Get(':invoiceId'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getInvoice", null);
__decorate([
    Get(':invoiceId/payments'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getPayments", null);
__decorate([
    Post(':invoiceId/payments/:paymentId/refunds'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __param(2, Param('paymentId')),
    __param(3, Body()),
    __param(4, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, CreateRefundDto, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createRefund", null);
__decorate([
    Post(':invoiceId/payments/:paymentId/reconcile'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __param(2, Param('paymentId')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "reconcilePaymentStatus", null);
__decorate([
    Get(':invoiceId/refunds'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getInvoiceRefunds", null);
__decorate([
    Get(':invoiceId/payments/:paymentId/refunds'),
    __param(0, Param('clinicId')),
    __param(1, Param('invoiceId')),
    __param(2, Param('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getPaymentRefunds", null);
BillingController = __decorate([
    Controller('clinics/:clinicId/invoices'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BillingService])
], BillingController);
export { BillingController };
//# sourceMappingURL=billing.controller.js.map