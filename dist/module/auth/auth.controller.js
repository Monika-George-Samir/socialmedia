"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_service_1 = __importDefault(require("./auth.service"));
router.post("/", async (req, res) => {
    let data = await auth_service_1.default.login(req.body);
    res.json({ message: "Done", data });
});
exports.default = router;
