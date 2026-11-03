/*
  Warnings:

  - A unique constraint covering the columns `[id,chartEntryId]` on the table `DentalChartSurface` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "DentalChartSurfaceHistory" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "chartEntryId" UUID NOT NULL,
    "surfaceId" UUID NOT NULL,
    "previousCondition" "SurfaceCondition",
    "newCondition" "SurfaceCondition" NOT NULL,
    "previousNotes" TEXT,
    "newNotes" TEXT,
    "changedBy" UUID NOT NULL,
    "changedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DentalChartSurfaceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DentalChartSurfaceHistory_clinicId_patientId_changedAt_idx" ON "DentalChartSurfaceHistory"("clinicId", "patientId", "changedAt");

-- CreateIndex
CREATE INDEX "DentalChartSurfaceHistory_surfaceId_changedAt_idx" ON "DentalChartSurfaceHistory"("surfaceId", "changedAt");

-- CreateIndex
CREATE INDEX "DentalChartSurfaceHistory_changedBy_idx" ON "DentalChartSurfaceHistory"("changedBy");

-- CreateIndex
CREATE UNIQUE INDEX "DentalChartSurface_id_chartEntryId_key" ON "DentalChartSurface"("id", "chartEntryId");

-- AddForeignKey
ALTER TABLE "DentalChartSurfaceHistory" ADD CONSTRAINT "DentalChartSurfaceHistory_surfaceId_chartEntryId_fkey" FOREIGN KEY ("surfaceId", "chartEntryId") REFERENCES "DentalChartSurface"("id", "chartEntryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalChartSurfaceHistory" ADD CONSTRAINT "DentalChartSurfaceHistory_chartEntryId_clinicId_patientId_fkey" FOREIGN KEY ("chartEntryId", "clinicId", "patientId") REFERENCES "DentalChartEntry"("id", "clinicId", "patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalChartSurfaceHistory" ADD CONSTRAINT "DentalChartSurfaceHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
