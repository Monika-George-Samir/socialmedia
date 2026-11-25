import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestException, ConflictException, NotFoundException } from "../../common/exception/exception.error"
import { IUser } from "../../common/interface/user.interface"
import { sendEmail } from "../../common/services/email.service"
import { compareHash, generateHash } from "../../common/services/encryption.service"
import { redisService } from "../../common/services/redis.service"
import { generateToken } from "../../common/services/token.service"
import { userModel } from "../../database/model/user.model"
import { DatabaseReposatory } from "../../database/reposatory/database.reposatory"
import { LoginDTO } from "./dto/auth.dto"


export class AuthService {
    private authReposatory: DatabaseReposatory<IUser>
    constructor(){
        this.authReposatory = new DatabaseReposatory<IUser>(userModel)
    }

    async signup(data: IUser){
        let {name, email, password, confirmPassword, age, phone} = data
        let existedUser = await this.authReposatory.findOne({filter: {email}})
        if (!existedUser) {
            throw new ConflictException("User already exists")
        }

        let hashedPassword = await generateHash({plainText: password})
        if (!hashedPassword) {
            throw new BadRequestException("something went wrong")
        }
        let otp = Math.round(Math.random() * 1000000)
        let addedUser = await this.authReposatory.create({name, email, password:hashedPassword, age, phone})
        redisService.set(`otp::${addedUser._id}`,  String(otp), 60)

        let {accessToken} = generateToken(addedUser)
        let html = `
            <h1>Welcome</h1>
            <a href="http://localhost:3000/auth/verify-account?token=${accessToken}">Complete your verification </a>
        `
        // sendEmail({to: addedUser.email, subject: "signup", html: `<h1> Your OTP is ${otp} </h1>`})
        sendEmail({to: addedUser.email, subject: "signup", html: html})
        return addedUser
    }


    async login(data: IUser): Promise<{accessToken: string, refreshToken: string}>{
        let {email, password} = data
        let existedUser = await this.authReposatory.findOne({filter: {email}})
        if (!existedUser) {
            throw new NotFoundException("User not found")
        }
        if (!existedUser.isVerified) {
            throw new BadRequestException("User not verified")
        }

        let matchedPassword = compareHash({plainText: password, hashedText: existedUser.password})
        if (!matchedPassword) {
            throw new BadRequestException("password not match")
        }

        let {accessToken, refreshToken} = generateToken(existedUser)
        return{accessToken, refreshToken}
    }

    async getUserById(id:string){
        let userData = await this.authReposatory.findOne({filter: {_id:id}})
        if (!userData) {
            throw new NotFoundException("User not found")
        }
        return userData
    }

    async verifyAccount(query:any){
        let {token} = query
        let decoded = jwt.decode(token) as JwtPayload
        console.log(decoded);
        
        let updatedUser = await this.authReposatory.updateOne({filter: {_id:decoded.id}, updateData: {isVerified: true}})
        return updatedUser
    }
}

export default new AuthService()