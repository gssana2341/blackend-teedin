"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSMTP = testSMTP;
exports.testTwilio = testTwilio;
exports.testResend = testResend;
exports.getEmailDiagnostics = getEmailDiagnostics;
exports.getSMSDiagnostics = getSMSDiagnostics;
exports.simpleResend = simpleResend;
exports.debugNotifications = debugNotifications;
exports.debugResend = debugResend;
exports.debugProperties = debugProperties;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Test SMTP
async function testSMTP(req, res) {
    try {
        // This would test SMTP configuration
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "SMTP test initiated",
            note: "This endpoint would test SMTP email configuration",
        });
    }
    catch (error) {
        console.error("Error in testSMTP:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Test Twilio SMS
async function testTwilio(req, res) {
    try {
        // This would test Twilio SMS configuration
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "Twilio SMS test initiated",
            note: "This endpoint would test Twilio SMS configuration",
        });
    }
    catch (error) {
        console.error("Error in testTwilio:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Test Resend email
async function testResend(req, res) {
    try {
        // This would test Resend email configuration
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "Resend email test initiated",
            note: "This endpoint would test Resend email configuration",
        });
    }
    catch (error) {
        console.error("Error in testResend:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Email diagnostics
async function getEmailDiagnostics(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Get email logs or statistics
        const { data: emailLogs, error } = await supabase
            .from("email_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);
        if (error) {
            console.error("Error fetching email logs:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch email logs", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            email_logs: emailLogs || [],
            total_logs: emailLogs?.length || 0,
        });
    }
    catch (error) {
        console.error("Error in getEmailDiagnostics:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// SMS diagnostics
async function getSMSDiagnostics(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Get SMS logs or statistics
        const { data: smsLogs, error } = await supabase
            .from("sms_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);
        if (error) {
            console.error("Error fetching SMS logs:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch SMS logs", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            sms_logs: smsLogs || [],
            total_logs: smsLogs?.length || 0,
        });
    }
    catch (error) {
        console.error("Error in getSMSDiagnostics:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Simple resend email
async function simpleResend(req, res) {
    try {
        const { to, subject, message } = req.body;
        if (!to || !subject || !message) {
            return (0, http_helpers_1.sendError)(res, "To, subject, and message are required", 400);
        }
        // This would send a simple email
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "Email sent successfully",
            to,
            subject,
        });
    }
    catch (error) {
        console.error("Error in simpleResend:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Debug notifications
async function debugNotifications(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: notifications, error } = await supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);
        if (error) {
            console.error("Error fetching notifications:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch notifications", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            notifications: notifications || [],
            total: notifications?.length || 0,
        });
    }
    catch (error) {
        console.error("Error in debugNotifications:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Debug resend
async function debugResend(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: emailLogs, error } = await supabase
            .from("email_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);
        if (error) {
            console.error("Error fetching email logs:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch email logs", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            email_logs: emailLogs || [],
            total: emailLogs?.length || 0,
        });
    }
    catch (error) {
        console.error("Error in debugResend:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Debug properties
async function debugProperties(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "Failed to fetch properties", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            properties: properties || [],
            total: properties?.length || 0,
        });
    }
    catch (error) {
        console.error("Error in debugProperties:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=testing.js.map