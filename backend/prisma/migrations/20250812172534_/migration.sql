/*
  Warnings:

  - You are about to drop the column `panVerified` on the `UdyamRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[panNumber]` on the table `UdyamRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DOB` to the `UdyamRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UdyamRegistration" DROP COLUMN "panVerified",
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "panName" VARCHAR(100),
ADD COLUMN     "typeOfOrg" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "UdyamRegistration_panNumber_key" ON "public"."UdyamRegistration"("panNumber");
