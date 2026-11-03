import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    createBranch(userId: string, clinicId: string, dto: CreateBranchDto): Promise<{
        message: string;
        branch: {
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            city: string | null;
            state: string | null;
            pincode: string | null;
        };
    }>;
    getBranches(userId: string, clinicId: string): Promise<{
        message: string;
        count: number;
        branches: {
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            city: string | null;
            state: string | null;
            pincode: string | null;
        }[];
    }>;
}
