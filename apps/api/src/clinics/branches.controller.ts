import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BranchesService } from './branches.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard.js';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('clinics')
@UseGuards(JwtAuthGuard)
export class BranchesController {
  constructor(private branchesService: BranchesService) {}
  @Get(':clinicId/branches')
  getBranches(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
  ) {
    return this.branchesService.getBranches(req.user.userId, clinicId);
  }
  @Post(':clinicId/branches')
  createBranch(
    @Req() req: AuthenticatedRequest,
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.branchesService.createBranch(req.user.userId, clinicId, dto);
  }
}
