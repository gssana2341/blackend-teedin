"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
exports.authRouter = router;
// Auth routes
router.get('/me', (0, http_helpers_1.asyncHandler)(auth_1.getCurrentUser));
router.post('/logout', (0, http_helpers_1.asyncHandler)(auth_1.logoutUser));
router.delete('/logout', (0, http_helpers_1.asyncHandler)(auth_1.forceLogout));
//# sourceMappingURL=auth.js.map