import { createClient } from "@supabase/supabase-js";

// Singleton pattern เพื่อป้องกัน Multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// ใช้ environment variables แทน hard-coded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        // Storage แบบไดนามิก: สลับระหว่าง sessionStorage/localStorage ตาม rememberMe
        storage:
          typeof window === "undefined"
            ? undefined
            : {
                getItem: (key: string) => {
                  const remember = localStorage.getItem("rememberMe") === "true";
                  return (remember ? localStorage : sessionStorage).getItem(key);
                },
                setItem: (key: string, value: string) => {
                  const remember = localStorage.getItem("rememberMe") === "true";
                  const target = remember ? localStorage : sessionStorage;
                  // ป้องกันค้างคนละที่: ลบจากอีกฝั่งก่อน
                  (remember ? sessionStorage : localStorage).removeItem(key);
                  target.setItem(key, value);
                },
                removeItem: (key: string) => {
                  try {
                    sessionStorage.removeItem(key);
                  } catch {}
                  try {
                    localStorage.removeItem(key);
                  } catch {}
                },
              },
      },
    });
  }
  return supabaseInstance;
})();
