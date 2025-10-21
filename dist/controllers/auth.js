"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
exports.logoutUser = logoutUser;
exports.forceLogout = forceLogout;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Get current user
async function getCurrentUser(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return (0, http_helpers_1.sendError)(res, 'ไม่พบ token การเข้าสู่ระบบ', 401);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // ตรวจสอบ session โดยใช้ supabase client
        const { data: { user }, error: authError, } = await supabase.auth.getUser(token);
        if (authError || !user) {
            console.log("Auth error:", authError);
            return (0, http_helpers_1.sendError)(res, "token ไม่ถูกต้องหรือหมดอายุ", 401);
        }
        // ดึงข้อมูล user จาก database
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email, full_name, phone, role, created_at, updated_at")
            .eq("id", user.id)
            .single();
        if (userError) {
            console.log("User error:", userError);
            return (0, http_helpers_1.sendError)(res, "ไม่พบข้อมูลผู้ใช้", 404);
        }
        // ตรวจสอบว่าเป็น Super Admin หรือไม่
        const isSuperAdmin = userData?.role === "admin";
        const isAdmin = userData?.role === "admin";
        return (0, http_helpers_1.sendSuccess)(res, {
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
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        return (0, http_helpers_1.sendError)(res, "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", 500);
    }
}
// Logout user
async function logoutUser(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return (0, http_helpers_1.sendError)(res, "ไม่พบ token การเข้าสู่ระบบ", 401);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // ตรวจสอบ session และ logout
        const { error: signOutError } = await supabase.auth.admin.signOut(token);
        if (signOutError) {
            console.error("Error signing out:", signOutError);
            // ถึงแม้จะมี error ใน signOut เราก็ยังคืน success เพื่อให้ client logout
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "ออกจากระบบสำเร็จ",
            success: true,
        });
    }
    catch (error) {
        console.error("Error during logout:", error);
        // ถึงแม้จะมี error เราก็ควรให้ client logout ได้
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "ออกจากระบบสำเร็จ",
            success: true,
        });
    }
}
// Force logout (for Super Admin)
async function forceLogout(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // Force logout - ลบ session ทั้งหมด
        await supabase.auth.signOut();
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "ออกจากระบบสำเร็จ",
            success: true,
        });
    }
    catch (error) {
        console.error("Error during force logout:", error);
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "ออกจากระบบสำเร็จ",
            success: true,
        });
    }
}
//# sourceMappingURL=auth.js.map