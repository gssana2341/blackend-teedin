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

async function checkExistingUsers() {
  try {
    console.log("🔍 กำลังตรวจสอบผู้ใช้ที่มีอยู่ในระบบ...\n");

    // ดู users ทั้งหมด
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ ข้อผิดพลาด:", error);
      return;
    }

    console.log(`📊 พบผู้ใช้ในระบบทั้งหมด: ${users.length} คน\n`);

    if (users.length > 0) {
      console.log("👥 รายชื่อผู้ใช้:");
      console.log("=====================================");
      users.forEach((user, index) => {
        console.log(`${index + 1}. อีเมล: ${user.email}`);
        console.log(`   บทบาท: ${user.role}`);
        console.log(
          `   สร้างเมื่อ: ${new Date(user.created_at).toLocaleString("th-TH")}\n`
        );
      });

      // ตรวจสอบว่ามี Super Admin แล้วหรือยัง
      const superAdmins = users.filter(user => user.role === "super_admin");
      if (superAdmins.length > 0) {
        console.log("🎉 มี Super Admin ในระบบแล้ว:");
        superAdmins.forEach(admin => {
          console.log(`   - ${admin.email}`);
        });
      } else {
        console.log("⚠️  ยังไม่มี Super Admin ในระบบ");
        console.log(
          "💡 แนะนำ: ให้เปลี่ยน role ของผู้ใช้คนใดคนหนึ่งเป็น super_admin"
        );

        if (users.length > 0) {
          console.log("\n🔧 คำสั่งที่แนะนำ:");
          console.log(
            `   UPDATE users SET role = 'super_admin' WHERE email = '${users[0].email}';`
          );
        }
      }
    } else {
      console.log("📭 ยังไม่มีผู้ใช้ในระบบ");
      console.log(
        "💡 แนะนำ: สมัครสมาชิกผ่านหน้าเว็บก่อน แล้วค่อยเปลี่ยนเป็น super_admin"
      );
    }
  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error.message);
  }
}

checkExistingUsers();
