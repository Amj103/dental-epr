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
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, Patch, Delete, UseGuards, } from '@nestjs/common';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto.js';
import { MedicalHistoryService } from './medical-history.service.js';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
let MedicalHistoryController = class MedicalHistoryController {
    medicalHistoryService;
    constructor(medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }
    createEntry(req, clinicId, patientId, dto) {
        return this.medicalHistoryService.createEntry(req.user.userId, clinicId, patientId, dto);
    }
    getHistory(req, clinicId, patientId) {
        return this.medicalHistoryService.getHistory(req.user.userId, clinicId, patientId);
    }
    updateEntry(req, clinicId, entryId, patientId, dto) {
        return this.medicalHistoryService.updateEntry(req.user.userId, clinicId, patientId, entryId, dto);
    }
    deactivateEntry(req, clinicId, patientId, entryId) {
        return this.medicalHistoryService.deactivateEntry(req.user.userId, clinicId, patientId, entryId);
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, CreateMedicalHistoryDto]),
    __metadata("design:returntype", void 0)
], MedicalHistoryController.prototype, "createEntry", null);
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MedicalHistoryController.prototype, "getHistory", null);
__decorate([
    Patch(':entryId'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('entryId', ParseUUIDPipe)),
    __param(3, Param('patientId', ParseUUIDPipe)),
    __param(4, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, UpdateMedicalHistoryDto]),
    __metadata("design:returntype", void 0)
], MedicalHistoryController.prototype, "updateEntry", null);
__decorate([
    Delete(':entryId'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Param('entryId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], MedicalHistoryController.prototype, "deactivateEntry", null);
MedicalHistoryController = __decorate([
    Controller('clinics/:clinicId/patients/:patientId/medical-history'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [MedicalHistoryService])
], MedicalHistoryController);
export { MedicalHistoryController };
//# sourceMappingURL=medical-history.controller.js.map