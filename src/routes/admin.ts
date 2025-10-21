import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { 
  getDashboardStats, 
  getUsers, 
  getAdminProperties, 
  getAdminStats,
  getAdminAgents,
  updateAgentStatus,
  getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAdminSettings,
  updateAdminSettings
} from '../controllers/admin';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// Admin routes
router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/users', asyncHandler(getUsers));
router.get('/properties', asyncHandler(getAdminProperties));
router.get('/stats', asyncHandler(getAdminStats));

// Admin agents routes
router.get('/agents', asyncHandler(getAdminAgents));
router.put('/agents', asyncHandler(updateAgentStatus));

// Admin announcements routes
router.get('/announcements', asyncHandler(getAdminAnnouncements));
router.post('/announcements', asyncHandler(createAnnouncement));
router.put('/announcements', asyncHandler(updateAnnouncement));
router.delete('/announcements', asyncHandler(deleteAnnouncement));

// Admin settings routes
router.get('/settings', asyncHandler(getAdminSettings));
router.put('/settings', asyncHandler(updateAdminSettings));

export { router as adminRouter };
