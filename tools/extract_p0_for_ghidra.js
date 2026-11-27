const fs = require('fs');
const path = require('path');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

// Partição 0: offset 0x80 (128) até 128 + 3264516
const p0_start = 128;
const p0_size = 3264516;
const p0 = buffer.slice(p0_start, p0_start + p0_size);

const scratchP0 = 'C:\\Users\\kalle\\.gemini\\antigravity\\scratch\\matribox2-firmware-mod\\firmware\\extracted\\partition_0_core_dsp.bin';
fs.mkdirSync(path.dirname(scratchP0), { recursive: true });
fs.writeFileSync(scratchP0, p0);

console.log(`[OK] Partição 0 extraída com sucesso para o Ghidra:`);
console.log(` -> ${scratchP0}`);
console.log(` -> Tamanho: ${p0.length} bytes (${(p0.length/1024/1024).toFixed(2)} MB)`);
console.log(` -> Endereço Base para o Ghidra: 0x00700000`);
