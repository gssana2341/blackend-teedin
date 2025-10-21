/**
 * Simple Super Admin Setup Script
 * ใช้สำหรับแสดงคำสั่ง SQL ที่ต้องรันเพื่อสร้าง Super Admin
 */

const userEmail = process.argv[2];

if (!userEmail) {
  console.log("📝 Usage: pnpm setup-super-admin <user-email>");
  console.log("📧 Example: pnpm setup-super-admin admin@example.com");
  console.log("");
  console.log("⚠️  Make sure the user account already exists in the system!");
  console.log("");
  process.exit(1);
}

console.log("🔐 Super Admin Setup Instructions");
console.log("================================");
console.log("");
console.log(`👤 Setting up super admin for: ${userEmail}`);
console.log("");
console.log("📝 Please run these SQL commands in Supabase Dashboard:");
console.log("");
console.log("-- Step 1: Update user role");
console.log(`UPDATE public.users `);
console.log(`SET role = 'super_admin', updated_at = NOW() `);
console.log(`WHERE email = '${userEmail}';`);
console.log("");
console.log("-- Step 2: Check if user exists");
console.log(
  `SELECT id, email, role FROM public.users WHERE email = '${userEmail}';`
);
console.log("");
console.log("-- Step 3: Assign super_admin role (if RBAC tables exist)");
console.log(
  `INSERT INTO public.user_roles (user_id, role_id, assigned_by, is_active)`
);
console.log(`SELECT u.id, ar.id, u.id, true`);
console.log(`FROM public.users u, public.admin_roles ar`);
console.log(`WHERE u.email = '${userEmail}' AND ar.name = 'super_admin'`);
console.log(`ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true;`);
console.log("");
console.log("-- Step 4: Verify permissions (optional)");
console.log(
  `SELECT upv.user_id, upv.email, upv.role_name, COUNT(upv.permission_name) as total_permissions`
);
console.log(`FROM user_permissions_view upv`);
console.log(`WHERE upv.email = '${userEmail}'`);
console.log(`GROUP BY upv.user_id, upv.email, upv.role_name;`);
console.log("");
console.log("✅ After running these commands:");
console.log("1. Start the development server: pnpm dev");
console.log("2. Navigate to: http://localhost:3000/super-admin-page");
console.log("3. Login with the super admin account");
console.log("");
console.log("🔗 Supabase SQL Editor:");
console.log(
  "   https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/editor"
);
console.log("");
