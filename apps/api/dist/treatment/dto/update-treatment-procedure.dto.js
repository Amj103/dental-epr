var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
import { TreatmentProcedureStatus } from './create-treatment-procedure.dto.js';
export class UpdateTreatmentProcedureDto {
    name;
    description;
    toothNumber;
    status;
    estimatedCost;
    actualCost;
}
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], UpdateTreatmentProcedureDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateTreatmentProcedureDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateTreatmentProcedureDto.prototype, "toothNumber", void 0);
__decorate([
    IsOptional(),
    IsEnum(TreatmentProcedureStatus),
    __metadata("design:type", String)
], UpdateTreatmentProcedureDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], UpdateTreatmentProcedureDto.prototype, "estimatedCost", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], UpdateTreatmentProcedureDto.prototype, "actualCost", void 0);
//# sourceMappingURL=update-treatment-procedure.dto.js.map