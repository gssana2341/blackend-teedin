"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTwilioOTP = sendTwilioOTP;
exports.verifyTwilioOTP = verifyTwilioOTP;
const twilio_1 = __importDefault(require("twilio"));
// สร้าง Twilio client
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// ส่ง OTP ผ่าน Twilio Verify Service
async function sendTwilioOTP(phone) {
    try {
        console.log("📱 ส่ง OTP ผ่าน Twilio ไปยัง:", phone);
        // ตรวจสอบว่า environment variables ถูกต้องหรือไม่
        if (!process.env.TWILIO_ACCOUNT_SID ||
            !process.env.TWILIO_AUTH_TOKEN ||
            (!process.env.TWILIO_VERIFY_SID && !process.env.TWILIO_VERIFY_SERVICE_SID)) {
            console.warn("⚠️ Twilio environment variables not configured, using mock response");
            // Mock response สำหรับ development
            return {
                success: true,
                verificationSid: `mock_verification_${Date.now()}`,
            };
        }
        // Normalize phone number to E.164 format
        const normalizePhone = (p) => {
            const digits = p.replace(/[^0-9+]/g, "");
            if (digits.startsWith("+"))
                return digits;
            if (digits.startsWith("66"))
                return "+" + digits;
            if (digits.startsWith("0"))
                return "+66" + digits.slice(1);
            return "+" + digits;
        };
        const e164Phone = normalizePhone(phone);
        console.log("📞 Normalized phone:", e164Phone);
        const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID || process.env.TWILIO_VERIFY_SID)
            .verifications.create({
            to: e164Phone,
            channel: "sms",
        });
        console.log("✅ OTP ส่งสำเร็จ:", {
            sid: verification.sid,
            status: verification.status,
            to: e164Phone,
        });
        return {
            success: true,
            verificationSid: verification.sid,
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("❌ Twilio OTP Error:", message);
        // ถ้าเป็น development environment และมี credentials ให้ใช้ mock response
        if (process.env.NODE_ENV === "development" &&
            (process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_AUTH_TOKEN)) {
            console.warn("⚠️ Using mock response for development");
            return {
                success: true,
                verificationSid: `mock_verification_${Date.now()}`,
            };
        }
        return {
            success: false,
            error: message || "ไม่สามารถส่ง OTP ได้",
        };
    }
}
// ยืนยัน OTP ผ่าน Twilio Verify Service
async function verifyTwilioOTP(phone, code) {
    try {
        console.log("🔐 ยืนยัน OTP:", { phone, code });
        // Normalize phone number
        const normalizePhone = (p) => {
            const digits = p.replace(/[^0-9+]/g, "");
            if (digits.startsWith("+"))
                return digits;
            if (digits.startsWith("66"))
                return "+" + digits;
            if (digits.startsWith("0"))
                return "+66" + digits.slice(1);
            return "+" + digits;
        };
        const e164Phone = normalizePhone(phone);
        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID || process.env.TWILIO_VERIFY_SID)
            .verificationChecks.create({
            to: e164Phone,
            code: code,
        });
        console.log("🔐 ผลการยืนยัน:", {
            status: verificationCheck.status,
            valid: verificationCheck.valid,
            to: e164Phone,
        });
        if (verificationCheck.status === "approved") {
            return {
                success: true,
                status: verificationCheck.status,
            };
        }
        else {
            return {
                success: false,
                error: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ",
                status: verificationCheck.status,
            };
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("❌ Twilio Verify Error:", message);
        return {
            success: false,
            error: message || "ไม่สามารถยืนยัน OTP ได้",
        };
    }
}
//# sourceMappingURL=twilio-sms.js.map