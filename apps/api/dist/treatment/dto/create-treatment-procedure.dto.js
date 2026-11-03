var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNumber, IsOptional, IsString, Matches, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export var TreatmentProcedureStatus;
(function (TreatmentProcedureStatus) {
    TreatmentProcedureStatus["PLANNED"] = "PLANNED";
    TreatmentProcedureStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TreatmentProcedureStatus["ON_HOLD"] = "ON_HOLD";
    TreatmentProcedureStatus["COMPLETED"] = "COMPLETED";
    TreatmentProcedureStatus["CANCELLED"] = "CANCELLED";
})(TreatmentProcedureStatus || (TreatmentProcedureStatus = {}));
export class CreateTreatmentProcedureDto {
    name;
    description;
    toothNumber;
    status;
    estimatedCost;
}
__decorate([
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateTreatmentProcedureDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTreatmentProcedureDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    Matches(/^(1[1-8]|2[1-8]|3[1-8]|4[1-8]|5[1-5]|6[1-5]|7[1-5]|8[1-5])$/),
    __metadata("design:type", String)
], CreateTreatmentProcedureDto.prototype, "toothNumber", void 0);
__decorate([
    IsOptional(),
    IsEnum(TreatmentProcedureStatus),
    __metadata("design:type", String)
], CreateTreatmentProcedureDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateTreatmentProcedureDto.prototype, "estimatedCost", void 0);
//# sourceMappingURL=create-treatment-procedure.dto.js.map