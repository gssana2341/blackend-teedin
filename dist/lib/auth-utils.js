"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserRole = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Utility function to refresh user role from database
const refreshUserRole = async (userId) => {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();
        if (userError) {
            console.warn("Could not fetch user role from database:", userError);
            return null;
        }
        console.log("✅ Refreshed user role from database:", userData.role);
        localStorage.setItem("userRole", userData.role);
        return userData.role;
    }
    catch (error) {
        console.error("Error refreshing user role:", error);
        return null;
    }
};
exports.refreshUserRole = refreshUserRole;
//# sourceMappingURL=auth-utils.js.map