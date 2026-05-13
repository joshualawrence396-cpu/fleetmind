const fs = require("fs");
let c = fs.readFileSync("app/page.tsx", "utf8");

// Fix remaining broken sequences found at specific positions
const repairs = [
  // "🏭"" " = 💬 chat bubble (two curly quotes)
  [/🏭\u201c\u201d/g, "💬"],
  [/🏭\u201d\u201c/g, "💬"],
  [/🏭\u201c\u201c/g, "💬"],
  // "🏭"„<" = 🔍 search / magnifier
  [/🏭\u201c\u201e/g, "🔍"],
  // "🏭—ºï" = 🗺 map
  [/🏭\u2014\u00ba/g, "🗺"],
  [/🏭[\u2014\u2013][\u00ba\u00b0]/g, "🗺"],
  // "🏭"‹ " = 📋 clipboard or 🔌 plug  
  [/🏭\u201c\u2039/g, "📋"],
  // Clean up any leftover ï characters after map emoji
  [/🗺[\u00ef][\u00b8][\u008f]/g, "🗺️"],
  [/🗺\uef\ub8\u8f/g, "🗺️"],
];

let original = c;
repairs.forEach(([p, r]) => { c = c.replace(p, r); });

// Final sweep - remove any stray chars after emojis
c = c.replace(/([🚛👤📦🏭📋⛽🔧🔔💬💳📸🔮💡🔌📱📚🧪✅💰⏳📍🔄🏆⚡🎯🗺🔍🛒🖨🔒📊📈✕→⚠])[\u201c\u201d\u2018\u2019\u2014\u2013\u203a\u2039\u201e][\u0080-\u02ff\u2018-\u201f]?/g, "$1");

fs.writeFileSync("app/page.tsx", c, "utf8");

// Verify
let remaining = 0;
for (let i = 0; i < c.length; i++) {
  const code = c.codePointAt(i);
  if (code > 0x1F000) {
    const next = c.codePointAt(i + 2);
    if (next && next > 0x200 && next < 0x2200) {
      console.log("Still broken:", JSON.stringify(c.substring(i, i+6)));
      remaining++;
    }
  }
}
if (remaining === 0) console.log("All emojis fixed!");
else console.log(remaining + " still broken");
