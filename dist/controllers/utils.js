"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
exports.sendOTPSMS = sendOTPSMS;
exports.verifyOTP = verifyOTP;
exports.verifyOTPSMS = verifyOTPSMS;
exports.resetPassword = resetPassword;
exports.getUser = getUser;
exports.trackView = trackView;
exports.checkDuplicate = checkDuplicate;
exports.checkOTP = checkOTP;
exports.getClientIP = getClientIP;
exports.trackViewGet = trackViewGet;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Send OTP via email
async function sendOTP(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return (0, http_helpers_1.sendError)(res, "กรุณาระบุอีเมล", 400);
        }
        // ตรวจสอบ rate limit (simplified version)
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        const rateLimitKey = `otp:${email}:${clientIP}`;
        // สร้าง OTP 6 หลัก
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // เก็บ OTP ในฐานข้อมูล พร้อมเวลาหมดอายุ (5 นาที)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "Failed to store OTP", 500);
        }
        // ส่งอีเมล OTP (simplified - in production, use proper email service)
        console.log(`OTP for ${email}: ${otpCode}`);
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "OTP sent successfully",
            email: email,
        });
    }
    catch (error) {
        console.error("Error in sendOTP:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Send OTP via SMS
async function sendOTPSMS(req, res) {
    try {
        const { phone } = req.body;
        if (!phone) {
            return (0, http_helpers_1.sendError)(res, "กรุณาระบุหมายเลขโทรศัพท์", 400);
        }
        // สร้าง OTP 6 หลัก
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // เก็บ OTP ในฐานข้อมูล
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "Failed to store OTP", 500);
        }
        // ส่ง SMS OTP (simplified - in production, use Twilio)
        console.log(`SMS OTP for ${phone}: ${otpCode}`);
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "SMS OTP sent successfully",
            phone: phone,
        });
    }
    catch (error) {
        console.error("Error in sendOTPSMS:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Verify OTP
async function verifyOTP(req, res) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return (0, http_helpers_1.sendError)(res, "กรุณาระบุอีเมลและรหัส OTP", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "รหัส OTP ไม่ถูกต้องหรือหมดอายุ", 400);
        }
        // ลบ OTP หลังจากใช้แล้ว
        await supabase
            .from("otp_codes")
            .delete()
            .eq("id", otpData.id);
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "OTP verified successfully",
            verified: true,
        });
    }
    catch (error) {
        console.error("Error in verifyOTP:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Verify OTP SMS
async function verifyOTPSMS(req, res) {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            return (0, http_helpers_1.sendError)(res, "กรุณาระบุหมายเลขโทรศัพท์และรหัส OTP", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "รหัส OTP ไม่ถูกต้องหรือหมดอายุ", 400);
        }
        // ลบ OTP หลังจากใช้แล้ว
        await supabase
            .from("otp_codes")
            .delete()
            .eq("id", otpData.id);
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "SMS OTP verified successfully",
            verified: true,
        });
    }
    catch (error) {
        console.error("Error in verifyOTPSMS:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Reset password
async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return (0, http_helpers_1.sendError)(res, "กรุณาระบุอีเมลและรหัสผ่านใหม่", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // อัพเดตรหัสผ่าน
        const { error: updateError } = await supabase.auth.admin.updateUserById(email, { password: newPassword });
        if (updateError) {
            console.error("Error updating password:", updateError);
            return (0, http_helpers_1.sendError)(res, "Failed to update password", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "Password updated successfully",
        });
    }
    catch (error) {
        console.error("Error in resetPassword:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Get user info
async function getUser(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return (0, http_helpers_1.sendError)(res, "User ID is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, first_name, last_name, role, phone, created_at, updated_at")
            .eq("id", id)
            .single();
        if (error || !user) {
            return (0, http_helpers_1.sendError)(res, "User not found", 404);
        }
        return (0, http_helpers_1.sendSuccess)(res, user);
    }
    catch (error) {
        console.error("Error in getUser:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Track property view
async function trackView(req, res) {
    try {
        const { propertyId } = req.body;
        if (!propertyId) {
            return (0, http_helpers_1.sendError)(res, "Property ID is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // อัพเดต view count - get current count first
        const { data: currentData, error: fetchError } = await supabase
            .from("property_details")
            .select("view_count")
            .eq("property_id", propertyId)
            .single();
        if (fetchError) {
            console.error("Error fetching current view count:", fetchError);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch property", 500);
        }
        const { error } = await supabase
            .from("property_details")
            .update({ view_count: (currentData?.view_count || 0) + 1 })
            .eq("property_id", propertyId);
        if (error) {
            console.error("Error tracking view:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to track view", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "View tracked successfully",
        });
    }
    catch (error) {
        console.error("Error in trackView:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Check duplicate data
async function checkDuplicate(req, res) {
    try {
        const { table, field, value } = req.body;
        if (!table || !field || !value) {
            return (0, http_helpers_1.sendError)(res, "Table, field, and value are required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
            .from(table)
            .select("id")
            .eq(field, value)
            .limit(1);
        if (error) {
            console.error("Error checking duplicate:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to check duplicate", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            is_duplicate: data && data.length > 0,
            exists: data && data.length > 0,
        });
    }
    catch (error) {
        console.error("Error in checkDuplicate:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Check OTP
async function checkOTP(req, res) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return (0, http_helpers_1.sendError)(res, "Email and code are required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendSuccess)(res, {
                valid: false,
                message: "Invalid or expired OTP",
            });
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            valid: true,
            message: "OTP is valid",
        });
    }
    catch (error) {
        console.error("Error in checkOTP:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Get client IP
async function getClientIP(req, res) {
    try {
        const ip = req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket?.remoteAddress ||
            req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            'unknown';
        return (0, http_helpers_1.sendSuccess)(res, {
            ip: ip,
            headers: {
                'x-forwarded-for': req.headers['x-forwarded-for'],
                'x-real-ip': req.headers['x-real-ip'],
                'user-agent': req.headers['user-agent'],
            },
        });
    }
    catch (error) {
        console.error("Error in getClientIP:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Track view with GET request (for frontend compatibility)
async function trackViewGet(req, res) {
    try {
        const { propertyId } = req.query;
        if (!propertyId) {
            return (0, http_helpers_1.sendError)(res, "Property ID is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // ตรวจสอบว่า propertyId เป็น UUID หรือไม่
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId);
        if (!isUUID) {
            // ถ้าไม่ใช่ UUID (เช่น "new-1", "new-2") ให้ return success โดยไม่ update database
            return (0, http_helpers_1.sendSuccess)(res, {
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
            return (0, http_helpers_1.sendSuccess)(res, {
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
            return (0, http_helpers_1.sendError)(res, "Failed to update view count", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "View tracked successfully",
            propertyId: propertyId,
            viewCount: newViewCount,
        });
    }
    catch (error) {
        console.error("Error in trackViewGet:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=utils.js.map