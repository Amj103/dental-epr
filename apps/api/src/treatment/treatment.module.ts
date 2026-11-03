import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service.js';
import { TreatmentController } from './treatment.controller.js';

@Module({
  providers: [TreatmentService],
  controllers: [TreatmentController]
})
export class TreatmentModule {}
