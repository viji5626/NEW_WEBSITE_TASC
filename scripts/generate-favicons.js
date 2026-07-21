import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const logoPath = 'public/brand/tasc-logo-dark.png';
  if (!fs.existsSync(logoPath)) {
    console.error(`Logo not found at ${logoPath}`);
    process.exit(1);
  }

  const logo = await Jimp.read(logoPath);
  console.log(`Loaded healthy logo: ${logo.width}x${logo.height}`);

  // Create a centered square version of the logo on a transparent background
  async function createSquareIcon(size) {
    const canvas = new Jimp({ width: size, height: size, color: 0x00000000 });
    
    // Scale logo to fit 85% of the square canvas
    const maxDim = Math.round(size * 0.85);
    const scaleRatio = maxDim / logo.width;
    const targetWidth = maxDim;
    const targetHeight = Math.round(logo.height * scaleRatio);
    
    let finalWidth = targetWidth;
    let finalHeight = targetHeight;
    
    if (finalHeight > maxDim) {
      finalHeight = maxDim;
      const scaleRatioH = finalHeight / logo.height;
      finalWidth = Math.round(logo.width * scaleRatioH);
    }

    const resizedLogo = logo.clone().resize({ w: finalWidth, h: finalHeight });
    
    // Center it
    const x = Math.round((size - finalWidth) / 2);
    const y = Math.round((size - finalHeight) / 2);
    canvas.composite(resizedLogo, x, y);
    
    return canvas;
  }

  // Generate different PNG sizes
  const filesToGenerate = {
    'favicon.png': 32,
    'favicon-32x32.png': 32,
    'favicon-16x16.png': 16,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
    'fevicon.png': 32
  };

  const images = {};
  for (const [name, size] of Object.entries(filesToGenerate)) {
    const icon = await createSquareIcon(size);
    const destPath = path.join('public', name);
    await icon.write(destPath);
    console.log(`Successfully generated ${destPath} (${size}x${size})`);
    
    if (size === 32) {
      images[size] = await fs.promises.readFile(destPath);
    }
  }

  // Create a genuine multi-size .ico file (32x32)
  const png32 = images[32];
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 (ICO)
  icoHeader.writeUInt16LE(1, 4); // Number of images (1)

  const icoDir = Buffer.alloc(16);
  icoDir.writeUInt8(32, 0); // Width
  icoDir.writeUInt8(32, 1); // Height
  icoDir.writeUInt8(0, 2); // Color palette
  icoDir.writeUInt8(0, 3); // Reserved
  icoDir.writeUInt16LE(1, 4); // Color planes
  icoDir.writeUInt16LE(32, 6); // Bits per pixel
  icoDir.writeUInt32LE(png32.length, 8); // Size of image data
  icoDir.writeUInt32LE(22, 12); // Offset of image data (6 bytes header + 16 bytes directory)

  const icoBuffer = Buffer.concat([icoHeader, icoDir, png32]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log(`Successfully generated genuine public/favicon.ico (${icoBuffer.length} bytes)`);

  console.log('Favicon generation completed successfully!');
}

generate().catch(err => {
  console.error('Error during favicon generation:', err);
  process.exit(1);
});
