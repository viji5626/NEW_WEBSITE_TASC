import fs from 'fs';
import path from 'path';

const brandDir = 'public/brand';
const outputJson = 'brand-binaries.json';

const result = {};

function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      const isBinary = !fullPath.endsWith('.svg') && !fullPath.endsWith('.vcf');
      if (isBinary) {
        const data = fs.readFileSync(fullPath);
        result[fullPath] = data.toString('base64');
      }
    }
  }
}

scanDir(brandDir);
fs.writeFileSync(outputJson, JSON.stringify(result));
console.log('Successfully packed binaries into ' + outputJson);
