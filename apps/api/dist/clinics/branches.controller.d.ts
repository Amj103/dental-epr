import { BranchesService } from './branches.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}
export declare class BranchesController {
    private branchesService;
    constructor(branchesService: BranchesService);
    getBranches(req: AuthenticatedRequest, clinicId: string): Promise<{
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
    createBranch(req: AuthenticatedRequest, clinicId: string, dto: CreateBranchDto): Promise<{
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
}
export {};
