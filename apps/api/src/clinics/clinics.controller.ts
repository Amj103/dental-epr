
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ClinicsService } from './clinics.service.js';
import { CreateClinicDto } from './dto/create-clinic.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics')
@UseGuards(JwtAuthGuard)
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Post()
  createClinic(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateClinicDto,
  ) {
    return this.clinicsService.createClinic(
      req.user.userId,
      dto,
    );
  }
}
