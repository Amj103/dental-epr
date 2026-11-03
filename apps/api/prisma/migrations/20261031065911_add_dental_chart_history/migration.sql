/*
  Warnings:

  - A unique constraint covering the columns `[id,clinicId,patientId]` on the table `DentalChartEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "DentalChartHistory" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "chartEntryId" UUID NOT NULL,
    "previousCondition" "ToothCondition",
    "newCondition" "ToothCondition" NOT NULL,
    "previousNotes" TEXT,
    "newNotes" TEXT,
    "changedBy" UUID NOT NULL,
    "changedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DentalChartHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DentalChartHistory_clinicId_patientId_changedAt_idx" ON "DentalChartHistory"("clinicId", "patientId", "changedAt");

-- CreateIndex
CREATE INDEX "DentalChartHistory_chartEntryId_changedAt_idx" ON "DentalChartHistory"("chartEntryId", "changedAt");

-- CreateIndex
CREATE INDEX "DentalChartHistory_changedBy_idx" ON "DentalChartHistory"("changedBy");

-- CreateIndex
CREATE UNIQUE INDEX "DentalChartEntry_id_clinicId_patientId_key" ON "DentalChartEntry"("id", "clinicId", "patientId");

-- AddForeignKey
ALTER TABLE "DentalChartHistory" ADD CONSTRAINT "DentalChartHistory_chartEntryId_clinicId_patientId_fkey" FOREIGN KEY ("chartEntryId", "clinicId", "patientId") REFERENCES "DentalChartEntry"("id", "clinicId", "patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalChartHistory" ADD CONSTRAINT "DentalChartHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
