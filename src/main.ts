import express, {json} from "express"
import type { Request, Response, NextFunction } from "express";
import authRouter from "./module/auth/auth.controller"
import { globalHandlingError } from "./common/utils/globalHandlingError"
import { ApplicationException, BadRequestException } from "./common/exception/exception.error";

const app = express()

app.use(json())
app.use("/auth", authRouter)
app.get("/", (req:Request, res:Response, next:NextFunction)=>{
    throw new BadRequestException("test", {})
})

app.use(globalHandlingError)

app.listen(3000, ()=>{
    console.log(`server is running on port 3000`);
    
})