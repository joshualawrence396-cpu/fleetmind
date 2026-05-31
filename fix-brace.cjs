const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");
const lines = content.split("\n");

// Find the orphan closing brace around line 155
// Look for a lone "}" between panel functions
for(let i = 148; i < 162; i++) {
  const line = lines[i]?.trim();
  if(line === "}" && lines[i-1]?.trim() === ")") {
    // Check if next non-empty line is a function declaration
    let nextLine = i + 1;
    while(nextLine < lines.length && lines[nextLine]?.trim() === "") nextLine++;
    if(lines[nextLine]?.includes("function ")) {
      console.log("Found orphan } at line", i+1, "- removing");
      lines.splice(i, 1);
      break;
    }
  }
}

fs.writeFileSync("app/dashboard/page.tsx", lines.join("\n"), "utf8");
console.log("Fixed! New line count:", lines.length);
