// Desmontador ARM Thumb-2 (Cortex-M, com VFP) usando Capstone (capstone-wasm).
// Uso:  node tools/disasm_thumb.js <offset_hex> <tamanho_hex> [arquivo.bin]
// Ex.:  node tools/disasm_thumb.js 5016ec 200
// O offset é o do ARQUIVO do firmware completo (HTFW), não o da Partição 0.
// Autores: Mgrpoisom & CesarMalak
const fs = require('fs');
const path = require('path');
const { Capstone, Const, loadCapstone } = require('capstone-wasm');

(async () => {
  const start = parseInt(process.argv[2], 16);
  const len = parseInt(process.argv[3], 16);
  const file = process.argv[4] ||
    path.join(__dirname, '..', 'QME-100_FW_USB_V1.3.0.bin');

  if (Number.isNaN(start) || Number.isNaN(len)) {
    console.error('Uso: node tools/disasm_thumb.js <offset_hex> <tamanho_hex> [arquivo.bin]');
    process.exit(1);
  }

  await loadCapstone();
  const fw = fs.readFileSync(file);
  const cs = new Capstone(Const.CS_ARCH_ARM, Const.CS_MODE_THUMB | Const.CS_MODE_MCLASS);
  const ins = cs.disasm(fw.subarray(start, start + len), { address: start });
  for (const i of ins) {
    console.log(i.address.toString(16) + ': ' + i.mnemonic + ' ' + i.opStr);
  }
  cs.close();
})();
