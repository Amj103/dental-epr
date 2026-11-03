import { Module } from '@nestjs/common';

import { PatientsController } from './patients.controller.js';
import { PatientsService } from './patients.service.js';
import { MedicalHistoryController } from './medical-history.controller.js';
import { MedicalHistoryService } from './medical-history.service.js';

@Module({
  controllers: [PatientsController, MedicalHistoryController],
  providers: [PatientsService, MedicalHistoryService],
})
export class PatientsModule {}
