const fs = require('fs');
const path = require('path');
const p0 = fs.readFileSync('firmware/extracted/partition_0_core_dsp.bin');

const assetsDir = 'F:/a-projetos/matribox 2 custom/ui_simulator/assets';
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// BMP 32 creator
function createBmp32(w, h, stride, rgbaBuf) {
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
      bmp[dstRow + x * 4] = rgbaBuf[srcRow + x * 4];         // B
      bmp[dstRow + x * 4 + 1] = rgbaBuf[srcRow + x * 4 + 1]; // G
      bmp[dstRow + x * 4 + 2] = rgbaBuf[srcRow + x * 4 + 2]; // R
      bmp[dstRow + x * 4 + 3] = rgbaBuf[srcRow + x * 4 + 3]; // A
    }
  }
  return bmp;
}

// BMP 24 creator
function createBmp24(w, h, stride, rgbBuf) {
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
  return bmp;
}

const assetsMap = {};
let count = 0;

for (let i = 0; i < p0.length - 24; i++) {
  const w = p0.readUInt16LE(i);
  const h = p0.readUInt16LE(i + 2);
  const stride = p0.readUInt16LE(i + 4);
  const bpp = p0.readUInt16LE(i + 6);
  const dataPtr = p0.readUInt32LE(i + 8);

  if ((dataPtr >>> 24) === 0x80) {
    if (bpp === 32 && stride === w * 4 && w >= 16 && w <= 480 && h >= 16 && h <= 320) {
      const pData = i + 24;
      if (pData + h * stride <= p0.length) {
        count++;
        const buf = p0.slice(pData, pData + h * stride);
        const bmp = createBmp32(w, h, stride, buf);
        const key = `asset_${count}_${w}x${h}_32bit`;
        assetsMap[key] = {
          name: key,
          width: w,
          height: h,
          bpp: 32,
          offset: '0x' + i.toString(16),
          dataUrl: 'data:image/bmp;base64,' + bmp.toString('base64')
        };
        fs.writeFileSync(path.join(assetsDir, `${key}.bmp`), bmp);
      }
    } else if (bpp === 24 && stride === w * 3 && w >= 16 && w <= 480 && h >= 16 && h <= 320) {
      const pData = i + 24;
      if (pData + h * stride <= p0.length) {
        count++;
        const buf = p0.slice(pData, pData + h * stride);
        const bmp = createBmp24(w, h, stride, buf);
        const key = `asset_${count}_${w}x${h}_24bit`;
        assetsMap[key] = {
          name: key,
          width: w,
          height: h,
          bpp: 24,
          offset: '0x' + i.toString(16),
          dataUrl: 'data:image/bmp;base64,' + bmp.toString('base64')
        };
        fs.writeFileSync(path.join(assetsDir, `${key}.bmp`), bmp);
      }
    }
  }
}

console.log(`Extracted total ${count} genuine assets.`);

// Write assets_data.js for instant browser loading
const jsContent = `// Gerado automaticamente pelo extrator forense da Matribox II
// Contém os assets gráficos oficiais extraídos da Partição 0 do firmware
window.MATRIBOX_ASSETS = ${JSON.stringify(assetsMap, null, 2)};
`;

fs.writeFileSync('F:/a-projetos/matribox 2 custom/ui_simulator/assets_data.js', jsContent);
console.log('Saved F:/a-projetos/matribox 2 custom/ui_simulator/assets_data.js');
