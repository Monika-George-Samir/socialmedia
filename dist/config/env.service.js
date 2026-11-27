"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(`./.env.${process.env.NODE_ENV}`) });
const port = process.env.PORT;
const databaseURI = process.env.DATABASE_URI;
const salt = process.env.SALT_ROUNDS;
const mood = process.env.MOOD;
const userSignature = process.env.ACCESS_SIGNATURE_USER;
const userRefreshSignature = process.env.REFRESH_SIGNATURE_USER;
const adminSignature = process.env.ACCESS_SIGNATURE_ADMIN;
const adminRefreshSignature = process.env.REFRESH_SIGNATURE_ADMIN;
const emailUser = process.env.EMAIL;
const appPassword = process.env.APP_PASSWORD;
const redisURI = process.env.REDIS_URI;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
exports.env = {
    port,
    databaseURI,
    salt,
    mood,
    userSignature,
    userRefreshSignature,
    adminSignature,
    adminRefreshSignature,
    emailUser,
    appPassword,
    redisURI,
    accessTokenExpiresIn
};
