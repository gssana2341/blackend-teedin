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
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Teedin Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/`);
});
exports.default = app;
//# sourceMappingURL=server.js.map