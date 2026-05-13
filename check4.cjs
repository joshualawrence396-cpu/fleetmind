const fs = require("fs");
const c = fs.readFileSync("app/page.tsx", "utf8");

// Find all emoji-like chars and show what comes after them
let i = 0;
let found = 0;
while (i < c.length && found < 20) {
  const code = c.codePointAt(i);
  if (code > 0x1F000) {
    const context = c.substring(i, i + 10);
    const codes = [];
    for (let j = 0; j < context.length; j++) {
      codes.push(context.codePointAt(j).toString(16));
    }
    console.log("Emoji at", i, ":", JSON.stringify(context), "codes:", codes.join(" "));
    found++;
    i += 2;
  } else {
    i++;
  }
}
