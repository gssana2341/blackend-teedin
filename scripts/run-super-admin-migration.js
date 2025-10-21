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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Found" : "Missing");
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "Found" : "Missing"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    console.log("Starting Super Admin migration...");
    console.log(
      "Note: Some commands may need to be run manually in Supabase SQL Editor"
    );

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Database connection test failed:", testError);
      return;
    }

    console.log("✓ Database connection successful");

    // First, let's check what tables already exist
    console.log("\nChecking existing database structure...");

    // Check if system_announcements table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "system_announcements",
        "system_settings",
        "admin_logs",
        "system_stats",
      ]);

    if (!tableError) {
      console.log(
        "Existing related tables:",
        tableCheck?.map(t => t.table_name) || []
      );
    }

    // Check if super_admin role exists in users table constraint
    console.log(
      "\nFor the full migration, please run the SQL file manually in Supabase SQL Editor:"
    );
    console.log("📁 File: database/super-admin-setup.sql");
    console.log(
      "🔗 Supabase Dashboard: https://app.supabase.com/project/kxkryylxfkkjgbgtxfog/sql"
    );

    console.log("\nThe migration includes:");
    console.log("- Adding super_admin role to users table");
    console.log("- Creating system_announcements table");
    console.log("- Creating system_settings table");
    console.log("- Creating admin_logs table");
    console.log("- Creating system_stats table");
    console.log("- Adding approval fields to properties and agens tables");
    console.log("- Creating necessary indexes and functions");
    console.log("- Inserting default system settings");
  } catch (error) {
    console.error("Migration check failed:", error);
  }
}

runMigration();
