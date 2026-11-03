export declare enum TreatmentProcedureStatus {
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateTreatmentProcedureDto {
    name: string;
    description?: string;
    toothNumber?: string;
    status?: TreatmentProcedureStatus;
    estimatedCost?: number;
}
