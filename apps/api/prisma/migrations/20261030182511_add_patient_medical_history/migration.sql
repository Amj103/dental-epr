-- CreateEnum
CREATE TYPE "MedicalHistoryCategory" AS ENUM ('CONDITION', 'ALLERGY', 'MEDICATION', 'SURGERY');

-- CreateTable
CREATE TABLE "MedicalHistoryEntry" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "category" "MedicalHistoryCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recordedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MedicalHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicalHistoryEntry_clinicId_patientId_category_idx" ON "MedicalHistoryEntry"("clinicId", "patientId", "category");

-- CreateIndex
CREATE INDEX "MedicalHistoryEntry_patientId_createdAt_idx" ON "MedicalHistoryEntry"("patientId", "createdAt");

-- AddForeignKey
ALTER TABLE "MedicalHistoryEntry" ADD CONSTRAINT "MedicalHistoryEntry_patientId_clinicId_fkey" FOREIGN KEY ("patientId", "clinicId") REFERENCES "Patient"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;
