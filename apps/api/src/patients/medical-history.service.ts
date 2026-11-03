import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto.js';

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async createEntry(
    userId: string,
    clinicId: string,
    patientId: string,
    dto: CreateMedicalHistoryDto,
  ) {
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

  async getHistory(userId: string, clinicId: string, patientId: string) {
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

  async updateEntry(
    userId: string,
    clinicId: string,
    patientId: string,
    entryId: string,
    dto: UpdateMedicalHistoryDto,
  ) {
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

  async deactivateEntry(
    userId: string,
    clinicId: string,
    patientId: string,
    entryId: string,
  ) {
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
}
