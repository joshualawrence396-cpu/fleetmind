const fs = require("fs");

// Create a simple ICO file from SVG data
// We'll generate a proper ICO with embedded PNG data
// Using a minimal valid 32x32 ICO structure

// Since we cant use sharp/canvas easily, create an SVG favicon 
// and update layout to use it
const svgContent = fs.readFileSync("public/favicon.svg", "utf8");
console.log("SVG favicon created at public/favicon.svg");

// Create apple touch icon (simple SVG copy)
fs.copyFileSync("public/favicon.svg", "public/apple-touch-icon.svg");

// Update the layout to use SVG favicon
let layout = fs.readFileSync("app/layout.tsx", "utf8");
if (!layout.includes("favicon.svg")) {
  layout = layout.replace(
    '<link rel="manifest" href="/manifest.json" />',
    `<link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />`
  );
  // Remove old favicon.ico reference if any
  layout = layout.replace(/<link rel="icon" href="\/favicon\.ico"[^>]*\/>/g, "");
  fs.writeFileSync("app/layout.tsx", layout, "utf8");
  console.log("Layout updated with SVG favicon");
} else {
  console.log("Favicon already in layout");
}
