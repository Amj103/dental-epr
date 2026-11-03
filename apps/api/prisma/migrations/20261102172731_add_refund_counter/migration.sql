-- CreateTable
CREATE TABLE "RefundCounter" (
    "clinicId" UUID NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RefundCounter_pkey" PRIMARY KEY ("clinicId")
);

-- AddForeignKey
ALTER TABLE "RefundCounter" ADD CONSTRAINT "RefundCounter_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
