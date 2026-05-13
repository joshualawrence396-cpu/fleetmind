const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "app", "page.tsx");
let c = fs.readFileSync(file, "utf8");

// Fix all corrupted multi-byte emoji sequences
const fixes = [
  // Truck
  [/\u00f0\u009f\u009a\u009b/g, "\u{1F69B}"],
  // Factory/warehouse
  [/\u00f0\u009f\u008f\u00ad/g, "\u{1F3ED}"],
  // Chart
  [/\u00f0\u009f\u0093\u008a/g, "\u{1F4CA}"],
  // Chart increasing
  [/\u00f0\u009f\u0093\u0088/g, "\u{1F4C8}"],
  // Person
  [/\u00f0\u009f\u0091\u00a4/g, "\u{1F464}"],
  // Package
  [/\u00f0\u009f\u0093\u00a6/g, "\u{1F4E6}"],
  // Clipboard
  [/\u00f0\u009f\u0093\u008b/g, "\u{1F4CB}"],
  // Fuel pump
  [/\u00e2\u009b\u00bd/g, "\u26FD"],
  // Wrench
  [/\u00f0\u009f\u0094\u00a7/g, "\u{1F527}"],
  // Bell
  [/\u00f0\u009f\u0094\u0094/g, "\u{1F514}"],
  // Chat bubble
  [/\u00f0\u009f\u0092\u00ac/g, "\u{1F4AC}"],
  // Credit card
  [/\u00f0\u009f\u0092\u00b3/g, "\u{1F4B3}"],
  // Camera
  [/\u00f0\u009f\u0093\u00b8/g, "\u{1F4F8}"],
  // Crystal ball
  [/\u00f0\u009f\u0094\u00ae/g, "\u{1F52E}"],
  // Lightbulb
  [/\u00f0\u009f\u0092\u00a1/g, "\u{1F4A1}"],
  // Plugin
  [/\u00f0\u009f\u0094\u008c/g, "\u{1F50C}"],
  // Mobile phone
  [/\u00f0\u009f\u0093\u00b1/g, "\u{1F4F1}"],
  // Books
  [/\u00f0\u009f\u0093\u009a/g, "\u{1F4DA}"],
  // Test tube
  [/\u00f0\u009f\u00a7\u00aa/g, "\u{1F9EA}"],
  // Check mark
  [/\u00e2\u009c\u0085/g, "\u2705"],
  // Money
  [/\u00f0\u009f\u0092\u00b0/g, "\u{1F4B0}"],
  // Hourglass
  [/\u00e2\u0093\u00b3/g, "\u23F3"],
  // Pin
  [/\u00f0\u009f\u0093\u008d/g, "\u{1F4CD}"],
  // Refresh
  [/\u00f0\u009f\u0094\u0084/g, "\u{1F504}"],
  // Trophy
  [/\u00f0\u009f\u008f\u0086/g, "\u{1F3C6}"],
  // Lightning
  [/\u00e2\u009a\u00a1/g, "\u26A1"],
  // Target
  [/\u00f0\u009f\u008e\u00af/g, "\u{1F3AF}"],
  // Map
  [/\u00f0\u009f\u0097\u00ba/g, "\u{1F5FA}"],
  // Arrow right
  [/\u00e2\u0086\u0092/g, "\u2192"],
  // Warning
  [/\u00e2\u009a\u00a0/g, "\u26A0"],
  // Crown/lock
  [/\u00f0\u009f\u0094\u0092/g, "\u{1F512}"],
  // Waving hand
  [/\u00f0\u009f\u0091\u008b/g, "\u{1F44B}"],
  // Barcode / magnifier
  [/\u00f0\u009f\u0094\u008d/g, "\u{1F50D}"],
  // Shopping cart
  [/\u00f0\u009f\u009b\u0092/g, "\u{1F6D2}"],
  // Shopping bags
  [/\u00f0\u009f\u009b\u008d/g, "\u{1F6CD}"],
  // Printer
  [/\u00f0\u009f\u0096\u00a8/g, "\u{1F5A8}"],
  // Quick fix â character artifacts before emojis
  [/\u00e2\u0080\u009c/g, "\u201C"],
  [/\u00e2\u0080\u009d/g, "\u201D"],
  // Remove stray â characters that appear before broken emojis
  [/\u00c3\u00b0\u00c5\u00b8/g, ""],
];

fixes.forEach(([from, to]) => { c = c.replace(from, to); });

// Also do simple string replacements for common ones still showing wrong
const strFixes = [
  ["ðŸš›", "??"], ["ðŸ"Š", "??"], ["ðŸ"ˆ", "??"], ["ðŸ'¤", "??"],
  ["ðŸ"¦", "??"], ["ðŸ­", "??"], ["ðŸ"‹", "??"], ["â›½", "?"],
  ["ðŸ"§", "??"], ["ðŸ"", "??"], ["ðŸ'¬", "??"], ["ðŸ'³", "??"],
  ["ðŸ"¸", "??"], ["ðŸ"®", "??"], ["ðŸ'¡", "??"], ["ðŸ"Œ", "??"],
  ["ðŸ"±", "??"], ["ðŸ"š", "??"], ["ðŸ§ª", "??"], ["âœ…", "?"],
  ["ðŸ'°", "??"], ["â³", "?"], ["ðŸ"", "??"], ["ðŸ"„", "??"],
  ["ðŸ†", "??"], ["â¡", "?"], ["ðŸŽ¯", "??"], ["â†'", "?"],
  ["ðŸ—º", "??"], ["ðŸ'‹", "??"], ["ðŸ›'", "??"], ["ðŸ"", "??"],
  ["â", "?"], ["ðŸ"¢", "??"], ["âŒ", "?"], ["ðŸ–¨", "??"],
  ["ðŸ"'", "??"], ["ðŸš—", "??"], ["ðŸ", "??"], ["ðŸ"²", "??"],
  ["ðŸ¤", "??"], ["ðŸ'»", "??"], ["ðŸŒ", "??"], ["ðŸ"…", "??"],
  ["â˜'", "?"], ["ðŸ˜", "??"], ["ðŸŽ‰", "??"], ["ðŸ"", "??"],
  ["ðŸ•", "??"], ["ðŸšš", "??"], ["ðŸ›µ", "??"], ["ðŸš•", "??"],
  ["ðŸ"–", "??"], ["ðŸ'Ž", "??"], ["ðŸ¦", "??"], ["ðŸ"", "??"],
  ["ðŸ—‚", "??"], ["ðŸ'¼", "??"], ["ðŸ""", "??"], ["ðŸ"•", "??"],
  ["ðŸ'"", "??"],
];

strFixes.forEach(([from, to]) => { c = c.split(from).join(to); });

fs.writeFileSync(file, c, "utf8");
console.log("Done! Emojis fixed in page.tsx");
