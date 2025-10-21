"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.createTestNotifications = createTestNotifications;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Get notifications
async function getNotifications(req, res) {
    try {
        const { user_id, type, status, limit = '10' } = req.query;
        const limitNum = parseInt(limit);
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        let query = supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limitNum);
        if (user_id) {
            query = query.eq("user_id", user_id);
        }
        if (type) {
            query = query.eq("type", type);
        }
        if (status) {
            query = query.eq("status", status);
        }
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching notifications:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch notifications", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, data || []);
    }
    catch (error) {
        console.error("Error in getNotifications:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Mark notification as read
async function markNotificationAsRead(req, res) {
    try {
        const { notification_id, user_id } = req.body;
        if (!notification_id || !user_id) {
            return (0, http_helpers_1.sendError)(res, "Notification ID and User ID are required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
            .from("notifications")
            .update({
            status: "read",
            read_at: new Date().toISOString(),
        })
            .eq("id", notification_id)
            .eq("user_id", user_id)
            .select()
            .single();
        if (error) {
            console.error("Error marking notification as read:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to mark notification as read", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, data);
    }
    catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Create test notifications
async function createTestNotifications(req, res) {
    try {
        const { user_id, count = 5 } = req.body;
        if (!user_id) {
            return (0, http_helpers_1.sendError)(res, "User ID is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const testNotifications = [];
        for (let i = 1; i <= count; i++) {
            testNotifications.push({
                user_id,
                type: "test",
                title: `Test Notification ${i}`,
                message: `This is a test notification number ${i}`,
                status: "unread",
            });
        }
        const { data, error } = await supabase
            .from("notifications")
            .insert(testNotifications)
            .select();
        if (error) {
            console.error("Error creating test notifications:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to create test notifications", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: `Created ${count} test notifications`,
            notifications: data,
        });
    }
    catch (error) {
        console.error("Error in createTestNotifications:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=notifications.js.map