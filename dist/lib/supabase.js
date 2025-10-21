"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});
const createSupabaseClient = () => {
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
};
exports.createSupabaseClient = createSupabaseClient;
//# sourceMappingURL=supabase.js.map