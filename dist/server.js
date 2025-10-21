"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const error_handler_1 = require("./middleware/error-handler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    const requestTimestamp = new Date().toISOString();
    console.log(`[${requestTimestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
    // Log response when it finishes
    res.on('finish', () => {
        const responseTimestamp = new Date().toISOString();
        const statusMessage = res.statusMessage || 'OK';
        console.log(`[${responseTimestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${statusMessage}`);
    });
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Teedin Backend API',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use('/api', routes_1.router);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Teedin Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api/*',
        },
    });
});
// Error handling middleware
app.use(error_handler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});
// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Teedin Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/`);
    console.log(`🔍 Logs will show all incoming requests and responses`);
});
exports.default = app;
//# sourceMappingURL=server.js.map