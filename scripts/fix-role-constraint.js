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

async function fixRoleConstraint() {
  try {
    console.log("🔧 กำลังแก้ไข Database Schema...\n");

    // ตรวจสอบ constraint ปัจจุบัน
    console.log("1. ตรวจสอบ role constraint ปัจจุบัน...");

    const { data: constraintInfo, error: constraintError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, character_maximum_length")
      .eq("table_name", "users")
      .eq("column_name", "role");

    if (!constraintError && constraintInfo) {
      console.log("📊 ข้อมูล role column:", constraintInfo);
    }

    console.log("\n2. กำลังรัน SQL เพื่อแก้ไข...");

    // รัน SQL เพื่อขยาย role column และอัพเดท constraint
    const sqlCommands = [
      // ลบ constraint เก่า
      `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`,

      // ขยายขนาด column
      `ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20);`,

      // เพิ่ม constraint ใหม่
      `ALTER TABLE users ADD CONSTRAINT users_role_check 
       CHECK (role IN ('customer', 'agent', 'admin', 'super_admin'));`,
    ];

    for (let i = 0; i < sqlCommands.length; i++) {
      const sql = sqlCommands[i];
      console.log(`   รันคำสั่งที่ ${i + 1}...`);

      try {
        // ใช้ RPC เพื่อรัน SQL
        const { data, error } = await supabase.rpc("exec_sql", { sql });
        if (error) {
          console.log(
            `   ⚠️  คำสั่งที่ ${i + 1} อาจใช้ไม่ได้ผ่าน RPC:`,
            error.message
          );
        } else {
          console.log(`   ✅ คำสั่งที่ ${i + 1} สำเร็จ`);
        }
      } catch (err) {
        console.log(
          `   ⚠️  คำสั่งที่ ${i + 1} ต้องรันใน SQL Editor:`,
          err.message
        );
      }
    }

    console.log(
      "\n📝 สำหรับความแน่ใจ กรุณารันคำสั่ง SQL นี้ใน Supabase SQL Editor:"
    );
    console.log("=".repeat(60));
    sqlCommands.forEach((sql, index) => {
      console.log(`-- คำสั่งที่ ${index + 1}`);
      console.log(sql);
      console.log("");
    });
    console.log("=".repeat(60));

    console.log(
      "\n🔗 Supabase SQL Editor: https://app.supabase.com/project/kxkryylxfkkjgbgtxfog/sql"
    );
  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error.message);
  }
}

fixRoleConstraint();
