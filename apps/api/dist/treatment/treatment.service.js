var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TreatmentPlanStatus as PrismaTreatmentPlanStatus } from '@prisma/client';
let TreatmentService = class TreatmentService {
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
        if (dto.startDate &&
            dto.targetDate &&
            new Date(dto.targetDate) < new Date(dto.startDate)) {
            throw new BadRequestException('Target date cannot be earlier than start date');
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
                        ? dto.status
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
    async findAll(userId, clinicId, patientId) {
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
    async createProcedure(userId, clinicId, patientId, planId, dto) {
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
        if (treatmentPlan.status === 'COMPLETED' ||
            treatmentPlan.status === 'CANCELLED') {
            throw new BadRequestException('Cannot add procedures to a completed or cancelled treatment plan');
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
    async createAppointment(userId, clinicId, patientId, planId, procedureId, dto) {
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
            throw new BadRequestException('Cannot schedule appointments for completed or cancelled procedures');
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
    async updateAppointment(userId, clinicId, patientId, planId, procedureId, appointmentId, dto) {
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
                status: dto.status,
            }),
            ...(dto.notes !== undefined && { notes: dto.notes }),
            ...(dto.outcome !== undefined && { outcome: dto.outcome }),
            ...(dto.actualCost !== undefined && { actualCost: dto.actualCost }),
        };
        const updatedAppointment = await this.prisma.$transaction(async (tx) => {
            if (data.status) {
                const allowedTransitions = {
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
                if (currentStatus !== nextStatus &&
                    !allowedTransitions[currentStatus]?.includes(nextStatus)) {
                    throw new BadRequestException(`Invalid appointment status transition: ${currentStatus} → ${nextStatus}`);
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
            const scheduledAtChanged = appointment.scheduledAt.getTime() !== updated.scheduledAt.getTime();
            const statusChanged = appointment.status !== updated.status;
            const otherFieldsChanged = appointment.durationMinutes !== updated.durationMinutes ||
                appointment.notes !== updated.notes ||
                appointment.outcome !== updated.outcome ||
                appointment.actualCost?.toString() !== updated.actualCost?.toString();
            if (scheduledAtChanged || statusChanged || otherFieldsChanged) {
                const action = statusChanged && updated.status === 'CANCELLED'
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
            const totalProcedureCost = appointments.reduce((total, appointment) => total + Number(appointment.actualCost ?? 0), 0);
            await tx.treatmentProcedure.update({
                where: { id: procedureId },
                data: {
                    actualCost: totalProcedureCost,
                },
            });
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
            const totalActualCost = procedures.reduce((total, procedure) => total + Number(procedure.actualCost ?? 0), 0);
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
    async findAppointments(userId, clinicId, patientId, planId, procedureId) {
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
    async getHistory(userId, clinicId, patientId, filters) {
        await this.checkMembership(userId, clinicId);
        await this.checkPatient(clinicId, patientId);
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {
            clinicId,
            patientId,
            ...(filters.entityType && {
                entityType: filters.entityType,
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
    async update(userId, clinicId, patientId, planId, dto) {
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
        if (treatmentPlan.status === 'COMPLETED' ||
            treatmentPlan.status === 'CANCELLED') {
            throw new BadRequestException('Completed or cancelled treatment plans cannot be modified');
        }
        const newStatus = dto.status ?? treatmentPlan.status;
        const allowedTransitions = {
            DRAFT: ['PROPOSED', 'CANCELLED'],
            PROPOSED: ['ACCEPTED', 'CANCELLED'],
            ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
            COMPLETED: [],
            CANCELLED: [],
        };
        if (dto.status !== undefined &&
            dto.status !== treatmentPlan.status &&
            !allowedTransitions[treatmentPlan.status]?.includes(newStatus)) {
            throw new BadRequestException(`Invalid treatment plan status transition: ${treatmentPlan.status} -> ${newStatus}`);
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
                throw new BadRequestException('A treatment plan must have at least one procedure before completion');
            }
            const unfinishedProcedures = procedures.filter((procedure) => procedure.status !== 'COMPLETED' && procedure.status !== 'CANCELLED');
            if (unfinishedProcedures.length > 0) {
                throw new BadRequestException('All procedures must be completed or cancelled before completing the treatment plan');
            }
        }
        const startDate = dto.startDate !== undefined
            ? new Date(dto.startDate)
            : treatmentPlan.startDate;
        const targetDate = dto.targetDate !== undefined
            ? new Date(dto.targetDate)
            : treatmentPlan.targetDate;
        if (startDate && targetDate && targetDate < startDate) {
            throw new BadRequestException('Target date cannot be earlier than start date');
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
                        status: dto.status,
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
            const hasChanges = Object.keys(previousData).some((key) => previousData[key] !==
                newData[key]);
            if (hasChanges) {
                await tx.treatmentHistory.create({
                    data: {
                        clinicId,
                        patientId,
                        changedBy: userId,
                        entityType: 'PLAN',
                        entityId: planId,
                        action: treatmentPlan.status !== updated.status
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
    async updateProcedure(userId, clinicId, patientId, planId, procedureId, dto) {
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
        if (plan.status === PrismaTreatmentPlanStatus.COMPLETED ||
            plan.status === PrismaTreatmentPlanStatus.CANCELLED) {
            throw new BadRequestException('Cannot modify procedures in a completed or cancelled treatment plan');
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
            const allowedTransitions = {
                PLANNED: ['IN_PROGRESS', 'CANCELLED'],
                IN_PROGRESS: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
                ON_HOLD: ['IN_PROGRESS', 'CANCELLED'],
                COMPLETED: [],
                CANCELLED: [],
            };
            if (dto.status !== undefined &&
                dto.status !== procedure.status &&
                !allowedTransitions[procedure.status]?.includes(newStatus)) {
                throw new BadRequestException(`Invalid procedure status transition: ${procedure.status} -> ${newStatus}`);
            }
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
                    throw new BadRequestException('Cannot complete procedure: all appointments must be completed or cancelled');
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
            const hasChanges = Object.keys(previousData).some((key) => previousData[key] !==
                newData[key]);
            if (hasChanges) {
                await tx.treatmentHistory.create({
                    data: {
                        clinicId,
                        patientId,
                        changedBy: userId,
                        entityType: 'PROCEDURE',
                        entityId: procedureId,
                        action: procedure.status !== result.status ? 'STATUS_CHANGED' : 'UPDATED',
                        previousData,
                        newData,
                    },
                });
            }
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
            const totalActualCost = procedures.reduce((total, procedure) => total + Number(procedure.actualCost ?? 0), 0);
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
};
TreatmentService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TreatmentService);
export { TreatmentService };
//# sourceMappingURL=treatment.service.js.map