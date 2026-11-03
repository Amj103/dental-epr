import { Module } from '@nestjs/common';

import { ClinicsController } from './clinics.controller.js';
import { ClinicsService } from './clinics.service.js';

import { BranchesController } from './branches.controller.js';
import { BranchesService } from './branches.service.js';

@Module({
  controllers: [
    ClinicsController,
    BranchesController,
  ],
  providers: [
    ClinicsService,
    BranchesService,
  ],
})
export class ClinicsModule {}