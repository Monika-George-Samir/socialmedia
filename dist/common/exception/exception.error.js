"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = exports.BadRequestException = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    status;
    constructor(message, cause, status) {
        super(message, { cause });
        this.status = status;
        this.name = this.constructor.name;
    }
}
exports.ApplicationException = ApplicationException;
class BadRequestException extends ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, cause, 400);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends ApplicationException {
    constructor(message = "Not Found", cause) {
        super(message, cause, 404);
    }
}
exports.NotFoundException = NotFoundException;
