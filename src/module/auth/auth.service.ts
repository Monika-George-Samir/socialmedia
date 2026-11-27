import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common/exception/exception.error"
import { IUser } from "../../common/interface/user.interface"
import { sendEmail } from "../../common/services/email.service"
import { compareHash, generateHash } from "../../common/services/encryption.service"
import { redisService } from "../../common/services/redis.service"
import { generateNewAccessToken, generateToken } from "../../common/services/token.service"
import { userModel } from "../../database/model/user.model"
import { DatabaseReposatory } from "../../database/reposatory/database.reposatory"
import { LoginDTO } from "./dto/auth.dto"
import { env } from "../../config/env.service"


export class AuthService {
    private authReposatory: DatabaseReposatory<IUser>
    constructor(){
        this.authReposatory = new DatabaseReposatory<IUser>(userModel)
    }

    async signup(data: IUser){
        let {name, email, password, confirmPassword, age, phone} = data
        let existedUser = await this.authReposatory.findOne({filter: {email}})
        if (existedUser) {
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

    async generateNewAccessToken(body:{refreshToken: string}){
        let {refreshToken} = body
        if (!refreshToken) {
            throw new BadRequestException("refresh token is required")
        }
        let decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload

        let accessExpiresAtMS = (decodedRefreshToken.iat as number + Number(env.accessTokenExpiresIn)) * 1000        
        if (Date.now() < accessExpiresAtMS) {
            throw new BadRequestException("Access token still valid")
        }
        let {accessToken} = generateNewAccessToken(refreshToken)
        if (accessToken) {
            return {accessToken}
        }
        throw new BadRequestException("invalid token")
    }

    async forgetPassword(id:string){
        let userData = await this.authReposatory.findOne({filter: {_id:id}})
        if (!userData) {
            throw new UnAuthorizedException("You are not authorized")
        }
        let otp = Math.round(Math.random() * 1000000)
        redisService.set(`forgetPasswordOTP::${userData._id}`,  String(otp), 60)
        sendEmail({to: userData.email, subject: "forget password otp", html: `<h1> Your OTP is ${otp} </h1>`})
    }


    async resetPassword(body:{newPassword:string, otp:string}, id:string){
        let {newPassword, otp} = body
        let existedUser = await this.authReposatory.findOne({filter: {_id:id}})
        if (!existedUser) {
            throw new UnAuthorizedException("Not authorized")
        }
        const resetPasswordOTP = await redisService.get(`forgetPasswordOTP::${existedUser._id}`)
        if (resetPasswordOTP != otp) {
            throw new BadRequestException("otp does not match")
        }
        let hashedPassword = await generateHash({plainText: newPassword})
        if (!hashedPassword) {
            throw new BadRequestException("something went wrong")
        }
        
        let updatedUser = await this.authReposatory.updateOne({filter: {_id:id}, updateData: {password: hashedPassword}})
        return updatedUser
    }   


    async getUserProfile(currentUserId: string, targetUserId: string){
        let userData = await this.authReposatory.findOne({filter: {_id:targetUserId}, select: "name email phone age isPrivate followers following"})
        if (!userData) {
            throw new NotFoundException("User not found")
        }
        
        let isOwner = currentUserId === targetUserId
        let isFollower = userData?.followers?.some((id)=> id.toString() === currentUserId)

        if (userData.isPrivate && !isOwner && !isFollower) {
            return {
                _id: userData._id,
                name: userData.name,
                isPrivate: true,
                followersCount: userData.followers?.length,
                followingCount: userData.following?.length,
            }
        }
        return userData
    }


    async followSystemToggle(currentUserId: string, body:{targetUserId:string}){
        let {targetUserId} = body
        if (currentUserId == targetUserId) {
            throw new BadRequestException("You cannot follow yourself")
        }

        let targetUser = await this.authReposatory.findOne({filter: {_id:targetUserId}})
        if (!targetUser) {
            throw new NotFoundException("User not found")
        }

        let isAlreadyFollowing = targetUser.followers?.some((id)=> id.toString() === currentUserId)

        let hasPendingRequest = targetUser.followRequests?.some((id)=> id.toString() === currentUserId)
        
        if (isAlreadyFollowing || hasPendingRequest) {
            await this.authReposatory.updateOne({filter: {_id: currentUserId}, updateData:{$pull: {following: targetUserId}}})
            await this.authReposatory.updateOne({filter: {_id: targetUserId}, updateData:{$pull: {followers: currentUserId, followRequests: currentUserId}}})
            return {message: hasPendingRequest? "Follow request cancelled" : "Unfollowed successfully"}
        }

        if (targetUser.isPrivate) {
            await this.authReposatory.updateOne({filter: {_id:targetUserId}, updateData:{$addToSet: {followRequests: currentUserId}}})
            return {message: "Follow request sent"}
        }

        await this.authReposatory.updateOne({filter: {_id: currentUserId},updateData:{$addToSet: {following: targetUserId}}})
        await this.authReposatory.updateOne({filter: {_id: targetUserId},updateData:{$addToSet: {followers: currentUserId}}})
        return {message: "Followed successfully"}

    }

    async searchUsers(body:{keyword:string}){
        let {keyword} = body
        if (!keyword || !keyword.trim()) {
            return []
        }
        let users = await this.authReposatory.findAll({filter: {
            isVerified: true,
            $or: [
                {name: {$regex : keyword.trim(), $options: "i"}},
                {email: {$regex: keyword.trim(), $options: "i"}}
            ]
        }, select: "name email isVerified phone age followers following"
    })
    if (users.length == 0) {
        throw new NotFoundException("No users found")
    }
    return users
    }

    async getUserSuggestions(currentUserId: string){
        let currentUser = await this.authReposatory.findOne({filter: {_id:currentUserId}})
        if (!currentUser) {
            throw new NotFoundException("User not found")
        }

        let excludedIds = [
            currentUserId,
            ...currentUser.following || []
        ]

        let suggestions = await this.authReposatory.findAll({filter: {
            _id: {$nin: excludedIds},
            followRequests: {$ne: currentUserId},
            isVerified: true
        }, select: "-__v -password -role -followRequests", limit: 4})
        return {data: suggestions, message: `Total suggestion: ${suggestions.length}`}
    }

}

export default new AuthService()