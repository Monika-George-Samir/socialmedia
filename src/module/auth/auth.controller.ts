import { Router } from "express";

import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

const router = Router()

import authService from "./auth.service"

router.post("/", async(req:Request, res:Response): Promise<void>=>{
      let data = await authService.login(req.body)
    res.json({message: "Done", data})
})

export default router