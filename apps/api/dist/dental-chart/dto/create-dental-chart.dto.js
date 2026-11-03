var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString, MaxLength, Matches, ValidateNested, IsArray, } from 'class-validator';
import { Type } from 'class-transformer';
import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';
class DentalSurfaceDto {
    surface;
    condition;
    notes;
}
__decorate([
    IsEnum(ToothSurface),
    __metadata("design:type", String)
], DentalSurfaceDto.prototype, "surface", void 0);
__decorate([
    IsEnum(SurfaceCondition),
    __metadata("design:type", String)
], DentalSurfaceDto.prototype, "condition", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], DentalSurfaceDto.prototype, "notes", void 0);
export class CreateDentalChartDto {
    toothNumber;
    condition;
    notes;
    surfaces;
}
__decorate([
    IsString(),
    Matches(/^(1[1-8]|2[1-8]|3[1-8]|4[1-8]|5[1-5]|6[1-5]|7[1-5]|8[1-5])$/, {
        message: 'Invalid FDI tooth number',
    }),
    __metadata("design:type", String)
], CreateDentalChartDto.prototype, "toothNumber", void 0);
__decorate([
    IsOptional(),
    IsEnum(ToothCondition),
    __metadata("design:type", String)
], CreateDentalChartDto.prototype, "condition", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateDentalChartDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => DentalSurfaceDto),
    __metadata("design:type", Array)
], CreateDentalChartDto.prototype, "surfaces", void 0);
//# sourceMappingURL=create-dental-chart.dto.js.map