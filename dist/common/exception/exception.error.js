"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.UnAuthorizedException = exports.ConflictException = exports.NotFoundException = exports.BadRequestException = exports.ApplicationException = void 0;
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
class ConflictException extends ApplicationException {
    constructor(message = "Conflict error", cause) {
        super(message, cause, 409);
    }
}
exports.ConflictException = ConflictException;
class UnAuthorizedException extends ApplicationException {
    constructor(message = "UnAuthorize error", cause) {
        super(message, cause, 401);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ForbiddenException extends ApplicationException {
    constructor(message = "Forbidden error", cause) {
        super(message, cause, 403);
    }
}
exports.ForbiddenException = ForbiddenException;
