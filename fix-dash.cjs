const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "latin1");

// Find where corruption starts
const corruptIdx = content.indexOf("}.Groups[1].Value");
if (corruptIdx > 0) {
  // Cut everything from corruption point back to find the real end
  content = content.substring(0, corruptIdx);
  // Find the last valid closing of the file
  const lastExport = content.lastIndexOf("export default function DashboardPage");
  console.log("Corruption found at:", corruptIdx);
  console.log("Last export at:", lastExport);
}

// Find "use client" - start of real file
const start = content.indexOf('"use client"');
if (start < 0) {
  console.log("ERROR: Could not find use client");
  console.log("First 300 chars:", content.substring(0, 300));
  process.exit(1);
}

// Clean content from start
content = content.substring(start);

// Now find where it got corrupted and trim
const corrupt = content.indexOf("}.Groups[1].Value");
if (corrupt > 0) {
  content = content.substring(0, corrupt);
  console.log("Trimmed corruption at position:", corrupt);
}

// Make sure file ends properly - find last closing brace
// Add proper closing if needed
if (!content.trim().endsWith("}")) {
  content = content.trimEnd() + "\n}\n";
}

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("File cleaned! Length:", content.length);
console.log("Last 100 chars:", content.slice(-100));
