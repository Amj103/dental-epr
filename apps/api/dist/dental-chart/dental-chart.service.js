var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let DentalChartService = class DentalChartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkMembership(userId, clinicId) {
        const membership = await this.prisma.clinicMembership.findFirst({
            where: {
                userId,
                clinicId,
                status: 'ACTIVE',
            },
        });
        if (!membership) {
            throw new ForbiddenException('You do not have access to this clinic');
        }
        return membership;
    }
    async checkPatient(clinicId, patientId) {
        const patient = await this.prisma.patient.findFirst({
            where: {
                id: patientId,
                clinicId,
            },
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return patient;
    }
    async create(userId, clinicId, patientId, dto) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        const condition = dto.condition ?? 'HEALTHY';
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.dentalChartEntry.findUnique({
                where: {
                    clinicId_patientId_toothNumber: {
                        clinicId,
                        patientId,
                        toothNumber: dto.toothNumber,
                    },
                },
            });
            if (existing) {
                throw new BadRequestException('Dental chart entry already exists for this tooth');
            }
            const entry = await tx.dentalChartEntry.create({
                data: {
                    clinicId,
                    patientId,
                    toothNumber: dto.toothNumber,
                    condition,
                    notes: dto.notes,
                    surfaces: {
                        create: dto.surfaces ?? [],
                    },
                },
                include: {
                    surfaces: true,
                },
            });
            await tx.dentalChartHistory.create({
                data: {
                    clinicId,
                    patientId,
                    chartEntryId: entry.id,
                    previousCondition: null,
                    newCondition: condition,
                    previousNotes: null,
                    newNotes: dto.notes ?? null,
                    changedBy: userId,
                },
            });
            for (const surface of entry.surfaces) {
                await tx.dentalChartSurfaceHistory.create({
                    data: {
                        clinicId,
                        patientId,
                        chartEntryId: entry.id,
                        surfaceId: surface.id,
                        previousCondition: null,
                        newCondition: surface.condition,
                        previousNotes: null,
                        newNotes: surface.notes,
                        changedBy: userId,
                    },
                });
            }
            return entry;
        });
    }
    async getChart(userId, clinicId, patientId) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        return this.prisma.dentalChartEntry.findMany({
            where: {
                clinicId,
                patientId,
            },
            include: {
                surfaces: true,
            },
            orderBy: {
                toothNumber: 'asc',
            },
        });
    }
    async getToothHistory(userId, clinicId, patientId, toothNumber, page = 1, limit = 20) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        const skip = (page - 1) * limit;
        const where = {
            clinicId,
            patientId,
            ...(toothNumber && {
                chartEntry: {
                    toothNumber,
                },
            }),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.dentalChartHistory.findMany({
                where,
                orderBy: {
                    changedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.dentalChartHistory.count({ where }),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSurfaceHistory(userId, clinicId, patientId, toothNumber, page = 1, limit = 20) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        const skip = (page - 1) * limit;
        const where = {
            clinicId,
            patientId,
            ...(toothNumber && {
                chartEntry: {
                    toothNumber,
                },
            }),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.dentalChartSurfaceHistory.findMany({
                where,
                orderBy: {
                    changedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.dentalChartSurfaceHistory.count({ where }),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async update(userId, clinicId, patientId, toothNumber, dto) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.dentalChartEntry.findUnique({
                where: {
                    clinicId_patientId_toothNumber: {
                        clinicId,
                        patientId,
                        toothNumber,
                    },
                },
            });
            if (!existing) {
                throw new NotFoundException('Dental chart entry not found');
            }
            const newCondition = dto.condition ?? existing.condition;
            const newNotes = dto.notes !== undefined ? dto.notes : existing.notes;
            const conditionChanged = newCondition !== existing.condition;
            const notesChanged = newNotes !== existing.notes;
            await tx.dentalChartEntry.update({
                where: {
                    id: existing.id,
                },
                data: {
                    condition: newCondition,
                    notes: newNotes,
                },
            });
            if (conditionChanged || notesChanged) {
                await tx.dentalChartHistory.create({
                    data: {
                        clinicId,
                        patientId,
                        chartEntryId: existing.id,
                        previousCondition: existing.condition,
                        newCondition,
                        previousNotes: existing.notes,
                        newNotes,
                        changedBy: userId,
                    },
                });
            }
            if (dto.surfaces) {
                for (const surface of dto.surfaces) {
                    const existingSurface = await tx.dentalChartSurface.findUnique({
                        where: {
                            chartEntryId_surface: {
                                chartEntryId: existing.id,
                                surface: surface.surface,
                            },
                        },
                    });
                    if (!existingSurface) {
                        const createdSurface = await tx.dentalChartSurface.create({
                            data: {
                                chartEntryId: existing.id,
                                surface: surface.surface,
                                condition: surface.condition,
                                notes: surface.notes,
                            },
                        });
                        await tx.dentalChartSurfaceHistory.create({
                            data: {
                                clinicId,
                                patientId,
                                chartEntryId: existing.id,
                                surfaceId: createdSurface.id,
                                previousCondition: null,
                                newCondition: createdSurface.condition,
                                previousNotes: null,
                                newNotes: createdSurface.notes,
                                changedBy: userId,
                            },
                        });
                    }
                    else {
                        const newSurfaceNotes = surface.notes !== undefined
                            ? surface.notes
                            : existingSurface.notes;
                        const conditionChanged = existingSurface.condition !== surface.condition;
                        const notesChanged = existingSurface.notes !== newSurfaceNotes;
                        if (!conditionChanged && !notesChanged) {
                            continue;
                        }
                        const updatedSurface = await tx.dentalChartSurface.update({
                            where: {
                                id: existingSurface.id,
                            },
                            data: {
                                condition: surface.condition,
                                notes: newSurfaceNotes,
                            },
                        });
                        await tx.dentalChartSurfaceHistory.create({
                            data: {
                                clinicId,
                                patientId,
                                chartEntryId: existing.id,
                                surfaceId: existingSurface.id,
                                previousCondition: existingSurface.condition,
                                newCondition: updatedSurface.condition,
                                previousNotes: existingSurface.notes,
                                newNotes: updatedSurface.notes,
                                changedBy: userId,
                            },
                        });
                    }
                }
            }
            return tx.dentalChartEntry.findUnique({
                where: {
                    id: existing.id,
                },
                include: {
                    surfaces: true,
                },
            });
        });
    }
    async remove(userId, clinicId, patientId, toothNumber) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        const entry = await this.prisma.dentalChartEntry.findUnique({
            where: {
                clinicId_patientId_toothNumber: {
                    clinicId,
                    patientId,
                    toothNumber,
                },
            },
        });
        if (!entry) {
            throw new NotFoundException('Dental chart entry not found');
        }
        throw new BadRequestException('Clinical dental records cannot be permanently deleted');
    }
};
DentalChartService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DentalChartService);
export { DentalChartService };
//# sourceMappingURL=dental-chart.service.js.map