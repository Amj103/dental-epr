declare enum TreatmentHistoryEntity {
    PLAN = "PLAN",
    PROCEDURE = "PROCEDURE",
    APPOINTMENT = "APPOINTMENT"
}
export declare class TreatmentHistoryQueryDto {
    entityType?: TreatmentHistoryEntity;
    page: number;
    limit: number;
}
export {};
