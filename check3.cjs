const fs = require("fs");
const content = fs.readFileSync("app/dashboard/page.tsx", "utf8");
const lines = content.split("\n");
console.log("Total lines:", lines.length);
console.log("Lines 150-160:");
lines.slice(149, 160).forEach((l, i) => console.log(149+i+1, "|", l));
