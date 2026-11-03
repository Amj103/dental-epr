import { MedicalHistoryCategory } from '@prisma/client';
export declare class CreateMedicalHistoryDto {
    category: MedicalHistoryCategory;
    title: string;
    details?: string;
}
