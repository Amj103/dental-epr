var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateTreatmentAppointmentDto {
    scheduledAt;
    durationMinutes;
    notes;
    actualCost;
}
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateTreatmentAppointmentDto.prototype, "scheduledAt", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(5),
    __metadata("design:type", Number)
], CreateTreatmentAppointmentDto.prototype, "durationMinutes", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateTreatmentAppointmentDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateTreatmentAppointmentDto.prototype, "actualCost", void 0);
//# sourceMappingURL=create-treatment-appointment.dto.js.map