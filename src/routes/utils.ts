import { Router, Request, Response } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { sendSuccess, sendError } from '../lib/http-helpers';
import { createClient } from '@supabase/supabase-js';
import { 
  sendOTP, 
  sendOTPSMS, 
  verifyOTP, 
  verifyOTPSMS, 
  resetPassword, 
  getUser, 
  trackView,
  trackViewGet,
  checkDuplicate,
  checkOTP,
  getClientIP
} from '../controllers/utils';

const router = Router();

// OTP routes
router.post('/send-otp', asyncHandler(sendOTP));
router.post('/send-otp-sms', asyncHandler(sendOTPSMS));
router.post('/verify-otp', asyncHandler(verifyOTP));
router.post('/verify-otp-sms', asyncHandler(verifyOTPSMS));

// Password reset
router.post('/reset-password', asyncHandler(resetPassword));

// User info
router.get('/user/:id', asyncHandler(getUser));

// Property tracking
router.post('/track-view', asyncHandler(trackView));
router.get('/track-view', asyncHandler(trackViewGet));

// Validation routes
router.post('/check-duplicate', asyncHandler(checkDuplicate));
router.post('/check-otp', asyncHandler(checkOTP));

// System info routes
router.get('/get-ip', asyncHandler(getClientIP));

// Test connection route
router.get('/test-connection', asyncHandler(async (req: Request, res: Response) => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test database connection
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (error) {
      return sendError(res, `Database connection failed: ${error.message}`, 500);
    }

    return sendSuccess(res, {
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      data: data
    });
  } catch (error: any) {
    return sendError(res, `Connection test failed: ${error.message}`, 500);
  }
}));

// Health check route
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, {
      status: 'OK',
      service: 'Teedin Backend API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error: any) {
    return sendError(res, `Health check failed: ${error.message}`, 500);
  }
}));

// Test route
router.get('/test', asyncHandler(async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, {
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    return sendError(res, `Test failed: ${error.message}`, 500);
  }
}));

// Status route
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test database connection
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    return sendSuccess(res, {
      status: 'OK',
      database: error ? 'disconnected' : 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error: any) {
    return sendError(res, `Status check failed: ${error.message}`, 500);
  }
}));

export { router as utilsRouter };
