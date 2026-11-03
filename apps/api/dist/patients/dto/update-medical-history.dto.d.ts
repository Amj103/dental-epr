import { MedicalHistoryCategory } from '@prisma/client';
export declare class UpdateMedicalHistoryDto {
    category?: MedicalHistoryCategory;
    title?: string;
    details?: string;
    isActive?: boolean;
}
