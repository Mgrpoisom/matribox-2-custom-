const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

console.log('=== RASTREAMENTO DA FUNÇÃO TAP TEMPO NO CÓDIGO (PARTIÇÃO 0) ===\n');

// Partição 0: 0x80 até 0x31D084 (endereço base 0x00700000)
const p0_start = 0x80;
const p0_size = 3264516;
const p0 = buffer.slice(p0_start, p0_start + p0_size);
const baseAddr = 0x00700000;

// 1. Onde está a string "Tap Tempo"?
// Em 0x315395 (relativo ao início do arquivo) -> endereço de memória = baseAddr + (0x315395 - 0x80)
const strOffsetInFile = 0x315395;
const strMemoryAddr = baseAddr + (strOffsetInFile - p0_start);
console.log(`String "Tap Tempo" no arquivo: 0x${strOffsetInFile.toString(16).toUpperCase()}`);
console.log(`Endereço de memória teórico:  0x${strMemoryAddr.toString(16).toUpperCase()}`);

// Procurar onde esse endereço de memória (ou relativo) é referenciado como ponteiro em P0
const ptrLE = Buffer.alloc(4);
ptrLE.writeUInt32LE(strMemoryAddr);

const ptrMatches = [];
let pos = 0;
while ((pos = p0.indexOf(ptrLE, pos)) !== -1) {
    ptrMatches.push(pos);
    pos += 4;
}

console.log(`\nPonteiros diretos para "Tap Tempo" em P0: ${ptrMatches.length}`);
ptrMatches.forEach(pOff => {
    const fileOff = p0_start + pOff;
    console.log(`[0x${fileOff.toString(16).toUpperCase()}] Referência encontrada!`);
    // Mostrar 32 bytes antes e depois
    const slice = buffer.slice(fileOff - 16, fileOff + 32);
    console.log(slice.toString('hex').match(/../g).join(' '));
});

// 2. Procurar também por "Tap" (0x3153A1)
const strTapFile = 0x3153A1;
const strTapMem = baseAddr + (strTapFile - p0_start);
const ptrTapLE = Buffer.alloc(4);
ptrTapLE.writeUInt32LE(strTapMem);

const tapPtrMatches = [];
pos = 0;
while ((pos = p0.indexOf(ptrTapLE, pos)) !== -1) {
    tapPtrMatches.push(pos);
    pos += 4;
}
console.log(`\nPonteiros para "Tap" em P0: ${tapPtrMatches.length}`);
tapPtrMatches.forEach(pOff => {
    const fileOff = p0_start + pOff;
    console.log(`[0x${fileOff.toString(16).toUpperCase()}] Referência para "Tap"!`);
    const slice = buffer.slice(fileOff - 16, fileOff + 32);
    console.log(slice.toString('hex').match(/../g).join(' '));
});
