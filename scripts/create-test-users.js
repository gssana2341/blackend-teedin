import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kxkryylxfkkjgbgtxfog.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3J5eWx4ZmtramdiZ3R4Zm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgwMDU4MywiZXhwIjoyMDYyMzc2NTgzfQ.6Jq5oyxsaw9wN3Z79PUazCxHefbdzkBmJpjtbLq2HAg";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUsers() {
  console.log("🔄 Creating test users...");

  try {
    // ดึง agents ที่ไม่มี users
    const { data: agents } = await supabase
      .from("agens")
      .select("user_id, company_name")
      .limit(5);

    if (!agents || agents.length === 0) {
      console.log("❌ No agents found");
      return;
    }

    // สร้าง users สำหรับแต่ละ agent
    const usersToInsert = agents.map((agent, index) => ({
      id: agent.user_id,
      email: `agent${index + 1}@tedin.com`,
      first_name: `Agent${index + 1}`,
      last_name: `Tester`,
      role: "agent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log("Users to insert:", usersToInsert);

    // ใส่ข้อมูลลง users table
    const { data: insertedUsers, error } = await supabase
      .from("users")
      .insert(usersToInsert)
      .select();

    if (error) {
      console.error("❌ Error inserting users:", error);
    } else {
      console.log(
        "✅ Successfully inserted users:",
        insertedUsers?.length || 0
      );
    }
  } catch (error) {
    console.error("❌ Database error:", error);
  }
}

createTestUsers();
