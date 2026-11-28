import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import authService from "./auth.service"
import { successResponse } from "../../common/exception/success.response";
import { validation } from "../../common/services/validation.service";
import { loginSchema, signupSchema, updateProfileSchema } from "./auth.validation";
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


router.post("/generate-access-token", async(req:Request, res:Response)=>{
    let data = await authService.generateNewAccessToken(req.body)
    successResponse({res, message:"New access token generated", data})
})

router.post("/forget-password", auth, async(req:IReq, res:Response)=>{
    let data = await authService.forgetPassword(req.userId as string)
    successResponse({res, message:"OTP sent", data})
})
router.patch("/reset-password", auth, async(req:IReq, res:Response)=>{
    let data = await authService.resetPassword(req.body, req.userId as string)
    successResponse({res, message:"password changed successfully", data})
})


router.get("/get-user-profile/:id", auth, async(req:IReq, res:Response)=>{
    let data = await authService.getUserProfile(req.userId as string, req.params.id as string)
    successResponse({res, message: "User details", data})
})


router.patch("/update-user", auth, validation(updateProfileSchema), async(req:IReq, res:Response)=>{
    let data = await authService.updateUser(req.userId as string, req.body)
    successResponse({res, message: "User updated", data})
})

router.patch("/follow-unfollow", auth, async(req:IReq, res:Response)=>{
    let data = await authService.followSystemToggle(req.userId as string, req.body)
    successResponse({res, message: data.message})
})

router.get("/search", auth, async(req:Request, res:Response)=>{
    let data = await authService.searchUsers(req.body)
    successResponse({res, data})
})

router.get("/get-suggestions", auth, async(req:IReq, res:Response)=>{
    let data = await authService.getUserSuggestions(req.userId as string)
    successResponse({res, message: data.message, data})
})

export default router