import express, {json} from "express"
import type { Request, Response, NextFunction } from "express";
import authRouter from "./module/auth/auth.controller"
import { globalHandlingError } from "./common/utils/globalHandlingError"
import { ApplicationException, BadRequestException } from "./common/exception/exception.error";
import cors from "cors"
import { rateLimit } from 'express-rate-limit'
import { env } from "./config/env.service";
import { DatabaseConnection } from "./database/connection";
import { redisService } from "./common/services/redis.service";

const app = express()
DatabaseConnection()
redisService.connect()
const limit = rateLimit({
    windowMs: 10*60*1000,
    limit: 200,
    message: "Too many requests"
})
app.use(limit)

app.use(json())
app.use(cors({
    origin: "*"
}))

app.use("/auth", authRouter)
app.get("/", (req:Request, res:Response, next:NextFunction)=>{
    throw new BadRequestException("test", {})
})

app.use(globalHandlingError)

app.listen(env.port, ()=>{
    console.log(`server is running on port ${env.port}`);
    
})