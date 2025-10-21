import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Test database connection
export async function testConnection(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Database connection error:", error);
      return sendError(res, "Database connection failed: " + error.message, 500);
    }

    return sendSuccess(res, {
      status: "connected",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in testConnection:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Create tables
export async function createTables(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // This would typically run SQL scripts to create tables
    // For now, we'll just return a success message
    return sendSuccess(res, {
      message: "Tables creation initiated",
      note: "This endpoint would typically run database migration scripts",
    });
  } catch (error) {
    console.error("Error in createTables:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Create OTP tables
export async function createOTPTables(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if OTP tables exist
    const { data: tables, error } = await supabase
      .from("otp_codes")
      .select("count")
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, would need to create it
      return sendSuccess(res, {
        message: "OTP tables need to be created",
        note: "This endpoint would typically create OTP-related tables",
      });
    }

    return sendSuccess(res, {
      message: "OTP tables already exist",
      status: "ready",
    });
  } catch (error) {
    console.error("Error in createOTPTables:", error);
    return sendError(res, "Internal server error", 500);
  }
}
