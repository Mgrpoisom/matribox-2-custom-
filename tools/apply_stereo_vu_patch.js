/**
 * PATCH ESTÉREO VU METERS (OUT L / OUT R) + DSP %
 * Autores: Mgrpoisom & CesarMalak
 * Sonicake Matribox II (QME-100) Custom Firmware Toolkit
 */

const fs = require('fs');
const path = require('path');

const inFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outDir = 'F:\\a-projetos\\matribox 2 custom\\firmware\\modified';
const outFile = path.join(outDir, 'QME-100_FW_STEREO_VU_BETA.bin');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('=== APLICANDO PATCH STEREO VU METERS (OUT L / OUT R) ===');
console.log('Arquivo de entrada:', inFile);

const fw = fs.readFileSync(inFile);
const P0_FILE_OFFSET = 0x80; // Partition 0 starts at 0x80 in HTFW

// 1. Verificar integridade da firmware original
const magic = fw.slice(0, 4).toString('ascii');
const model = fw.slice(12, 19).toString('ascii');
if (magic !== 'HTFW' || !model.startsWith('QME-100')) {
  console.error('[-] Erro: firmware inválida ou incompatível!');
  process.exit(1);
}
console.log(`[+] Firmware válida: ${magic}, Modelo: ${model}, Tamanho: ${fw.length} bytes`);

// 2. PATCH 1: Separação de canais L e R no DSP
// Offset em P0: 0x30158 -> Offset no arquivo HTFW: 0x80 + 0x30158 = 0x301d8
const p1_off1 = P0_FILE_OFFSET + 0x30158;
const p1_off2 = P0_FILE_OFFSET + 0x3016e;

console.log(`\n--- Aplicando Patch 1 (Separação OUT L / OUT R no DSP) ---`);
console.log(`Offset 1: 0x${p1_off1.toString(16)} (P0: 0x30158)`);
const original1 = fw.slice(p1_off1, p1_off1 + 2);
console.log('  Original:', original1.toString('hex'), '(esperado: 0844 [add r0, r1])');

if (original1.toString('hex') !== '0844') {
  console.error('[-] Bytes originais divergentes no offset 1!');
  process.exit(1);
}

// Substitui 'add r0, r1' (08 44) por 'nop' (00 bf)
// r0 permanece puro OUT L!
fw[p1_off1] = 0x00;
fw[p1_off1 + 1] = 0xbf;
console.log('  [+] Patch 1.1 aplicado: NOP em add r0, r1 (OUT L isolado)');

console.log(`Offset 2: 0x${p1_off2.toString(16)} (P0: 0x3016e)`);
const original2 = fw.slice(p1_off2, p1_off2 + 8);
console.log('  Original:', original2.toString('hex'), '(esperado: 0069b84949690844)');

if (original2.toString('hex') !== '0069b84949690844') {
  console.error('[-] Bytes originais divergentes no offset 2!');
  process.exit(1);
}

// Substitui:
// ldr r0, [r0, #0x10] -> ldr r0, [r0, #0x04] (carrega OUT R diretamente: 40 68)
// seguido de 3 x NOP (00 bf 00 bf 00 bf)
// O valor de OUT R é gravado no slot de nível do canal 2 (0x2025922c)
fw[p1_off2 + 0] = 0x40; // ldr r0, [r0, #4]
fw[p1_off2 + 1] = 0x68;
fw[p1_off2 + 2] = 0x00; // nop
fw[p1_off2 + 3] = 0xbf;
fw[p1_off2 + 4] = 0x00; // nop
fw[p1_off2 + 5] = 0xbf;
fw[p1_off2 + 6] = 0x00; // nop
fw[p1_off2 + 7] = 0xbf;
console.log('  [+] Patch 1.2 aplicado: ldr r0, [r0, #4] + NOPs (OUT R roteado para Pair 2)');

// 3. Salvar firmware modificada
fs.writeFileSync(outFile, fw);
console.log(`\n[+] Firmware gerada com sucesso: ${outFile}`);
console.log(`[+] Tamanho: ${fs.statSync(outFile).size} bytes (idêntico ao original: ${fw.length})`);
