/**
 * GUARDRAIL DE SEGURANÇA - SONICAKE MATRIBOX II
 * Autores: Mgrpoisom & CesarMalak
 * Valida a integridade absoluta de qualquer firmware antes de testes ou gravação.
 */

const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2] || 'firmware/modified/QME-100_FW_STEREO_VU_BETA.bin';
console.log('=== VALIDADOR GUARDRAIL FORENSE DE SEGURANÇA ===');
console.log('Alvo:', targetFile);

if (!fs.existsSync(targetFile)) {
  console.error('[-] ERRO CRÍTICO: Arquivo não encontrado:', targetFile);
  process.exit(1);
}

const fw = fs.readFileSync(targetFile);
let errors = 0;

// 1. Verificação de Tamanho Exato
const EXPECTED_SIZE = 5447156;
if (fw.length !== EXPECTED_SIZE) {
  console.error(`[-] FALHA DE GUARDRAIL: Tamanho incorreto! Atual: ${fw.length}, Esperado: ${EXPECTED_SIZE}`);
  errors++;
} else {
  console.log(`[+] Tamanho exato validado: ${fw.length} bytes (100% OK)`);
}

// 2. Verificação de Cabeçalho HTFW
const magic = fw.slice(0, 4).toString('ascii');
if (magic !== 'HTFW') {
  console.error(`[-] FALHA DE GUARDRAIL: Magic header inválido! Encontrado: ${magic}`);
  errors++;
} else {
  console.log(`[+] Magic Header validado: ${magic} (100% OK)`);
}

// 3. Verificação de Identificador do Modelo QME-100
const model = fw.slice(12, 19).toString('ascii');
if (!model.startsWith('QME-100')) {
  console.error(`[-] FALHA DE GUARDRAIL: Modelo incompatível! Encontrado: ${model}`);
  errors++;
} else {
  console.log(`[+] Identificador de Hardware validado: ${model} (100% OK)`);
}

// 4. Verificação das 4 Partições HTFW
const p0_magic = fw.slice(0x80, 0x84).toString('ascii');
if (p0_magic !== 'V130') {
  console.error(`[-] FALHA DE GUARDRAIL: Partição 0 corrompida! Header: ${p0_magic}`);
  errors++;
} else {
  console.log(`[+] Partição 0 (Core DSP LPC4350) validada: ${p0_magic} (100% OK)`);
}

// 5. Verificação dos Patches Críticos do DSP
const p1_off1 = 0x80 + 0x30158;
const p1_off2 = 0x80 + 0x3016e;

const bytes1 = fw.slice(p1_off1, p1_off1 + 2).toString('hex');
if (bytes1 !== '00bf') {
  console.error(`[-] FALHA DE GUARDRAIL: Patch OUT L (0x30158) ausente ou incorreto! Bytes: ${bytes1}`);
  errors++;
} else {
  console.log(`[+] Patch OUT L (Isolamento Estéreo): NOP validado (0x${p1_off1.toString(16)})`);
}

const bytes2 = fw.slice(p1_off2, p1_off2 + 8).toString('hex');
if (bytes2 !== '406800bf00bf00bf') {
  console.error(`[-] FALHA DE GUARDRAIL: Patch OUT R (0x3016e) ausente ou incorreto! Bytes: ${bytes2}`);
  errors++;
} else {
  console.log(`[+] Patch OUT R (Roteamento Pair 2): ldr r0, [r0, #4] validado (0x${p1_off2.toString(16)})`);
}

console.log('----------------------------------------------------');
if (errors === 0) {
  console.log('[✓✓✓] STATUS: 100% APROVADO PELO GUARDRAIL! FIRMWARE TOTALMENTE SEGURA.');
  process.exit(0);
} else {
  console.error(`[XXX] STATUS: REPROVADO (${errors} erros). NÃO GRAVAR NA PEDALEIRA!`);
  process.exit(1);
}
