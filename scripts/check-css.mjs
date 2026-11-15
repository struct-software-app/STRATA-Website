import fs from 'node:fs';
import path from 'node:path';

const requiredSelectors = ['.shadow-xs', '.shadow-2xs', '.animate-in', '.bg-hero-glow', '.backdrop-blur-xs'];
const validZinc = new Set(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']);
let failed = false;

const assetsDir = path.resolve('dist/assets');
const cssFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css')) : [];
if (cssFiles.length === 0) {
  console.error('No CSS files found in dist/assets');
  process.exit(1);
}
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(assetsDir, file), 'utf8');
  const missing = requiredSelectors.filter((sel) => !css.includes(sel));
  if (missing.length > 0) {
    console.error(`${file} missing selectors: ${missing.join(', ')}`);
    failed = true;
  }
}

function walkTsx(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsx(full);
    else if (entry.name.endsWith('.tsx')) {
      const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
      lines.forEach((line, idx) => {
        const rel = `${path.relative(process.cwd(), full)}:${idx + 1}`;
        if (line.includes('bg-radial-')) { console.error(`${rel} contains bg-radial-`); failed = true; }
        if (line.includes('zoom-in-98')) { console.error(`${rel} contains zoom-in-98`); failed = true; }
        for (const m of line.matchAll(/\bzinc-(\d+)\b/g)) {
          if (!validZinc.has(m[1])) { console.error(`${rel} invalid shade zinc-${m[1]}`); failed = true; }
        }
      });
    }
  }
}
walkTsx(path.resolve('src'));

if (failed) process.exit(1);
console.log('CSS check passed');
