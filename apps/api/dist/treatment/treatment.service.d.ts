import { UpdateTreatmentProcedureDto } from './dto/update-treatment-procedure.dto.js';
import { TreatmentHistoryQueryDto } from './dto/treatment-history-query.dto.js';
import { CreateTreatmentAppointmentDto } from './dto/create-treatment-appointment.dto.js';
import { UpdateTreatmentAppointmentDto } from './dto/update-treatment-appointment.dto.js';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto.js';
import { CreateTreatmentProcedureDto } from './dto/create-treatment-procedure.dto.js';
export declare class TreatmentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private checkMembership;
    private checkPatient;
    create(userId: string, clinicId: string, patientId: string, dto: CreateTreatmentPlanDto): Promise<{
        procedures: {
            toothNumber: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            startedAt: Date | null;
            treatmentPlanId: string;
        }[];
    } & {
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentPlanStatus;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        title: string;
        description: string | null;
        estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        clinicalNotes: string | null;
        startDate: Date | null;
        targetDate: Date | null;
        completedAt: Date | null;
        createdBy: string;
    }>;
    findAll(userId: string, clinicId: string, patientId: string): Promise<({
        procedures: ({
            appointments: {
                notes: string | null;
                id: string;
                clinicId: string;
                status: import("@prisma/client").$Enums.TreatmentAppointmentStatus;
                createdAt: Date;
                updatedAt: Date;
                actualCost: import("@prisma/client/runtime/library").Decimal | null;
                scheduledAt: Date;
                durationMinutes: number;
                outcome: string | null;
                treatmentProcedureId: string;
            }[];
        } & {
            toothNumber: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            startedAt: Date | null;
            treatmentPlanId: string;
        })[];
    } & {
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentPlanStatus;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        title: string;
        description: string | null;
        estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        clinicalNotes: string | null;
        startDate: Date | null;
        targetDate: Date | null;
        completedAt: Date | null;
        createdBy: string;
    })[]>;
    createProcedure(userId: string, clinicId: string, patientId: string, planId: string, dto: CreateTreatmentProcedureDto): Promise<{
        appointments: {
            notes: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentAppointmentStatus;
            createdAt: Date;
            updatedAt: Date;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            scheduledAt: Date;
            durationMinutes: number;
            outcome: string | null;
            treatmentProcedureId: string;
        }[];
    } & {
        toothNumber: string | null;
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        startedAt: Date | null;
        treatmentPlanId: string;
    }>;
    createAppointment(userId: string, clinicId: string, patientId: string, planId: string, procedureId: string, dto: CreateTreatmentAppointmentDto): Promise<{
        treatmentProcedure: {
            toothNumber: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            startedAt: Date | null;
            treatmentPlanId: string;
        };
    } & {
        notes: string | null;
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentAppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        scheduledAt: Date;
        durationMinutes: number;
        outcome: string | null;
        treatmentProcedureId: string;
    }>;
    updateAppointment(userId: string, clinicId: string, patientId: string, planId: string, procedureId: string, appointmentId: string, dto: UpdateTreatmentAppointmentDto): Promise<{
        treatmentProcedure: {
            toothNumber: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            startedAt: Date | null;
            treatmentPlanId: string;
        };
    } & {
        notes: string | null;
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentAppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        scheduledAt: Date;
        durationMinutes: number;
        outcome: string | null;
        treatmentProcedureId: string;
    }>;
    findAppointments(userId: string, clinicId: string, patientId: string, planId: string, procedureId: string): Promise<{
        notes: string | null;
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentAppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        scheduledAt: Date;
        durationMinutes: number;
        outcome: string | null;
        treatmentProcedureId: string;
    }[]>;
    getHistory(userId: string, clinicId: string, patientId: string, filters: TreatmentHistoryQueryDto): Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            clinicId: string;
            patientId: string;
            changedBy: string;
            changedAt: Date;
            entityType: import("@prisma/client").$Enums.TreatmentHistoryEntity;
            entityId: string;
            action: import("@prisma/client").$Enums.TreatmentHistoryAction;
            previousData: import("@prisma/client/runtime/library").JsonValue | null;
            newData: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(userId: string, clinicId: string, patientId: string, planId: string, dto: UpdateTreatmentPlanDto): Promise<{
        procedures: {
            toothNumber: string | null;
            id: string;
            clinicId: string;
            status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
            actualCost: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            startedAt: Date | null;
            treatmentPlanId: string;
        }[];
    } & {
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentPlanStatus;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        title: string;
        description: string | null;
        estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        clinicalNotes: string | null;
        startDate: Date | null;
        targetDate: Date | null;
        completedAt: Date | null;
        createdBy: string;
    }>;
    updateProcedure(userId: string, clinicId: string, patientId: string, planId: string, procedureId: string, dto: UpdateTreatmentProcedureDto): Promise<{
        toothNumber: string | null;
        id: string;
        clinicId: string;
        status: import("@prisma/client").$Enums.TreatmentProcedureStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        estimatedCost: import("@prisma/client/runtime/library").Decimal | null;
        actualCost: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        startedAt: Date | null;
        treatmentPlanId: string;
    }>;
}
