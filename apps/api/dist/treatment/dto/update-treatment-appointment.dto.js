var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export var TreatmentAppointmentStatus;
(function (TreatmentAppointmentStatus) {
    TreatmentAppointmentStatus["SCHEDULED"] = "SCHEDULED";
    TreatmentAppointmentStatus["CONFIRMED"] = "CONFIRMED";
    TreatmentAppointmentStatus["CHECKED_IN"] = "CHECKED_IN";
    TreatmentAppointmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TreatmentAppointmentStatus["COMPLETED"] = "COMPLETED";
    TreatmentAppointmentStatus["CANCELLED"] = "CANCELLED";
    TreatmentAppointmentStatus["NO_SHOW"] = "NO_SHOW";
})(TreatmentAppointmentStatus || (TreatmentAppointmentStatus = {}));
export class UpdateTreatmentAppointmentDto {
    scheduledAt;
    durationMinutes;
    status;
    notes;
    outcome;
    actualCost;
}
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateTreatmentAppointmentDto.prototype, "scheduledAt", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(5),
    __metadata("design:type", Number)
], UpdateTreatmentAppointmentDto.prototype, "durationMinutes", void 0);
__decorate([
    IsOptional(),
    IsEnum(TreatmentAppointmentStatus),
    __metadata("design:type", String)
], UpdateTreatmentAppointmentDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateTreatmentAppointmentDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateTreatmentAppointmentDto.prototype, "outcome", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], UpdateTreatmentAppointmentDto.prototype, "actualCost", void 0);
//# sourceMappingURL=update-treatment-appointment.dto.js.map