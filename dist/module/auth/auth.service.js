"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exception_error_1 = require("../../common/exception/exception.error");
const email_service_1 = require("../../common/services/email.service");
const encryption_service_1 = require("../../common/services/encryption.service");
const redis_service_1 = require("../../common/services/redis.service");
const token_service_1 = require("../../common/services/token.service");
const user_model_1 = require("../../database/model/user.model");
const database_reposatory_1 = require("../../database/reposatory/database.reposatory");
const env_service_1 = require("../../config/env.service");
class AuthService {
    authReposatory;
    constructor() {
        this.authReposatory = new database_reposatory_1.DatabaseReposatory(user_model_1.userModel);
    }
    async signup(data) {
        let { name, email, password, confirmPassword, age, phone } = data;
        let existedUser = await this.authReposatory.findOne({ filter: { email } });
        if (existedUser) {
            throw new exception_error_1.ConflictException("User already exists");
        }
        let hashedPassword = await (0, encryption_service_1.generateHash)({ plainText: password });
        if (!hashedPassword) {
            throw new exception_error_1.BadRequestException("something went wrong");
        }
        let otp = Math.round(Math.random() * 1000000);
        let addedUser = await this.authReposatory.create({ name, email, password: hashedPassword, age, phone });
        redis_service_1.redisService.set(`otp::${addedUser._id}`, String(otp), 60);
        let { accessToken } = (0, token_service_1.generateToken)(addedUser);
        let html = `
            <h1>Welcome</h1>
            <a href="http://localhost:3000/auth/verify-account?token=${accessToken}">Complete your verification </a>
        `;
        // sendEmail({to: addedUser.email, subject: "signup", html: `<h1> Your OTP is ${otp} </h1>`})
        (0, email_service_1.sendEmail)({ to: addedUser.email, subject: "signup", html: html });
        return addedUser;
    }
    async login(data) {
        let { email, password } = data;
        let existedUser = await this.authReposatory.findOne({ filter: { email } });
        if (!existedUser) {
            throw new exception_error_1.NotFoundException("User not found");
        }
        if (!existedUser.isVerified) {
            throw new exception_error_1.BadRequestException("User not verified");
        }
        let matchedPassword = (0, encryption_service_1.compareHash)({ plainText: password, hashedText: existedUser.password });
        if (!matchedPassword) {
            throw new exception_error_1.BadRequestException("password not match");
        }
        let { accessToken, refreshToken } = (0, token_service_1.generateToken)(existedUser);
        return { accessToken, refreshToken };
    }
    async getUserById(id) {
        let userData = await this.authReposatory.findOne({ filter: { _id: id } });
        if (!userData) {
            throw new exception_error_1.NotFoundException("User not found");
        }
        return userData;
    }
    async verifyAccount(query) {
        let { token } = query;
        let decoded = jsonwebtoken_1.default.decode(token);
        console.log(decoded);
        let updatedUser = await this.authReposatory.updateOne({ filter: { _id: decoded.id }, updateData: { isVerified: true } });
        return updatedUser;
    }
    async generateNewAccessToken(body) {
        let { refreshToken } = body;
        if (!refreshToken) {
            throw new exception_error_1.BadRequestException("refresh token is required");
        }
        let decodedRefreshToken = jsonwebtoken_1.default.decode(refreshToken);
        let accessExpiresAtMS = (decodedRefreshToken.iat + Number(env_service_1.env.accessTokenExpiresIn)) * 1000;
        if (Date.now() < accessExpiresAtMS) {
            throw new exception_error_1.BadRequestException("Access token still valid");
        }
        let { accessToken } = (0, token_service_1.generateNewAccessToken)(refreshToken);
        if (accessToken) {
            return { accessToken };
        }
        throw new exception_error_1.BadRequestException("invalid token");
    }
    async forgetPassword(id) {
        let userData = await this.authReposatory.findOne({ filter: { _id: id } });
        if (!userData) {
            throw new exception_error_1.UnAuthorizedException("You are not authorized");
        }
        let otp = Math.round(Math.random() * 1000000);
        redis_service_1.redisService.set(`forgetPasswordOTP::${userData._id}`, String(otp), 60);
        (0, email_service_1.sendEmail)({ to: userData.email, subject: "forget password otp", html: `<h1> Your OTP is ${otp} </h1>` });
    }
    async resetPassword(body, id) {
        let { newPassword, otp } = body;
        let existedUser = await this.authReposatory.findOne({ filter: { _id: id } });
        if (!existedUser) {
            throw new exception_error_1.UnAuthorizedException("Not authorized");
        }
        const resetPasswordOTP = await redis_service_1.redisService.get(`forgetPasswordOTP::${existedUser._id}`);
        if (resetPasswordOTP != otp) {
            throw new exception_error_1.BadRequestException("otp does not match");
        }
        let hashedPassword = await (0, encryption_service_1.generateHash)({ plainText: newPassword });
        if (!hashedPassword) {
            throw new exception_error_1.BadRequestException("something went wrong");
        }
        let updatedUser = await this.authReposatory.updateOne({ filter: { _id: id }, updateData: { password: hashedPassword } });
        return updatedUser;
    }
    async followSystemToggle(currentUserId, body) {
        let { targetUserId } = body;
        if (currentUserId == targetUserId) {
            throw new exception_error_1.BadRequestException("You cannot follow yourself");
        }
        let targetUser = await this.authReposatory.findOne({ filter: { _id: targetUserId } });
        if (!targetUser) {
            throw new exception_error_1.NotFoundException("User not found");
        }
        let isAlreadyFollowing = targetUser.followers?.some((id) => id.toString() === currentUserId);
        let hasPendingRequest = targetUser.followRequests?.some((id) => id.toString() === currentUserId);
        if (isAlreadyFollowing || hasPendingRequest) {
            await this.authReposatory.updateOne({ filter: { _id: currentUserId }, updateData: { $pull: { following: targetUserId } } });
            await this.authReposatory.updateOne({ filter: { _id: targetUserId }, updateData: { $pull: { followers: currentUserId, followRequests: currentUserId } } });
            return { message: hasPendingRequest ? "Follow request cancelled" : "Unfollowed successfully" };
        }
        if (targetUser.isPrivate) {
            await this.authReposatory.updateOne({ filter: { _id: targetUserId }, updateData: { $addToSet: { followRequests: currentUserId } } });
            return { message: "Follow request sent" };
        }
        await this.authReposatory.updateOne({ filter: { _id: currentUserId }, updateData: { $addToSet: { following: targetUserId } } });
        await this.authReposatory.updateOne({ filter: { _id: targetUserId }, updateData: { $addToSet: { followers: currentUserId } } });
        return { message: "Followed successfully" };
    }
    async searchUsers(body) {
        let { keyword } = body;
        if (!keyword || !keyword.trim()) {
            return [];
        }
        let users = await this.authReposatory.findAll({ filter: {
                isVerified: true,
                $or: [
                    { name: { $regex: keyword.trim(), $options: "i" } },
                    { email: { $regex: keyword.trim(), $options: "i" } }
                ]
            }, select: "name email isVerified phone age followers following"
        });
        if (users.length == 0) {
            throw new exception_error_1.NotFoundException("No users found");
        }
        return users;
    }
    async getUserSuggestions(currentUserId) {
        let currentUser = await this.authReposatory.findOne({ filter: { _id: currentUserId } });
        if (!currentUser) {
            throw new exception_error_1.NotFoundException("User not found");
        }
        let excludedIds = [
            currentUserId,
            ...currentUser.following || []
        ];
        let suggestions = await this.authReposatory.findAll({ filter: {
                _id: { $nin: excludedIds },
                followRequests: { $ne: currentUserId },
                isVerified: true
            }, select: "-__v -password -role -followRequests" });
        return suggestions;
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
