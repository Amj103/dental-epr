-- CreateEnum
CREATE TYPE "ToothCondition" AS ENUM ('HEALTHY', 'CARIES', 'FILLED', 'CROWN', 'ROOT_CANAL_TREATED', 'FRACTURED', 'IMPLANT', 'MISSING', 'EXTRACTED', 'IMPACTED', 'OTHER');

-- CreateEnum
CREATE TYPE "ToothSurface" AS ENUM ('MESIAL', 'DISTAL', 'OCCLUSAL', 'BUCCAL', 'LINGUAL');

-- CreateEnum
CREATE TYPE "SurfaceCondition" AS ENUM ('CARIES', 'RESTORATION', 'SEALANT', 'FRACTURE', 'OTHER');

-- CreateTable
CREATE TABLE "DentalChartEntry" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "toothNumber" VARCHAR(2) NOT NULL,
    "condition" "ToothCondition" NOT NULL DEFAULT 'HEALTHY',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DentalChartEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DentalChartSurface" (
    "id" UUID NOT NULL,
    "chartEntryId" UUID NOT NULL,
    "surface" "ToothSurface" NOT NULL,
    "condition" "SurfaceCondition" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DentalChartSurface_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DentalChartEntry_clinicId_patientId_idx" ON "DentalChartEntry"("clinicId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "DentalChartEntry_clinicId_patientId_toothNumber_key" ON "DentalChartEntry"("clinicId", "patientId", "toothNumber");

-- CreateIndex
CREATE INDEX "DentalChartSurface_chartEntryId_idx" ON "DentalChartSurface"("chartEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "DentalChartSurface_chartEntryId_surface_key" ON "DentalChartSurface"("chartEntryId", "surface");

-- AddForeignKey
ALTER TABLE "DentalChartEntry" ADD CONSTRAINT "DentalChartEntry_patientId_clinicId_fkey" FOREIGN KEY ("patientId", "clinicId") REFERENCES "Patient"("id", "clinicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalChartSurface" ADD CONSTRAINT "DentalChartSurface_chartEntryId_fkey" FOREIGN KEY ("chartEntryId") REFERENCES "DentalChartEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
