const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// The tabs that need to show real panels
const tabMappings = [
  ["warehouses", "WarehousesPanel"],
  ["inventory", "InventoryPanel"],
  ["barcode", "BarcodePanel"],
  ["fuel", "FuelPanel"],
  ["maintenance", "MaintenancePanel"],
  ["invoices", "InvoicesPanel"],
  ["cost-analysis", "CostAnalysisPanel"],
  ["hubs", "HubsPanel"],
  ["route-optimizer", "RouteOptimizerPanel"],
  ["telematics", "TelematicsPanel"],
  ["courier-federation", "CourierPanel"],
  ["ai-agents", "AIAgentsPanel"],
  ["notifications", "NotificationsPanel"],
  ["api-docs", "APIDocsPanel"],
  ["testing", "TestingPanel"],
  ["monitoring", "MonitoringPanel"],
  ["team-chat", "TeamChatPanel"],
  ["pod", "PODPanel"],
  ["analytics", "AnalyticsPanel"],
  ["geofences", "GeofencingPanel"],
  ["returns", "ReturnsPanel"],
  ["forecast", "ForecastPanel"],
  ["ml-maintenance", "MLMaintenancePanel"],
];

// Check which ones are missing from the render section
const missing = [];
tabMappings.forEach(([tab, panel]) => {
  const hasRouting = content.includes(`activeTab === "${tab}" && <${panel}`);
  const hasFn = content.includes(`function ${panel}(`);
  if (!hasRouting) missing.push({ tab, panel, hasFn });
});

console.log("Missing tab routings:", missing.length);
missing.forEach(m => console.log(` - ${m.tab} -> ${m.panel} (fn exists: ${m.hasFn})`));

// Find where to insert missing tab renderers
// Look for the last tab renderer
const lastTabIdx = content.lastIndexOf("{activeTab === \"pod\" && <PODPanel />}");
if (lastTabIdx === -1) {
  console.log("Cannot find insertion point - checking for any tab renderer...");
  const anyTab = content.lastIndexOf("{activeTab ===");
  console.log("Last activeTab at:", anyTab, content.substring(anyTab, anyTab + 80));
} else {
  // Insert missing ones after the last one
  let insertion = "\n";
  missing.forEach(m => {
    if (m.hasFn) {
      if (m.panel === "RouteOptimizerPanel") {
        insertion += `          {activeTab === "${m.tab}" && <${m.panel} optimizeRoutes={optimizeRoutes} optimizing={optimizing} optimizeResult={optimizeResult} />}\n`;
      } else {
        insertion += `          {activeTab === "${m.tab}" && <${m.panel} />}\n`;
      }
    }
  });
  
  if (insertion.trim()) {
    content = content.slice(0, lastTabIdx + "{activeTab === \"pod\" && <PODPanel />}".length) + insertion + content.slice(lastTabIdx + "{activeTab === \"pod\" && <PODPanel />}".length);
    fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
    console.log("Inserted missing tab routings!");
  }
}
