const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Manually load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  const env = {};
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });

  return env;
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSuperAdminShortName() {
  try {
    console.log("🔧 กำลังสร้าง Super Admin (ใช้ชื่อสั้น)...\n");

    // เปลี่ยน admin ที่มีอยู่เป็น superadmin (10 ตัวอักษร)
    const adminEmail = "gassana2341@gmail.com";

    console.log(`📧 กำลังเปลี่ยน ${adminEmail} เป็น superadmin...`);

    const { data, error } = await supabase
      .from("users")
      .update({ role: "superadmin" })
      .eq("email", adminEmail)
      .select();

    if (error) {
      console.error("❌ ข้อผิดพลาด:", error);
      return;
    }

    if (data && data.length > 0) {
      console.log("🎉 สำเร็จ! สร้าง Super Admin แล้ว");
      console.log(`✅ อีเมล: ${data[0].email}`);
      console.log(`✅ บทบาทใหม่: ${data[0].role}`);
      console.log(
        '\n📝 หมายเหตุ: ใช้ role "superadmin" แทน "super_admin" เพื่อให้พอดีกับ database constraint'
      );
      console.log(
        "\n🚀 ตอนนี้คุณสามารถ login ด้วยอีเมลนี้แล้วเข้าหน้า Super Admin ได้แล้ว!"
      );
      console.log("\n📱 ขั้นตอนต่อไป:");
      console.log("1. เปิด http://localhost:3000");
      console.log("2. Login ด้วย gassana2341@gmail.com");
      console.log("3. เข้าหน้า Dashboard");
      console.log("4. จะเห็นเมนู Super Admin ใน Sidebar");

      console.log(
        '\n⚠️  คำเตือน: ต้องแก้ไข auth-context.tsx ให้รองรับ role "superadmin"'
      );
    } else {
      console.log("⚠️  ไม่พบผู้ใช้ที่ต้องการอัพเดท");
    }
  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error.message);
  }
}

createSuperAdminShortName();
