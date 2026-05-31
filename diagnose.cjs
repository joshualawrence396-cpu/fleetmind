const fs = require("fs");
const content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Find all placeholder patterns
const placeholderPattern = /This module is active/g;
const matches = [];
let match;
while ((match = placeholderPattern.exec(content)) !== null) {
  matches.push({ index: match.index, context: content.substring(match.index - 100, match.index + 100) });
}
console.log("Placeholder count:", matches.length);
if (matches.length > 0) {
  console.log("First occurrence context:", matches[0].context);
}

// Check which tabs are routing correctly
const tabChecks = ["warehouses", "inventory", "analytics", "fuel", "maintenance"];
tabChecks.forEach(tab => {
  const hasPanel = content.includes(`activeTab === "${tab}" && <`);
  const hasPanelFn = content.includes(`function ${tab.charAt(0).toUpperCase() + tab.slice(1)}Panel`);
  const hasPlaceholder = content.includes(`activeTab === "${tab}"`) && content.includes("This module is active");
  console.log(`${tab}: routing=${hasPanel}, panel_fn=${hasPanelFn}`);
});

console.log("\nTotal file length:", content.length);
console.log("Has WarehousesPanel fn:", content.includes("function WarehousesPanel"));
console.log("Has InventoryPanel fn:", content.includes("function InventoryPanel"));
console.log("Has AnalyticsPanel fn:", content.includes("function AnalyticsPanel"));
