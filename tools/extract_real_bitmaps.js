const fs = require('fs');
const path = require('path');
const p0 = fs.readFileSync('firmware/extracted/partition_0_core_dsp.bin');

const outDir = 'F:/a-projetos/matribox 2 custom/ui_simulator/assets';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Function to write 24-bit uncompressed BMP
function writeBmp24(filePath, w, h, stride, rgbBuf) {
  const rowSize = Math.floor((24 * w + 31) / 32) * 4;
  const fileSize = 54 + rowSize * h;
  const bmp = Buffer.alloc(fileSize);
  bmp.write('BM', 0);
  bmp.writeUInt32LE(fileSize, 2);
  bmp.writeUInt32LE(54, 10);
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(w, 18);
  bmp.writeInt32LE(-h, 22);
  bmp.writeUInt16LE(1, 26);
  bmp.writeUInt16LE(24, 28);
  bmp.writeUInt32LE(0, 30);
  bmp.writeUInt32LE(rowSize * h, 34);

  for (let y = 0; y < h; y++) {
    const srcRow = y * stride;
    const dstRow = 54 + y * rowSize;
    for (let x = 0; x < w; x++) {
      bmp[dstRow + x * 3] = rgbBuf[srcRow + x * 3];
      bmp[dstRow + x * 3 + 1] = rgbBuf[srcRow + x * 3 + 1];
      bmp[dstRow + x * 3 + 2] = rgbBuf[srcRow + x * 3 + 2];
    }
  }
  fs.writeFileSync(filePath, bmp);
}

// Search for uncompressed 24-bit bitmaps
let count = 0;
for (let i = 0; i < p0.length - 24; i++) {
  const w = p0.readUInt16LE(i);
  const h = p0.readUInt16LE(i + 2);
  const stride = p0.readUInt16LE(i + 4);
  const bpp = p0.readUInt16LE(i + 6);
  const dataPtr = p0.readUInt32LE(i + 8);

  if (bpp === 24 && w >= 16 && w <= 480 && h >= 16 && h <= 320 && stride === w * 3) {
    if ((dataPtr >>> 24) === 0x80) {
      count++;
      const pData = i + 24;
      if (pData + h * stride <= p0.length) {
        const rgbBuf = p0.slice(pData, pData + h * stride);
        const fileName = `bitmap_${count}_${w}x${h}_off0x${i.toString(16)}.bmp`;
        writeBmp24(path.join(outDir, fileName), w, h, stride, rgbBuf);
        console.log(`Saved: ${fileName}`);
        if (count >= 15) break;
      }
    }
  }
}

console.log(`Total extracted: ${count}`);
