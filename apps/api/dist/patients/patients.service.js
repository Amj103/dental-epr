var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException, NotFoundException, ConflictException, } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPatient(userId, clinicId, branchId, dto) {
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
        const branch = await this.prisma.branch.findFirst({
            where: {
                id: branchId,
                clinicId,
            },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found in this clinic');
        }
        for (let attempt = 0; attempt < 3; attempt++) {
            const patientNumber = `PAT-${randomBytes(4).toString('hex').toUpperCase()}`;
            try {
                return await this.prisma.patient.create({
                    data: {
                        clinicId,
                        branchId,
                        patientNumber,
                        firstName: dto.firstName.trim(),
                        lastName: dto.lastName.trim(),
                        dateOfBirth: dto.dateOfBirth
                            ? new Date(dto.dateOfBirth)
                            : undefined,
                        gender: dto.gender ?? 'UNKNOWN',
                        phone: dto.phone?.trim(),
                        email: dto.email?.trim().toLowerCase(),
                        address: dto.address?.trim(),
                        city: dto.city?.trim(),
                        state: dto.state?.trim(),
                        pincode: dto.pincode?.trim(),
                    },
                });
            }
            catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002' &&
                    attempt < 2) {
                    continue;
                }
                if (error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002') {
                    throw new ConflictException('Could not generate a unique patient number. Please try again.');
                }
                throw error;
            }
        }
        throw new ConflictException('Patient registration failed. Please try again.');
    }
    async getPatients(userId, clinicId, branchId, query) {
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
        const branch = await this.prisma.branch.findFirst({
            where: {
                id: branchId,
                clinicId,
            },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found in this clinic');
        }
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const search = query.search?.trim();
        const where = {
            clinicId,
            branchId,
            ...(search
                ? {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { patientNumber: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search } },
                    ],
                }
                : {}),
        };
        const [patients, total] = await this.prisma.$transaction([
            this.prisma.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.patient.count({ where }),
        ]);
        return {
            data: patients,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPatientById(userId, clinicId, branchId, patientId) {
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
        const patient = await this.prisma.patient.findFirst({
            where: {
                id: patientId,
                clinicId,
                branchId,
            },
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return patient;
    }
};
PatientsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PatientsService);
export { PatientsService };
//# sourceMappingURL=patients.service.js.map