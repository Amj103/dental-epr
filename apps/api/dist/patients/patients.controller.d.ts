import { ListPatientsQueryDto } from './dto/list-patients-query.dto.js';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}
export declare class PatientsController {
    private patientsService;
    constructor(patientsService: PatientsService);
    getPatients(req: AuthenticatedRequest, clinicId: string, branchId: string, query: ListPatientsQueryDto): Promise<{
        data: {
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            patientNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: import("@prisma/client").$Enums.PatientGender;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            pincode: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPatientById(req: AuthenticatedRequest, clinicId: string, branchId: string, patientId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        patientNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.PatientGender;
        phone: string | null;
        email: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
    }>;
    createPatient(req: AuthenticatedRequest, clinicId: string, branchId: string, dto: CreatePatientDto): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        patientNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.PatientGender;
        phone: string | null;
        email: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
    }>;
}
export {};
