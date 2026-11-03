import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        message: string;
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        invalid?: undefined;
        reused?: undefined;
        message: string;
    }>;
    logout(dto: RefreshDto): Promise<{
        message: string;
    }>;
    getProfile(req: {
        user: {
            userId: string;
            email: string;
        };
    }): {
        message: string;
        user: {
            userId: string;
            email: string;
        };
    };
}
