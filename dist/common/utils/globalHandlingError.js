"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalHandlingError = void 0;
const globalHandlingError = (err, req, res, next) => {
    // let stack = env.mood == "dev" ? err.stack : null 
    const status = err.status || 500;
    // const cause = err.cause
    console.log(err);
    // let extra = err.cause ? err.cause.extra : null
    res.status(status).json({ message: err.message, stack: err.stack });
};
exports.globalHandlingError = globalHandlingError;
