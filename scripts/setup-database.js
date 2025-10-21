const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read environment variables from .env.local manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach(line => {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    });

    return envVars;
  } catch (error) {
    console.log("⚠️  Could not read .env.local file");
    return {};
  }
}

const envVars = loadEnvFile();
const supabaseUrl =
  envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log(
    "Please make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPropertiesTables() {
  try {
    console.log("🚀 Creating properties tables and admin logs...");

    // อ่านไฟล์ SQL
    const sqlPath = path.join(
      __dirname,
      "..",
      "sql",
      "create-properties-tables.sql"
    );
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // แบ่ง SQL statements
    const statements = sqlContent
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // รัน SQL statements ทีละอัน
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ";";
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql: statement,
        });

        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }

    // ตรวจสอบว่า tables ถูกสร้างแล้วหรือไม่
    console.log("\n🔍 Checking created tables...");

    const { data: properties, error: propError } = await supabase
      .from("properties")
      .select("count(*)")
      .limit(1);

    if (propError) {
      console.error("❌ Properties table check failed:", propError.message);
    } else {
      console.log("✅ Properties table is accessible");
    }

    const { data: logs, error: logError } = await supabase
      .from("admin_logs")
      .select("count(*)")
      .limit(1);

    if (logError) {
      console.error("❌ Admin logs table check failed:", logError.message);
    } else {
      console.log("✅ Admin logs table is accessible");
    }

    console.log("\n🎉 Database setup completed!");
    console.log("You can now use the Super Admin system with real data.");
  } catch (error) {
    console.error("❌ Failed to create tables:", error);
    process.exit(1);
  }
}

// Alternative method: Execute SQL directly using edge functions or manual approach
async function createTablesManually() {
  try {
    console.log("🚀 Creating tables manually...");

    // Create properties table
    const createPropertiesSQL = `
      CREATE TABLE IF NOT EXISTS properties (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price BIGINT NOT NULL,
        location TEXT,
        property_type TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'inactive')),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const createAdminLogsSQL = `
      CREATE TABLE IF NOT EXISTS admin_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        target_type TEXT,
        target_id UUID,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log("Manual table creation requires direct database access.");
    console.log("Please run the following SQL in your Supabase SQL editor:");
    console.log("\n" + "=".repeat(50));
    console.log(createPropertiesSQL);
    console.log(createAdminLogsSQL);
    console.log("=".repeat(50));

    // Try to test if tables exist by querying them
    console.log("\n🔍 Testing table access...");

    try {
      const { error: propError } = await supabase
        .from("properties")
        .select("id")
        .limit(1);

      if (!propError) {
        console.log("✅ Properties table already exists and is accessible");
      }
    } catch (err) {
      console.log("⚠️  Properties table may need to be created");
    }

    try {
      const { error: logError } = await supabase
        .from("admin_logs")
        .select("id")
        .limit(1);

      if (!logError) {
        console.log("✅ Admin logs table already exists and is accessible");
      }
    } catch (err) {
      console.log("⚠️  Admin logs table may need to be created");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the setup
if (require.main === module) {
  console.log("🔧 Setting up database for Super Admin system...");
  createTablesManually();
}

module.exports = { createPropertiesTables, createTablesManually };
