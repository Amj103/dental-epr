export declare enum TreatmentPlanStatus {
    DRAFT = "DRAFT",
    PROPOSED = "PROPOSED",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateTreatmentPlanDto {
    title: string;
    description?: string;
    clinicalNotes?: string;
    status?: TreatmentPlanStatus;
    startDate?: string;
    targetDate?: string;
    estimatedCost?: number;
}
