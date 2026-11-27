// Aplicador do Pattern Tremolo Configurável (Fig 1, Fig 2 e Fig 3 nos Knobs)
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outputPath = path.join(__dirname, '..', 'firmware', 'modified', 'QME-100_PATTERN_TREM_V1.3.0.bin');
const scratchPath = 'C:/Users/kalle/.gemini/antigravity/scratch/matribox2-firmware-mod/QME-100_PATTERN_TREM_V1.3.0.bin';

console.log('=== APLICANDO PATTERN TREMOLO CONFIGURÁVEL (FIG 1, FIG 2, FIG 3) ===');
const fw = fs.readFileSync(inputPath);

// 1. Modificar o descritor do Tremolo em 0x501660
// Título aponta para Tremolo\0 em 0x82 + 0x24 = 0xa6
fw.writeUInt32LE(0xa6, 0x501674);
fw.writeUInt32LE(0xa6, 0x501678);

// Param 0: Fig 1 (nameIdx: 0x94, min: 0, max: 10, step: 1, def: 4 [1/4], flags: 0x2212ff00)
fw.writeUInt32LE(0x94, 0x501688);
fw.writeFloatLE(0.0, 0x50168c);
fw.writeFloatLE(10.0, 0x501690);
fw.writeFloatLE(1.0, 0x501694);
fw.writeFloatLE(4.0, 0x501698);
fw.writeUInt32LE(0x2212ff00, 0x50169c);

// Param 1: Fig 2 (nameIdx: 0x9a, min: 0, max: 11 [11=OFF], step: 1, def: 7 [1/8], flags: 0x2212ff01)
fw.writeUInt32LE(0x9a, 0x5016a0);
fw.writeFloatLE(0.0, 0x5016a4);
fw.writeFloatLE(11.0, 0x5016a8);
fw.writeFloatLE(1.0, 0x5016ac);
fw.writeFloatLE(7.0, 0x5016b0);
fw.writeUInt32LE(0x2212ff01, 0x5016b4);

// Param 2: Fig 3 (nameIdx: 0xa0, min: 0, max: 11 [11=OFF], step: 1, def: 10 [1/16], flags: 0x2212ff02)
fw.writeUInt32LE(0xa0, 0x5016b8);
fw.writeFloatLE(0.0, 0x5016bc);
fw.writeFloatLE(11.0, 0x5016c0);
fw.writeFloatLE(1.0, 0x5016c4);
fw.writeFloatLE(10.0, 0x5016c8);
fw.writeUInt32LE(0x2212ff02, 0x5016cc);

// Strings em 0x5016d0:
// Fig 1\0Fig 2\0Fig 3\0Tremolo\0\0\0 (28 bytes)
Buffer.from('Fig 1\0Fig 2\0Fig 3\0Tremolo\0\0\0', 'ascii').copy(fw, 0x5016d0);

// 2. Na função init (0x501730), zerar contador de passo [0x2024F410] e ciclos [0x2024F414]
fw[0x501732] = 0x10;

// 3. Em 0x50174c..0x501766: injetar seletor do passo ativo
// mov r4, r1 | vmov.f32 s0, #1.0 | movw r0, #0xf410 | movt r0, #0x2024
// ldr r3, [r0] | add.w r3, r2, r3, lsl #2 | vldr s2, [r3] | nop
const stepLoader = Buffer.from('0c46b7ee000a4ff21040c2f22400036802eb830393ed001a00bf', 'hex');
stepLoader.copy(fw, 0x50174c);

// 4. Em 0x501764: NOP bne para sempre ler o Tap Tempo
fw.writeUInt16LE(0xbf00, 0x501764);

// 5. Em 0x5018A0: usar frequência alvo imediatamente na virada de ciclo
Buffer.from('b0ee419a', 'hex').copy(fw, 0x5018A0);

// 6. Sub-rotina de ciclo em 0x50179c e chamada em 0x501946
// bl #0x50179c
Buffer.from('fff729ff', 'hex').copy(fw, 0x501946);

// Subrotina em 0x50179C: incrementa ciclo, alterna 0 -> 1 -> 2
// e reinicia se atingir passo desligado
const subRoutine = Buffer.from(
  '4ff21042c2f2240213680133032b28bf002313607047',
  'hex'
);
subRoutine.copy(fw, 0x50179c);

// Salvar
fs.writeFileSync(scratchPath, fw);
fs.writeFileSync(outputPath, fw);
console.log('[+] Sucesso! Arquivo gerado em:', outputPath, 'Tamanho:', fw.length);
