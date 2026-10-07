const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = __dirname;
const files = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry.name)) walk(full);
    else if (/\.(html|css|js)$/.test(entry.name)) files.push(full);
  }
}
walk(root);
const missing = [];
for (const file of files) {
  if (file.endsWith('.js')) execFileSync(process.execPath, ['--check', file]);
  const content = fs.readFileSync(file, 'utf8');
  const patterns = [/(?:src|href)="([^"]+)"/g, /url\(['"]?([^)'"\s]+)/g, /from\s+'([^']+)'/g, /new URL\('([^']+)'/g];
  for (const pattern of patterns) {
    for (const [, ref] of content.matchAll(pattern)) {
      if (!ref.startsWith('.') && file.endsWith('vite.config.js')) continue;
      if (/^(data:|#|http)/.test(ref) || ref.includes('{{')) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), ref.split('#')[0]))) missing.push(`${path.relative(root, file)}: ${ref}`);
    }
  }
}
console.log(JSON.stringify({ filesChecked: files.length, missing }, null, 2));
if (missing.length) process.exit(1);

