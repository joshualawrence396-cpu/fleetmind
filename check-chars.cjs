const fs = require("fs");
const c = fs.readFileSync("app/page.tsx", "utf8");
// Find the truck emoji area
const idx = c.indexOf("Total Vehicles");
const snippet = c.substring(idx - 50, idx + 20);
console.log("Snippet:", JSON.stringify(snippet));
// Show char codes
for (let i = 0; i < snippet.length; i++) {
  if (snippet.charCodeAt(i) > 127) {
    console.log("Char", i, "=", snippet.charCodeAt(i), snippet[i]);
  }
}
