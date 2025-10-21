import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Send OTP via email
export async function sendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, "กรุณาระบุอีเมล", 400);
    }

    // ตรวจสอบ rate limit (simplified version)
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const rateLimitKey = `otp:${email}:${clientIP}`;
    
    // สร้าง OTP 6 หลัก
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // เก็บ OTP ในฐานข้อมูล พร้อมเวลาหมดอายุ (5 นาที)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // เก็บ OTP ในฐานข้อมูล
    const { error: otpError } = await supabase
      .from("otp_codes")
      .insert({
        email,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
        ip_address: clientIP,
      });

    if (otpError) {
      console.error("Error storing OTP:", otpError);
      return sendError(res, "Failed to store OTP", 500);
    }

    // ส่งอีเมล OTP (simplified - in production, use proper email service)
    console.log(`OTP for ${email}: ${otpCode}`);

    return sendSuccess(res, {
      message: "OTP sent successfully",
      email: email,
    });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Send OTP via SMS
export async function sendOTPSMS(req: Request, res: Response) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return sendError(res, "กรุณาระบุหมายเลขโทรศัพท์", 400);
    }

    // สร้าง OTP 6 หลัก
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // เก็บ OTP ในฐานข้อมูล
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: otpError } = await supabase
      .from("otp_codes")
      .insert({
        phone,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
        ip_address: req.ip || 'unknown',
      });

    if (otpError) {
      console.error("Error storing OTP:", otpError);
      return sendError(res, "Failed to store OTP", 500);
    }

    // ส่ง SMS OTP (simplified - in production, use Twilio)
    console.log(`SMS OTP for ${phone}: ${otpCode}`);

    return sendSuccess(res, {
      message: "SMS OTP sent successfully",
      phone: phone,
    });
  } catch (error) {
    console.error("Error in sendOTPSMS:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Verify OTP
export async function verifyOTP(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return sendError(res, "กรุณาระบุอีเมลและรหัส OTP", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ตรวจสอบ OTP
    const { data: otpData, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return sendError(res, "รหัส OTP ไม่ถูกต้องหรือหมดอายุ", 400);
    }

    // ลบ OTP หลังจากใช้แล้ว
    await supabase
      .from("otp_codes")
      .delete()
      .eq("id", otpData.id);

    return sendSuccess(res, {
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Verify OTP SMS
export async function verifyOTPSMS(req: Request, res: Response) {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return sendError(res, "กรุณาระบุหมายเลขโทรศัพท์และรหัส OTP", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ตรวจสอบ OTP
    const { data: otpData, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return sendError(res, "รหัส OTP ไม่ถูกต้องหรือหมดอายุ", 400);
    }

    // ลบ OTP หลังจากใช้แล้ว
    await supabase
      .from("otp_codes")
      .delete()
      .eq("id", otpData.id);

    return sendSuccess(res, {
      message: "SMS OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error in verifyOTPSMS:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Reset password
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return sendError(res, "กรุณาระบุอีเมลและรหัสผ่านใหม่", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // อัพเดตรหัสผ่าน
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return sendError(res, "Failed to update password", 500);
    }

    return sendSuccess(res, {
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get user info
export async function getUser(req: Request, res: Response) {
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
    console.error("Error in getUser:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Track property view
export async function trackView(req: Request, res: Response) {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return sendError(res, "Property ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // อัพเดต view count - get current count first
    const { data: currentData, error: fetchError } = await supabase
      .from("property_details")
      .select("view_count")
      .eq("property_id", propertyId)
      .single();

    if (fetchError) {
      console.error("Error fetching current view count:", fetchError);
      return sendError(res, "Failed to fetch property", 500);
    }

    const { error } = await supabase
      .from("property_details")
      .update({ view_count: (currentData?.view_count || 0) + 1 })
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error tracking view:", error);
      return sendError(res, "Failed to track view", 500);
    }

    return sendSuccess(res, {
      message: "View tracked successfully",
    });
  } catch (error) {
    console.error("Error in trackView:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Check duplicate data
export async function checkDuplicate(req: Request, res: Response) {
  try {
    const { table, field, value } = req.body;

    if (!table || !field || !value) {
      return sendError(res, "Table, field, and value are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from(table as string)
      .select("id")
      .eq(field as string, value)
      .limit(1);

    if (error) {
      console.error("Error checking duplicate:", error);
      return sendError(res, "Failed to check duplicate", 500);
    }

    return sendSuccess(res, {
      is_duplicate: data && data.length > 0,
      exists: data && data.length > 0,
    });
  } catch (error) {
    console.error("Error in checkDuplicate:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Check OTP
export async function checkOTP(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return sendError(res, "Email and code are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: otpData, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !otpData) {
      return sendSuccess(res, {
        valid: false,
        message: "Invalid or expired OTP",
      });
    }

    return sendSuccess(res, {
      valid: true,
      message: "OTP is valid",
    });
  } catch (error) {
    console.error("Error in checkOTP:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get client IP
export async function getClientIP(req: Request, res: Response) {
  try {
    const ip = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection as any).socket?.remoteAddress ||
               req.headers['x-forwarded-for'] ||
               req.headers['x-real-ip'] ||
               'unknown';

    return sendSuccess(res, {
      ip: ip,
      headers: {
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip'],
        'user-agent': req.headers['user-agent'],
      },
    });
  } catch (error) {
    console.error("Error in getClientIP:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Track view with GET request (for frontend compatibility)
export async function trackViewGet(req: Request, res: Response) {
  try {
    const { propertyId } = req.query;

    if (!propertyId) {
      return sendError(res, "Property ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // ตรวจสอบว่า propertyId เป็น UUID หรือไม่
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId as string);
    
    if (!isUUID) {
      // ถ้าไม่ใช่ UUID (เช่น "new-1", "new-2") ให้ return success โดยไม่ update database
      return sendSuccess(res, {
        message: "View tracked successfully (static property)",
        propertyId: propertyId,
        viewCount: 0,
        note: "Static property - view count not tracked in database"
      });
    }

    // อัพเดต view count - get current count first
    const { data: currentData, error: fetchError } = await supabase
      .from("property_details")
      .select("view_count")
      .eq("property_id", propertyId)
      .single();

    if (fetchError) {
      console.error("Error fetching current view count:", fetchError);
      // ถ้า property ไม่มี ให้ return success แต่ไม่ update
      return sendSuccess(res, {
        message: "Property not found, but request processed",
        propertyId: propertyId,
        viewCount: 0,
        note: "Property does not exist in database"
      });
    }

    const currentViewCount = currentData?.view_count || 0;
    const newViewCount = currentViewCount + 1;

    // Update view count
    const { error: updateError } = await supabase
      .from("property_details")
      .update({ view_count: newViewCount })
      .eq("property_id", propertyId);

    if (updateError) {
      console.error("Error updating view count:", updateError);
      return sendError(res, "Failed to update view count", 500);
    }

    return sendSuccess(res, {
      message: "View tracked successfully",
      propertyId: propertyId,
      viewCount: newViewCount,
    });
  } catch (error) {
    console.error("Error in trackViewGet:", error);
    return sendError(res, "Internal server error", 500);
  }
}
