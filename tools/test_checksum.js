const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

console.log('=== INVESTIGAÇÃO DOS CHECKSUMS DO CABEÇALHO HTFW ===\n');

// 1. O valor em 0x04: 0x00016737 (em decimal: 91959)
const unknown_0x04 = buffer.readUInt32LE(4);
console.log(`Valor no offset 0x04: 0x${unknown_0x04.toString(16).padStart(8, '0').toUpperCase()} (${unknown_0x04})`);

// 2. O valor em 0x38:
const unknown_0x38 = buffer.readUInt32LE(0x38);
console.log(`Valor no offset 0x38: 0x${unknown_0x38.toString(16).padStart(8, '0').toUpperCase()} (${unknown_0x38})`);

// 3. Testar somas de bytes e palavras do payload (de 0x80 até o final)
const payload = buffer.slice(0x80);

// Soma aditiva de 8 bits, 16 bits, 32 bits
let sum8 = 0, sum16 = 0, sum32 = 0;
for (let i = 0; i < payload.length; i++) {
    sum8 = (sum8 + payload[i]) & 0xFF;
}
for (let i = 0; i < payload.length - 1; i += 2) {
    sum16 = (sum16 + payload.readUInt16LE(i)) & 0xFFFF;
}
for (let i = 0; i < payload.length - 3; i += 4) {
    sum32 = (sum32 + payload.readUInt32LE(i)) >>> 0;
}

const crc32 = zlib.crc32(payload) >>> 0;

console.log(`Payload Size: ${payload.length} bytes`);
console.log(`Soma 8-bit:   0x${sum8.toString(16).toUpperCase()}`);
console.log(`Soma 16-bit:  0x${sum16.toString(16).toUpperCase()}`);
console.log(`Soma 32-bit:  0x${sum32.toString(16).toUpperCase()}`);
console.log(`CRC32:        0x${crc32.toString(16).toUpperCase()}`);

// Checar cada partição
const partitions = [
    { id: 0, start: 128, size: 3264516, flagVal: 0x01001912 },
    { id: 1, start: 3264644, size: 258048, flagVal: 0x02001735 },
    { id: 2, start: 3522692, size: 131072, flagVal: 0x10001FED },
    { id: 3, start: 3653764, size: 1793400, flagVal: 0xFFFFFFFF }
];

console.log('\n--- Análise das Partições ---');
partitions.forEach(p => {
    const partData = buffer.slice(p.start, p.start + p.size);
    const pCrc = zlib.crc32(partData) >>> 0;
    let pSum16 = 0;
    for (let i = 0; i < partData.length - 1; i += 2) {
        pSum16 = (pSum16 + partData.readUInt16LE(i)) & 0xFFFF;
    }
    console.log(`Partição ${p.id}: Flag/Valor: 0x${p.flagVal.toString(16).padStart(8, '0').toUpperCase()} | Sum16: 0x${pSum16.toString(16).padStart(4, '0').toUpperCase()} | CRC: 0x${pCrc.toString(16).padStart(8, '0').toUpperCase()}`);
});
