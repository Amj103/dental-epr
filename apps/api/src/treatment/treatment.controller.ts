import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateTreatmentProcedureDto } from './dto/update-treatment-procedure.dto.js';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto.js';
import { Query } from '@nestjs/common';
import { TreatmentHistoryQueryDto } from './dto/treatment-history-query.dto.js';
import { UpdateTreatmentAppointmentDto } from './dto/update-treatment-appointment.dto.js';
import { CreateTreatmentAppointmentDto } from './dto/create-treatment-appointment.dto.js';
import type { Request } from 'express';
import { CreateTreatmentProcedureDto } from './dto/create-treatment-procedure.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
import { TreatmentService } from './treatment.service.js';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics/:clinicId/patients/:patientId/treatment-plans')
@UseGuards(JwtAuthGuard)
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  // Create a treatment plan
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Body() dto: CreateTreatmentPlanDto,
  ) {
    return this.treatmentService.create(
      req.user.userId,
      clinicId,
      patientId,
      dto,
    );
  }

  // Get all treatment plans for a patient
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.treatmentService.findAll(req.user.userId, clinicId, patientId);
  }
  // Update a treatment plan
  @Patch(':planId')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Body() dto: UpdateTreatmentPlanDto,
  ) {
    return this.treatmentService.update(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      dto,
    );
  }
  // Add a procedure to a treatment plan
  @Post(':planId/procedures')
  createProcedure(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Body() dto: CreateTreatmentProcedureDto,
  ) {
    return this.treatmentService.createProcedure(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      dto,
    );
  }
  // Schedule an appointment for a procedure
  @Post(':planId/procedures/:procedureId/appointments')
  createAppointment(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Param('procedureId') procedureId: string,
    @Body() dto: CreateTreatmentAppointmentDto,
  ) {
    return this.treatmentService.createAppointment(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      procedureId,
      dto,
    );
  }
  // Update or reschedule an appointment
  @Patch(':planId/procedures/:procedureId/appointments/:appointmentId')
  updateAppointment(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Param('procedureId') procedureId: string,
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateTreatmentAppointmentDto,
  ) {
    return this.treatmentService.updateAppointment(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      procedureId,
      appointmentId,
      dto,
    );
  }

  // Get all appointments for a procedure
  @Get(':planId/procedures/:procedureId/appointments')
  findAppointments(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Param('procedureId') procedureId: string,
  ) {
    return this.treatmentService.findAppointments(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      procedureId,
    );
  }
  // Get treatment history for a patient
  @Get('history')
  getHistory(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Query() filters: TreatmentHistoryQueryDto,
  ) {
    return this.treatmentService.getHistory(
      req.user.userId,
      clinicId,
      patientId,
      filters,
    );
  }
  @Patch(':planId/procedures/:procedureId')
  async updateProcedure(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId') clinicId: string,
    @Param('patientId') patientId: string,
    @Param('planId') planId: string,
    @Param('procedureId') procedureId: string,
    @Body() dto: UpdateTreatmentProcedureDto,
  ) {
    return this.treatmentService.updateProcedure(
      req.user.userId,
      clinicId,
      patientId,
      planId,
      procedureId,
      dto,
    );
  }
}
