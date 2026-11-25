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
class AuthService {
    authReposatory;
    constructor() {
        this.authReposatory = new database_reposatory_1.DatabaseReposatory(user_model_1.userModel);
    }
    async signup(data) {
        let { name, email, password, confirmPassword, age, phone } = data;
        let existedUser = await this.authReposatory.findOne({ filter: { email } });
        if (!existedUser) {
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
}
exports.AuthService = AuthService;
exports.default = new AuthService();
