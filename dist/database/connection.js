"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_service_1 = require("../config/env.service");
const DatabaseConnection = () => {
    mongoose_1.default.connect(env_service_1.env.databaseURI).then(() => {
        console.log('database connected');
    }).catch((err) => {
        console.log(err);
    });
};
exports.DatabaseConnection = DatabaseConnection;
