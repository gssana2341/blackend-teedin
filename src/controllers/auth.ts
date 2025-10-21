import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get current user
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 'ไม่พบ token การเข้าสู่ระบบ', 401);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // ตรวจสอบ session โดยใช้ supabase client
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log("Auth error:", authError);
      return sendError(res, "token ไม่ถูกต้องหรือหมดอายุ", 401);
    }

    // ดึงข้อมูล user จาก database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name, phone, role, created_at, updated_at")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.log("User error:", userError);
      return sendError(res, "ไม่พบข้อมูลผู้ใช้", 404);
    }

    // ตรวจสอบว่าเป็น Super Admin หรือไม่
    const isSuperAdmin = userData?.role === "admin";
    const isAdmin = userData?.role === "admin";

    return sendSuccess(res, {
      id: userData?.id || user.id,
      email: userData?.email || user.email,
      fullName: userData?.full_name || "",
      phone: userData?.phone || "",
      role: userData?.role || "customer",
      isSuperAdmin,
      isAdmin,
      createdAt: userData?.created_at,
      updatedAt: userData?.updated_at,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return sendError(res, "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", 500);
  }
}

// Logout user
export async function logoutUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return sendError(res, "ไม่พบ token การเข้าสู่ระบบ", 401);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ตรวจสอบ session และ logout
    const { error: signOutError } = await supabase.auth.admin.signOut(token);

    if (signOutError) {
      console.error("Error signing out:", signOutError);
      // ถึงแม้จะมี error ใน signOut เราก็ยังคืน success เพื่อให้ client logout
    }

    return sendSuccess(res, {
      message: "ออกจากระบบสำเร็จ",
      success: true,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    // ถึงแม้จะมี error เราก็ควรให้ client logout ได้
    return sendSuccess(res, {
      message: "ออกจากระบบสำเร็จ",
      success: true,
    });
  }
}

// Force logout (for Super Admin)
export async function forceLogout(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Force logout - ลบ session ทั้งหมด
    await supabase.auth.signOut();

    return sendSuccess(res, {
      message: "ออกจากระบบสำเร็จ",
      success: true,
    });
  } catch (error) {
    console.error("Error during force logout:", error);
    return sendSuccess(res, {
      message: "ออกจากระบบสำเร็จ",
      success: true,
    });
  }
}
