import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env.service.js';
import { BadRequestException } from '../exception/exception.error.js';
import { IUser } from '../interface/user.interface.js';

export const generateNewAccessToken = (refreshToken:string)=>{
    let data = jwt.decode(refreshToken) as JwtPayload
    if (!data) {
        throw new BadRequestException("token is not valid")
    }
    let aud: string;
    let signature: string;
    let refreshSignature: string;
    switch (data.aud) {
        case "admin":
            signature = env.adminSignature
            refreshSignature = env.adminRefreshSignature
            aud = "admin"
            break;
            
        default:
            signature = env.userSignature
            refreshSignature = env.userRefreshSignature
            aud = "user"
            break;
    }
    let decodedRefreshToken = jwt.verify(refreshToken, refreshSignature) as JwtPayload
    let accessToken = jwt.sign({id:decodedRefreshToken.id}, signature, {expiresIn: "30min", audience: aud})
    
    return {accessToken}
}

export const generateToken = (user:IUser)=>{
    let aud;
    let signature;
    let refreshSignature;
    switch (user.role) {
        case 1:
            signature = env.adminSignature
            refreshSignature = env.adminRefreshSignature
            aud = "admin"
            break;
            
        default:
            signature = env.userSignature
            refreshSignature = env.userRefreshSignature
            aud = "user"
            break;
    }
    let accessToken = jwt.sign({id: user._id}, signature, {expiresIn: "30min", audience: aud})
    let refreshToken = jwt.sign({id: user._id}, refreshSignature, {expiresIn: "1y", audience: aud})
    
    return {accessToken, refreshToken}
}

