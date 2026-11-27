/**
 * BUILD DEFINITIVO: PATTERN TREMOLO PÊNDULO (SQUARE PAN) + STEREO VU + PT-BR
 * Autores: Mgrpoisom & CesarMalak
 * Sonicake Matribox II (QME-100) Custom Firmware Toolkit
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');

const repo = 'F:\\a-projetos\\matribox 2 custom';
const baseFile = path.join(repo, 'firmware', 'modified', 'QME-100_PTBR_V1.3.0.bin');
const stockFile = path.join(repo, 'QME-100_FW_USB_V1.3.0.bin');

const outStereoVu = path.join(repo, 'firmware', 'modified', 'QME-100_FW_STEREO_VU_BETA.bin');
const outPatternTrem = path.join(repo, 'firmware', 'modified', 'QME-100_PATTERN_TREM_V1.3.0.bin');
const dlStereoVu = 'F:\\Downloads\\QME-100_FW_STEREO_VU_BETA.bin';
const dlPatternTrem = 'F:\\Downloads\\QME-100_PATTERN_TREM_V1.3.0.bin';

const EXPECTED_SIZE = 5447156;

console.log('====================================================================');
console.log('BUILD DEFINITIVO: PATTERN TREMOLO PÊNDULO SQUARE PAN + STEREO VU');
console.log('Autores: Mgrpoisom & CesarMalak');
console.log('====================================================================');

if (!fs.existsSync(baseFile)) {
  console.error('[-] Erro: Arquivo base PT-BR não encontrado:', baseFile);
  process.exit(1);
}
if (!fs.existsSync(stockFile)) {
  console.error('[-] Erro: Arquivo stock de referência não encontrado:', stockFile);
  process.exit(1);
}

const fw = fs.readFileSync(baseFile);
const stock = fs.readFileSync(stockFile);
console.log(`[+] Base carregada: ${baseFile} (${fw.length} bytes)`);

if (fw.length !== EXPECTED_SIZE) {
  console.error(`[-] Erro: Tamanho da base inválido! Atual: ${fw.length}, Esperado: ${EXPECTED_SIZE}`);
  process.exit(1);
}

// 1. Verificar integridade HTFW
const magic = fw.slice(0, 4).toString('ascii');
const model = fw.slice(12, 19).toString('ascii');
const p0Header = fw.slice(0x80, 0x84).toString('ascii');
if (magic !== 'HTFW' || !model.startsWith('QME-100') || p0Header !== 'V130') {
  console.error(`[-] Erro: Cabeçalho HTFW inválido! magic=${magic}, model=${model}, p0=${p0Header}`);
  process.exit(1);
}

// 2. Conferir TODOS os bytes originais esperados antes de aplicar qualquer patch
console.log('\n--- Verificando bytes originais da base PT-BR contra fábrica ---');
function assertHex(offset, expectedHex, label) {
  const len = expectedHex.length / 2;
  const actual = fw.slice(offset, offset + len).toString('hex');
  const stockHex = stock.slice(offset, offset + len).toString('hex');
  if (actual !== expectedHex || stockHex !== expectedHex) {
    console.error(`[-] MISMATCH em ${label} (0x${offset.toString(16)}): atual=${actual}, stock=${stockHex}, esperado=${expectedHex}`);
    process.exit(1);
  }
  console.log(`[✓] ${label} (0x${offset.toString(16)}): ${actual}`);
}

function assertMatchesStock(offset, len, label) {
  const actual = fw.slice(offset, offset + len).toString('hex');
  const stockHex = stock.slice(offset, offset + len).toString('hex');
  if (actual !== stockHex) {
    console.error(`[-] MISMATCH vs stock em ${label} (0x${offset.toString(16)}, ${len}B): base=${actual}, stock=${stockHex}`);
    process.exit(1);
  }
  console.log(`[✓] ${label} (0x${offset.toString(16)}, ${len}B): 100% igual ao stock (${actual.slice(0, 24)}...)`);
}

// Verificações Partição 3 (Tremolo)
assertHex(0x5016c8, '00000000', 'Tremolo Sync default (0.0f)');
assertHex(0x501732, '0c', 'Tremolo init offset byte (0x0c)');
assertHex(0x501764, '09d1', 'Tremolo Sync bne #0x50177a');
assertMatchesStock(0x501772, 78, 'Tremolo Rate comparison chain (0x501772..0x5017bf)');
assertMatchesStock(0x5018a0, 4, 'Tremolo smoothed period load (0x5018a0)');
assertHex(0x501946, 'd8bf0026', 'Tremolo cycle wrap it le; movle r6, #0');
assertHex(0x501988, '83f9223f', 'Tremolo waveshape scale s17 (2/pi = 0.6366f)');

// Verificações Partição 0 (Stereo VU)
assertHex(0x301d8, '0844', 'DSP OUT L mono sum add r0, r1');
assertHex(0x301ee, '0069b84949690844', 'DSP Pair 2 sum');

// 3. Aplicar Patch Pattern Tremolo Pêndulo Automático (Square Pan: 1/4 -> 1/8 -> 1/16 -> 1/8 -> 1/4)
// Mantém 100% dos descritores e nomes originais dos knobs (Depth, Rate, Sync)
console.log('\n--- Aplicando Patch Pattern Tremolo Pêndulo (Square Pan) ---');

// 3.1 Sync padrão = 1.0f (ON) no descritor (0x5016c8)
fw.writeFloatLE(1.0, 0x5016c8);
console.log('[+] 0x5016c8: Sync default = 1.0f (ON)');

// 3.2 Zerar contador de ciclos [0x2024F410] na função init (0x501732)
fw[0x501732] = 0x10;
console.log('[+] 0x501732: Contador 0x2024F410 zerado no init');

// 3.3 Em 0x501764: NOP para sempre ler BPM do Tap Tempo
fw.writeUInt16LE(0xbf00, 0x501764);
console.log('[+] 0x501764: NOP em bne (leitura contínua do Tap Tempo)');

// 3.4 Máquina de estados Pêndulo (36 ciclos = 1/4 -> 1/8 -> 1/16 -> 1/8 -> 1/4) + sub-rotina em 0x5017a4
const pendulumHex =
  '4ff21042c2f224021368242b24bf00231360b7ee002a042b60d3b6ee002a0c2b5cd3b5ee002a1c2b58d3b6ee002a55e000bf' +
  'c8bf704700264ff21042c2f2240213680133242b28bf002313607047';
const pendulumBuf = Buffer.from(pendulumHex, 'hex');
if (pendulumBuf.length !== 78) {
  console.error(`[-] Erro interno: tamanho de pendulumBuf (${pendulumBuf.length}) != 78`);
  process.exit(1);
}
pendulumBuf.copy(fw, 0x501772);
console.log('[+] 0x501772..0x5017bf: Máquina de estados Pêndulo (78 bytes) + sub-rotina em 0x5017a4');

// 3.5 Em 0x5018a0: atualização imediata na virada de figura (vmov.f32 s18, s2)
Buffer.from('b0ee419a', 'hex').copy(fw, 0x5018a0);
console.log('[+] 0x5018a0: Transição imediata de figura (vmov.f32 s18, s2)');

// 3.6 Em 0x501946: chamar sub-rotina de fim de ciclo (bl #0x5017a4)
Buffer.from('fff72dff', 'hex').copy(fw, 0x501946);
console.log('[+] 0x501946: Chamada bl #0x5017a4 aplicada');

// 3.7 Em 0x501988: alterar s17 para 2.5f (Square Pan waveshape sem estalos)
fw.writeFloatLE(2.5, 0x501988);
console.log('[+] 0x501988: Square Pan waveshape ativo (s17 = 2.5f)');

// 4. Aplicar Patch Stereo VU DSP Core (Partição 0)
console.log('\n--- Aplicando Patch Stereo VU no DSP Core (Partição 0) ---');
fw[0x301d8] = 0x00;
fw[0x301d9] = 0xbf;
Buffer.from('406800bf00bf00bf', 'hex').copy(fw, 0x301ee);
console.log('[+] 0x301d8 (NOP OUT L) e 0x301ee (OUT R Pair 2) aplicados');

// 5. Conferir tamanho final
if (fw.length !== EXPECTED_SIZE) {
  console.error(`[-] Erro: Tamanho final alterado! Atual: ${fw.length}, Esperado: ${EXPECTED_SIZE}`);
  process.exit(1);
}

// 6. Gravar binários no repositório e em Downloads
fs.writeFileSync(outStereoVu, fw);
fs.writeFileSync(outPatternTrem, fw);
const sha256 = crypto.createHash('sha256').update(fw).digest('hex').toUpperCase();
console.log(`\n[+] Salvo: ${outStereoVu}`);
console.log(`[+] Salvo: ${outPatternTrem}`);
console.log(`[+] Tamanho final: ${fw.length} bytes (SHA-256: ${sha256})`);

fs.copyFileSync(outStereoVu, dlStereoVu);
fs.copyFileSync(outPatternTrem, dlPatternTrem);
console.log(`[+] Copiado para Downloads: ${dlStereoVu}`);
console.log(`[+] Copiado para Downloads: ${dlPatternTrem}`);

// 7. Validar ambos os arquivos com tools/guardrail.js
console.log('\n--- Executando Validação Guardrail ---');
const guardrailScript = path.join(repo, 'tools', 'guardrail.js');
console.log(cp.execSync(`node "${guardrailScript}" "${outStereoVu}"`, { encoding: 'utf8' }));
console.log(cp.execSync(`node "${guardrailScript}" "${outPatternTrem}"`, { encoding: 'utf8' }));

// 8. Commit e Push no GitHub
console.log('\n--- Publicando no GitHub (origin main) ---');
cp.execSync(
  `git -C "${repo}" add firmware/modified/QME-100_FW_STEREO_VU_BETA.bin firmware/modified/QME-100_PATTERN_TREM_V1.3.0.bin tools/build_final_stereo_vu.js`,
  { stdio: 'inherit' }
);

const stagedDiff = cp.execSync(`git -C "${repo}" diff --cached --name-only`, { encoding: 'utf8' }).trim();
if (stagedDiff) {
  cp.execSync(
    `git -C "${repo}" commit -m "feat(dsp): Pendulum Pattern Tremolo Square Pan (1/4-1/8-1/16-1/8-1/4) + Stereo VU + PT-BR by Mgrpoisom & CesarMalak"`,
    { stdio: 'inherit' }
  );
  cp.execSync(`git -C "${repo}" push origin main`, { stdio: 'inherit' });
} else {
  console.log('[*] Nenhuma alteração nova pendente no staging do Git.');
}

console.log('\n[✓✓✓] CONCLUÍDO! BUILD, GUARDRAIL, DOWNLOADS E GITHUB 100% ATUALIZADOS.');
