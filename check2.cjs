const fs = require("fs");
const c = fs.readFileSync("app/page.tsx", "utf8");
// Find the truck icon in stat cards
const idx = c.indexOf("icon:\"");
const snippet = c.substring(idx, idx + 200);
console.log("Icon area:", JSON.stringify(snippet));
