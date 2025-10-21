"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrorCode = exports.extractErrorMessage = void 0;
const extractErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    if (error && typeof error === "object" && "message" in error) {
        const maybeMessage = error.message;
        if (typeof maybeMessage === "string") {
            return maybeMessage;
        }
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return String(error);
    }
};
exports.extractErrorMessage = extractErrorMessage;
const extractErrorCode = (error) => {
    if (!error || typeof error !== "object") {
        return undefined;
    }
    if ("code" in error) {
        const code = error.code;
        if (typeof code === "string" || typeof code === "number") {
            return code;
        }
    }
    return undefined;
};
exports.extractErrorCode = extractErrorCode;
//# sourceMappingURL=error-utils.js.map