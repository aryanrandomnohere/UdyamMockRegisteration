import type { Response } from "express";

export function errorResponse(res: Response, message: string,errors: string[] | null, statusCode: number) {
    return res.status(statusCode).json({
        message: message,
        success: false,
        errors: errors,
    });
}

export default errorResponse; 