const fs = require("fs");
const path = require("path");

const files = [
  "app/page.tsx",
  "app/pricing/page.tsx",
  "app/client/page.tsx",
  "app/dashboard/page.tsx",
  "components/CostAnalysis.tsx",
  "components/DemandForecasting.tsx",
  "components/InvoiceGeneration.tsx",
];

const safeFormat = (match) => match.replace(
  /(\w+)\.toLocaleString\(\)/g,
  '$1.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")'
);

let fixed = 0;
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, "utf8");
  const original = content;
  content = content.replace(/[\w.[\]()'"]+\.toLocaleString\(\)/g, (match) => {
    return match.replace(".toLocaleString()", '.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")');
  });
  if (content !== original) {
    fs.writeFileSync(f, content, "utf8");
    console.log("Fixed: " + f);
    fixed++;
  }
});
console.log("Total fixed: " + fixed + " files");
