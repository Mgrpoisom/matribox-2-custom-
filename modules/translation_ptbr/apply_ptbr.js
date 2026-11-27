/**
 * APLICADOR DE TRADUÇÃO PT-BR COM GUARDRAILS ESTRITOS
 * Autores: Mgrpoisom & CesarMalak
 */

const fs = require('fs');
const path = require('path');

function applyPtBrTranslation(inputFile, outputFile, dictFile) {
    console.log('====================================================');
    console.log('    APLICADOR DE TRADUÇÃO PT-BR (GUARDRAIL NÍVEL 1) ');
    console.log('    Autores: Mgrpoisom & CesarMalak                 ');
    console.log('====================================================\n');

    if (!fs.existsSync(inputFile)) {
        console.error(`[-] Arquivo não encontrado: ${inputFile}`);
        return false;
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

        // Preenche exatamente o tamanho com espaços ou nulos para não deslocar a memória
        const paddedTarget = Buffer.alloc(origBuffer.length, 0x20); // Espaços
        targetBuffer.copy(paddedTarget);

        // Se original terminava com \0, manter \0 no final
        let pos = 0;
        while ((pos = buffer.indexOf(origBuffer, pos)) !== -1) {
            console.log(`[+] Substituindo em 0x${pos.toString(16).toUpperCase()}: "${originalStr}" -> "${targetStr}"`);
            paddedTarget.copy(buffer, pos);
            patchedCount++;
            pos += origBuffer.length;
        }
    });

    console.log(`\n[OK] Total de strings aplicadas: ${patchedCount}`);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, buffer);
    console.log(`[+] Novo firmware gerado em:\n -> ${outputFile}`);
    return true;
}

const inFw = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outFw = 'F:\\a-projetos\\matribox 2 custom\\firmware\\modified\\QME-100_PTBR_V1.3.0.bin';
const dict = path.join(__dirname, 'ptbr_dict.json');

applyPtBrTranslation(inFw, outFw, dict);
