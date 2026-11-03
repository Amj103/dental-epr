
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClinicDto } from './dto/create-clinic.dto.js';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async createClinic(userId: string, dto: CreateClinicDto) {
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A clinic with this slug already exists',
        );
      }

      throw error;
    }
  }
}
