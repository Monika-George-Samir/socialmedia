import { env } from "../../config/env.service";
import bcrypt from 'bcrypt';


export const generateHash = async({plainText, salt = env.salt}: {plainText:string, salt?:string})=>{
    let hashedData = await bcrypt.hash(plainText, Number(salt))
    return hashedData
}



export const compareHash = async({plainText, hashedText}: {plainText:string, hashedText:string})=>{
    return await bcrypt.compare(plainText, hashedText)
}