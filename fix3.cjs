const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Remove the injected FleetPanel function that doesn't belong
// It starts with "function FleetPanel(" and ends before the next proper panel
const fleetPanelMatch = content.match(/\nfunction FleetPanel\(\{[^}]+\}[^]*?(?=\nfunction [A-Z]|\nexport default)/);
if (fleetPanelMatch) {
  console.log("Found FleetPanel injection at index:", content.indexOf(fleetPanelMatch[0]));
  console.log("Length:", fleetPanelMatch[0].length);
  content = content.replace(fleetPanelMatch[0], "\n");
  console.log("Removed FleetPanel injection");
} else {
  console.log("FleetPanel not found with regex, trying line scan...");
  
  const lines = content.split("\n");
  let startLine = -1, endLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("function FleetPanel(")) {
      startLine = i;
      console.log("Found FleetPanel at line:", i+1);
    }
    if (startLine > -1 && i > startLine && lines[i].match(/^function [A-Z]/) && endLine === -1) {
      endLine = i;
      console.log("FleetPanel ends at line:", i+1);
      break;
    }
  }
  
  if (startLine > -1 && endLine > -1) {
    lines.splice(startLine, endLine - startLine);
    content = lines.join("\n");
    console.log("Removed lines", startLine+1, "to", endLine);
  } else if (startLine > -1) {
    console.log("Could not find end of FleetPanel");
    // Show context
    lines.slice(startLine, startLine+20).forEach((l,i) => console.log(startLine+i+1, "|", l));
  }
}

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Done! File length:", content.length);
