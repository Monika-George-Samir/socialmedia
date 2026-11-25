import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env.service.js';
import type{ NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exception/exception.error.js';
import { IReq } from '../interface/request.interface.js';



export const auth = (req:IReq, res:Response, next:NextFunction)=>{
    if (!req.headers.authorization) {
        throw new BadRequestException("Token not provided")
    }
    let [flag, token] = req.headers.authorization.split(" ")
    if (!token) {
        throw new BadRequestException("Token not found")
    }
    switch (flag) {
        case "Basic":
            const basicData = Buffer.from(token, "base64").toString()
            let [eamil, password] = basicData.split(":")
            break;
    
        case "Bearer":
            let decoded = jwt.decode(token) as JwtPayload
            let signature: string;
            switch (decoded.aud) {
                case "admin":
                    signature = env.adminSignature
                    break;
                default:
                    signature = env.userSignature
                    break;
            }      
            let decodedData = jwt.verify(token, signature) as JwtPayload
            console.log(decodedData);
            if (decodedData) {
                req.userId = decodedData.id
                next()
            }else{
                throw new BadRequestException("invalid token")
            }  
        default:
            break;
    }
    
}


