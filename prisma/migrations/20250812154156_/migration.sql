/*
  Warnings:

  - A unique constraint covering the columns `[aadhaarNumber]` on the table `UdyamRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `UdyamRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UdyamRegistration_aadhaarNumber_key" ON "public"."UdyamRegistration"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UdyamRegistration_mobileNumber_key" ON "public"."UdyamRegistration"("mobileNumber");
