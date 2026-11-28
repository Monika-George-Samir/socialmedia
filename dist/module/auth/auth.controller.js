"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const success_response_1 = require("../../common/exception/success.response");
const validation_service_1 = require("../../common/services/validation.service");
const auth_validation_1 = require("./auth.validation");
const auth_midlleware_1 = require("../../common/middleware/auth.midlleware");
const router = (0, express_1.Router)();
router.post("/login", (0, validation_service_1.validation)(auth_validation_1.loginSchema), async (req, res) => {
    let data = await auth_service_1.default.login(req.body);
    (0, success_response_1.successResponse)({ res, message: "login successfully", data });
});
router.post("/signup", (0, validation_service_1.validation)(auth_validation_1.signupSchema), async (req, res) => {
    let data = await auth_service_1.default.signup(req.body);
    (0, success_response_1.successResponse)({ res, message: "Signup successfully", data });
});
router.get("/get-user-by-id", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.getUserById(req.userId);
    (0, success_response_1.successResponse)({ res, message: "User found", data });
});
router.get("/verify-account", async (req, res) => {
    let data = await auth_service_1.default.verifyAccount(req.query);
    (0, success_response_1.successResponse)({ res, message: "Account verified", data });
});
router.post("/generate-access-token", async (req, res) => {
    let data = await auth_service_1.default.generateNewAccessToken(req.body);
    (0, success_response_1.successResponse)({ res, message: "New access token generated", data });
});
router.post("/forget-password", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.forgetPassword(req.userId);
    (0, success_response_1.successResponse)({ res, message: "OTP sent", data });
});
router.patch("/reset-password", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.resetPassword(req.body, req.userId);
    (0, success_response_1.successResponse)({ res, message: "password changed successfully", data });
});
router.get("/get-user-profile/:id", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.getUserProfile(req.userId, req.params.id);
    (0, success_response_1.successResponse)({ res, message: "User details", data });
});
router.patch("/update-user", auth_midlleware_1.auth, (0, validation_service_1.validation)(auth_validation_1.updateProfileSchema), async (req, res) => {
    let data = await auth_service_1.default.updateUser(req.userId, req.body);
    (0, success_response_1.successResponse)({ res, message: "User updated", data });
});
router.patch("/follow-unfollow", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.followSystemToggle(req.userId, req.body);
    (0, success_response_1.successResponse)({ res, message: data.message });
});
router.get("/search", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.searchUsers(req.body);
    (0, success_response_1.successResponse)({ res, data });
});
router.get("/get-suggestions", auth_midlleware_1.auth, async (req, res) => {
    let data = await auth_service_1.default.getUserSuggestions(req.userId);
    (0, success_response_1.successResponse)({ res, message: data.message, data });
});
exports.default = router;
