import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import authService from "./auth.service"
import { successResponse } from "../../common/exception/success.response";
import { validation } from "../../common/services/validation.service";
import { signupSchema } from "./auth.validation";

const router = Router()


router.post("/", validation(signupSchema), async(req:Request, res:Response): Promise<void>=>{
    let data = await authService.signup(req.body)
    successResponse({res, message:"Done", data})
})

export default router