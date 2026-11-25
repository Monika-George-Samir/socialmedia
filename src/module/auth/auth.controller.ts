import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import authService from "./auth.service"
import { successResponse } from "../../common/exception/success.response";
import { validation } from "../../common/services/validation.service";
import { loginSchema, signupSchema } from "./auth.validation";
import { auth } from "../../common/middleware/auth.midlleware";
import { IReq } from "../../common/interface/request.interface";

const router = Router()


router.post("/login", validation(loginSchema), async(req:Request, res:Response): Promise<void>=>{
   let data = await authService.login(req.body)
   successResponse({res, message:"login successfully", data})
})


router.post("/signup", validation(signupSchema), async(req:Request, res:Response)=>{
    let data = await authService.signup(req.body)
    successResponse({res, message: "Signup successfully", data})
})


router.get("/get-user-by-id", auth, async(req:IReq, res:Response)=>{
    let data = await authService.getUserById(req.userId as string)
    successResponse({res, message: "User found", data})
})

router.get("/verify-account", async(req:Request, res:Response)=>{
    let data = await authService.verifyAccount(req.query)
    successResponse({res, message: "Account verified", data})
})
export default router