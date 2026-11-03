var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException, ConflictException, } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let BranchesService = class BranchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBranch(userId, clinicId, dto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const membership = await tx.clinicMembership.findFirst({
                    where: {
                        userId,
                        clinicId,
                        status: 'ACTIVE',
                        role: {
                            in: ['OWNER', 'ADMIN'],
                        },
                    },
                });
                if (!membership) {
                    throw new ForbiddenException('You do not have permission to create branches in this clinic');
                }
                const branch = await tx.branch.create({
                    data: {
                        clinicId,
                        name: dto.name.trim(),
                        address: dto.address?.trim(),
                        city: dto.city?.trim(),
                        state: dto.state?.trim(),
                        pincode: dto.pincode?.trim(),
                    },
                });
                return {
                    message: 'Branch created successfully',
                    branch,
                };
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('A branch with this name already exists in this clinic');
            }
            throw error;
        }
    }
    async getBranches(userId, clinicId) {
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
        const branches = await this.prisma.branch.findMany({
            where: {
                clinicId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return {
            message: 'Branches retrieved successfully',
            count: branches.length,
            branches,
        };
    }
};
BranchesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BranchesService);
export { BranchesService };
//# sourceMappingURL=branches.service.js.map