/**
 * PATCH DE COR DO LED: TAP TEMPO BRANCO PURO
 * Autores: Mgrpoisom & CesarMalak
 * 
 * Substitui o registrador de cor R1 = 4 (Amarelo) para R1 = 7 (Branco Puro).
 */

const fs = require('fs');
const path = require('path');

const inFw = 'C:\\Users\\kalle\\.gemini\\antigravity\\scratch\\matribox2-firmware-mod\\firmware\\modified\\QME-100_PTBR_V1.3.0.bin';
const outFw = 'C:\\Users\\kalle\\.gemini\\antigravity\\scratch\\matribox2-firmware-mod\\firmware\\modified\\QME-100_WHITELED_BETA_V1.3.0.bin';

const buffer = fs.readFileSync(inFw);

console.log('=== APLICANDO WHITE LED MOD (TAP TEMPO BRANCO PURO) ===\n');

// Ponto 1: Instrução MOV.W R1, #4 em 0x40C1B (4F F4 04 61) -> byte 0x04 em 0x40C1D
const off1 = 0x40C1D;
if (buffer[off1] === 0x04) {
    buffer[off1] = 0x07; // 7 = WHITE
    console.log(`[+] [0x${off1.toString(16).toUpperCase()}] Patch 1 aplicado: Cor 0x04 (Amarelo) -> 0x07 (Branco Puro)`);
} else {
    console.warn(`[!] Byte inesperado em 0x${off1.toString(16).toUpperCase()}: 0x${buffer[off1].toString(16)}`);
}

// Ponto 2: Instrução MOV.W R1, #4 em 0x40C57 (4F F4 04 61) -> byte 0x04 em 0x40C59
const off2 = 0x40C59;
if (buffer[off2] === 0x04) {
    buffer[off2] = 0x07; // 7 = WHITE
    console.log(`[+] [0x${off2.toString(16).toUpperCase()}] Patch 2 aplicado: Cor 0x04 (Amarelo) -> 0x07 (Branco Puro)`);
} else {
    console.warn(`[!] Byte inesperado em 0x${off2.toString(16).toUpperCase()}: 0x${buffer[off2].toString(16)}`);
}

fs.mkdirSync(path.dirname(outFw), { recursive: true });
fs.writeFileSync(outFw, buffer);

console.log(`\n[OK] Firmware White LED Mod gerado com sucesso em:\n -> ${outFw}`);
