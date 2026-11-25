"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_service_js_1 = require("../../config/env.service.js");
const exception_error_js_1 = require("../exception/exception.error.js");
const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        throw new exception_error_js_1.BadRequestException("Token not provided");
    }
    let [flag, token] = req.headers.authorization.split(" ");
    if (!token) {
        throw new exception_error_js_1.BadRequestException("Token not found");
    }
    switch (flag) {
        case "Basic":
            const basicData = Buffer.from(token, "base64").toString();
            let [eamil, password] = basicData.split(":");
            break;
        case "Bearer":
            let decoded = jsonwebtoken_1.default.decode(token);
            let signature;
            switch (decoded.aud) {
                case "admin":
                    signature = env_service_js_1.env.adminSignature;
                    break;
                default:
                    signature = env_service_js_1.env.userSignature;
                    break;
            }
            let decodedData = jsonwebtoken_1.default.verify(token, signature);
            console.log(decodedData);
            if (decodedData) {
                req.userId = decodedData.id;
                next();
            }
            else {
                throw new exception_error_js_1.BadRequestException("invalid token");
            }
        default:
            break;
    }
};
exports.auth = auth;
