-- CreateTable
CREATE TABLE "public"."UdyamRegistration" (
    "id" SERIAL NOT NULL,
    "aadhaarNumber" VARCHAR(12) NOT NULL,
    "entrepreneurName" VARCHAR(100) NOT NULL,
    "otp" VARCHAR(6),
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileNumber" INTEGER NOT NULL,
    "panNumber" VARCHAR(10),
    "panVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UdyamRegistration_pkey" PRIMARY KEY ("id")
);
