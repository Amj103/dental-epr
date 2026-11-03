import { ClinicsService } from './clinics.service.js';
import { CreateClinicDto } from './dto/create-clinic.dto.js';
interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}
export declare class ClinicsController {
    private clinicsService;
    constructor(clinicsService: ClinicsService);
    createClinic(req: AuthenticatedRequest, dto: CreateClinicDto): Promise<{
        message: string;
        clinic: {
            memberships: {
                userId: string;
                role: import("@prisma/client").$Enums.MembershipRole;
                status: import("@prisma/client").$Enums.MembershipStatus;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ClinicStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
            slug: string;
            countryCode: string;
            timezone: string;
            currency: string;
        };
    }>;
}
export {};
