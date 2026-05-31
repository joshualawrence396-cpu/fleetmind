const fs = require("fs");
const content = fs.readFileSync("app/dashboard/page.tsx", "utf8");
console.log("File length:", content.length);
console.log("Has DashboardPage:", content.includes("DashboardPage"));
console.log("Has activeTab:", content.includes("activeTab"));
console.log("Has GeofencingPanel:", content.includes("GeofencingPanel"));
console.log("Last 200 chars:", content.slice(-200));
console.log("First 100 chars:", content.substring(0, 100));
