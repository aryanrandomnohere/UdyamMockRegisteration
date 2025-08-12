/*
  Warnings:

  - You are about to alter the column `mobileNumber` on the `UdyamRegistration` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "public"."UdyamRegistration" ALTER COLUMN "mobileNumber" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "aadhaarNumber" SET DATA TYPE VARCHAR(12);
