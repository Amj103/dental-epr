import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ListPatientsQueryDto } from './dto/list-patients-query.dto.js';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics/:clinicId/branches/:branchId/patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}
  @Get()
  getPatients(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() query: ListPatientsQueryDto,
  ) {
    return this.patientsService.getPatients(
      req.user.userId,
      clinicId,
      branchId,
      query,
    );
  }
  @Get(':patientId')
  getPatientById(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.patientsService.getPatientById(
      req.user.userId,
      clinicId,
      branchId,
      patientId,
    );
  }
  @Post()
  createPatient(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientsService.createPatient(
      req.user.userId,
      clinicId,
      branchId,
      dto,
    );
  }
}
