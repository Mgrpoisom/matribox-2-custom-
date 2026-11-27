# Ferramentas de Engenharia Reversa Utilizadas

Projeto de **Mgrpoisom & CesarMalak**.

## Capstone (via `capstone-wasm`) — desmontador ARM Thumb-2

* **O que é:** [Capstone](https://www.capstone-engine.org/) é uma biblioteca de desmontagem (disassembly) de código de máquina. Usamos o pacote npm **`capstone-wasm`** (v1.0.3), que roda em WebAssembly e **não precisa compilar nada nativo**.
* **Para que usamos:** transformar os bytes do firmware da Matribox II (processador ARM Cortex-M com unidade de ponto flutuante VFP) em instruções legíveis, para entender o código dos efeitos (ex.: `Tremolo`) antes de qualquer patch.
* **Script:** [`tools/disasm_thumb.js`](../tools/disasm_thumb.js)

### Instalação
```
npm install
```
*(No Windows, se o PowerShell bloquear o `npm.ps1`, use `npm.cmd install`.)*

### Uso
```
node tools/disasm_thumb.js <offset_hex> <tamanho_hex> [arquivo.bin]
npm run disasm -- 5016ec 200
```
O offset é o do **arquivo completo** `QME-100_FW_USB_V1.3.0.bin`, não o da Partição 0.

### Exemplo: função de processamento do `Tremolo`
`npm run disasm -- 501744 230` mostra o laço de áudio do tremolo (leitura de BPM, escolha da figura rítmica e fase do oscilador).

## Outras ferramentas
* **Node.js** (v22): todos os scripts de `tools/` e `modules/`.
* **Ghidra** (planejado para análises maiores): ver [`GHIDRA_SETUP.md`](GHIDRA_SETUP.md).

> [!NOTE]
> Nenhum binário é alterado por estas ferramentas. Elas só **leem** o firmware. Todo patch gerado continua obrigado a passar pelo `guardrail.js`.
