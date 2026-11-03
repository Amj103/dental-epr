
import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  // CREATE BRANCH
  async createBranch(
    userId: string,
    clinicId: string,
    dto: CreateBranchDto,
  ) {
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
          throw new ForbiddenException(
            'You do not have permission to create branches in this clinic',
          );
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A branch with this name already exists in this clinic',
        );
      }

      throw error;
    }
  }

  // GET ALL BRANCHES
  async getBranches(userId: string, clinicId: string) {
    const membership = await this.prisma.clinicMembership.findFirst({
      where: {
        userId,
        clinicId,
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this clinic',
      );
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
}
