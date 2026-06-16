import fs from 'fs';
import path from 'path';

const brandDir = 'public/brand';
const backupDir = 'image-backups';
const MAX_CHUNK_SIZE_BYTES = 1000 * 1000; // 1MB chunks to ensure safety

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

let result = {};
let currentSizeBytes = 0;
let chunkIndex = 0;

function flushChunk() {
  if (Object.keys(result).length > 0) {
    const outputJson = path.join(backupDir, `brand-binaries-${chunkIndex}.json`);
    fs.writeFileSync(outputJson, JSON.stringify(result));
    console.log(`Successfully packed binaries into ${outputJson}`);
    chunkIndex++;
    result = {};
    currentSizeBytes = 0;
  }
}

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
        const base64Str = data.toString('base64');
        
        // If adding this file exceeds the limit, flush first
        if (currentSizeBytes > 0 && currentSizeBytes + base64Str.length > MAX_CHUNK_SIZE_BYTES) {
          flushChunk();
        }
        
        result[fullPath] = base64Str;
        currentSizeBytes += base64Str.length;
      }
    }
  }
}

// Clean old backups first
const oldFiles = fs.readdirSync(backupDir);
for (const file of oldFiles) {
  if (file.endsWith('.json')) {
    fs.unlinkSync(path.join(backupDir, file));
  }
}

scanDir(brandDir);
flushChunk();
console.log('Done packing all binaries.');
