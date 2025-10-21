"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Admin client for server-side operations that require elevated privileges
const createSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase URL or Service Role Key");
    }
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
exports.createSupabaseAdmin = createSupabaseAdmin;
//# sourceMappingURL=supabase-admin.js.map