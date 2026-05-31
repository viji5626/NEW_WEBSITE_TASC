import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/master/frontend/public/brand/';
const TARGET_DIR = path.join(process.cwd(), 'public/brand');

const filesToDownload = [
  'connectivity.png',
  'data-mes.png',
  'founder-vijay.jpg',
  'genesis64.png',
  'mitsubishi.jpg',
  'protocols.png',
  'siemens.png',
  'tasc-logo-dark.png',
  'vert-auto.jpg',
  'vert-bms.jpg',
  'vert-conveyor.jpg',
  'vert-hvac.jpg',
  'vert-material.jpg',
  'vert-mining.jpg',
  'vert-panel.jpg',
  'vert-paper.jpg',
  'vert-substation.jpg',
  'vert-sustain.jpg',
  'vert-water.jpg',
  'cases/ems.jpg',
  'cases/iron-ore.jpg',
  'cases/quartz-ben.jpg',
  'cases/quartz-slab.jpg',
  'cases/sas.jpg'
];

function downloadFile(fileUrl, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${fileUrl}' (${response.statusCode})`));
        return;
      }
      
      const data = [];
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', async () => {
        const buffer = Buffer.concat(data);
        await fs.writeFile(outputPath, buffer);
        console.log(`Downloaded ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading pristine images from GitHub to fix corrupted exports...');
  
  if (!existsSync(TARGET_DIR)) {
    mkdirSync(TARGET_DIR, { recursive: true });
  }
  if (!existsSync(path.join(TARGET_DIR, 'cases'))) {
    mkdirSync(path.join(TARGET_DIR, 'cases'), { recursive: true });
  }

  for (const file of filesToDownload) {
    const fileUrl = BASE_URL + file;
    const outputPath = path.join(TARGET_DIR, file);
    try {
      await downloadFile(fileUrl, outputPath);
    } catch (err) {
      console.error(`Failed to download ${file}:`, err.message);
    }
  }
  console.log('Images downloaded successfully!');
}

main();
