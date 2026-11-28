"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = {
    body: zod_1.default.object({
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(6),
    })
};
exports.signupSchema = {
    body: zod_1.default.object({
        name: zod_1.default.string().min(3).max(30),
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(6),
        confirmPassword: zod_1.default.string().min(6),
        age: zod_1.default.number().min(12).max(50),
        phone: zod_1.default.string()
    }).superRefine((data, ctx) => {
        if (data.password != data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password and confirmPassword didn't match",
                path: ['confirmPassword']
            });
        }
    })
};
exports.updateProfileSchema = {
    body: zod_1.default.object({
        name: zod_1.default.string().min(3).max(30).optional(),
        age: zod_1.default.number().min(12).max(50).optional(),
        phone: zod_1.default.string().optional()
    }).refine((data) => Object.keys(data).length > 0, { message: "no field provided to update" })
};
