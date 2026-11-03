var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, } from 'class-validator';
import { PatientGender } from '@prisma/client';
export class CreatePatientDto {
    firstName;
    lastName;
    dateOfBirth;
    gender;
    phone;
    email;
    address;
    city;
    state;
    pincode;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(80),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(80),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsOptional(),
    IsEnum(PatientGender),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    MaxLength(254),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "city", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "state", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(12),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "pincode", void 0);
//# sourceMappingURL=create-patient.dto.js.map