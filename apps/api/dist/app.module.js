var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DentalChartModule } from './dental-chart/dental-chart.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ClinicsModule } from './clinics/clinics.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { TreatmentModule } from './treatment/treatment.module.js';
import { BillingModule } from './billing/billing.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map