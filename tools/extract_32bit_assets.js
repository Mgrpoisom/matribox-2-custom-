const fs = require('fs');
const path = require('path');
const p0 = fs.readFileSync('firmware/extracted/partition_0_core_dsp.bin');

const outDir = 'F:/a-projetos/matribox 2 custom/ui_simulator/assets';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function writeBmp32(filePath, w, h, stride, rgbaBuf) {
  const fileSize = 54 + w * h * 4;
  const bmp = Buffer.alloc(fileSize);
  bmp.write('BM', 0);
  bmp.writeUInt32LE(fileSize, 2);
  bmp.writeUInt32LE(54, 10);
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(w, 18);
  bmp.writeInt32LE(-h, 22);
  bmp.writeUInt16LE(1, 26);
  bmp.writeUInt16LE(32, 28);
  bmp.writeUInt32LE(0, 30);
  bmp.writeUInt32LE(w * h * 4, 34);

  for (let y = 0; y < h; y++) {
    const srcRow = y * stride;
    const dstRow = 54 + y * (w * 4);
    for (let x = 0; x < w; x++) {
      // In BMP 32: B, G, R, A
      const r = rgbaBuf[srcRow + x * 4];
      const g = rgbaBuf[srcRow + x * 4 + 1];
      const b = rgbaBuf[srcRow + x * 4 + 2];
      const a = rgbaBuf[srcRow + x * 4 + 3];
      bmp[dstRow + x * 4] = b;
      bmp[dstRow + x * 4 + 1] = g;
      bmp[dstRow + x * 4 + 2] = r;
      bmp[dstRow + x * 4 + 3] = a;
    }
  }
  fs.writeFileSync(filePath, bmp);
}

let count32 = 0;
for (let i = 0; i < p0.length - 24; i++) {
  const w = p0.readUInt16LE(i);
  const h = p0.readUInt16LE(i + 2);
  const stride = p0.readUInt16LE(i + 4);
  const bpp = p0.readUInt16LE(i + 6);
  const dataPtr = p0.readUInt32LE(i + 8);

  if (bpp === 32 && w >= 16 && w <= 480 && h >= 16 && h <= 320 && stride === w * 4) {
    if ((dataPtr >>> 24) === 0x80) {
      count32++;
      const pData = i + 24;
      if (pData + h * stride <= p0.length) {
        const rgbaBuf = p0.slice(pData, pData + h * stride);
        const fileName = `icon_${count32}_${w}x${h}_off0x${i.toString(16)}.bmp`;
        writeBmp32(path.join(outDir, fileName), w, h, stride, rgbaBuf);
        console.log(`Saved 32-bit: ${fileName}`);
        if (count32 >= 20) break;
      }
    }
  }
}

console.log(`Total 32-bit extracted: ${count32}`);
