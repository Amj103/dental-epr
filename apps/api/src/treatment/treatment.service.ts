import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTreatmentProcedureDto } from './dto/update-treatment-procedure.dto.js';
import { TreatmentHistoryEntity as PrismaTreatmentHistoryEntity } from '@prisma/client';
import { TreatmentHistoryQueryDto } from './dto/treatment-history-query.dto.js';
import { CreateTreatmentAppointmentDto } from './dto/create-treatment-appointment.dto.js';
import { UpdateTreatmentAppointmentDto } from './dto/update-treatment-appointment.dto.js';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto.js';
import { TreatmentAppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto.js';
import { TreatmentPlanStatus as PrismaTreatmentPlanStatus } from '@prisma/client';
import { CreateTreatmentProcedureDto } from './dto/create-treatment-procedure.dto.js';
@Injectable()
export class TreatmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Verify that the user has active membership in this clinic
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

  // Verify that the patient belongs to this clinic
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

  // Create a treatment plan and record its history
  async create(
    userId: string,
    clinicId: string,
    patientId: string,
    dto: CreateTreatmentPlanDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    if (
      dto.startDate &&
      dto.targetDate &&
      new Date(dto.targetDate) < new Date(dto.startDate)
    ) {
      throw new BadRequestException(
        'Target date cannot be earlier than start date',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const treatmentPlan = await tx.treatmentPlan.create({
        data: {
          clinicId,
          patientId,
          createdBy: userId,
          title: dto.title,
          description: dto.description,
          clinicalNotes: dto.clinicalNotes,
          status: dto.status
            ? (dto.status as unknown as PrismaTreatmentPlanStatus)
            : PrismaTreatmentPlanStatus.DRAFT,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
          estimatedCost: dto.estimatedCost,
        },
        include: {
          procedures: true,
        },
      });

      await tx.treatmentHistory.create({
        data: {
          clinicId,
          patientId,
          changedBy: userId,
          entityType: 'PLAN',
          entityId: treatmentPlan.id,
          action: 'CREATED',
          newData: {
            title: treatmentPlan.title,
            description: treatmentPlan.description,
            clinicalNotes: treatmentPlan.clinicalNotes,
            status: treatmentPlan.status,
            startDate: treatmentPlan.startDate?.toISOString() ?? null,
            targetDate: treatmentPlan.targetDate?.toISOString() ?? null,
            estimatedCost: treatmentPlan.estimatedCost?.toString() ?? null,
          },
        },
      });

      return treatmentPlan;
    });
  }

  // Get all treatment plans for a patient
  async findAll(userId: string, clinicId: string, patientId: string) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    return this.prisma.treatmentPlan.findMany({
      where: {
        clinicId,
        patientId,
      },
      include: {
        procedures: {
          include: {
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  // Add a procedure to an existing treatment plan
  // Add a procedure and record its history
  async createProcedure(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    dto: CreateTreatmentProcedureDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const treatmentPlan = await this.prisma.treatmentPlan.findFirst({
      where: {
        id: planId,
        clinicId,
        patientId,
      },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    if (
      treatmentPlan.status === 'COMPLETED' ||
      treatmentPlan.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'Cannot add procedures to a completed or cancelled treatment plan',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const procedure = await tx.treatmentProcedure.create({
        data: {
          clinicId,
          treatmentPlanId: planId,
          name: dto.name,
          description: dto.description,
          toothNumber: dto.toothNumber,
          status: dto.status ?? 'PLANNED',
          estimatedCost: dto.estimatedCost,
        },
        include: {
          appointments: true,
        },
      });

      await tx.treatmentHistory.create({
        data: {
          clinicId,
          patientId,
          changedBy: userId,
          entityType: 'PROCEDURE',
          entityId: procedure.id,
          action: 'CREATED',
          newData: {
            treatmentPlanId: planId,
            name: procedure.name,
            description: procedure.description,
            toothNumber: procedure.toothNumber,
            status: procedure.status,
            estimatedCost: procedure.estimatedCost?.toString() ?? null,
          },
        },
      });

      return procedure;
    });
  }
  // Schedule an appointment and record its history
  async createAppointment(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    procedureId: string,
    dto: CreateTreatmentAppointmentDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const treatmentPlan = await this.prisma.treatmentPlan.findFirst({
      where: {
        id: planId,
        clinicId,
        patientId,
      },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    const procedure = await this.prisma.treatmentProcedure.findFirst({
      where: {
        id: procedureId,
        clinicId,
        treatmentPlanId: planId,
      },
    });

    if (!procedure) {
      throw new NotFoundException('Treatment procedure not found');
    }

    if (procedure.status === 'COMPLETED' || procedure.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot schedule appointments for completed or cancelled procedures',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.treatmentAppointment.create({
        data: {
          clinicId,
          treatmentProcedureId: procedureId,
          scheduledAt: new Date(dto.scheduledAt),
          durationMinutes: dto.durationMinutes ?? 30,
          notes: dto.notes,
          actualCost: dto.actualCost,
        },
        include: {
          treatmentProcedure: true,
        },
      });

      await tx.treatmentHistory.create({
        data: {
          clinicId,
          patientId,
          changedBy: userId,
          entityType: 'APPOINTMENT',
          entityId: appointment.id,
          action: 'CREATED',
          newData: {
            treatmentPlanId: planId,
            procedureId,
            scheduledAt: appointment.scheduledAt.toISOString(),
            durationMinutes: appointment.durationMinutes,
            status: appointment.status,
            notes: appointment.notes,
            actualCost: appointment.actualCost?.toString() ?? null,
          },
        },
      });

      return appointment;
    });
  }
  // Update an appointment and record its history
  async updateAppointment(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    procedureId: string,
    appointmentId: string,
    dto: UpdateTreatmentAppointmentDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const treatmentPlan = await this.prisma.treatmentPlan.findFirst({
      where: { id: planId, clinicId, patientId },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    const procedure = await this.prisma.treatmentProcedure.findFirst({
      where: { id: procedureId, clinicId, treatmentPlanId: planId },
    });

    if (!procedure) {
      throw new NotFoundException('Treatment procedure not found');
    }

    const appointment = await this.prisma.treatmentAppointment.findFirst({
      where: { id: appointmentId, clinicId, treatmentProcedureId: procedureId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const data = {
      ...(dto.scheduledAt !== undefined && {
        scheduledAt: new Date(dto.scheduledAt),
      }),
      ...(dto.durationMinutes !== undefined && {
        durationMinutes: dto.durationMinutes,
      }),
      ...(dto.status !== undefined && {
        status: dto.status as unknown as PrismaAppointmentStatus,
      }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.outcome !== undefined && { outcome: dto.outcome }),
      ...(dto.actualCost !== undefined && { actualCost: dto.actualCost }),
    };

    const updatedAppointment = await this.prisma.$transaction(async (tx) => {
      // Validate appointment status transitions
      if (data.status) {
        const allowedTransitions: Record<string, string[]> = {
          SCHEDULED: ['CONFIRMED', 'CANCELLED', 'NO_SHOW'],
          CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
          CHECKED_IN: ['IN_PROGRESS', 'CANCELLED'],
          IN_PROGRESS: ['COMPLETED'],
          COMPLETED: [],
          CANCELLED: [],
          NO_SHOW: [],
        };

        const currentStatus = appointment.status;
        const nextStatus = data.status;

        if (
          currentStatus !== nextStatus &&
          !allowedTransitions[currentStatus]?.includes(nextStatus)
        ) {
          throw new BadRequestException(
            `Invalid appointment status transition: ${currentStatus} → ${nextStatus}`,
          );
        }
      }
      const updated = await tx.treatmentAppointment.update({
        where: { id: appointmentId },
        data,
        include: { treatmentProcedure: true },
      });

      const previousData = {
        name: procedure.name,
        description: procedure.description,
        toothNumber: procedure.toothNumber,
        status: procedure.status,
        estimatedCost: procedure.estimatedCost?.toString() ?? null,
        actualCost: procedure.actualCost?.toString() ?? null,
        startedAt: procedure.startedAt?.toISOString() ?? null,
        completedAt: procedure.completedAt?.toISOString() ?? null,
      };

      const newData = {
        scheduledAt: updated.scheduledAt.toISOString(),
        durationMinutes: updated.durationMinutes,
        status: updated.status,
        notes: updated.notes,
        outcome: updated.outcome,
        actualCost: updated.actualCost?.toString() ?? null,
      };

      const scheduledAtChanged =
        appointment.scheduledAt.getTime() !== updated.scheduledAt.getTime();

      const statusChanged = appointment.status !== updated.status;

      const otherFieldsChanged =
        appointment.durationMinutes !== updated.durationMinutes ||
        appointment.notes !== updated.notes ||
        appointment.outcome !== updated.outcome ||
        appointment.actualCost?.toString() !== updated.actualCost?.toString();

      if (scheduledAtChanged || statusChanged || otherFieldsChanged) {
        const action =
          statusChanged && updated.status === 'CANCELLED'
            ? 'CANCELLED'
            : scheduledAtChanged
              ? 'RESCHEDULED'
              : statusChanged
                ? 'STATUS_CHANGED'
                : 'UPDATED';

        await tx.treatmentHistory.create({
          data: {
            clinicId,
            patientId,
            changedBy: userId,
            entityType: 'APPOINTMENT',
            entityId: appointmentId,
            action,
            previousData,
            newData,
          },
        });
      }
      // Recalculate procedure actual cost from appointments
      const appointments = await tx.treatmentAppointment.findMany({
        where: {
          treatmentProcedureId: procedureId,
          clinicId,
          status: 'COMPLETED',
        },
        select: {
          actualCost: true,
        },
      });

      const totalProcedureCost = appointments.reduce(
        (total, appointment) => total + Number(appointment.actualCost ?? 0),
        0,
      );

      await tx.treatmentProcedure.update({
        where: { id: procedureId },
        data: {
          actualCost: totalProcedureCost,
        },
      });
      // Recalculate treatment plan actual cost
      const procedures = await tx.treatmentProcedure.findMany({
        where: {
          treatmentPlanId: planId,
          clinicId,
          status: {
            not: 'CANCELLED',
          },
        },
        select: {
          actualCost: true,
        },
      });

      const totalActualCost = procedures.reduce(
        (total, procedure) => total + Number(procedure.actualCost ?? 0),
        0,
      );

      await tx.treatmentPlan.update({
        where: { id: planId },
        data: {
          actualCost: totalActualCost,
        },
      });
      return updated;
    });

    return updatedAppointment;
  }
  // Get all appointments for a treatment procedure
  async findAppointments(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    procedureId: string,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const treatmentPlan = await this.prisma.treatmentPlan.findFirst({
      where: {
        id: planId,
        clinicId,
        patientId,
      },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    const procedure = await this.prisma.treatmentProcedure.findFirst({
      where: {
        id: procedureId,
        clinicId,
        treatmentPlanId: planId,
      },
    });

    if (!procedure) {
      throw new NotFoundException('Treatment procedure not found');
    }

    return this.prisma.treatmentAppointment.findMany({
      where: {
        clinicId,
        treatmentProcedureId: procedureId,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }
  // Get paginated treatment history for a patient
  async getHistory(
    userId: string,
    clinicId: string,
    patientId: string,
    filters: TreatmentHistoryQueryDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      clinicId,
      patientId,
      ...(filters.entityType && {
        entityType: filters.entityType as PrismaTreatmentHistoryEntity,
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.treatmentHistory.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          changedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.treatmentHistory.count({ where }),
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
  // Update a treatment plan and record its history
  async update(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    dto: UpdateTreatmentPlanDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const treatmentPlan = await this.prisma.treatmentPlan.findFirst({
      where: {
        id: planId,
        clinicId,
        patientId,
      },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    if (
      treatmentPlan.status === 'COMPLETED' ||
      treatmentPlan.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'Completed or cancelled treatment plans cannot be modified',
      );
    }

    const newStatus = dto.status ?? treatmentPlan.status;

    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ['PROPOSED', 'CANCELLED'],
      PROPOSED: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (
      dto.status !== undefined &&
      dto.status !== treatmentPlan.status &&
      !allowedTransitions[treatmentPlan.status]?.includes(newStatus)
    ) {
      throw new BadRequestException(
        `Invalid treatment plan status transition: ${treatmentPlan.status} -> ${newStatus}`,
      );
    }
    if (newStatus === 'COMPLETED') {
      const procedures = await this.prisma.treatmentProcedure.findMany({
        where: {
          treatmentPlanId: planId,
          clinicId,
        },
        select: {
          status: true,
        },
      });

      if (procedures.length === 0) {
        throw new BadRequestException(
          'A treatment plan must have at least one procedure before completion',
        );
      }

      const unfinishedProcedures = procedures.filter(
        (procedure) =>
          procedure.status !== 'COMPLETED' && procedure.status !== 'CANCELLED',
      );

      if (unfinishedProcedures.length > 0) {
        throw new BadRequestException(
          'All procedures must be completed or cancelled before completing the treatment plan',
        );
      }
    }

    const startDate =
      dto.startDate !== undefined
        ? new Date(dto.startDate)
        : treatmentPlan.startDate;

    const targetDate =
      dto.targetDate !== undefined
        ? new Date(dto.targetDate)
        : treatmentPlan.targetDate;

    if (startDate && targetDate && targetDate < startDate) {
      throw new BadRequestException(
        'Target date cannot be earlier than start date',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const updated = await tx.treatmentPlan.update({
        where: {
          id: planId,
        },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.clinicalNotes !== undefined && {
            clinicalNotes: dto.clinicalNotes,
          }),
          ...(dto.status !== undefined && {
            status: dto.status as unknown as PrismaTreatmentPlanStatus,
          }),
          ...(newStatus === 'COMPLETED' &&
            treatmentPlan.status !== 'COMPLETED' && {
              completedAt: now,
            }),
          ...(dto.startDate !== undefined && {
            startDate: new Date(dto.startDate),
          }),
          ...(dto.targetDate !== undefined && {
            targetDate: new Date(dto.targetDate),
          }),
          ...(dto.estimatedCost !== undefined && {
            estimatedCost: dto.estimatedCost,
          }),
        },
        include: {
          procedures: true,
        },
      });

      const previousData = {
        title: treatmentPlan.title,
        description: treatmentPlan.description,
        clinicalNotes: treatmentPlan.clinicalNotes,
        status: treatmentPlan.status,
        startDate: treatmentPlan.startDate?.toISOString() ?? null,
        targetDate: treatmentPlan.targetDate?.toISOString() ?? null,
        estimatedCost: treatmentPlan.estimatedCost?.toString() ?? null,
        completedAt: treatmentPlan.completedAt?.toISOString() ?? null,
      };

      const newData = {
        title: updated.title,
        description: updated.description,
        clinicalNotes: updated.clinicalNotes,
        status: updated.status,
        startDate: updated.startDate?.toISOString() ?? null,
        targetDate: updated.targetDate?.toISOString() ?? null,
        estimatedCost: updated.estimatedCost?.toString() ?? null,
        completedAt: updated.completedAt?.toISOString() ?? null,
      };

      const hasChanges = Object.keys(previousData).some(
        (key) =>
          previousData[key as keyof typeof previousData] !==
          newData[key as keyof typeof newData],
      );

      if (hasChanges) {
        await tx.treatmentHistory.create({
          data: {
            clinicId,
            patientId,
            changedBy: userId,
            entityType: 'PLAN',
            entityId: planId,
            action:
              treatmentPlan.status !== updated.status
                ? 'STATUS_CHANGED'
                : 'UPDATED',
            previousData,
            newData,
          },
        });
      }

      return updated;
    });
  }
  async updateProcedure(
    userId: string,
    clinicId: string,
    patientId: string,
    planId: string,
    procedureId: string,
    dto: UpdateTreatmentProcedureDto,
  ) {
    await this.checkMembership(userId, clinicId);
    await this.checkPatient(clinicId, patientId);

    const plan = await this.prisma.treatmentPlan.findFirst({
      where: {
        id: planId,
        clinicId,
        patientId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Treatment plan not found');
    }

    if (
      plan.status === PrismaTreatmentPlanStatus.COMPLETED ||
      plan.status === PrismaTreatmentPlanStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot modify procedures in a completed or cancelled treatment plan',
      );
    }

    const procedure = await this.prisma.treatmentProcedure.findFirst({
      where: {
        id: procedureId,
        treatmentPlanId: planId,
        clinicId,
      },
    });

    if (!procedure) {
      throw new NotFoundException('Treatment procedure not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const newStatus = dto.status ?? procedure.status;
      const allowedTransitions: Record<string, string[]> = {
        PLANNED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
        ON_HOLD: ['IN_PROGRESS', 'CANCELLED'],
        COMPLETED: [],
        CANCELLED: [],
      };

      if (
        dto.status !== undefined &&
        dto.status !== procedure.status &&
        !allowedTransitions[procedure.status]?.includes(newStatus)
      ) {
        throw new BadRequestException(
          `Invalid procedure status transition: ${procedure.status} -> ${newStatus}`,
        );
      }
      // Validate appointments before completing a procedure
      if (newStatus === 'COMPLETED' && procedure.status !== 'COMPLETED') {
        const unfinishedAppointments = await tx.treatmentAppointment.count({
          where: {
            treatmentProcedureId: procedureId,
            clinicId,
            status: {
              notIn: ['COMPLETED', 'CANCELLED'],
            },
          },
        });

        if (unfinishedAppointments > 0) {
          throw new BadRequestException(
            'Cannot complete procedure: all appointments must be completed or cancelled',
          );
        }
      }
      const result = await tx.treatmentProcedure.update({
        where: { id: procedureId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.toothNumber !== undefined && {
            toothNumber: dto.toothNumber,
          }),
          ...(dto.status !== undefined && { status: dto.status }),
          ...(dto.estimatedCost !== undefined && {
            estimatedCost: dto.estimatedCost,
          }),
          ...(dto.actualCost !== undefined && {
            actualCost: dto.actualCost,
          }),

          ...(newStatus === 'IN_PROGRESS' &&
            procedure.startedAt === null && {
              startedAt: now,
            }),

          ...(newStatus === 'PLANNED' && {
            startedAt: null,
          }),

          ...(newStatus === 'COMPLETED' && {
            completedAt: now,
            startedAt: procedure.startedAt ?? now,
          }),

          ...(procedure.status === 'COMPLETED' &&
            newStatus !== 'COMPLETED' && {
              completedAt: null,
            }),
        },
      });

      const previousData = {
        name: procedure.name,
        description: procedure.description,
        toothNumber: procedure.toothNumber,
        status: procedure.status,
        estimatedCost: procedure.estimatedCost?.toString() ?? null,
        actualCost: procedure.actualCost?.toString() ?? null,
      };

      const newData = {
        name: result.name,
        description: result.description,
        toothNumber: result.toothNumber,
        status: result.status,
        estimatedCost: result.estimatedCost?.toString() ?? null,
        actualCost: result.actualCost?.toString() ?? null,
        startedAt: result.startedAt?.toISOString() ?? null,
        completedAt: result.completedAt?.toISOString() ?? null,
      };
      const hasChanges = Object.keys(previousData).some(
        (key) =>
          previousData[key as keyof typeof previousData] !==
          newData[key as keyof typeof newData],
      );

      if (hasChanges) {
        await tx.treatmentHistory.create({
          data: {
            clinicId,
            patientId,
            changedBy: userId,
            entityType: 'PROCEDURE',
            entityId: procedureId,
            action:
              procedure.status !== result.status ? 'STATUS_CHANGED' : 'UPDATED',
            previousData,
            newData,
          },
        });
      }

      // Recalculate treatment plan actual cost
      const procedures = await tx.treatmentProcedure.findMany({
        where: {
          treatmentPlanId: planId,
          clinicId,
          status: {
            not: 'CANCELLED',
          },
        },
        select: {
          actualCost: true,
        },
      });

      const totalActualCost = procedures.reduce(
        (total, procedure) => total + Number(procedure.actualCost ?? 0),
        0,
      );

      await tx.treatmentPlan.update({
        where: { id: planId },
        data: {
          actualCost: totalActualCost,
        },
      });

      return result;
    });

    return updated;
  }
}
