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
import { Body, Controller, Get, Param, Post, Patch, Req, UseGuards, } from '@nestjs/common';
import { UpdateTreatmentProcedureDto } from './dto/update-treatment-procedure.dto.js';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto.js';
import { Query } from '@nestjs/common';
import { TreatmentHistoryQueryDto } from './dto/treatment-history-query.dto.js';
import { UpdateTreatmentAppointmentDto } from './dto/update-treatment-appointment.dto.js';
import { CreateTreatmentAppointmentDto } from './dto/create-treatment-appointment.dto.js';
import { CreateTreatmentProcedureDto } from './dto/create-treatment-procedure.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
import { TreatmentService } from './treatment.service.js';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto.js';
let TreatmentController = class TreatmentController {
    treatmentService;
    constructor(treatmentService) {
        this.treatmentService = treatmentService;
    }
    create(req, clinicId, patientId, dto) {
        return this.treatmentService.create(req.user.userId, clinicId, patientId, dto);
    }
    findAll(req, clinicId, patientId) {
        return this.treatmentService.findAll(req.user.userId, clinicId, patientId);
    }
    update(req, clinicId, patientId, planId, dto) {
        return this.treatmentService.update(req.user.userId, clinicId, patientId, planId, dto);
    }
    createProcedure(req, clinicId, patientId, planId, dto) {
        return this.treatmentService.createProcedure(req.user.userId, clinicId, patientId, planId, dto);
    }
    createAppointment(req, clinicId, patientId, planId, procedureId, dto) {
        return this.treatmentService.createAppointment(req.user.userId, clinicId, patientId, planId, procedureId, dto);
    }
    updateAppointment(req, clinicId, patientId, planId, procedureId, appointmentId, dto) {
        return this.treatmentService.updateAppointment(req.user.userId, clinicId, patientId, planId, procedureId, appointmentId, dto);
    }
    findAppointments(req, clinicId, patientId, planId, procedureId) {
        return this.treatmentService.findAppointments(req.user.userId, clinicId, patientId, planId, procedureId);
    }
    getHistory(req, clinicId, patientId, filters) {
        return this.treatmentService.getHistory(req.user.userId, clinicId, patientId, filters);
    }
    async updateProcedure(req, clinicId, patientId, planId, procedureId, dto) {
        return this.treatmentService.updateProcedure(req.user.userId, clinicId, patientId, planId, procedureId, dto);
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, CreateTreatmentPlanDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "findAll", null);
__decorate([
    Patch(':planId'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, UpdateTreatmentPlanDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "update", null);
__decorate([
    Post(':planId/procedures'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, CreateTreatmentProcedureDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "createProcedure", null);
__decorate([
    Post(':planId/procedures/:procedureId/appointments'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Param('procedureId')),
    __param(5, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, CreateTreatmentAppointmentDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "createAppointment", null);
__decorate([
    Patch(':planId/procedures/:procedureId/appointments/:appointmentId'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Param('procedureId')),
    __param(5, Param('appointmentId')),
    __param(6, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, UpdateTreatmentAppointmentDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "updateAppointment", null);
__decorate([
    Get(':planId/procedures/:procedureId/appointments'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Param('procedureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "findAppointments", null);
__decorate([
    Get('history'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, TreatmentHistoryQueryDto]),
    __metadata("design:returntype", void 0)
], TreatmentController.prototype, "getHistory", null);
__decorate([
    Patch(':planId/procedures/:procedureId'),
    __param(0, Req()),
    __param(1, Param('clinicId')),
    __param(2, Param('patientId')),
    __param(3, Param('planId')),
    __param(4, Param('procedureId')),
    __param(5, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, UpdateTreatmentProcedureDto]),
    __metadata("design:returntype", Promise)
], TreatmentController.prototype, "updateProcedure", null);
TreatmentController = __decorate([
    Controller('clinics/:clinicId/patients/:patientId/treatment-plans'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [TreatmentService])
], TreatmentController);
export { TreatmentController };
//# sourceMappingURL=treatment.controller.js.map