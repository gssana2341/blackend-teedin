"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const sendSuccess = (res, data, status = 200) => {
    return res.status(status).json({ success: true, data });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, status = 400) => {
    return res.status(status).json({ success: false, error: message });
};
exports.sendError = sendError;
//# sourceMappingURL=http-helpers.js.map