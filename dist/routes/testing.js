"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const testing_1 = require("../controllers/testing");
const router = (0, express_1.Router)();
exports.testingRouter = router;
// Testing routes
router.post('/test-smtp', (0, http_helpers_1.asyncHandler)(testing_1.testSMTP));
router.post('/test-twilio', (0, http_helpers_1.asyncHandler)(testing_1.testTwilio));
router.post('/test-resend', (0, http_helpers_1.asyncHandler)(testing_1.testResend));
router.get('/email-diagnostics', (0, http_helpers_1.asyncHandler)(testing_1.getEmailDiagnostics));
router.get('/sms-diagnostics', (0, http_helpers_1.asyncHandler)(testing_1.getSMSDiagnostics));
router.post('/simple-resend', (0, http_helpers_1.asyncHandler)(testing_1.simpleResend));
// Debug routes
router.get('/debug-notifications', (0, http_helpers_1.asyncHandler)(testing_1.debugNotifications));
router.get('/debug-resend', (0, http_helpers_1.asyncHandler)(testing_1.debugResend));
router.get('/debug-properties', (0, http_helpers_1.asyncHandler)(testing_1.debugProperties));
//# sourceMappingURL=testing.js.map