const fs = require('fs');
const path = require('path');

const emojiMap = [
  [/ðŸš›/g, '🚛'], [/ðŸ"Š/g, '📊'], [/ðŸ"ˆ/g, '📈'], [/ðŸ'¤/g, '👤'],
  [/ðŸ"¦/g, '📦'], [/ðŸ/g, '🏭'], [/ðŸ"‹/g, '📋'], [/â›½/g, '⛽'],
  [/ðŸ"§/g, '🔧'], [/ðŸ""/g, '🔔'], [/ðŸ'¬/g, '💬'], [/ðŸ'³/g, '💳'],
  [/ðŸ"¸/g, '📸'], [/ðŸ"®/g, '🔮'], [/ðŸ'¡/g, '💡'], [/ðŸ"Œ/g, '🔌'],
  [/ðŸ"±/g, '📱'], [/ðŸ"š/g, '📚'], [/ðŸ§ª/g, '🧪'], [/âœ…/g, '✅'],
  [/ðŸ'°/g, '💰'], [/â³/g, '⏳'], [/ðŸ"/g, '📍'], [/ðŸ"„/g, '🔄'],
  [/ðŸ†/g, '🏆'], [/â¡/g, '⚡'], [/ðŸŽ¯/g, '🎯'], [/ðŸ'ˆ/g, '👤'],
  [/â†'/g, '→'], [/ðŸ"©/g, '🔩'], [/ðŸš—/g, '🚗'], [/ðŸ'/g, '👋'],
  [/ðŸ"²/g, '📲'], [/ðŸ›'/g, '🛒'], [/ðŸ›/g, '🛍️'], [/ðŸ"/g, '🔍'],
  [/â›"/g, '⛔'], [/ðŸ—ºï¸/g, '🗺️'], [/ðŸ¦/g, '🏦'], [/âœ•/g, '✕'],
  [/ðŸ"¢/g, '📢'], [/ðŸš¨/g, '🚨'], [/â„¹ï¸/g, 'ℹ️'], [/âŒ/g, '❌'],
  [/ðŸ–¨ï¸/g, '🖨️'], [/ðŸ'"/g, '🔓'], [/ðŸ'ˆ/g, '💈'],
];

const components = [
  'app/page.tsx',
  'app/pricing/page.tsx',
  'app/client/page.tsx',
  'app/track/page.tsx',
  'components/FuelManagement.tsx',
  'components/MaintenanceScheduling.tsx',
  'components/NotificationSystem.tsx',
  'components/RealTimeChat.tsx',
  'components/APIDocumentation.tsx',
  'components/AutomatedTesting.tsx',
  'components/PerformanceMonitoring.tsx',
  'components/InvoiceGeneration.tsx',
  'components/ProofOfDelivery.tsx',
  'components/DemandForecasting.tsx',
  'components/CostAnalysis.tsx',
  'components/BarcodeScanner.tsx',
  'components/APIIntegrations.tsx',
  'components/DriverMobileApp.tsx',
];

let totalFixed = 0;
components.forEach(f => {
  const full = path.join(__dirname, f);
  if (!fs.existsSync(full)) return;
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;
  emojiMap.forEach(([from, to]) => {
    if (content.match(from)) { content = content.replace(from, to); changed = true; }
  });
  if (changed) {
    fs.writeFileSync(full, content, 'utf8');
    console.log('Fixed: ' + f);
    totalFixed++;
  }
});
console.log('Done! Fixed ' + totalFixed + ' files.');
