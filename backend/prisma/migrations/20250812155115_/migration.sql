/*
  Warnings:

  - Changed the type of `aadhaarNumber` on the `UdyamRegistration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."UdyamRegistration" DROP COLUMN "aadhaarNumber",
ADD COLUMN     "aadhaarNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UdyamRegistration_aadhaarNumber_key" ON "public"."UdyamRegistration"("aadhaarNumber");
