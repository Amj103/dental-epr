import { TreatmentProcedureStatus } from './create-treatment-procedure.dto.js';
export declare class UpdateTreatmentProcedureDto {
    name?: string;
    description?: string;
    toothNumber?: string;
    status?: TreatmentProcedureStatus;
    estimatedCost?: number;
    actualCost?: number;
}
