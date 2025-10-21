import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { getNotifications, markNotificationAsRead, createTestNotifications } from '../controllers/notifications';

const router = Router();

// Notifications routes
router.get('/', asyncHandler(getNotifications));
router.post('/read', asyncHandler(markNotificationAsRead));
router.post('/create-test', asyncHandler(createTestNotifications));

export { router as notificationsRouter };
