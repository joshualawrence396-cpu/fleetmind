const fs = require("fs");
const content = fs.readFileSync("app/dashboard/page.tsx", "utf8");
const lines = content.split("\n");
console.log("Lines 148-170:");
lines.slice(147, 170).forEach((l, i) => console.log(148+i, "|", l));
