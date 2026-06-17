import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function compressPng(srcRel, destRel, maxDim = 1250) {
  if (!fs.existsSync(srcRel)) {
    console.log(`[COMPRESS] Source file not found: ${srcRel}`);
    return false;
  }
  
  try {
    const image = await Jimp.read(srcRel);
    console.log(`[COMPRESS] Loaded ${srcRel} (${image.width}x${image.height})`);
    
    if (image.width > maxDim || image.height > maxDim) {
      const ratio = Math.min(maxDim / image.width, maxDim / image.height);
      const w = Math.round(image.width * ratio);
      const h = Math.round(image.height * ratio);
      console.log(`[COMPRESS] Resizing to ${w}x${h}`);
      image.resize({ w, h });
    }
    
    // Save as JPEG which is robust, fast-loading, and completely safe from binary issues
    await image.write(destRel);
    const size = fs.statSync(destRel).size;
    console.log(`[COMPRESS] Successfully wrote optimized image to ${destRel} (${size} bytes)`);
    return true;
  } catch (err) {
    console.error(`[COMPRESS] Failed compressing ${srcRel}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('=== RUNNING COMPRESSION ON INDUSTRIAL ARCHITECTURE DIAGRAMS ===');
  
  const targets = [
    { src: 'public/brand/siemens.png', dest: 'public/brand/siemens.jpg' },
    { src: 'public/brand/connectivity.png', dest: 'public/brand/connectivity.jpg' },
    { src: 'public/brand/protocols.png', dest: 'public/brand/protocols.jpg' },
    { src: 'public/brand/data-mes.png', dest: 'public/brand/data-mes.jpg' }
  ];
  
  for (const t of targets) {
    await compressPng(t.src, t.dest);
  }
  
  // Clean up corrupted webp assets from ALL directories to prevent any stale reads
  const dirs = ['public/brand', 'public/brand_new', 'tasc_brand'];
  const webpNames = ['siemens.webp', 'connectivity.webp', 'protocols.webp', 'data-mes.webp'];
  
  for (const d of dirs) {
    for (const wn of webpNames) {
      const fullWebpPath = path.join(d, wn);
      if (fs.existsSync(fullWebpPath)) {
        try {
          fs.unlinkSync(fullWebpPath);
          console.log(`[CLEANUP] Deleted corrupted webp: ${fullWebpPath}`);
        } catch (err) {
          console.error(`[CLEANUP] Failed deleting ${fullWebpPath}:`, err.message);
        }
      }
    }
    
    // Copy compressed jpgs to other folders
    if (d !== 'public/brand') {
      const jpgNames = ['siemens.jpg', 'connectivity.jpg', 'protocols.jpg', 'data-mes.jpg'];
      for (const jn of jpgNames) {
        const srcJpg = path.join('public/brand', jn);
        const destJpg = path.join(d, jn);
        if (fs.existsSync(srcJpg)) {
          try {
            fs.mkdirSync(d, { recursive: true });
            fs.copyFileSync(srcJpg, destJpg);
            console.log(`[SYNC] Copied ${srcJpg} -> ${destJpg}`);
          } catch (err) {
            console.error(`[SYNC] Failed copying to ${destJpg}:`, err.message);
          }
        }
      }
    }
  }
  
  console.log('=== COMPRESSION COMPLETED ===');
}

main().catch(console.error);
