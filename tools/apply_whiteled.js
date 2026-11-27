const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_WHITELED_V1.3.0.bin');

console.log('=== APLICADOR DO WHITE LED MOD (TAP TEMPO) ===');
console.log('[*] Lendo firmware base PT-BR:', inputPath);

const fw = fs.readFileSync(inputPath);

// No contêiner HTFW, a Partição 0 começa em 0x80.
// A função de despacho de cor do Footswitch está no offset 0x2CC3A da Partição 0:
// 0x80 + 0x2CC3A = 0x2CCBA.
// Instrução original: 04 20 (MOVS R0, #4 -> Yellow)
// Instrução modificada: 07 20 (MOVS R0, #7 -> Pure White)

const targetOffset = 0x2CCBA;

if (fw[targetOffset] !== 0x04) {
    console.error(`[-] ERRO: Byte no offset 0x${targetOffset.toString(16).toUpperCase()} é 0x${fw[targetOffset].toString(16)}, esperado 0x04!`);
    process.exit(1);
}

fw[targetOffset] = 0x07;

fs.writeFileSync(outputPath, fw);
console.log(`[+] Patch aplicado com sucesso!`);
console.log(`[+] Offset modificado: 0x${targetOffset.toString(16).toUpperCase()} (0x04 -> 0x07)`);
console.log(`[+] Arquivo gerado: ${outputPath} (${fw.length} bytes)`);
