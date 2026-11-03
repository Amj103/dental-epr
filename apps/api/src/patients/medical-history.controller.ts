import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto.js';
import { MedicalHistoryService } from './medical-history.service.js';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics/:clinicId/patients/:patientId/medical-history')
@UseGuards(JwtAuthGuard)
export class MedicalHistoryController {
  constructor(private medicalHistoryService: MedicalHistoryService) {}

  @Post()
  createEntry(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateMedicalHistoryDto,
  ) {
    return this.medicalHistoryService.createEntry(
      req.user.userId,
      clinicId,
      patientId,
      dto,
    );
  }

  @Get()
  getHistory(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.medicalHistoryService.getHistory(
      req.user.userId,
      clinicId,
      patientId,
    );
  }
  @Patch(':entryId')
  updateEntry(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoryService.updateEntry(
      req.user.userId,
      clinicId,
      patientId,
      entryId,
      dto,
    );
  }

  @Delete(':entryId')
  deactivateEntry(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
  ) {
    return this.medicalHistoryService.deactivateEntry(
      req.user.userId,
      clinicId,
      patientId,
      entryId,
    );
  }
}
