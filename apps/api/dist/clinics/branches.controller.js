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
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards, } from '@nestjs/common';
import { BranchesService } from './branches.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
let BranchesController = class BranchesController {
    branchesService;
    constructor(branchesService) {
        this.branchesService = branchesService;
    }
    getBranches(req, clinicId) {
        return this.branchesService.getBranches(req.user.userId, clinicId);
    }
    createBranch(req, clinicId, dto) {
        return this.branchesService.createBranch(req.user.userId, clinicId, dto);
    }
};
__decorate([
    Get(':clinicId/branches'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BranchesController.prototype, "getBranches", null);
__decorate([
    Post(':clinicId/branches'),
    __param(0, Req()),
    __param(1, Param('clinicId', ParseUUIDPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateBranchDto]),
    __metadata("design:returntype", void 0)
], BranchesController.prototype, "createBranch", null);
BranchesController = __decorate([
    Controller('clinics'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BranchesService])
], BranchesController);
export { BranchesController };
//# sourceMappingURL=branches.controller.js.map