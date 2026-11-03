import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto.js';
import { MedicalHistoryService } from './medical-history.service.js';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto.js';
interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}
export declare class MedicalHistoryController {
    private medicalHistoryService;
    constructor(medicalHistoryService: MedicalHistoryService);
    createEntry(req: AuthenticatedRequest, clinicId: string, patientId: string, dto: CreateMedicalHistoryDto): Promise<{
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
    getHistory(req: AuthenticatedRequest, clinicId: string, patientId: string): Promise<{
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
    updateEntry(req: AuthenticatedRequest, clinicId: string, entryId: string, patientId: string, dto: UpdateMedicalHistoryDto): Promise<{
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
    deactivateEntry(req: AuthenticatedRequest, clinicId: string, patientId: string, entryId: string): Promise<{
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
export {};
