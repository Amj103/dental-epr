import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { ToothNumberDto } from './dto/tooth-number.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';
import { CreateDentalChartDto } from './dto/create-dental-chart.dto.js';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto.js';
import { DentalChartService } from './dental-chart.service.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics/:clinicId/patients/:patientId/dental-chart')
@UseGuards(JwtAuthGuard)
export class DentalChartController {
  constructor(private readonly dentalChartService: DentalChartService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateDentalChartDto,
  ) {
    return this.dentalChartService.create(
      req.user.userId,
      clinicId,
      patientId,
      dto,
    );
  }

  @Get()
  getChart(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.dentalChartService.getChart(
      req.user.userId,
      clinicId,
      patientId,
    );
  }

  // GET TOOTH HISTORY
  @Get('history')
  getToothHistory(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: PaginationDto,
  ) {
    return this.dentalChartService.getToothHistory(
      req.user.userId,
      clinicId,
      patientId,
      filters.toothNumber,
      filters.page,
      filters.limit,
    );
  }
  // GET SURFACE HISTORY
  @Get('surface-history')
  getSurfaceHistory(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: PaginationDto,
  ) {
    return this.dentalChartService.getSurfaceHistory(
      req.user.userId,
      clinicId,
      patientId,
      filters.toothNumber,
      filters.page,
      filters.limit,
    );
  }

  @Patch(':toothNumber')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('toothNumber') toothNumber: string,
    @Body() dto: UpdateDentalChartDto,
  ) {
    return this.dentalChartService.update(
      req.user.userId,
      clinicId,
      patientId,
      toothNumber,
      dto,
    );
  }

  @Delete(':toothNumber')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('toothNumber') toothNumber: string,
  ) {
    return this.dentalChartService.remove(
      req.user.userId,
      clinicId,
      patientId,
      toothNumber,
    );
  }
}
