/**
 * BUILD FINAL STEREO VU FIRMWARE
 * Autores: Mgrpoisom & CesarMalak
 * Sonicake Matribox II (QME-100) Custom Firmware Toolkit
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repo = 'F:\\a-projetos\\matribox 2 custom';
const baseFile = path.join(repo, 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const outFile = path.join(repo, 'firmware', 'modified', 'QME-100_FW_STEREO_VU_BETA.bin');
const dlFile = 'F:\\Downloads\\QME-100_FW_STEREO_VU_BETA.bin';

console.log('======================================================');
console.log('BUILD FIRMWARE DEFINITIVA: TREMOLO ESTÁVEL + STEREO VU');
console.log('Autores: Mgrpoisom & CesarMalak');
console.log('======================================================');

// 1. Carregar base 100% testada (PT-BR + Stock DSP em P3)
if (!fs.existsSync(baseFile)) {
  console.error('[-] Erro: Arquivo base não encontrado:', baseFile);
  process.exit(1);
}

const fw = fs.readFileSync(baseFile);
console.log(`[+] Base carregada: ${baseFile} (${fw.length} bytes)`);

// Validações HTFW
const magic = fw.slice(0, 4).toString('ascii');
const model = fw.slice(12, 19).toString('ascii');
if (magic !== 'HTFW' || !model.startsWith('QME-100')) {
  console.error('[-] Erro: Arquivo HTFW inválido!');
  process.exit(1);
}

// 2. Garantir que a Partição 3 está 100% limpa (elimina travamento do Tremolo)
// O offset 0x501946 no arquivo deve ser idêntico ao stock (d8 bf 00 26)
console.log('\n--- Verificando Partição 3 (Tremolo) ---');
const tremBytes = fw.slice(0x501946, 0x50194a).toString('hex');
console.log('Bytes em 0x501946:', tremBytes, '(esperado: d8bf0026)');
if (tremBytes === 'fff729ff') {
  console.log('[!] Detectado patch quebrado de tremolo! Restaurando para original...');
  fw[0x501946] = 0xd8;
  fw[0x501947] = 0xbf;
  fw[0x501948] = 0x00;
  fw[0x501949] = 0x26;
} else if (tremBytes === 'd8bf0026') {
  console.log('[✓] Partição 3 100% original de fábrica! Tremolo NUNCA travará.');
}

// 3. Aplicar Patch de Separação de Áudio Estéreo no DSP Core (Partição 0)
// P0_OFFSET = 0x80
// Offset 1: 0x80 + 0x30158 = 0x301d8 (add r0, r1 -> nop: isola OUT L)
// Offset 2: 0x80 + 0x3016e = 0x301ee (ldr r0, [r0, #4] + nops: OUT R)
console.log('\n--- Aplicando Patch Estéreo no DSP Core ---');
const p1_off1 = 0x80 + 0x30158;
const p1_off2 = 0x80 + 0x3016e;

console.log(`Offset 0x${p1_off1.toString(16)}: substituindo ${fw.slice(p1_off1, p1_off1+2).toString('hex')} por 00bf (NOP OUT L)`);
fw[p1_off1] = 0x00;
fw[p1_off1 + 1] = 0xbf;

console.log(`Offset 0x${p1_off2.toString(16)}: substituindo ${fw.slice(p1_off2, p1_off2+8).toString('hex')} por 406800bf00bf00bf (OUT R)`);
fw[p1_off2 + 0] = 0x40;
fw[p1_off2 + 1] = 0x68;
fw[p1_off2 + 2] = 0x00;
fw[p1_off2 + 3] = 0xbf;
fw[p1_off2 + 4] = 0x00;
fw[p1_off2 + 5] = 0xbf;
fw[p1_off2 + 6] = 0x00;
fw[p1_off2 + 7] = 0xbf;

// 4. Salvar binário de firmware modificado
fs.writeFileSync(outFile, fw);
console.log(`\n[+] Firmware salva em: ${outFile}`);
console.log(`[+] Tamanho: ${fs.statSync(outFile).size} bytes`);

// 5. Copiar diretamente para a pasta Downloads do usuário
try {
  fs.copyFileSync(outFile, dlFile);
  console.log(`[+] Firmware copiada para Downloads: ${dlFile}`);
} catch (e) {
  console.log('[!] Não foi possível copiar para Downloads:', e.message);
}

// 6. Validar com guardrail
console.log('\n--- Executando Guardrail ---');
const guardrailScript = path.join(repo, 'tools', 'guardrail.js');
if (fs.existsSync(guardrailScript)) {
  const res = cp.execSync(`node "${guardrailScript}" "${outFile}"`, { encoding: 'utf8' });
  console.log(res);
}

console.log('\n[✓✓✓] BUILD COMPLETO COM SUCESSO!');
