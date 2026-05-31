const fs = require("fs");
const content = fs.readFileSync("app/dashboard/page.tsx", "utf8");
console.log("File length:", content.length);
console.log("Has WarehousesPanel:", content.includes("WarehousesPanel"));
console.log("Has AIAgentsPanel:", content.includes("AIAgentsPanel"));
console.log("Has export default:", content.includes("export default function DashboardPage"));
console.log("Last 200 chars:", content.slice(-200));
