const fs = require("fs");
let c = fs.readFileSync("app/page.tsx", "utf8");

// Replace all emoji strings with text labels or icon names
// Navigation icons - replace emoji + label with just label (icons handled by lucide)
const navFixes = [
  // Stat card icons
  [/icon:"[^"]*",grad:"linear-gradient\(135deg,#6366f1,#8b5cf6\)"/g, 'icon:"truck",grad:"linear-gradient(135deg,#6366f1,#8b5cf6)"'],
  [/icon:"[^"]*",grad:"linear-gradient\(135deg,#10b981,#059669\)"/g, 'icon:"users",grad:"linear-gradient(135deg,#10b981,#059669)"'],
  [/icon:"[^"]*",grad:"linear-gradient\(135deg,#f59e0b,#d97706\)"/g, 'icon:"package",grad:"linear-gradient(135deg,#f59e0b,#d97706)"'],
  [/icon:"[^"]*",grad:"linear-gradient\(135deg,#ec4899,#db2777\)"/g, 'icon:"checkCircle",grad:"linear-gradient(135deg,#ec4899,#db2777)"'],
];

navFixes.forEach(([p,r]) => { c = c.replace(p, r); });
fs.writeFileSync("app/page.tsx", c, "utf8");
console.log("done");
