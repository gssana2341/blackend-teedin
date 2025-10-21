"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
exports.adminRouter = router;
// All admin routes require authentication and admin role
router.use(auth_1.requireAuth);
router.use(auth_1.requireAdmin);
// Admin routes
router.get('/dashboard', (0, http_helpers_1.asyncHandler)(admin_1.getDashboardStats));
router.get('/users', (0, http_helpers_1.asyncHandler)(admin_1.getUsers));
router.get('/properties', (0, http_helpers_1.asyncHandler)(admin_1.getAdminProperties));
router.get('/stats', (0, http_helpers_1.asyncHandler)(admin_1.getAdminStats));
// Admin agents routes
router.get('/agents', (0, http_helpers_1.asyncHandler)(admin_1.getAdminAgents));
router.put('/agents', (0, http_helpers_1.asyncHandler)(admin_1.updateAgentStatus));
// Admin announcements routes
router.get('/announcements', (0, http_helpers_1.asyncHandler)(admin_1.getAdminAnnouncements));
router.post('/announcements', (0, http_helpers_1.asyncHandler)(admin_1.createAnnouncement));
router.put('/announcements', (0, http_helpers_1.asyncHandler)(admin_1.updateAnnouncement));
router.delete('/announcements', (0, http_helpers_1.asyncHandler)(admin_1.deleteAnnouncement));
// Admin settings routes
router.get('/settings', (0, http_helpers_1.asyncHandler)(admin_1.getAdminSettings));
router.put('/settings', (0, http_helpers_1.asyncHandler)(admin_1.updateAdminSettings));
//# sourceMappingURL=admin.js.map