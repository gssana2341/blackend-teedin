// Test script for Super Admin API endpoints
async function testAPI() {
  const baseUrl = "http://localhost:3000";

  console.log("Testing Super Admin API endpoints...\n");

  const endpoints = [
    "/api/admin/dashboard",
    "/api/admin/users",
    "/api/admin/agents",
    "/api/admin/announcements",
    "/api/admin/settings",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      const status = response.status;
      const statusText = response.statusText;

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ ${endpoint}: ${status} ${statusText}`);
        console.log(`  Response keys: ${Object.keys(data).join(", ")}\n`);
      } else {
        console.log(`✗ ${endpoint}: ${status} ${statusText}\n`);
      }
    } catch (error) {
      console.log(`✗ ${endpoint}: ${error.message}\n`);
    }
  }
}

testAPI().catch(console.error);
