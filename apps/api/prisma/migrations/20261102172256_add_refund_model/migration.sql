-- CreateTable
CREATE TABLE "Refund" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "refundNumber" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "refundedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Refund_clinicId_paymentId_idx" ON "Refund"("clinicId", "paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_clinicId_refundNumber_key" ON "Refund"("clinicId", "refundNumber");

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_clinicId_paymentId_fkey" FOREIGN KEY ("clinicId", "paymentId") REFERENCES "Payment"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
