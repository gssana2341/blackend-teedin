"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
exports.usersRouter = router;
// User routes
router.get('/:id', (0, http_helpers_1.asyncHandler)(users_1.getUserById));
router.post('/update-role', (0, http_helpers_1.asyncHandler)(users_1.updateUserRole));
router.post('/check-exists', (0, http_helpers_1.asyncHandler)(users_1.checkUserExists));
//# sourceMappingURL=users.js.map