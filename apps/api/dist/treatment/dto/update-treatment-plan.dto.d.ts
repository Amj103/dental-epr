import { TreatmentPlanStatus } from './create-treatment-plan.dto.js';
export declare class UpdateTreatmentPlanDto {
    title?: string;
    description?: string;
    clinicalNotes?: string;
    status?: TreatmentPlanStatus;
    startDate?: string;
    targetDate?: string;
    estimatedCost?: number;
}
