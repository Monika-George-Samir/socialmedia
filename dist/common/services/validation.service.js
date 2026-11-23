"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const exception_error_1 = require("../exception/exception.error");
const validation = (schema) => {
    return ((req, res, next) => {
        let validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key]) {
                continue;
            }
            const value = schema[key].safeParse(req[key]);
            if (!value.success) {
                validationError.push({ key, issue: value.error.issues });
            }
        }
        if (validationError.length > 0) {
            throw new exception_error_1.BadRequestException("Validation error", validationError);
        }
        next();
    });
};
exports.validation = validation;
