const fs = require("fs");
const path = require("path");

// Create icons directory
fs.mkdirSync("public/icons", { recursive: true });

// Generate SVG icon that browsers can use
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size*0.2}" fill="#6366f1"/>
  <rect width="${size}" height="${size}" rx="${size*0.2}" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <text x="${size/2}" y="${size*0.68}" font-family="Arial" font-size="${size*0.45}" fill="white" text-anchor="middle">🚛</text>
</svg>`;
  fs.writeFileSync(`public/icons/icon-${size}.png`, svg);
  console.log(`Created icon-${size}.png (SVG)`);
});
console.log("Icons created!");
