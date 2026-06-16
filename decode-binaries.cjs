const fs = require('fs');
const path = require('path');

const backupDir = 'image-backups';
if (!fs.existsSync(backupDir)) {
  console.log('No backups found.');
  process.exit(0);
}

const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
let processed = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(backupDir, file), 'utf-8');
  try {
    const data = JSON.parse(content);
    for (const [p, base64Data] of Object.entries(data)) {
      if (!p.startsWith('public/')) continue;
      const dir = path.dirname(p);
      fs.mkdirSync(dir, { recursive: true });
      const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      fs.writeFileSync(p, Buffer.from(cleanBase64, 'base64'));
      processed++;
    }
  } catch (err) {
    console.error('Error parsing JSON from ' + file + ':', err);
  }
}

console.log('Done unpacking. Files processed: ' + processed);
