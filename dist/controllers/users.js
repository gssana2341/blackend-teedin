"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.updateUserRole = updateUserRole;
exports.checkUserExists = checkUserExists;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Get user by ID
async function getUserById(req, res) {
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
        console.error("Error in getUserById:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Update user role
async function updateUserRole(req, res) {
    try {
        const { user_id, new_role } = req.body;
        if (!user_id || !new_role) {
            return (0, http_helpers_1.sendError)(res, "User ID and new role are required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
            .from("users")
            .update({ role: new_role })
            .eq("id", user_id)
            .select()
            .single();
        if (error) {
            console.error("Error updating user role:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to update user role", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, data);
    }
    catch (error) {
        console.error("Error in updateUserRole:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Check if user exists
async function checkUserExists(req, res) {
    try {
        const { email, phone } = req.body;
        if (!email && !phone) {
            return (0, http_helpers_1.sendError)(res, "Email or phone is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
            return (0, http_helpers_1.sendError)(res, "Failed to check user existence", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            exists: data && data.length > 0,
            users: data || [],
        });
    }
    catch (error) {
        console.error("Error in checkUserExists:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=users.js.map