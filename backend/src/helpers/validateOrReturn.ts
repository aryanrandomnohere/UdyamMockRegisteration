import { z } from "zod";
import { errorResponse } from "./errorResponse.js";
import type { Response } from "express";

// validate the data and return the data if valid else return the error
export function validateOrReturn(res: Response, schema: z.ZodSchema, data: any) {
    const result = schema.safeParse(data);
    if (!result.success) {
        return errorResponse(res, result.error.issues.map((issue) => issue.message).join(", "), result.error.issues.map((issue) => issue.message), 400);
    }
    return result.data;
}   