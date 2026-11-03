import { PatientGender } from '@prisma/client';
export declare class CreatePatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: PatientGender;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}
