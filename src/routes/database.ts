import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { testConnection, createTables, createOTPTables } from '../controllers/database';

const router = Router();

// Database routes
router.get('/test-connection', asyncHandler(testConnection));
router.post('/create-tables', asyncHandler(createTables));
router.post('/create-otp-tables', asyncHandler(createOTPTables));

export { router as databaseRouter };
