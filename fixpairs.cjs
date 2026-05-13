const fs = require("fs");

// The issue: emojis stored as surrogate pairs have their low surrogate
// corrupted into random unicode chars. We need to fix each pair.
// Pattern: high surrogate (d800-dbff) followed by garbage instead of low surrogate (dc00-dfff)

const emojiFixes = [
  // Each entry: [corrupted high surrogate, corrupted low chars..., correct emoji]
  // We can see from the codes: 1f3ed dfed = factory but then garbage follows
  // The real fix: replace the whole corrupted sequence with the right emoji

  // From the output, 1f3ed followed by dfed then garbage = wrong emoji entirely
  // Let's map by what the second char codes are:
  // dfed + 201c + 160 = 📊 (chart)
  // dfed + 201c + 2c6 = 📈 (chart up)  
  // dfed + 2018 + a4  = 👤 (person)
  // dfed + 201c + a6  = 📦 (box)
  // dfed + 8f + ad    = 🏭 (factory - actual)
  // dfed + 201c + 2039= 📋 (clipboard)
  // dfed + 201d + a7  = ⛽ (fuel)
  // dfed + 2019 + b3  = 💳 (card)
  // dfed + 2019 + a1  = 💡 (bulb)
  // dfed + 201d + ae  = 🔮 (crystal)
  // dfed + 201d + 201d= 💬 (chat)
  // dfed + 2019 + ac  = 💬 (chat)
  // dfed + 201c + b8  = 📸 (camera)
  // dfed + 201d + 152 = 🔌 (plug)
  // dfed + 201c + b1  = 📱 (phone)
  // dfed + 201c + 161 = 📚 (books)
  // dfed + a7 + aa    = 🧪 (test)
];

// Better approach: just rewrite the nav section and icon strings directly
const files = ["app/page.tsx"];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, "utf8");
  
  // Remove the garbage chars that appear after emojis
  // The pattern is: emoji char + (201c|201d|2018|2019) + (one more char)
  // These are "smart quotes" that got inserted
  
  // Replace specific corrupted sequences we can see in the output
  const repairs = [
    // icon strings in the navSections and stat cards
    [/🏭[\u201c\u201d\u2018\u2019][\u0080-\u02ff](?=")/g, "📊"],   // chart
    [/🏭[\u201c][\u02c6](?=")/g, "📈"],    // chart up
    [/🏭[\u2018][\u00a4](?=")/g, "👤"],    // person
    [/🏭[\u201c][\u00a6](?=")/g, "📦"],    // box - first occurrence
    [/🏭[\u008f][\u00ad](?=")/g, "🏭"],    // actual factory
    [/🏭[\u201c][\u2039](?=")/g, "📋"],    // clipboard
    [/🏭[\u201d][\u00a7](?=")/g, "⛽"],    // fuel
    [/🏭[\u2019][\u00b3](?=")/g, "💳"],    // card
    [/🏭[\u2019][\u00a1](?=")/g, "💡"],    // bulb
    [/🏭[\u201d][\u00ae](?=")/g, "🔮"],    // crystal
    [/🏭[\u201d][\u201d](?=")/g, "💬"],    // chat
    [/🏭[\u2019][\u00ac](?=")/g, "💬"],    // chat 2
    [/🏭[\u201c][\u00b8](?=")/g, "📸"],    // camera
    [/🏭[\u201d][\u0152](?=")/g, "🔌"],    // plug
    [/🏭[\u201c][\u00b1](?=")/g, "📱"],    // phone
    [/🏭[\u201c][\u0161](?=")/g, "📚"],    // books
    [/🏭[\u00a7][\u00aa](?=")/g, "🧪"],    // test tube
    [/🏭[\u201c][\u0160](?=")/g, "📊"],    // chart (duplicate)
    // Fix corrupted arrows and symbols
    [/[\u201c][\u0086][\u0092]/g, "→"],
    [/[\u201c][\u009c][\u0085]/g, "✅"],
    [/[\u201c][\u009a][\u00a1]/g, "⚡"],
    [/[\u201c][\u009b][\u00bd]/g, "⛽"],
    [/[\u201c][\u0093][\u00b3]/g, "⏳"],
    [/[\u201c][\u009c][\u0095]/g, "✕"],
    [/[\u201c][\u009c][\u0093]/g, "✓"],
    // Remove stray curly quotes that snuck in after emojis
    [/([🚛👤📦🏭📋⛽🔧🔔💬💳📸🔮💡🔌📱📚🧪✅💰⏳📍🔄🏆⚡🎯🗺🔍🛒🖨🔒📊📈])[\u201c\u201d\u2018\u2019][\u0080-\u02ff]/g, "$1"],
  ];

  let original = c;
  repairs.forEach(([pattern, replacement]) => {
    c = c.replace(pattern, replacement);
  });

  fs.writeFileSync(f, c, "utf8");
  
  // Count remaining issues
  const remaining = (c.match(/🏭[\u201c\u201d\u2018\u2019]/g) || []).length;
  console.log("Fixed. Remaining issues:", remaining);
  
  // Show any still-broken emojis
  let i = 0;
  while (i < c.length) {
    const code = c.codePointAt(i);
    if (code > 0x1F000) {
      const next = c.codePointAt(i + 2);
      if (next > 0x200 && next < 0x2200) {
        console.log("Still broken at", i, ":", JSON.stringify(c.substring(i, i+5)));
      }
    }
    i++;
  }
});
