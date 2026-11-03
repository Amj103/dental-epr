-- CreateEnum
CREATE TYPE "TreatmentHistoryEntity" AS ENUM ('PLAN', 'PROCEDURE', 'APPOINTMENT');

-- CreateEnum
CREATE TYPE "TreatmentHistoryAction" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'RESCHEDULED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TreatmentHistory" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "changedBy" UUID NOT NULL,
    "entityType" "TreatmentHistoryEntity" NOT NULL,
    "entityId" UUID NOT NULL,
    "action" "TreatmentHistoryAction" NOT NULL,
    "previousData" JSONB,
    "newData" JSONB,
    "changedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TreatmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreatmentHistory_clinicId_patientId_changedAt_idx" ON "TreatmentHistory"("clinicId", "patientId", "changedAt");

-- CreateIndex
CREATE INDEX "TreatmentHistory_clinicId_entityType_entityId_idx" ON "TreatmentHistory"("clinicId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "TreatmentHistory_changedBy_changedAt_idx" ON "TreatmentHistory"("changedBy", "changedAt");

-- AddForeignKey
ALTER TABLE "TreatmentHistory" ADD CONSTRAINT "TreatmentHistory_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentHistory" ADD CONSTRAINT "TreatmentHistory_patientId_clinicId_fkey" FOREIGN KEY ("patientId", "clinicId") REFERENCES "Patient"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentHistory" ADD CONSTRAINT "TreatmentHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
