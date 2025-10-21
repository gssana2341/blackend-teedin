import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { 
  testSMTP, 
  testTwilio, 
  testResend, 
  getEmailDiagnostics, 
  getSMSDiagnostics, 
  simpleResend,
  debugNotifications,
  debugResend,
  debugProperties
} from '../controllers/testing';

const router = Router();

// Testing routes
router.post('/test-smtp', asyncHandler(testSMTP));
router.post('/test-twilio', asyncHandler(testTwilio));
router.post('/test-resend', asyncHandler(testResend));
router.get('/email-diagnostics', asyncHandler(getEmailDiagnostics));
router.get('/sms-diagnostics', asyncHandler(getSMSDiagnostics));
router.post('/simple-resend', asyncHandler(simpleResend));

// Debug routes
router.get('/debug-notifications', asyncHandler(debugNotifications));
router.get('/debug-resend', asyncHandler(debugResend));
router.get('/debug-properties', asyncHandler(debugProperties));

export { router as testingRouter };
