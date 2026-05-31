const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Fix 1: inp is not defined in DashboardPage main function
// The inp variable is defined in panels but used in main DashboardPage modal form
// Add inp definition inside DashboardPage
const inpDef = `  const inp: any = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, marginBottom: 12, fontFamily: "system-ui" }`;

// Find where to insert it - after the state declarations in DashboardPage
const insertAfter = `  const user = session?.user as any`;
content = content.replace(insertAfter, insertAfter + "\n" + inpDef);

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("inp fix applied!");
console.log("File length:", content.length);
