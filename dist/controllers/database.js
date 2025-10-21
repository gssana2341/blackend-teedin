"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
exports.createTables = createTables;
exports.createOTPTables = createOTPTables;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Test database connection
async function testConnection(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Test connection by querying a simple table
        const { data, error } = await supabase
            .from("users")
            .select("count")
            .limit(1);
        if (error) {
            console.error("Database connection error:", error);
            return (0, http_helpers_1.sendError)(res, "Database connection failed: " + error.message, 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            status: "connected",
            message: "Database connection successful",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Error in testConnection:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Create tables
async function createTables(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // This would typically run SQL scripts to create tables
        // For now, we'll just return a success message
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "Tables creation initiated",
            note: "This endpoint would typically run database migration scripts",
        });
    }
    catch (error) {
        console.error("Error in createTables:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Create OTP tables
async function createOTPTables(req, res) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Check if OTP tables exist
        const { data: tables, error } = await supabase
            .from("otp_codes")
            .select("count")
            .limit(1);
        if (error && error.code === 'PGRST116') {
            // Table doesn't exist, would need to create it
            return (0, http_helpers_1.sendSuccess)(res, {
                message: "OTP tables need to be created",
                note: "This endpoint would typically create OTP-related tables",
            });
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            message: "OTP tables already exist",
            status: "ready",
        });
    }
    catch (error) {
        console.error("Error in createOTPTables:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=database.js.map