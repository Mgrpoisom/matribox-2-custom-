// Aplicador do Pattern Tremolo - Caminho 1 (Seletor Modo 1, 2 e 3 no Knob do Meio)
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PATTERN_TREM_V1.3.0.bin');
const scratchPath = 'C:/Users/kalle/.gemini/antigravity/scratch/matribox2-firmware-mod/QME-100_PATTERN_TREM_V1.3.0.bin';

console.log('=== APLICANDO PATTERN TREMOLO - CAMINHO 1 (MODO 1, 2 OU 3) ===');
const fw = fs.readFileSync(inputPath);

// 1. Sync padrão = 1.0f (ON) no descritor (0x5016C8)
fw.writeFloatLE(1.0, 0x5016c8);

// 2. Param 1 (Rate) vira 'Modo' (min: 1, max: 3, step: 1, def: 3, flag: 0x1500ff01)
// Mantém exatamente 5 bytes ('Modo\0') substituindo 'Rate\0' em 0x5016D5
fw.writeFloatLE(1.0, 0x5016a4);        // min = 1.0
fw.writeFloatLE(3.0, 0x5016a8);        // max = 3.0
fw.writeFloatLE(1.0, 0x5016ac);        // step = 1.0
fw.writeFloatLE(3.0, 0x5016b0);        // default = 3.0 (Modo 3 padrão)
fw.writeUInt32LE(0x1500ff01, 0x5016b4);// flag = slider inteiro 1, 2, 3
Buffer.from('Modo\0', 'ascii').copy(fw, 0x5016d5);

// 3. Na função init (0x501730), zerar o contador de ciclos [0x2024F410]
fw[0x501732] = 0x10;

// 4. Em 0x501764, NOP bne para sempre ler o Tap Tempo
fw.writeUInt16LE(0xbf00, 0x501764);

// 5. Em 0x501772..0x5017B2: ler Modo em s2, ajustar limite (1=4, 2=12, 3=28) e selecionar figura
const loopHex = '4ff21042c2f22402bdeec11a11ee100a1c23012808bf0423022808bf0c2353601068984228bf00201060b7ee002a042854d3b6ee002a0c2850d3b5ee002a4de000bf';
Buffer.from(loopHex, 'hex').copy(fw, 0x501772);

// 6. Subrotina de ciclo em 0x5017B4: incrementa ciclo e compara com limite dinâmico
const subHex = '4ff21042c2f224025168136801338b4228bf002313607047';
Buffer.from(subHex, 'hex').copy(fw, 0x5017b4);

// 7. Em 0x5018A0: atualização de fase instantânea na virada (vmov.f32 s18, s2)
Buffer.from('b0ee419a', 'hex').copy(fw, 0x5018a0);

// 8. Em 0x501946: chamar subrotina em 0x5017B4 (bl #0x5017b4)
Buffer.from('fff735ff', 'hex').copy(fw, 0x501946);

// Salvar
fs.writeFileSync(scratchPath, fw);
fs.writeFileSync(outputPath, fw);
console.log('[+] Sucesso! Arquivo gerado em:', outputPath, 'Tamanho:', fw.length);
