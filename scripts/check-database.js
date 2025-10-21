import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kxkryylxfkkjgbgtxfog.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3J5eWx4ZmtramdiZ3R4Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDA1ODMsImV4cCI6MjA2MjM3NjU4M30.CDUqZSXA8IxaUBUU7tcxDXn7qyM4i6pma_3dURjvmyU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndInsertTestData() {
  console.log("🔍 Checking database tables...");

  try {
    // เช็คตาราง users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
    } else {
      console.log("✅ Users table:", users?.length || 0, "records");
      if (users && users.length > 0) {
        console.log("Sample user:", users[0]);
      }
    }

    // เช็คตาราง agens
    const { data: agents, error: agentsError } = await supabase
      .from("agens")
      .select(
        `
        user_id,
        company_name,
        license_number,
        status,
        created_at,
        users!agens_user_id_fkey(
          email,
          first_name,
          last_name,
          phone
        )
      `
      )
      .limit(5);

    if (agentsError) {
      console.error("❌ Error fetching agents:", agentsError);
    } else {
      console.log("✅ Agents table:", agents?.length || 0, "records");
      if (agents && agents.length > 0) {
        console.log("Sample agent:", agents[0]);
      }
    }

    // เช็คตาราง properties
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("*")
      .limit(5);

    if (propertiesError) {
      console.error("❌ Error fetching properties:", propertiesError);
    } else {
      console.log("✅ Properties table:", properties?.length || 0, "records");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}

checkAndInsertTestData();
