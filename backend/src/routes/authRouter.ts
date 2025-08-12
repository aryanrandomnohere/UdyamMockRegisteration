import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { verifyAadhaar, verifyAadhaarOtp, verifyPan } from "../controller/authController.js";
const authRouter = Router();
authRouter.post("/aadhaar",asyncHandler(verifyAadhaar)); 
authRouter.post("/aadhaar/otp", asyncHandler(verifyAadhaarOtp));
authRouter.post("/pan",asyncHandler(verifyPan));
export default authRouter;