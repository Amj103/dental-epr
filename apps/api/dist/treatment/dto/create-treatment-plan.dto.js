var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export var TreatmentPlanStatus;
(function (TreatmentPlanStatus) {
    TreatmentPlanStatus["DRAFT"] = "DRAFT";
    TreatmentPlanStatus["PROPOSED"] = "PROPOSED";
    TreatmentPlanStatus["ACCEPTED"] = "ACCEPTED";
    TreatmentPlanStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TreatmentPlanStatus["COMPLETED"] = "COMPLETED";
    TreatmentPlanStatus["CANCELLED"] = "CANCELLED";
})(TreatmentPlanStatus || (TreatmentPlanStatus = {}));
export class CreateTreatmentPlanDto {
    title;
    description;
    clinicalNotes;
    status;
    startDate;
    targetDate;
    estimatedCost;
}
__decorate([
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "clinicalNotes", void 0);
__decorate([
    IsOptional(),
    IsEnum(TreatmentPlanStatus),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "startDate", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "targetDate", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateTreatmentPlanDto.prototype, "estimatedCost", void 0);
//# sourceMappingURL=create-treatment-plan.dto.js.map