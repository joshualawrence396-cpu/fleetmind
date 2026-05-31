const fs = require("fs");
const content = fs.readFileSync("app/page.tsx", "utf8");
const start = content.indexOf('"use client"');
if (start > 0) {
  fs.writeFileSync("app/page.tsx", content.substring(start), "utf8");
  console.log("Fixed! Removed " + start + " garbage chars");
} else if (start === 0) {
  console.log("File is already clean");
} else {
  console.log("ERROR: Could not find use client directive");
  console.log("First 200 chars:", content.substring(0, 200));
}
