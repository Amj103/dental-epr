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
import { Body, Controller, Param, ParseUUIDPipe, Post, Get, Req, UseGuards, Query, } from '@nestjs/common';
import { ListPatientsQueryDto } from './dto/list-patients-query.dto.js';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    getPatients(req, clinicId, branchId, query) {
        return this.patientsService.getPatients(req.user.userId, clinicId, branchId, query);
    }
    getPatientById(req, clinicId, branchId, patientId) {
        return this.patientsService.getPatientById(req.user.userId, clinicId, branchId, patientId);
    }
    createPatient(req, clinicId, branchId, dto) {
        return this.patientsService.createPatient(req.user.userId, clinicId, branchId, dto);
    }
};
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('branchId', ParseUUIDPipe)),
    __param(3, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, ListPatientsQueryDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getPatients", null);
__decorate([
    Get(':patientId'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('branchId', ParseUUIDPipe)),
    __param(3, Param('patientId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getPatientById", null);
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('branchId', ParseUUIDPipe)),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, CreatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "createPatient", null);
PatientsController = __decorate([
    Controller('clinics/:clinicId/branches/:branchId/patients'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [PatientsService])
], PatientsController);
export { PatientsController };
//# sourceMappingURL=patients.controller.js.map