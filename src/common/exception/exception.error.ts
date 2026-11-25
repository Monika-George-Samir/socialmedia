

export class ApplicationException extends Error{
    constructor(message: string, cause:unknown, public status:number){
        super(message, {cause})
        this.name = this.constructor.name
    }
}


export class BadRequestException extends ApplicationException {
    constructor(message = "Bad Request", cause?: unknown){
        super(message, cause, 400)
    }
}

export class NotFoundException extends ApplicationException {
    constructor(message = "Not Found", cause?: unknown){
        super(message, cause, 404)
    }
}
export class ConflictException extends ApplicationException {
    constructor(message = "Conflict error", cause?: unknown){
        super(message, cause, 409)
    }
}
export class UnAuthorizedException extends ApplicationException {
    constructor(message = "UnAuthorize error", cause?: unknown){
        super(message, cause, 401)
    }
}
export class ForbiddenException extends ApplicationException {
    constructor(message = "Forbidden error", cause?: unknown){
        super(message, cause, 403)
    }
}