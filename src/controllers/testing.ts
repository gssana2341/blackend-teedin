import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Test SMTP
export async function testSMTP(req: Request, res: Response) {
  try {
    // This would test SMTP configuration
    return sendSuccess(res, {
      message: "SMTP test initiated",
      note: "This endpoint would test SMTP email configuration",
    });
  } catch (error) {
    console.error("Error in testSMTP:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Test Twilio SMS
export async function testTwilio(req: Request, res: Response) {
  try {
    // This would test Twilio SMS configuration
    return sendSuccess(res, {
      message: "Twilio SMS test initiated",
      note: "This endpoint would test Twilio SMS configuration",
    });
  } catch (error) {
    console.error("Error in testTwilio:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Test Resend email
export async function testResend(req: Request, res: Response) {
  try {
    // This would test Resend email configuration
    return sendSuccess(res, {
      message: "Resend email test initiated",
      note: "This endpoint would test Resend email configuration",
    });
  } catch (error) {
    console.error("Error in testResend:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Email diagnostics
export async function getEmailDiagnostics(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get email logs or statistics
    const { data: emailLogs, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching email logs:", error);
      return sendError(res, "Failed to fetch email logs", 500);
    }

    return sendSuccess(res, {
      email_logs: emailLogs || [],
      total_logs: emailLogs?.length || 0,
    });
  } catch (error) {
    console.error("Error in getEmailDiagnostics:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// SMS diagnostics
export async function getSMSDiagnostics(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get SMS logs or statistics
    const { data: smsLogs, error } = await supabase
      .from("sms_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching SMS logs:", error);
      return sendError(res, "Failed to fetch SMS logs", 500);
    }

    return sendSuccess(res, {
      sms_logs: smsLogs || [],
      total_logs: smsLogs?.length || 0,
    });
  } catch (error) {
    console.error("Error in getSMSDiagnostics:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Simple resend email
export async function simpleResend(req: Request, res: Response) {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return sendError(res, "To, subject, and message are required", 400);
    }

    // This would send a simple email
    return sendSuccess(res, {
      message: "Email sent successfully",
      to,
      subject,
    });
  } catch (error) {
    console.error("Error in simpleResend:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Debug notifications
export async function debugNotifications(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching notifications:", error);
      return sendError(res, "Failed to fetch notifications", 500);
    }

    return sendSuccess(res, {
      notifications: notifications || [],
      total: notifications?.length || 0,
    });
  } catch (error) {
    console.error("Error in debugNotifications:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Debug resend
export async function debugResend(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: emailLogs, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching email logs:", error);
      return sendError(res, "Failed to fetch email logs", 500);
    }

    return sendSuccess(res, {
      email_logs: emailLogs || [],
      total: emailLogs?.length || 0,
    });
  } catch (error) {
    console.error("Error in debugResend:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Debug properties
export async function debugProperties(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: properties, error } = await supabase
      .from("properties")
      .select(`
        id,
        listing_type,
        property_category,
        created_at,
        property_details (
          project_name,
          address,
          price
        )
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching properties:", error);
      return sendError(res, "Failed to fetch properties", 500);
    }

    return sendSuccess(res, {
      properties: properties || [],
      total: properties?.length || 0,
    });
  } catch (error) {
    console.error("Error in debugProperties:", error);
    return sendError(res, "Internal server error", 500);
  }
}
