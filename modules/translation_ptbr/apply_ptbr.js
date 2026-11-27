/**
 * APLICADOR DE TRADUÇÃO PT-BR COM GUARDRAILS
 * Autores: Mgrpoisom & CesarMalak
 * 
 * Regra: Null-Padding estrito para não alterar nenhum ponteiro de memória.
 */

const fs = require('fs');
const path = require('path');

function applyPtBrTranslation(inputFile, outputFile, dictFile) {
    console.log('=== APLICADOR DE TRADUÇÃO PT-BR (GUARDRAIL NÍVEL 1) ===\n');
    console.log(`[*] Arquivo de entrada: ${inputFile}`);
    console.log(`[*] Dicionário:         ${dictFile}`);

    if (!fs.existsSync(inputFile)) {
        console.error(`[-] Arquivo não encontrado: ${inputFile}`);
        return;
    }

    const dict = JSON.parse(fs.readFileSync(dictFile, 'utf8'));
    let buffer = fs.readFileSync(inputFile);
    let patchedCount = 0;

    Object.keys(dict).forEach(originalStr => {
        const targetStr = dict[originalStr];
        const origBuffer = Buffer.from(originalStr, 'latin1');
        const targetBuffer = Buffer.from(targetStr, 'latin1');

        if (targetBuffer.length > origBuffer.length) {
            console.error(`[GUARDRAIL BLOQUEOU] Tradução "${targetStr}" tem ${targetBuffer.length} bytes, maior que o original (${origBuffer.length} bytes). Risco de corrupção evitado!`);
            return;
        }

        // Preenche com bytes nulos para manter o tamanho idêntico
        const paddedTarget = Buffer.alloc(origBuffer.length, 0);
        targetBuffer.copy(paddedTarget);

        let pos = 0;
        while ((pos = buffer.indexOf(origBuffer, pos)) !== -1) {
            console.log(`[+] Substituindo em 0x${pos.toString(16).toUpperCase()}: "${originalStr}" -> "${targetStr}"`);
            paddedTarget.copy(buffer, pos);
            patchedCount++;
            pos += origBuffer.length;
        }
    });

    console.log(`\n[OK] Total de strings traduzidas: ${patchedCount}`);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, buffer);
    console.log(`[+] Novo firmware gerado em: ${outputFile}`);
}

const inFw = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outFw = 'F:\\a-projetos\\matribox 2 custom\\firmware\\modified\\QME-100_PTBR_V1.3.0.bin';
const dict = path.join(__dirname, 'ptbr_dict.json');

applyPtBrTranslation(inFw, outFw, dict);
