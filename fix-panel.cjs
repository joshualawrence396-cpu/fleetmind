const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Remove any stray <Panel> or </Panel> tags
content = content.replace(/<Panel>/g, "");
content = content.replace(/<\/Panel>/g, "");
content = content.replace(/<Panel \/>/g, "");

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Fixed! Lines:", content.split("\n").length);
