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
const router = (0, express_1.Router)();
router.post("/", (0, validation_service_1.validation)(auth_validation_1.signupSchema), async (req, res) => {
    let data = await auth_service_1.default.signup(req.body);
    (0, success_response_1.successResponse)({ res, message: "Done", data });
});
exports.default = router;
