-- CreateTable
CREATE TABLE "PaymentCounter" (
    "clinicId" UUID NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaymentCounter_pkey" PRIMARY KEY ("clinicId")
);

-- AddForeignKey
ALTER TABLE "PaymentCounter" ADD CONSTRAINT "PaymentCounter_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
