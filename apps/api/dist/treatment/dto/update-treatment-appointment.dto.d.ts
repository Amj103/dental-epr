export declare enum TreatmentAppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
export declare class UpdateTreatmentAppointmentDto {
    scheduledAt?: string;
    durationMinutes?: number;
    status?: TreatmentAppointmentStatus;
    notes?: string;
    outcome?: string;
    actualCost?: number;
}
