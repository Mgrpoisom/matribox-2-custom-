// Aplicador do Pattern Tremolo (1/4 -> 1/8 -> 1/16 guiado pelo Tap Tempo)
// Modifica o modulo "Tremolo" (ID 0x04000021, offset 0x501660) sobre a base PT-BR.
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const scratchOut = 'C:/Users/kalle/.gemini/antigravity/scratch/matribox2-firmware-mod/QME-100_PATTERN_TREM_V1.3.0.bin';

console.log('=== APLICADOR DO PATTERN TREMOLO (1/4 -> 1/8 -> 1/16) ===');
const fw = fs.readFileSync(inputPath);

// 1. Definir Sync padrao como 1.0f (ON) no descritor do Tremolo (0x5016C8)
fw.writeFloatLE(1.0, 0x5016C8);

// 2. Na funcao init (0x501730), zerar o contador de ciclos [0x2024F410] ao carregar o efeito
// Original em 0x501730: 4f f2 0c 40 (movw r0, #0xf40c) -> 4f f2 10 40 (movw r0, #0xf410)
if (fw[0x501732] !== 0x0c) {
  throw new Error('Byte inesperado em 0x501732');
}
fw[0x501732] = 0x10;

// 3. Em 0x501764, substituir 'bne #0x50177a' (09 d1) por 'nop' (00 bf)
// para que o efeito sempre leia o BPM do Tap Tempo em [sp, #0x64]
if (fw.readUInt16LE(0x501764) !== 0xd109) {
  throw new Error('Instrucao inesperada em 0x501764');
}
fw.writeUInt16LE(0xbf00, 0x501764);

// 4. Em 0x501772..0x5017B8: seletor automatico de 3 figuras (4 tempos / 1 compasso cada)
//    + sub-rotina em 0x50179C chamada a cada fim de ciclo do oscilador:
//    - Ciclos 0..3   (4 ciclos  = 4 tempos): s4 = 1.00f (Figura 1: 1/4)
//    - Ciclos 4..11  (8 ciclos  = 4 tempos): s4 = 0.50f (Figura 2: 1/8)
//    - Ciclos 12..27 (16 ciclos = 4 tempos): s4 = 0.25f (Figura 3: 1/16)
const patchBlock = Buffer.from(
  '4ff21042c2f2240213681c2b24bf00231360b7ee002a042b60d3b6ee002a0c2b5cd3b5ee002a59e000bf' +
  'c8bf704700264ff21042c2f22402136801331c2b28bf002313607047',
  'hex'
);
patchBlock.copy(fw, 0x501772);

// 5. Em 0x5018A0: usar a frequencia alvo imediatamente na virada de ciclo (vmov.f32 s18, s2)
// evitando o atraso de 460ms na troca de figura ritmica
Buffer.from('b0ee419a', 'hex').copy(fw, 0x5018A0);

// 6. Em 0x501946: chamar a sub-rotina de fim de ciclo (bl #0x50179c)
Buffer.from('fff729ff', 'hex').copy(fw, 0x501946);

fs.writeFileSync(scratchOut, fw);
console.log('[+] Gerado com sucesso em:', scratchOut, 'Tamanho:', fw.length);
