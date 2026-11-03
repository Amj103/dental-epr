var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, } from 'class-validator';
import { MedicalHistoryCategory } from '@prisma/client';
export class UpdateMedicalHistoryDto {
    category;
    title;
    details;
    isActive;
}
__decorate([
    IsOptional(),
    IsEnum(MedicalHistoryCategory),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "category", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsNotEmpty(),
    MaxLength(150),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "details", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateMedicalHistoryDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-medical-history.dto.js.map