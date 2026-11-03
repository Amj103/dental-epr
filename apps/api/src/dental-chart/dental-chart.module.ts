import { Module } from '@nestjs/common';

import { DentalChartController } from './dental-chart.controller.js';
import { DentalChartService } from './dental-chart.service.js';

@Module({
  controllers: [DentalChartController],
  providers: [DentalChartService],
})
export class DentalChartModule {}
