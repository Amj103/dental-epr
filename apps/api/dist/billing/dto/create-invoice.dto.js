var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsNumber, Min, Max, IsDateString, MaxLength, ArrayMinSize, } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateInvoiceItemDto {
    description;
    quantity;
    unitPrice;
    discount;
    taxRate;
    treatmentProcedureId;
}
__decorate([
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0.01),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "discount", void 0);
__decorate([
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "taxRate", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "treatmentProcedureId", void 0);
export class CreateInvoiceDto {
    patientId;
    treatmentPlanId;
    dueDate;
    notes;
    items;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "patientId", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "treatmentPlanId", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ValidateNested({ each: true }),
    Type(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
//# sourceMappingURL=create-invoice.dto.js.map