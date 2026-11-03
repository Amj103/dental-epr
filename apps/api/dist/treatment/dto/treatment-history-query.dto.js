var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
var TreatmentHistoryEntity;
(function (TreatmentHistoryEntity) {
    TreatmentHistoryEntity["PLAN"] = "PLAN";
    TreatmentHistoryEntity["PROCEDURE"] = "PROCEDURE";
    TreatmentHistoryEntity["APPOINTMENT"] = "APPOINTMENT";
})(TreatmentHistoryEntity || (TreatmentHistoryEntity = {}));
export class TreatmentHistoryQueryDto {
    entityType;
    page = 1;
    limit = 20;
}
__decorate([
    IsOptional(),
    IsEnum(TreatmentHistoryEntity),
    __metadata("design:type", String)
], TreatmentHistoryQueryDto.prototype, "entityType", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Object)
], TreatmentHistoryQueryDto.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Object)
], TreatmentHistoryQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=treatment-history-query.dto.js.map