"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateNewAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_service_js_1 = require("../../config/env.service.js");
const exception_error_js_1 = require("../exception/exception.error.js");
const generateNewAccessToken = (refreshToken) => {
    let data = jsonwebtoken_1.default.decode(refreshToken);
    if (!data) {
        throw new exception_error_js_1.BadRequestException("token is not valid");
    }
    let aud;
    let signature;
    let refreshSignature;
    switch (data.aud) {
        case "admin":
            signature = env_service_js_1.env.adminSignature;
            refreshSignature = env_service_js_1.env.adminRefreshSignature;
            aud = "admin";
            break;
        default:
            signature = env_service_js_1.env.userSignature;
            refreshSignature = env_service_js_1.env.userRefreshSignature;
            aud = "user";
            break;
    }
    let decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, refreshSignature);
    let accessToken = jsonwebtoken_1.default.sign({ id: decodedRefreshToken.id }, signature, { expiresIn: "30min", audience: aud });
    return { accessToken };
};
exports.generateNewAccessToken = generateNewAccessToken;
const generateToken = (user) => {
    let aud;
    let signature;
    let refreshSignature;
    switch (user.role) {
        case 1:
            signature = env_service_js_1.env.adminSignature;
            refreshSignature = env_service_js_1.env.adminRefreshSignature;
            aud = "admin";
            break;
        default:
            signature = env_service_js_1.env.userSignature;
            refreshSignature = env_service_js_1.env.userRefreshSignature;
            aud = "user";
            break;
    }
    let accessToken = jsonwebtoken_1.default.sign({ id: user._id }, signature, { expiresIn: "30min", audience: aud });
    let refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, refreshSignature, { expiresIn: "1y", audience: aud });
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
