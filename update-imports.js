const fs = require("fs");
const path = require("path");

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to update import paths in a file
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Update @/lib imports to relative paths
    content = content.replace(/@\/lib\//g, "../lib/");
    content = content.replace(/@\/utils\/supabase\/server/g, "../lib/supabase");
    content = content.replace(/@\/components\//g, "../../components/");
    content = content.replace(/@\/types\//g, "../types/");
    content = content.replace(/@\/contexts\//g, "../../contexts/");
    content = content.replace(/@\/hooks\//g, "../../hooks/");

    // Update Next.js specific imports that might not be needed in standalone backend
    content = content.replace(
      /import { NextRequest, NextResponse } from "next\/server";/g,
      ""
    );
    content = content.replace(
      /import { NextResponse } from "next\/server";/g,
      ""
    );
    content = content.replace(
      /import { NextRequest } from "next\/server";/g,
      ""
    );

    // Add basic response handling for standalone backend
    if (
      content.includes("NextResponse.json") &&
      !content.includes("// Response helper")
    ) {
      content = content.replace(
        /import { createSupabaseAdmin } from/g,
        "// Response helper\nconst json = (data, status = 200) => ({ status, data });\nimport { createSupabaseAdmin } from"
      );
    }

    if (content !== fs.readFileSync(filePath, "utf8")) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
      modified = true;
    }

    return modified;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const backendDir = __dirname;
const tsFiles = findTsFiles(backendDir);

console.log(
  `Found ${tsFiles.length} TypeScript/JavaScript files to process...`
);

let updatedCount = 0;
tsFiles.forEach(file => {
  if (updateImports(file)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files successfully.`);
console.log("Import path updates completed!");
