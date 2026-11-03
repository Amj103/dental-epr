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
import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, ParseUUIDPipe, Query, } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
import { CreateDentalChartDto } from './dto/create-dental-chart.dto.js';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto.js';
import { DentalChartService } from './dental-chart.service.js';
let DentalChartController = class DentalChartController {
    dentalChartService;
    constructor(dentalChartService) {
        this.dentalChartService = dentalChartService;
    }
    create(req, clinicId, patientId, dto) {
        return this.dentalChartService.create(req.user.userId, clinicId, patientId, dto);
    }
    getChart(req, clinicId, patientId) {
        return this.dentalChartService.getChart(req.user.userId, clinicId, patientId);
    }
    getToothHistory(req, clinicId, patientId, filters) {
        return this.dentalChartService.getToothHistory(req.user.userId, clinicId, patientId, filters.toothNumber, filters.page, filters.limit);
    }
    getSurfaceHistory(req, clinicId, patientId, filters) {
        return this.dentalChartService.getSurfaceHistory(req.user.userId, clinicId, patientId, filters.toothNumber, filters.page, filters.limit);
    }
    update(req, clinicId, patientId, toothNumber, dto) {
        return this.dentalChartService.update(req.user.userId, clinicId, patientId, toothNumber, dto);
    }
    remove(req, clinicId, patientId, toothNumber) {
        return this.dentalChartService.remove(req.user.userId, clinicId, patientId, toothNumber);
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, CreateDentalChartDto]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "getChart", null);
__decorate([
    Get('history'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, PaginationDto]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "getToothHistory", null);
__decorate([
    Get('surface-history'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, PaginationDto]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "getSurfaceHistory", null);
__decorate([
    Patch(':toothNumber'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Param('toothNumber')),
    __param(4, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, UpdateDentalChartDto]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "update", null);
__decorate([
    Delete(':toothNumber'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Param('patientId', ParseUUIDPipe)),
    __param(3, Param('toothNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], DentalChartController.prototype, "remove", null);
DentalChartController = __decorate([
    Controller('clinics/:clinicId/patients/:patientId/dental-chart'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [DentalChartService])
], DentalChartController);
export { DentalChartController };
//# sourceMappingURL=dental-chart.controller.js.map