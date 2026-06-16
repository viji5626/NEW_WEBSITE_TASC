const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('brand-binaries.json', 'utf-8');

const regex = /"([^"]+)"\s*:\s*"([^"]*)"/g;
let match;
let processed = 0;

while ((match = regex.exec(content)) !== null) {
  const [_, p, base64Data] = match;
  if (!p.startsWith('public/')) continue;
  try {
    const dir = path.dirname(p);
    fs.mkdirSync(dir, { recursive: true });
    // Strip metadata prefix if present (e.g. data:image/jpeg;base64,)
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    fs.writeFileSync(p, Buffer.from(cleanBase64, 'base64'));
    processed++;
  } catch (err) {}
}

const lastKeyMatch = content.match(/"(public\/[^"]+)"\s*:\s*"([^"]*)$/);
if (lastKeyMatch) {
  try {
    const p = lastKeyMatch[1];
    let base64Data = lastKeyMatch[2];
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const dir = path.dirname(p);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, Buffer.from(cleanBase64, 'base64'));
    processed++;
  } catch (err) {}
}

console.log('Done unpacking. Files processed: ' + processed);
