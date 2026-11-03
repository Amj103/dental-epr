import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDentalChartDto } from './dto/create-dental-chart.dto.js';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto.js';
export declare class DentalChartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private checkMembership;
    private checkPatient;
    create(userId: string, clinicId: string, patientId: string, dto: CreateDentalChartDto): Promise<{
        surfaces: {
            surface: import("@prisma/client").$Enums.ToothSurface;
            condition: import("@prisma/client").$Enums.SurfaceCondition;
            notes: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chartEntryId: string;
        }[];
    } & {
        toothNumber: string;
        condition: import("@prisma/client").$Enums.ToothCondition;
        notes: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
    }>;
    getChart(userId: string, clinicId: string, patientId: string): Promise<({
        surfaces: {
            surface: import("@prisma/client").$Enums.ToothSurface;
            condition: import("@prisma/client").$Enums.SurfaceCondition;
            notes: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chartEntryId: string;
        }[];
    } & {
        toothNumber: string;
        condition: import("@prisma/client").$Enums.ToothCondition;
        notes: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
    })[]>;
    getToothHistory(userId: string, clinicId: string, patientId: string, toothNumber?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            clinicId: string;
            patientId: string;
            chartEntryId: string;
            previousCondition: import("@prisma/client").$Enums.ToothCondition | null;
            newCondition: import("@prisma/client").$Enums.ToothCondition;
            previousNotes: string | null;
            newNotes: string | null;
            changedBy: string;
            changedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSurfaceHistory(userId: string, clinicId: string, patientId: string, toothNumber?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            clinicId: string;
            patientId: string;
            chartEntryId: string;
            previousCondition: import("@prisma/client").$Enums.SurfaceCondition | null;
            newCondition: import("@prisma/client").$Enums.SurfaceCondition;
            previousNotes: string | null;
            newNotes: string | null;
            changedBy: string;
            changedAt: Date;
            surfaceId: string;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(userId: string, clinicId: string, patientId: string, toothNumber: string, dto: UpdateDentalChartDto): Promise<({
        surfaces: {
            surface: import("@prisma/client").$Enums.ToothSurface;
            condition: import("@prisma/client").$Enums.SurfaceCondition;
            notes: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chartEntryId: string;
        }[];
    } & {
        toothNumber: string;
        condition: import("@prisma/client").$Enums.ToothCondition;
        notes: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
    }) | null>;
    remove(userId: string, clinicId: string, patientId: string, toothNumber: string): Promise<void>;
}
