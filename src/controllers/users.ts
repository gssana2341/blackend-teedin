import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get user by ID
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, "User ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, role, phone, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Update user role
export async function updateUserRole(req: Request, res: Response) {
  try {
    const { user_id, new_role } = req.body;

    if (!user_id || !new_role) {
      return sendError(res, "User ID and new role are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("users")
      .update({ role: new_role })
      .eq("id", user_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      return sendError(res, "Failed to update user role", 500);
    }

    return sendSuccess(res, data);
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Check if user exists
export async function checkUserExists(req: Request, res: Response) {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return sendError(res, "Email or phone is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase.from("users").select("id, email, phone");

    if (email) {
      query = query.eq("email", email);
    }

    if (phone) {
      query = query.eq("phone", phone);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking user existence:", error);
      return sendError(res, "Failed to check user existence", 500);
    }

    return sendSuccess(res, {
      exists: data && data.length > 0,
      users: data || [],
    });
  } catch (error) {
    console.error("Error in checkUserExists:", error);
    return sendError(res, "Internal server error", 500);
  }
}
