import type { NextFunction, Request, Response } from "express";
import { IError } from "../interface/error.interface";


export const globalHandlingError = (err: IError, req: Request, res:Response, next:NextFunction)=>{
    // let stack = env.mood == "dev" ? err.stack : null 
    const status = err.status || 500
    const cause = err.cause
    
    // let extra = err.cause ? err.cause.extra : null
    res.status(status).json({message: err.message, cause, stack: err.stack})
}