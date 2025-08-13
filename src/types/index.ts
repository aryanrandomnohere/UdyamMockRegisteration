import { z } from "zod";

export const aadhaarSchema = z.object({
    aadhaar: z.string().min(12),
    name: z.string().min(1),
});

export const aadhaarOtpSchema = z.object({
    aadhaar: z.string().min(12),
    otp: z.string().min(6),
});

export const panSchema = z.object({
    pan: z.string().min(10),
    panName: z.string().min(1),
    DOB: z.string().min(1),
    typeOfOrg: z.string().min(1),
});