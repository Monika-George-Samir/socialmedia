"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const user_enums_1 = require("../../common/enums/user.enums");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    },
    role: {
        type: Number,
        enum: user_enums_1.RoleEnums,
        default: user_enums_1.RoleEnums.User
    }
});
exports.userModel = (0, mongoose_1.model)("user", userSchema);
