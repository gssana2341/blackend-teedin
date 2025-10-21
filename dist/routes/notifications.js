"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const notifications_1 = require("../controllers/notifications");
const router = (0, express_1.Router)();
exports.notificationsRouter = router;
// Notifications routes
router.get('/', (0, http_helpers_1.asyncHandler)(notifications_1.getNotifications));
router.post('/read', (0, http_helpers_1.asyncHandler)(notifications_1.markNotificationAsRead));
router.post('/create-test', (0, http_helpers_1.asyncHandler)(notifications_1.createTestNotifications));
//# sourceMappingURL=notifications.js.map