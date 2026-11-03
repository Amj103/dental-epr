import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateDentalChartDto } from './dto/create-dental-chart.dto.js';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto.js';

@Injectable()
export class DentalChartService {
  constructor(private readonly prisma: PrismaService) {}

  // Verify clinic membership
  private async checkMembership(userId: string, clinicId: string) {
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

  // Verify patient belongs to clinic
  private async checkPatient(clinicId: string, patientId: string) {
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

  // CREATE DENTAL CHART ENTRY
  async create(
    userId: string,
    clinicId: string,
    patientId: string,
    dto: CreateDentalChartDto,
  ) {
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
        throw new BadRequestException(
          'Dental chart entry already exists for this tooth',
        );
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

      // Record initial clinical state
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
      // Record initial history for every tooth surface
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

  // GET COMPLETE DENTAL CHART
  async getChart(userId: string, clinicId: string, patientId: string) {
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

  // GET TOOTH HISTORY
  async getToothHistory(
    userId: string,
    clinicId: string,
    patientId: string,
    toothNumber?: string,
    page = 1,
    limit = 20,
  ) {
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

  // GET TOOTH SURFACE HISTORY
  // GET TOOTH SURFACE HISTORY
  async getSurfaceHistory(
    userId: string,
    clinicId: string,
    patientId: string,
    toothNumber?: string,
    page = 1,
    limit = 20,
  ) {
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

  // UPDATE TOOTH
  async update(
    userId: string,
    clinicId: string,
    patientId: string,
    toothNumber: string,
    dto: UpdateDentalChartDto,
  ) {
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

      // Update tooth details
      await tx.dentalChartEntry.update({
        where: {
          id: existing.id,
        },
        data: {
          condition: newCondition,
          notes: newNotes,
        },
      });

      // Record tooth history
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

      // Update individual tooth surfaces
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
            // Create new surface
            const createdSurface = await tx.dentalChartSurface.create({
              data: {
                chartEntryId: existing.id,
                surface: surface.surface,
                condition: surface.condition,
                notes: surface.notes,
              },
            });

            // Record initial surface history
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
          } else {
            // Preserve existing notes if not provided
            const newSurfaceNotes =
              surface.notes !== undefined
                ? surface.notes
                : existingSurface.notes;

            const conditionChanged =
              existingSurface.condition !== surface.condition;

            const notesChanged = existingSurface.notes !== newSurfaceNotes;

            if (!conditionChanged && !notesChanged) {
              continue;
            }

            // Update existing surface
            const updatedSurface = await tx.dentalChartSurface.update({
              where: {
                id: existingSurface.id,
              },
              data: {
                condition: surface.condition,
                notes: newSurfaceNotes,
              },
            });

            // Record surface history
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

      // Return updated tooth and surfaces
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

  // HARD DELETION IS DISABLED FOR CLINICAL RECORDS
  async remove(
    userId: string,
    clinicId: string,
    patientId: string,
    toothNumber: string,
  ) {
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

    throw new BadRequestException(
      'Clinical dental records cannot be permanently deleted',
    );
  }
}
