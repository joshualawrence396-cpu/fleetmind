const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Remove the old placeholder catch-all if still present
const placeholderStart = content.indexOf(`This module is active. APIs are running`);
if (placeholderStart > -1) {
  // Find the opening of this div block
  const openDiv = content.lastIndexOf("{[\"", placeholderStart);
  const closeDiv = content.indexOf("</div>\n          )}", placeholderStart);
  if (openDiv > -1 && closeDiv > -1) {
    const removed = content.substring(openDiv, closeDiv + 20);
    content = content.replace(removed, "");
    console.log("Removed placeholder block:", removed.length, "chars");
    fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
  } else {
    console.log("Could not find exact boundaries, trying alternative...");
    // Try to find and remove the entire problematic section
    content = content.replace(/\{?\["warehouses"[^}]+\.includes\(activeTab\)[^}]+\}[^}]+This module is active[^}]+\}[^}]+\}/gs, "");
    fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
    console.log("Used alternative removal");
  }
} else {
  console.log("No placeholder found - checking tab routing...");
  // Check if tabs are wired
  ["warehouses","inventory","analytics","fuel","maintenance","invoices","hubs","telematics","courier-federation","ai-agents","notifications","api-docs","testing","monitoring","team-chat","pod","cost-analysis","route-optimizer"].forEach(tab => {
    const panelName = tab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Panel";
    const hasRouting = content.includes(`activeTab === "${tab}" && <${panelName}`);
    if (!hasRouting) console.log(`MISSING TAB ROUTING: ${tab} -> ${panelName}`);
  });
}
