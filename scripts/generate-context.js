import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const allFiles = getFiles(srcDir);

let contextText = 'TASC Automation Website Content:\\n\\n';

for (const file of allFiles) {
  // skip some files if they don't have visual text
  if (file.includes('vite-env.d.ts') || file.includes('main.tsx')) continue;

  const content = fs.readFileSync(file, 'utf8');
  
  // Clean up code to reduce token usage and improve semantic value
  let cleaned = content.replace(/^import.*$/gm, '');
  cleaned = cleaned.replace(/className=(["']).*?\1/g, ''); // remove className string
  cleaned = cleaned.replace(/className={.*?}/g, ''); // remove className object/variable
  cleaned = cleaned.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '[ICON]');
  cleaned = cleaned.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/]+={0,2}/g, '[IMAGE]');
  
  // Remove multiple empty lines
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  
  contextText += `--- File: src/${path.relative(srcDir, file)} ---\n`;
  contextText += cleaned + '\n\n';
}

const contextData = { context: contextText };
fs.writeFileSync(path.join(rootDir, 'website-knowledge.json'), JSON.stringify(contextData, null, 2));
console.log('Site context generated successfully. Size:', contextText.length, 'bytes');
