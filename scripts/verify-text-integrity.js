const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const siteDir = path.join(__dirname, '..', '_site');
const baselineFile = path.join(__dirname, 'baseline-text-hashes.json');

function extractVisibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ') // ignore decorative SVGs
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getAllHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const isRecording = process.argv.includes('--record');
const htmlFiles = getAllHtmlFiles(siteDir);

if (htmlFiles.length === 0) {
  console.error("Error: _site directory is empty. Run 'npm run build' first.");
  process.exit(1);
}

if (isRecording) {
  const hashes = {};
  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file);
    const text = extractVisibleText(fs.readFileSync(file, 'utf8'));
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    hashes[rel] = { hash, length: text.length };
  }
  fs.writeFileSync(baselineFile, JSON.stringify(hashes, null, 2), 'utf8');
  console.log(`Baseline recorded for ${Object.keys(hashes).length} HTML routes.`);
  process.exit(0);
}

if (!fs.existsSync(baselineFile)) {
  console.error("Baseline file not found. Run 'node scripts/verify-text-integrity.js --record' first.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
let failed = 0;

for (const [rel, data] of Object.entries(baseline)) {
  const filePath = path.join(siteDir, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING ROUTE: ${rel}`);
    failed++;
    continue;
  }
  const currentText = extractVisibleText(fs.readFileSync(filePath, 'utf8'));
  const currentHash = crypto.createHash('sha256').update(currentText).digest('hex');
  if (currentHash !== data.hash) {
    console.error(`TEXT CONTENT DRIFT IN: ${rel}`);
    console.error(`Expected length: ${data.length}, Actual: ${currentText.length}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`FAILED: ${failed} routes had text modifications!`);
  process.exit(1);
}

console.log(`PASSED: All ${Object.keys(baseline).length} routes match approved text 100%.`);
process.exit(0);
