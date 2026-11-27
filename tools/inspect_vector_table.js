const fs = require('fs');

const p0File = 'C:\\Users\\kalle\\.gemini\\antigravity\\scratch\\matribox2-firmware-mod\\firmware\\extracted\\partition_0_core_dsp.bin';
const p0 = fs.readFileSync(p0File);

console.log('=== TABELA DE VETORES ARM DA PARTIÇÃO 0 ===\n');
const slice = p0.slice(0, 64);

for (let i = 0; i < slice.length; i += 16) {
    const chunk = slice.slice(i, i + 16);
    const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
    console.log(`[0x${i.toString(16).padStart(4, '0').toUpperCase()}]: ${hex}`);
}

const sp = slice.readUInt32LE(0);
const reset = slice.readUInt32LE(4);
const nmi = slice.readUInt32LE(8);
const hardfault = slice.readUInt32LE(12);

console.log(`\nStack Pointer Inicial: 0x${sp.toString(16).toUpperCase()}`);
console.log(`Reset Vector:          0x${reset.toString(16).toUpperCase()}`);
console.log(`NMI Vector:            0x${nmi.toString(16).toUpperCase()}`);
console.log(`HardFault Vector:      0x${hardfault.toString(16).toUpperCase()}`);
