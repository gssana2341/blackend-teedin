/**
 * Super Admin Setup Script
 * ใช้สำหรับมอบหมายสิทธิ์ super_admin แก่ user
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// โหลด environment variables
config({ path: resolve(".env.local") });

// สร้าง Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration");
  console.error(
    "   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
  console.error(
    `   Current SUPABASE_URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}`
  );
  console.error(
    `   Current SUPABASE_KEY: ${supabaseKey ? "✅ Set" : "❌ Missing"}`
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSuperAdmin(userEmail) {
  console.log(`🔐 Setting up Super Admin for: ${userEmail}`);

  try {
    // 1. ค้นหา user จาก email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", userEmail)
      .single();

    if (userError || !user) {
      console.error("❌ User not found:", userEmail);
      return false;
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    // 2. อัปเดต role ในตาราง users
    const { error: updateError } = await supabase
      .from("users")
      .update({
        role: "super_admin",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ Failed to update user role:", updateError);
      return false;
    }

    console.log("✅ Updated user role to super_admin");

    // 3. ค้นหา super_admin role ID
    const { data: superAdminRole, error: roleError } = await supabase
      .from("admin_roles")
      .select("id, name")
      .eq("name", "super_admin")
      .single();

    if (roleError || !superAdminRole) {
      console.log("⚠️  Super admin role not found in database");
      console.log("   Make sure to run the database schema first!");
      return true; // Role updated successfully, but RBAC not set up
    }

    console.log(`✅ Found super_admin role: ${superAdminRole.id}`);

    // 4. เพิ่ม user role mapping
    const { error: roleAssignError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role_id: superAdminRole.id,
        assigned_by: user.id, // Self-assigned
        is_active: true,
      });

    if (roleAssignError) {
      console.error("❌ Failed to assign role:", roleAssignError);
      return false;
    }

    console.log("✅ Assigned super_admin role successfully");

    // 5. ตรวจสอบการให้สิทธิ์
    const { data: permissions, error: permError } = await supabase
      .from("user_permissions_view")
      .select("permission_name")
      .eq("user_id", user.id);

    if (permError) {
      console.warn("⚠️  Could not verify permissions:", permError);
    } else {
      console.log(`✅ User has ${permissions?.length || 0} permissions`);
    }

    console.log("");
    console.log("🎉 Super Admin setup completed successfully!");
    console.log(`👤 User: ${userEmail}`);
    console.log(`🆔 User ID: ${user.id}`);
    console.log(`🔑 Role: super_admin`);
    console.log(`📅 Updated: ${new Date().toLocaleString()}`);
    console.log("");
    console.log("🚀 Next steps:");
    console.log("1. Start the development server: pnpm dev");
    console.log("2. Navigate to: http://localhost:3000/super-admin-page");
    console.log("3. Login with the super admin account");
    console.log("");

    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
}

// Command line usage
const userEmail = process.argv[2];

if (!userEmail) {
  console.log("📝 Usage: node setup-super-admin.js <user-email>");
  console.log("📧 Example: node setup-super-admin.js admin@example.com");
  console.log("");
  console.log("⚠️  Make sure the user account already exists in the system!");
  process.exit(1);
}

setupSuperAdmin(userEmail)
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
