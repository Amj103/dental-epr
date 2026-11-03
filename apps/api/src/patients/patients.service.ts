import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ListPatientsQueryDto } from './dto/list-patients-query.dto.js';
import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async createPatient(
    userId: string,
    clinicId: string,
    branchId: string,
    dto: CreatePatientDto,
  ) {
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
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          attempt < 2
        ) {
          continue;
        }

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            'Could not generate a unique patient number. Please try again.',
          );
        }

        throw error;
      }
    }

    throw new ConflictException(
      'Patient registration failed. Please try again.',
    );
  }

  async getPatients(
    userId: string,
    clinicId: string,
    branchId: string,
    query: ListPatientsQueryDto,
  ) {
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

    const where: Prisma.PatientWhereInput = {
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
  async getPatientById(
    userId: string,
    clinicId: string,
    branchId: string,
    patientId: string,
  ) {
    // Verify active clinic membership.
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

    // Find patient within the specified clinic and branch.
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
}
