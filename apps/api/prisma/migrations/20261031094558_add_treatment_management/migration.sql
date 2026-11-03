-- CreateEnum
CREATE TYPE "TreatmentPlanStatus" AS ENUM ('DRAFT', 'PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TreatmentProcedureStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TreatmentAppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "TreatmentPlan" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "createdBy" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "clinicalNotes" TEXT,
    "status" "TreatmentPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" DATE,
    "targetDate" DATE,
    "completedAt" TIMESTAMPTZ(6),
    "estimatedCost" DECIMAL(12,2),
    "actualCost" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TreatmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentProcedure" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "treatmentPlanId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "toothNumber" VARCHAR(2),
    "status" "TreatmentProcedureStatus" NOT NULL DEFAULT 'PLANNED',
    "estimatedCost" DECIMAL(12,2),
    "actualCost" DECIMAL(12,2),
    "startedAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TreatmentProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentAppointment" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "treatmentProcedureId" UUID NOT NULL,
    "scheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "status" "TreatmentAppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "outcome" TEXT,
    "actualCost" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TreatmentAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreatmentPlan_clinicId_patientId_createdAt_idx" ON "TreatmentPlan"("clinicId", "patientId", "createdAt");

-- CreateIndex
CREATE INDEX "TreatmentPlan_clinicId_status_idx" ON "TreatmentPlan"("clinicId", "status");

-- CreateIndex
CREATE INDEX "TreatmentPlan_createdBy_idx" ON "TreatmentPlan"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentPlan_id_clinicId_key" ON "TreatmentPlan"("id", "clinicId");

-- CreateIndex
CREATE INDEX "TreatmentProcedure_clinicId_treatmentPlanId_idx" ON "TreatmentProcedure"("clinicId", "treatmentPlanId");

-- CreateIndex
CREATE INDEX "TreatmentProcedure_clinicId_status_idx" ON "TreatmentProcedure"("clinicId", "status");

-- CreateIndex
CREATE INDEX "TreatmentProcedure_clinicId_toothNumber_idx" ON "TreatmentProcedure"("clinicId", "toothNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentProcedure_id_clinicId_key" ON "TreatmentProcedure"("id", "clinicId");

-- CreateIndex
CREATE INDEX "TreatmentAppointment_clinicId_treatmentProcedureId_schedule_idx" ON "TreatmentAppointment"("clinicId", "treatmentProcedureId", "scheduledAt");

-- CreateIndex
CREATE INDEX "TreatmentAppointment_clinicId_scheduledAt_idx" ON "TreatmentAppointment"("clinicId", "scheduledAt");

-- CreateIndex
CREATE INDEX "TreatmentAppointment_clinicId_status_idx" ON "TreatmentAppointment"("clinicId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentAppointment_id_clinicId_key" ON "TreatmentAppointment"("id", "clinicId");

-- AddForeignKey
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_patientId_clinicId_fkey" FOREIGN KEY ("patientId", "clinicId") REFERENCES "Patient"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentProcedure" ADD CONSTRAINT "TreatmentProcedure_treatmentPlanId_clinicId_fkey" FOREIGN KEY ("treatmentPlanId", "clinicId") REFERENCES "TreatmentPlan"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentAppointment" ADD CONSTRAINT "TreatmentAppointment_treatmentProcedureId_clinicId_fkey" FOREIGN KEY ("treatmentProcedureId", "clinicId") REFERENCES "TreatmentProcedure"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;
