"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
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
// Validation routes
router.post('/check-duplicate', (0, http_helpers_1.asyncHandler)(utils_1.checkDuplicate));
router.post('/check-otp', (0, http_helpers_1.asyncHandler)(utils_1.checkOTP));
// System info routes
router.get('/get-ip', (0, http_helpers_1.asyncHandler)(utils_1.getClientIP));
//# sourceMappingURL=utils.js.map