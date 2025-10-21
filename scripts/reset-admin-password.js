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

async function resetAdminPassword() {
  try {
    console.log("🔑 กำลังตั้งรหัสผ่านใหม่สำหรับ Super Admin...\n");

    const adminEmail = "gassana2341@gmail.com";
    const newPassword = "SuperAdmin123!";

    console.log(`📧 อีเมล: ${adminEmail}`);
    console.log(`🔐 รหัสผ่านใหม่: ${newPassword}`);

    // อัพเดทรหัสผ่านผ่าน Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      // ต้องหา user ID ก่อน
      "",
      { password: newPassword }
    );

    // หา user ID ก่อน
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", adminEmail)
      .single();

    if (userError) {
      console.error("❌ ไม่พบผู้ใช้:", userError);
      return;
    }

    console.log(`🆔 User ID: ${userData.id}`);

    // อัพเดทรหัสผ่าน
    const { data: updateData, error: updateError } =
      await supabase.auth.admin.updateUserById(userData.id, {
        password: newPassword,
      });

    if (updateError) {
      console.error("❌ ไม่สามารถอัพเดทรหัสผ่านได้:", updateError);
      return;
    }

    console.log("🎉 อัพเดทรหัสผ่านสำเร็จ!");
    console.log("\n🚀 ตอนนี้คุณสามารถ login ได้แล้ว:");
    console.log(`   อีเมล: ${adminEmail}`);
    console.log(`   รหัสผ่าน: ${newPassword}`);
    console.log("\n📱 ขั้นตอนต่อไป:");
    console.log("1. เปิด http://localhost:3000");
    console.log("2. คลิก Login");
    console.log("3. ใส่ข้อมูลข้างบน");
    console.log("4. เข้าหน้า Dashboard แล้วไปที่ Super Admin");
  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error.message);

    // Alternative: สร้าง user ใหม่
    console.log("\n🔄 ลองสร้างผู้ใช้ Super Admin ใหม่...");

    const newAdminEmail = "superadmin@teedineasy.com";
    const adminPassword = "SuperAdmin123!";

    const { data: newUserData, error: newUserError } =
      await supabase.auth.admin.createUser({
        email: newAdminEmail,
        password: adminPassword,
        email_confirm: true,
      });

    if (newUserError) {
      console.error("❌ ไม่สามารถสร้างผู้ใช้ใหม่ได้:", newUserError);
      return;
    }

    // เพิ่มลง public.users table
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .insert([
        {
          id: newUserData.user.id,
          email: newAdminEmail,
          role: "admin",
          first_name: "Super",
          last_name: "Admin",
        },
      ]);

    if (publicUserError) {
      console.error("❌ ไม่สามารถเพิ่มลง public.users ได้:", publicUserError);
      return;
    }

    console.log("🎉 สร้างผู้ใช้ Super Admin ใหม่สำเร็จ!");
    console.log(`📧 อีเมล: ${newAdminEmail}`);
    console.log(`🔐 รหัสผ่าน: ${adminPassword}`);
  }
}

resetAdminPassword();
