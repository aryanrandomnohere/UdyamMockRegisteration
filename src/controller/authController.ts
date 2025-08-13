import { type Request, type Response } from "express";
import { aadhaarOtpSchema, aadhaarSchema, panSchema } from "../types/index.js";
import { validateOrReturn } from "../helpers/validateOrReturn.js";
import { prisma } from "../config/config.js";
import { errorResponse } from "../helpers/errorResponse.js";

    const verifyAadhaar = async (req: Request, res: Response): Promise<void> => {
    const { aadhaar, name } = validateOrReturn(res, aadhaarSchema, req.body) as { aadhaar: string, name: string, consent: boolean };
    const errors = [];
    if(aadhaar.length !== 12) {
        errors.push("Aadhaar number must be 12 digits");
    }
    if(name.length === 0) {
        errors.push("Name is required");    
    }
    const aadhaarData = await prisma.udyamRegistration.findUnique({ 
        where: {
            aadhaarNumber: aadhaar, 
        },
    });
    if(!aadhaarData) {
        errors.push("There is error in Aadhaar Validation/Authentication.");
    }
    if(errors.length > 0) {
        errorResponse(res, "There is error in Aadhaar Validation/Authentication.", errors, 200);
        return;
    }

    if(aadhaarData?.entrepreneurName.toLowerCase() !== name.toLowerCase()) {
        errors.push("Name is not matching with Aadhaar");
        errorResponse(res, "There is error in Aadhaar Validation/Authentication.", errors, 200);
        return;
    }
    if(errors.length > 0) {
        errorResponse(res, "There is error in Aadhaar Validation/Authentication.", errors, 200);
        return;
    }
   
    //Generating mock OTP 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.udyamRegistration.update({
        where: {
            aadhaarNumber: aadhaar,
        },
        data: {
            otp: otp,
            otpVerified: false,
        },
    });
    res.status(200).json({ message: "Aadhaar verification successful", otp: otp, mobileNumber: aadhaarData?.mobileNumber, success: true }); 
}

    const verifyAadhaarOtp = async (req: Request, res: Response): Promise<void> => {
        const { aadhaar, otp } = validateOrReturn(res, aadhaarOtpSchema, req.body) as { aadhaar: string, otp: string };
        const aadhaarData = await prisma.udyamRegistration.findUnique({
            where: {
                aadhaarNumber: aadhaar,
            },
        });
        if(!aadhaarData) {
            errorResponse(res, "Aadhaar number not found", ["Aadhaar number not found"], 400);
            return 
        }
        if(aadhaarData.otp !== otp) {
            errorResponse(res, "Invalid OTP", ["Invalid OTP"], 400);
            return;
        }
        await prisma.udyamRegistration.update({
            where: {
                aadhaarNumber: aadhaar,
            },
            data: {
                otpVerified: true,
            },
        });
        res.status(200).json({ message: "Aadhaar OTP verification successful", success: true });
    }

    const verifyPan =async (req: Request, res: Response): Promise<void> => {
        const { pan, panName, DOB} = validateOrReturn(res, panSchema, req.body) as { pan: string, panName: string, DOB: string, typeOfOrg: string };
        if(!pan || !panName || !DOB) return;
        if(!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
            errorResponse(res, "Invalid PAN", ["Invalid PAN"], 200);
            return;
        }
        const panData = await prisma.udyamRegistration.findFirst({
            where: {
                panNumber: pan,
            },
        });
        if(!panData) {
            errorResponse(res, "Details mismatch", ["Details mismatch"], 200);
            return;
        }
        if(panData.panName?.toLowerCase() !== panName.toLowerCase()) {
            errorResponse(res, "Details mismatch", ["Details mismatch"], 200);
            return;
        }
        if(panData.DOB.toISOString() !== new Date(DOB).toISOString()) {
            errorResponse(res, "Details mismatch", ["Details mismatch"], 200);
            return;
        }
        await prisma.udyamRegistration.update({
                where: {
                panNumber: pan,
            },
            data: {
                panVerified: true,
            },
        });
        res.status(200).json({ message: "PAN verification successful", success: true });
    }

export { verifyAadhaar, verifyAadhaarOtp, verifyPan };  