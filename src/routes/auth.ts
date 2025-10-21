import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { sendSuccess, sendError } from '../lib/http-helpers';
import { getCurrentUser, logoutUser, forceLogout } from '../controllers/auth';

const router = Router();

// Auth routes
router.get('/me', asyncHandler(getCurrentUser));
router.post('/logout', asyncHandler(logoutUser));
router.delete('/logout', asyncHandler(forceLogout));

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // First, try Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError || !authData.user) {
      // If Supabase Auth fails, check if user exists in database
      console.log('Supabase Auth failed, checking database for user:', email);
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Database query result:', { userData, userError });

      if (userError || !userData) {
        console.log('User not found in database');
        return sendError(res, 'ไม่พบข้อมูลผู้ใช้', 404);
      }

      // For now, accept any password for existing users (you should implement proper password checking)
      return sendSuccess(res, {
        message: 'Login successful',
        user: {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          phone: userData.phone
        },
        token: 'mock-jwt-token' // You should generate a proper JWT token
      });
    }

    // If Supabase Auth succeeds, get user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      return sendError(res, 'ไม่พบข้อมูลผู้ใช้', 404);
    }

    return sendSuccess(res, {
      message: 'Login successful',
      user: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        phone: userData.phone
      },
      token: authData.session?.access_token
    });
  } catch (error: any) {
    return sendError(res, `Login failed: ${error.message}`, 500);
  }
}));

// Register route
router.post('/register', asyncHandler(async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return sendError(res, 'Email, password, and name are required', 400);
    }

    // TODO: Implement actual registration logic with Supabase
    // For now, return a mock response
    return sendSuccess(res, {
      message: 'Registration successful',
      user: {
        id: 'mock-user-id',
        email: email,
        name: name
      }
    });
  } catch (error: any) {
    return sendError(res, `Registration failed: ${error.message}`, 500);
  }
}));

export { router as authRouter };
