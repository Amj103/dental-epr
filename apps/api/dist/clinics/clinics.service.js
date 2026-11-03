var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let ClinicsService = class ClinicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createClinic(userId, dto) {
        try {
            const clinic = await this.prisma.clinic.create({
                data: {
                    name: dto.name.trim(),
                    slug: dto.slug.trim().toLowerCase(),
                    email: dto.email?.trim().toLowerCase(),
                    phone: dto.phone?.trim(),
                    memberships: {
                        create: {
                            userId,
                            role: 'OWNER',
                            status: 'ACTIVE',
                        },
                    },
                },
                include: {
                    memberships: {
                        select: {
                            userId: true,
                            role: true,
                            status: true,
                        },
                    },
                },
            });
            return {
                message: 'Clinic created successfully',
                clinic,
            };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('A clinic with this slug already exists');
            }
            throw error;
        }
    }
};
ClinicsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ClinicsService);
export { ClinicsService };
//# sourceMappingURL=clinics.service.js.map