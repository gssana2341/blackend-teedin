"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const database_1 = require("../controllers/database");
const router = (0, express_1.Router)();
exports.databaseRouter = router;
// Database routes
router.get('/test-connection', (0, http_helpers_1.asyncHandler)(database_1.testConnection));
router.post('/create-tables', (0, http_helpers_1.asyncHandler)(database_1.createTables));
router.post('/create-otp-tables', (0, http_helpers_1.asyncHandler)(database_1.createOTPTables));
//# sourceMappingURL=database.js.map