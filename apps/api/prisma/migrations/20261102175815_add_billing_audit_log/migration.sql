-- CreateEnum
CREATE TYPE "BillingAuditAction" AS ENUM ('INVOICE_CREATED', 'INVOICE_ISSUED', 'PAYMENT_RECORDED', 'REFUND_CREATED', 'INVOICE_CANCELLED', 'PAYMENT_RECONCILED');

-- CreateEnum
CREATE TYPE "BillingAuditEntity" AS ENUM ('INVOICE', 'PAYMENT', 'REFUND');

-- CreateTable
CREATE TABLE "BillingAuditLog" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "entity" "BillingAuditEntity" NOT NULL,
    "entityId" UUID NOT NULL,
    "action" "BillingAuditAction" NOT NULL,
    "description" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillingAuditLog_clinicId_createdAt_idx" ON "BillingAuditLog"("clinicId", "createdAt");

-- CreateIndex
CREATE INDEX "BillingAuditLog_clinicId_entity_entityId_idx" ON "BillingAuditLog"("clinicId", "entity", "entityId");

-- CreateIndex
CREATE INDEX "BillingAuditLog_clinicId_userId_createdAt_idx" ON "BillingAuditLog"("clinicId", "userId", "createdAt");

-- AddForeignKey
ALTER TABLE "BillingAuditLog" ADD CONSTRAINT "BillingAuditLog_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
