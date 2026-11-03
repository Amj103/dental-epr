var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString, MaxLength, IsArray, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';
class UpdateDentalSurfaceDto {
    surface;
    condition;
    notes;
}
__decorate([
    IsEnum(ToothSurface),
    __metadata("design:type", String)
], UpdateDentalSurfaceDto.prototype, "surface", void 0);
__decorate([
    IsEnum(SurfaceCondition),
    __metadata("design:type", String)
], UpdateDentalSurfaceDto.prototype, "condition", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateDentalSurfaceDto.prototype, "notes", void 0);
export class UpdateDentalChartDto {
    condition;
    notes;
    surfaces;
}
__decorate([
    IsOptional(),
    IsEnum(ToothCondition),
    __metadata("design:type", String)
], UpdateDentalChartDto.prototype, "condition", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateDentalChartDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => UpdateDentalSurfaceDto),
    __metadata("design:type", Array)
], UpdateDentalChartDto.prototype, "surfaces", void 0);
//# sourceMappingURL=update-dental-chart.dto.js.map