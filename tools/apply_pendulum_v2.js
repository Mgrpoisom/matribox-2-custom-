// Aplicador do Pattern Tremolo Pêndulo V2 (1 -> 2 -> 3 -> 2 -> 1)
// Corrige a checagem de fim de ciclo (it gt; bxgt lr; movs r6, #0)
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PATTERN_TREM_V1.3.0.bin');
const scratchPath = 'C:/Users/kalle/.gemini/antigravity/scratch/matribox2-firmware-mod/QME-100_PATTERN_TREM_V1.3.0.bin';

console.log('=== APLICANDO PATTERN TREMOLO PÊNDULO V2 (1 -> 2 -> 3 -> 2 -> 1) ===');
const fw = fs.readFileSync(inputPath);

// 1. Sync padrão = 1.0f (ON) no descritor (0x5016C8) - sem alterar descritores de parâmetros
fw.writeFloatLE(1.0, 0x5016c8);

// 2. Na função init (0x501730), zerar o contador de ciclos [0x2024F410]
fw[0x501732] = 0x10;

// 3. Em 0x501764, NOP bne para sempre ler o Tap Tempo
fw.writeUInt16LE(0xbf00, 0x501764);

// 4. Máquina de estados Pêndulo (36 ciclos):
// - Ciclos 0..3   (4 batidas):  1/4  (Figura 1)
// - Ciclos 4..11  (8 batidas):  1/8  (Figura 2 - subindo)
// - Ciclos 12..27 (16 batidas): 1/16 (Figura 3 - ápice)
// - Ciclos 28..35 (8 batidas):  1/8  (Figura 2 - descendo)
// - Wrap para 0:                1/4  (Figura 1 - base)
// + Subrotina de ciclo em 0x5017A4 com checagem de ciclo 'it gt; bxgt lr; movs r6, #0'
const pendulumBlock = Buffer.from(
  '4ff21042c2f224021368242b28bf00231360b7ee002a042b60d3b6ee002a0c2b5cd3b5ee002a1c2b58d3b6ee002a55e000bf' +
  'c8bf704700264ff21042c2f2240213680133242b28bf002313607047',
  'hex'
);
pendulumBlock.copy(fw, 0x501772);

// 5. Em 0x5018A0: atualização de fase instantânea na virada (vmov.f32 s18, s2)
Buffer.from('b0ee419a', 'hex').copy(fw, 0x5018a0);

// 6. Em 0x501946: chamar subrotina em 0x5017A4 (bl #0x5017a4)
Buffer.from('fff72dff', 'hex').copy(fw, 0x501946);

// Salvar
fs.writeFileSync(scratchPath, fw);
fs.writeFileSync(outputPath, fw);
console.log('[+] Sucesso! Arquivo gerado em:', outputPath, 'Tamanho:', fw.length);
