const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'app', 'page.tsx'), 'utf8');

// Replace all broken emoji sequences with correct ones
const fixed = content
  .replace(/ðŸš›/g, '🚛')
  .replace(/ðŸ"Š/g, '📊')
  .replace(/ðŸ"ˆ/g, '📈')
  .replace(/ðŸ'¤/g, '👤')
  .replace(/ðŸ"¦/g, '📦')
  .replace(/ðŸ/g, '🏭')
  .replace(/ðŸ"‹/g, '📋')
  .replace(/â›½/g, '⛽')
  .replace(/ðŸ"§/g, '🔧')
  .replace(/ðŸ""/g, '🔔')
  .replace(/ðŸ'¬/g, '💬')
  .replace(/ðŸ'³/g, '💳')
  .replace(/ðŸ"¸/g, '📸')
  .replace(/ðŸ"®/g, '🔮')
  .replace(/ðŸ'¡/g, '💡')
  .replace(/ðŸ"Œ/g, '🔌')
  .replace(/ðŸ"±/g, '📱')
  .replace(/ðŸ"š/g, '📚')
  .replace(/ðŸ§ª/g, '🧪')
  .replace(/âœ…/g, '✅')
  .replace(/ðŸ'°/g, '💰')
  .replace(/â³/g, '⏳')
  .replace(/ðŸ"/g, '📍')
  .replace(/ðŸ"„/g, '🔄')
  .replace(/ðŸ—ºï¸/g, '🗺️')
  .replace(/ðŸ'/g, '👋')
  .replace(/â¡/g, '⚡')
  .replace(/ðŸ†/g, '🏆')
  .replace(/ðŸŽ¯/g, '🎯')
  .replace(/ðŸ'»/g, '💻')
  .replace(/ðŸ"/g, '🔍')
  .replace(/â†'/g, '→')
  .replace(/ðŸ'ˆ/g, '👈')
  .replace(/â€¢/g, '•')
  .replace(/â€"/g, '–')

fs.writeFileSync(path.join(__dirname, 'app', 'page.tsx'), fixed, 'utf8');
console.log('Fixed! Emojis restored.');
