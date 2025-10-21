import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userProfile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(403).json({ error: 'Authorization failed' });
  }
}
