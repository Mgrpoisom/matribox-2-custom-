// Aplicador do Pattern Tremolo Pêndulo Perfeito (1 -> 2 -> 3 -> 2 -> 1)
// Baseado 100% no arquivo QME-100_PATTERN_TREM_V1.3.0 (1).bin aprovado pelo usuário
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');

const inputPath = 'F:/Downloads/QME-100_PATTERN_TREM_V1.3.0 (1).bin';
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PATTERN_TREM_V1.3.0.bin');
const scratchPath = 'C:/Users/kalle/.gemini/antigravity/scratch/matribox2-firmware-mod/QME-100_PATTERN_TREM_V1.3.0.bin';

console.log('=== APLICANDO PÊNDULO (1 -> 2 -> 3 -> 2 -> 1) SOBRE BASE TOP (1) ===');
const fw = fs.readFileSync(inputPath);

// Na subrotina em 0x50179c:
// Avança o ciclo de 4 passos:
// c = (c + 1) % 4
// Se c == 0 -> fig = 0 (Fig 1)
// Se c == 1 -> fig = 1 (Fig 2)
// Se c == 2 -> fig = 2 (Fig 3)
// Se c == 3 -> fig = 1 (Fig 2)  <-- desce para Fig 2 antes de voltar para Fig 1!
const subHex = '4ff21042c2f2240253680133042b28bf002353601946032908bf012111607047';
Buffer.from(subHex, 'hex').copy(fw, 0x50179c);

// Salvar
fs.writeFileSync(scratchPath, fw);
fs.writeFileSync(outputPath, fw);
console.log('[+] Sucesso! Arquivo gerado em:', outputPath, 'Tamanho:', fw.length);
