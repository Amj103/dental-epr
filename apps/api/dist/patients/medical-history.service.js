var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let MedicalHistoryService = class MedicalHistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEntry(userId, clinicId, patientId, dto) {
        const membership = await this.prisma.clinicMembership.findFirst({
            where: { userId, clinicId, status: 'ACTIVE' },
        });
        if (!membership) {
            throw new ForbiddenException('You do not have access to this clinic');
        }
        const patient = await this.prisma.patient.findFirst({
            where: { id: patientId, clinicId },
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return this.prisma.medicalHistoryEntry.create({
            data: {
                clinicId,
                patientId,
                category: dto.category,
                title: dto.title.trim(),
                details: dto.details?.trim(),
            },
        });
    }
    async getHistory(userId, clinicId, patientId) {
        const membership = await this.prisma.clinicMembership.findFirst({
            where: { userId, clinicId, status: 'ACTIVE' },
        });
        if (!membership) {
            throw new ForbiddenException('You do not have access to this clinic');
        }
        const patient = await this.prisma.patient.findFirst({
            where: { id: patientId, clinicId },
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return this.prisma.medicalHistoryEntry.findMany({
            where: { clinicId, patientId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateEntry(userId, clinicId, patientId, entryId, dto) {
        const membership = await this.prisma.clinicMembership.findFirst({
            where: { userId, clinicId, status: 'ACTIVE' },
        });
        if (!membership) {
            throw new ForbiddenException('You do not have access to this clinic');
        }
        const entry = await this.prisma.medicalHistoryEntry.findFirst({
            where: { id: entryId, clinicId, patientId },
        });
        if (!entry) {
            throw new NotFoundException('Medical history entry not found');
        }
        return this.prisma.medicalHistoryEntry.update({
            where: { id: entry.id },
            data: {
                ...(dto.category !== undefined && { category: dto.category }),
                ...(dto.title !== undefined && { title: dto.title.trim() }),
                ...(dto.details !== undefined && { details: dto.details.trim() }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async deactivateEntry(userId, clinicId, patientId, entryId) {
        const membership = await this.prisma.clinicMembership.findFirst({
            where: { userId, clinicId, status: 'ACTIVE' },
        });
        if (!membership) {
            throw new ForbiddenException('You do not have access to this clinic');
        }
        const entry = await this.prisma.medicalHistoryEntry.findFirst({
            where: { id: entryId, clinicId, patientId },
        });
        if (!entry) {
            throw new NotFoundException('Medical history entry not found');
        }
        return this.prisma.medicalHistoryEntry.update({
            where: { id: entry.id },
            data: { isActive: false },
        });
    }
};
MedicalHistoryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MedicalHistoryService);
export { MedicalHistoryService };
//# sourceMappingURL=medical-history.service.js.map