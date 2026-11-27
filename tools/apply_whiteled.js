const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_WHITELED_V1.3.0.bin');

console.log('=== APLICADOR DEFINITIVO DO WHITE LED MOD (HARDWARE RGB FLOAT TABLE) ===');
console.log('[*] Lendo firmware base PT-BR:', inputPath);

const fw = fs.readFileSync(inputPath);

// 1. Tabela de hardware de cores dos footswitches (8 slots de ações dos footswitches A, B, C, D em Tap/Hold):
// Cada entrada tem 3 floats IEEE-754: { Red, Green, Blue }
// Original: R=1.0f, G=1.0f, B=0.0f (Amarelo)
// Modificado: R=1.0f, G=1.0f, B=1.0f (Branco Puro RGB 255, 255, 255)
const hwColorOffsets = [
    0x4B935, 0x4B989, 0x4B9F9, 0x4BA69,
    0x4BAD9, 0x4BB49, 0x4BBB9, 0x4BC29
];

hwColorOffsets.forEach((off, i) => {
    const r = fw.readFloatLE(off);
    const g = fw.readFloatLE(off + 4);
    const b = fw.readFloatLE(off + 8);
    if (r === 1.0 && g === 1.0 && b === 0.0) {
        fw.writeFloatLE(1.0, off + 8);
        console.log(`[+] Slot #${i+1} [0x${off.toString(16).toUpperCase()}]: R=1.0, G=1.0, B=0.0 -> B=1.0 (BRANCO PURO)`);
    } else {
        console.warn(`[!] Slot #${i+1} [0x${off.toString(16).toUpperCase()}]: valores inesperados R=${r}, G=${g}, B=${b}`);
    }
});

// 2. Enum de cor do Footswitch (offset 0x2CCBA):
if (fw[0x2CCBA] === 0x04) {
    fw[0x2CCBA] = 0x07;
    console.log('[+] Enum do Footswitch [0x2CCBA]: 0x04 (Amarelo) -> 0x07 (Branco)');
}

fs.writeFileSync(outputPath, fw);
console.log(`[+] Firmware gravado com sucesso em: ${outputPath} (${fw.length} bytes)`);
