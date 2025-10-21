"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
// lib/supabaseClient.ts - Singleton pattern เพื่อป้องกัน Multiple GoTrueClient instances
const auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
// Singleton pattern เพื่อป้องกันการสร้าง client หลายตัว
let supabaseInstance = null;
exports.supabase = (() => {
    if (!supabaseInstance) {
        supabaseInstance = (0, auth_helpers_nextjs_1.createClientComponentClient)();
    }
    return supabaseInstance;
})();
//# sourceMappingURL=supabaseClient.js.map