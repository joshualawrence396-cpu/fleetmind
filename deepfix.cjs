const fs = require("fs");

const files = [
  "app/page.tsx",
  "app/pricing/page.tsx", 
  "app/client/page.tsx",
  "app/track/page.tsx",
  "components/FuelManagement.tsx",
  "components/MaintenanceScheduling.tsx",
  "components/NotificationSystem.tsx",
  "components/RealTimeChat.tsx",
  "components/APIDocumentation.tsx",
  "components/AutomatedTesting.tsx",
  "components/PerformanceMonitoring.tsx",
  "components/InvoiceGeneration.tsx",
  "components/ProofOfDelivery.tsx",
  "components/DemandForecasting.tsx",
  "components/CostAnalysis.tsx",
  "components/BarcodeScanner.tsx",
  "components/APIIntegrations.tsx",
  "components/DriverMobileApp.tsx",
];

// These are the garbled sequences that appear after emojis
// They come from UTF-8 bytes being misread as latin-1
const fixes = [
  // Arrows and symbols that got corrupted
  ["\u00e2\u0086\u0092", "\u2192"],   // â†' -> →
  ["\u00e2\u009c\u0085", "\u2705"],   // âœ… -> ✅  
  ["\u00e2\u0080\u00a2", "\u2022"],   // â€¢ -> •
  ["\u00e2\u009a\u00a0", "\u26a0"],   // âš  -> ⚠
  ["\u00e2\u009b\u00bd", "\u26fd"],   // â›½ -> ⛽
  ["\u00e2\u009a\u00a1", "\u26a1"],   // â¡ -> ⚡
  ["\u00e2\u0093\u00b3", "\u23f3"],   // â³ -> ⏳
  ["\u00e2\u009c\u0095", "\u2715"],   // âœ• -> ✕
  ["\u00e2\u009c\u0093", "\u2713"],   // âœ" -> ✓
  ["\u00e2\u009c\u0098", "\u2718"],   // âœ˜ -> ✘
  ["\u00c2\u00b7", "\u00b7"],         // Â· -> ·
  // Truck and vehicle emojis
  ["\u00f0\u009f\u009a\u009b", "\uD83D\uDE9B"], // 🚛
  ["\u00f0\u009f\u009a\u0097", "\uD83D\uDE97"], // 🚗
  ["\u00f0\u009f\u009a\u009a", "\uD83D\uDE9A"], // 🚚
  // People
  ["\u00f0\u009f\u0091\u00a4", "\uD83D\uDC64"], // 👤
  ["\u00f0\u009f\u0091\u008b", "\uD83D\uDC4B"], // 👋
  // Objects
  ["\u00f0\u009f\u0093\u00a6", "\uD83D\uDCE6"], // 📦
  ["\u00f0\u009f\u0093\u008a", "\uD83D\uDCCA"], // 📊
  ["\u00f0\u009f\u0093\u0088", "\uD83D\uDCC8"], // 📈
  ["\u00f0\u009f\u008f\u00ad", "\uD83C\uDFED"], // 🏭
  ["\u00f0\u009f\u0094\u00a7", "\uD83D\uDD27"], // 🔧
  ["\u00f0\u009f\u0094\u0094", "\uD83D\uDD14"], // 🔔
  ["\u00f0\u009f\u0092\u00ac", "\uD83D\uDCAC"], // 💬
  ["\u00f0\u009f\u0092\u00b3", "\uD83D\uDCB3"], // 💳
  ["\u00f0\u009f\u0093\u00b8", "\uD83D\uDCF8"], // 📸
  ["\u00f0\u009f\u0094\u00ae", "\uD83D\uDD2E"], // 🔮
  ["\u00f0\u009f\u0092\u00a1", "\uD83D\uDCA1"], // 💡
  ["\u00f0\u009f\u0094\u008c", "\uD83D\uDD0C"], // 🔌
  ["\u00f0\u009f\u0093\u00b1", "\uD83D\uDCF1"], // 📱
  ["\u00f0\u009f\u0093\u009a", "\uD83D\uDCDA"], // 📚
  ["\u00f0\u009f\u00a7\u00aa", "\uD83E\uDDEA"], // 🧪
  ["\u00f0\u009f\u0092\u00b0", "\uD83D\uDCB0"], // 💰
  ["\u00f0\u009f\u0093\u008d", "\uD83D\uDCCD"], // 📍
  ["\u00f0\u009f\u0094\u0084", "\uD83D\uDD04"], // 🔄
  ["\u00f0\u009f\u008f\u0086", "\uD83C\uDFC6"], // 🏆
  ["\u00f0\u009f\u008e\u00af", "\uD83C\uDFAF"], // 🎯
  ["\u00f0\u009f\u0097\u00ba", "\uD83D\uDDFA"], // 🗺
  ["\u00f0\u009f\u0094\u008d", "\uD83D\uDD0D"], // 🔍
  ["\u00f0\u009f\u009b\u0092", "\uD83D\uDED2"], // 🛒
  ["\u00f0\u009f\u0096\u00a8", "\uD83D\uDDA8"], // 🖨
  ["\u00f0\u009f\u0094\u0092", "\uD83D\uDD12"], // 🔒
  ["\u00f0\u009f\u0093\u008b", "\uD83D\uDCCB"], // 📋
  ["\u00f0\u009f\u009a\u00a8", "\uD83D\uDEA8"], // 🚨
  ["\u00e2\u009b\u00bd", "\u26fd"],              // ⛽
  ["\u00f0\u009f\u0091\u0094", "\uD83D\uDC54"], // 👔
  ["\u00f0\u009f\u0092\u00bc", "\uD83D\uDCBC"], // 💼
  ["\u00f0\u009f\u008f\u00a0", "\uD83C\uDFE0"], // 🏠
  ["\u00f0\u009f\u0093\u00b2", "\uD83D\uDCF2"], // 📲
];

let totalFixed = 0;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  
  // Read as latin1 to see raw bytes, then fix
  let raw = fs.readFileSync(f);
  let str = raw.toString("utf8");
  let original = str;
  
  fixes.forEach(([bad, good]) => {
    str = str.split(bad).join(good);
  });
  
  // Also strip any remaining garbage chars that appear right after emojis
  // These are â characters followed by random chars
  str = str.replace(/\u00e2[\u0080-\u00bf][\u0080-\u00bf]/g, (match) => {
    // Try to decode as UTF-8
    const b1 = match.charCodeAt(0);
    const b2 = match.charCodeAt(1);  
    const b3 = match.charCodeAt(2);
    const cp = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
    if (cp > 0x2000 && cp < 0x3000) return String.fromCodePoint(cp);
    return match;
  });

  if (str !== original) {
    fs.writeFileSync(f, str, "utf8");
    console.log("Fixed: " + f);
    totalFixed++;
  } else {
    console.log("No changes: " + f);
  }
});

console.log("\nTotal files fixed: " + totalFixed);
