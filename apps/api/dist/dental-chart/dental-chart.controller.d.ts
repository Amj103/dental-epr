import { Request } from 'express';
import { PaginationDto } from './dto/pagination.dto.js';
import { CreateDentalChartDto } from './dto/create-dental-chart.dto.js';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto.js';
import { DentalChartService } from './dental-chart.service.js';
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}
export declare class DentalChartController {
    private readonly dentalChartService;
    constructor(dentalChartService: DentalChartService);
    create(req: AuthenticatedRequest, clinicId: string, patientId: string, dto: CreateDentalChartDto): Promise<{
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
    getChart(req: AuthenticatedRequest, clinicId: string, patientId: string): Promise<({
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
    getToothHistory(req: AuthenticatedRequest, clinicId: string, patientId: string, filters: PaginationDto): Promise<{
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
    getSurfaceHistory(req: AuthenticatedRequest, clinicId: string, patientId: string, filters: PaginationDto): Promise<{
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
    update(req: AuthenticatedRequest, clinicId: string, patientId: string, toothNumber: string, dto: UpdateDentalChartDto): Promise<({
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
    remove(req: AuthenticatedRequest, clinicId: string, patientId: string, toothNumber: string): Promise<void>;
}
export {};
