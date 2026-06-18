const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Check if a file is already valid (exists, size > 0, and not corrupted)
function isFileValid(p) {
  if (!fs.existsSync(p)) return false;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) return true;
  if (stat.size < 50) return false;
  const buf = fs.readFileSync(p);
  const hex = buf.slice(0, 10).toString('hex');
  if (hex.startsWith('efbfbd')) return false; // UTF-8 replacement character corruption marker
  return true;
}

async function fetchWithUrls(urls, dest) {
  for (const url of urls) {
    try {
      console.log(`  [DOWNLOAD TEMP] Trying ${url}...`);
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) {
        console.log(`    HTTP failure status: ${res.status}`);
        continue;
      }
      const ab = await res.arrayBuffer();
      const buf = Buffer.from(ab);
      if (buf.length < 50) {
        console.log(`    File downloaded is too small: ${buf.length} bytes`);
        continue;
      }
      const hex = buf.slice(0, 10).toString('hex');
      if (hex.startsWith('efbfbd')) {
        console.log(`    File downloaded is corrupted (efbfbd): ${buf.length} bytes`);
        continue;
      }
      ensureDir(dest);
      fs.writeFileSync(dest, buf);
      console.log(`  [DOWNLOAD SUCCESS] ${dest} (${buf.length} bytes)`);
      return true;
    } catch (err) {
      console.log(`    Fetch failed: ${err.message}`);
    }
  }
  return false;
}

// Extract from local truncated and healthy backup JSON files using RegExp
function extractBackupViaRegex(bPath) {
  if (!fs.existsSync(bPath)) return;
  const content = fs.readFileSync(bPath, 'utf-8');
  
  // RegExp to match "key": "base64"
  const regex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  let match;
  let count = 0;
  
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const b64 = match[2];
    
    if (key.startsWith('public/brand/') && b64.length > 50) {
      const relativePath = key.replace('public/brand/', '');
      const dest = path.join('public', 'brand', relativePath);
      
      // If we don't have a valid file locally, let's extract it!
      if (!isFileValid(dest)) {
        const cleanB64 = b64.includes(',') ? b64.split(',')[1] : b64;
        const buf = Buffer.from(cleanB64, 'base64');
        const hex = buf.slice(0, 10).toString('hex');
        
        if (buf.length > 50 && !hex.startsWith('efbfbd')) {
          ensureDir(dest);
          fs.writeFileSync(dest, buf);
          console.log(`  [EXTRACTED BACKUP] ${dest} (${buf.length} bytes)`);
          count++;
        }
      }
    }
  }
  if (count > 0) {
    console.log(`  [BACKUP CHUNK RESTORED] ${count} files salvaged from ${bPath}`);
  }
}

async function runRestoration() {
  console.log('=== STARTING SEAMLESS MULTI-SOURCE HYBRID ASSET RESTORER ===');
  
  // Create relative brand directories
  const folders = [
    'public/brand/cases',
    'public/brand_new/cases',
    'tasc_brand/cases'
  ];
  for (const f of folders) {
    fs.mkdirSync(f, { recursive: true });
  }

  // Define prioritized URLs for each file to ensure maximum survivability
  const commitSha = 'fb54717f187626c95ddf8c7cf33e3713c1625c02';
  const downloadConfigs = {
    'public/brand/ABB.jpg': [
      `https://raw.githubusercontent.com/viji5626/NEW_WEBSITE_TASC/${commitSha}/public/brand/ABB.jpg`,
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/ABB.jpg`
    ],
    'public/brand/MEI.jpg': [
      `https://raw.githubusercontent.com/viji5626/NEW_WEBSITE_TASC/${commitSha}/public/brand/MEI.jpg`,
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/MEI.jpg`
    ],
    'public/brand/Schneider.jpg': [
      `https://raw.githubusercontent.com/viji5626/NEW_WEBSITE_TASC/${commitSha}/public/brand/Schneider.jpg`,
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/Schneider.jpg`
    ],
    'public/brand/director-monika.jpg': [
      `https://raw.githubusercontent.com/viji5626/NEW_WEBSITE_TASC/${commitSha}/public/brand/director-monika.jpg`,
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/director-monika.jpg`
    ],
    'public/brand/siemens.jpg': [
      `https://raw.githubusercontent.com/viji5626/NEW_WEBSITE_TASC/${commitSha}/public/brand/siemens.jpg`,
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/siemens.jpg`
    ],
    'public/brand/siemens.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/siemens.png`
    ],
    'public/brand/connectivity.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/connectivity.png`
    ],
    'public/brand/data-mes.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/data-mes.png`
    ],
    'public/brand/protocols.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/protocols.png`
    ],
    'public/brand/tasc-logo-dark.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/tasc-logo-dark.png`
    ],
    'public/brand/founder-vijay.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/founder-vijay.jpg`
    ],
    'public/brand/mitsubishi.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/mitsubishi.jpg`
    ],
    'public/brand/cases/ems.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/cases/ems.jpg`
    ],
    'public/brand/cases/iron-ore.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/cases/iron-ore.jpg`
    ],
    'public/brand/cases/quartz-ben.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/cases/quartz-ben.jpg`
    ],
    'public/brand/cases/quartz-slab.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/cases/quartz-slab.jpg`
    ],
    'public/brand/cases/sas.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/cases/sas.jpg`
    ],
    'public/brand/genesis64.png': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/genesis64.png`
    ],
    'public/brand/vcard-qr.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vcard-qr.svg`
    ],
    'public/brand/microsoft.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/microsoft.svg`
    ],
    'public/brand/openai.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/openai.svg`
    ],
    'public/brand/openai-white.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/openai-white.svg`
    ],
    'public/brand/hermes.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/hermes.svg`
    ],
    'public/brand/hermes-white.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/hermes-white.svg`
    ],
    'public/brand/ai-orchestration.svg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/ai-orchestration.svg`
    ],
    'public/brand/vert-auto.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-auto.jpg`
    ],
    'public/brand/vert-bms.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-bms.jpg`
    ],
    'public/brand/vert-conveyor.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-conveyor.jpg`
    ],
    'public/brand/vert-hvac.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-hvac.jpg`
    ],
    'public/brand/vert-material.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-material.jpg`
    ],
    'public/brand/vert-mining.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-mining.jpg`
    ],
    'public/brand/vert-panel.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-panel.jpg`
    ],
    'public/brand/vert-paper.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-paper.jpg`
    ],
    'public/brand/vert-substation.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-substation.jpg`
    ],
    'public/brand/vert-sustain.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-sustain.jpg`
    ],
    'public/brand/vert-water.jpg': [
      `https://raw.githubusercontent.com/viji5626/EMERGENT_WEBSITE/main/frontend/public/brand/vert-water.jpg`
    ]
  };

  // 1. Download in parallel only if not already valid
  console.log('--- Phase 1: Prioritized Downloading of Assets ---');
  const downloadPromises = Object.entries(downloadConfigs).map(async ([dest, urls]) => {
    if (isFileValid(dest)) {
      console.log(`  [HEALTHY] ${dest}`);
      return;
    }
    return fetchWithUrls(urls, dest);
  });
  await Promise.all(downloadPromises);

  // 2. Extract from local JSON backups as a redundant safeguard
  console.log('--- Phase 2: Salvaging Local Base64 Backup Chunks ---');
  const backupsDir = 'image-backups';
  if (fs.existsSync(backupsDir)) {
    const backupFiles = fs.readdirSync(backupsDir).filter(f => f.endsWith('.json'));
    // Sort backup files numerically
    backupFiles.sort((a,b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
    
    for (const bFile of backupFiles) {
      const bPath = path.join(backupsDir, bFile);
      try {
        extractBackupViaRegex(bPath);
      } catch (err) {
        console.log(`  [SAFE READ] Encountered error parsing backup chunk ${bFile}: ${err.message}`);
      }
    }
  }

  // 3. Keep auxiliary replica folders fully synchronized (brand_new and tasc_brand)
  console.log('-- Phase 3: Syncing Replica Folders --');
  const copyDirRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      if (fs.statSync(srcPath).isDirectory()) {
        copyDirRecursive(srcPath, destPath);
      } else {
        // Only transfer valid files
        if (isFileValid(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  };

  console.log('Synchronizing public/brand to public/brand_new and tasc_brand...');
  copyDirRecursive('public/brand', 'public/brand_new');
  copyDirRecursive('public/brand', 'tasc_brand');

  console.log('=== BRAND ASSETS RESTORATION COMPLETELY DONE ===');
}

runRestoration().catch(err => {
  console.error('Fatal decoder error:', err);
});
