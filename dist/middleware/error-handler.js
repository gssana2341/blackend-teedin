"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    const timestamp = new Date().toISOString();
    const statusCode = err.status || 500;
    console.error(`🚨 [${timestamp}] Error ${statusCode} on ${req.method} ${req.originalUrl}:`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Stack: ${err.stack}`);
    res.status(statusCode).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        timestamp: timestamp
    });
}
//# sourceMappingURL=error-handler.js.map