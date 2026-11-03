import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DentalChartModule } from './dental-chart/dental-chart.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ClinicsModule } from './clinics/clinics.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { TreatmentModule } from './treatment/treatment.module.js';
import { BillingModule } from './billing/billing.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ClinicsModule,
    PatientsModule,
    DentalChartModule,
    TreatmentModule,
    BillingModule,
  ],
})
export class AppModule {}
