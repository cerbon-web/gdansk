const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'CNAME');
const destDir = path.join(__dirname, '..', '..', 'frontend');
const dest = path.join(destDir, 'CNAME');

try {
  if (!fs.existsSync(src)) throw new Error(`Source CNAME not found: ${src}`);
  if (!fs.existsSync(destDir)) throw new Error(`Build output directory not found: ${destDir}`);
  fs.copyFileSync(src, dest);
  console.log(`CNAME copied to ${dest}`);
} catch (err) {
  console.error('Failed to copy CNAME:', err.message || err);
  process.exit(1);
}
