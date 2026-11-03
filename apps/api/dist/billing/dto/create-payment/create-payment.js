var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNumber, Min, IsEnum, IsOptional, IsString, MaxLength, } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
export class CreatePayment {
    amount;
    method;
    transactionId;
    reference;
    notes;
}
__decorate([
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0.01),
    __metadata("design:type", Number)
], CreatePayment.prototype, "amount", void 0);
__decorate([
    IsEnum(PaymentMethod),
    __metadata("design:type", String)
], CreatePayment.prototype, "method", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreatePayment.prototype, "transactionId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreatePayment.prototype, "reference", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreatePayment.prototype, "notes", void 0);
//# sourceMappingURL=create-payment.js.map