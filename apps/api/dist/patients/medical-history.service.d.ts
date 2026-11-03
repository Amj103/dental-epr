import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto.js';
export declare class MedicalHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createEntry(userId: string, clinicId: string, patientId: string, dto: CreateMedicalHistoryDto): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        isActive: boolean;
        category: import("@prisma/client").$Enums.MedicalHistoryCategory;
        title: string;
        details: string | null;
        recordedAt: Date;
    }>;
    getHistory(userId: string, clinicId: string, patientId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        isActive: boolean;
        category: import("@prisma/client").$Enums.MedicalHistoryCategory;
        title: string;
        details: string | null;
        recordedAt: Date;
    }[]>;
    updateEntry(userId: string, clinicId: string, patientId: string, entryId: string, dto: UpdateMedicalHistoryDto): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        isActive: boolean;
        category: import("@prisma/client").$Enums.MedicalHistoryCategory;
        title: string;
        details: string | null;
        recordedAt: Date;
    }>;
    deactivateEntry(userId: string, clinicId: string, patientId: string, entryId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        isActive: boolean;
        category: import("@prisma/client").$Enums.MedicalHistoryCategory;
        title: string;
        details: string | null;
        recordedAt: Date;
    }>;
}
