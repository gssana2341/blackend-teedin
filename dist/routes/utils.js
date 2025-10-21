"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const http_helpers_2 = require("../lib/http-helpers");
const supabase_js_1 = require("@supabase/supabase-js");
const utils_1 = require("../controllers/utils");
const router = (0, express_1.Router)();
exports.utilsRouter = router;
// OTP routes
router.post('/send-otp', (0, http_helpers_1.asyncHandler)(utils_1.sendOTP));
router.post('/send-otp-sms', (0, http_helpers_1.asyncHandler)(utils_1.sendOTPSMS));
router.post('/verify-otp', (0, http_helpers_1.asyncHandler)(utils_1.verifyOTP));
router.post('/verify-otp-sms', (0, http_helpers_1.asyncHandler)(utils_1.verifyOTPSMS));
// Password reset
router.post('/reset-password', (0, http_helpers_1.asyncHandler)(utils_1.resetPassword));
// User info
router.get('/user/:id', (0, http_helpers_1.asyncHandler)(utils_1.getUser));
// Property tracking
router.post('/track-view', (0, http_helpers_1.asyncHandler)(utils_1.trackView));
router.get('/track-view', (0, http_helpers_1.asyncHandler)(utils_1.trackViewGet));
// Validation routes
router.post('/check-duplicate', (0, http_helpers_1.asyncHandler)(utils_1.checkDuplicate));
router.post('/check-otp', (0, http_helpers_1.asyncHandler)(utils_1.checkOTP));
// System info routes
router.get('/get-ip', (0, http_helpers_1.asyncHandler)(utils_1.getClientIP));
// Test connection route
router.get('/test-connection', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // Test database connection
        const { data, error } = await supabase
            .from('properties')
            .select('id')
            .limit(1);
        if (error) {
            return (0, http_helpers_2.sendError)(res, `Database connection failed: ${error.message}`, 500);
        }
        return (0, http_helpers_2.sendSuccess)(res, {
            message: 'Database connection successful',
            timestamp: new Date().toISOString(),
            data: data
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Connection test failed: ${error.message}`, 500);
    }
}));
// Health check route
router.get('/health', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        return (0, http_helpers_2.sendSuccess)(res, {
            status: 'OK',
            service: 'Teedin Backend API',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Health check failed: ${error.message}`, 500);
    }
}));
// Test route
router.get('/test', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        return (0, http_helpers_2.sendSuccess)(res, {
            message: 'Test endpoint working',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Test failed: ${error.message}`, 500);
    }
}));
// Status route
router.get('/status', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // Test database connection
        const { data, error } = await supabase
            .from('properties')
            .select('id')
            .limit(1);
        return (0, http_helpers_2.sendSuccess)(res, {
            status: 'OK',
            database: error ? 'disconnected' : 'connected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Status check failed: ${error.message}`, 500);
    }
}));
//# sourceMappingURL=utils.js.map