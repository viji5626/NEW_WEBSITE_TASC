import fs from 'fs';
import path from 'path';

const inputFile = 'brand-binaries.json';

if (fs.existsSync(inputFile)) {
  console.log('Unpacking binary files to correct GitHub export corruption...');
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  
  for (const [filePath, base64Content] of Object.entries(data)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, Buffer.from(base64Content, 'base64'));
  }
  console.log('Successfully unpacked binaries.');
} else {
  console.log('No packed binaries found (brand-binaries.json), skipping...');
}
