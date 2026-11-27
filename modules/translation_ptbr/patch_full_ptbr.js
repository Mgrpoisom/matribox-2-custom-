/**
 * PATCH COMPLETO PT-BR DE PRECISÃO (UTF-8 & LATIN1)
 * Autores: Mgrpoisom & CesarMalak
 */

const fs = require('fs');

const inFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outFile = 'F:\\a-projetos\\matribox 2 custom\\firmware\\modified\\QME-100_PTBR_V1.3.0.bin';

let buffer = fs.readFileSync(inFile);

console.log('=== APLICANDO PATCH COMPLETO PT-BR ===\n');

// 1. Substituir "Español" por "Português" (com acento UTF-8) no slot de 12 bytes em 0x316C11
const offset_lang = 0x316C11;
const ptbr_lang = Buffer.from('Português\0\0', 'utf8'); // 10 + 2 = 12 bytes
ptbr_lang.copy(buffer, offset_lang);
console.log(`[+] [0x${offset_lang.toString(16).toUpperCase()}] Idioma alterado para: "Português"`);

// 2. Substituir "Tiempo de Pant." por "Tempo de Tela" (16 bytes em 0x3168ED)
const offset_tiempo = 0x3168ED;
const tempo_tela = Buffer.from('Tempo de Tela\0\0\0', 'latin1'); // 16 bytes
tempo_tela.copy(buffer, offset_tiempo);
console.log(`[+] [0x${offset_tiempo.toString(16).toUpperCase()}] Alterado para: "Tempo de Tela"`);

// 3. Substituir "Siempre" por "Sempre" (8 bytes em 0x316B5D)
const offset_siempre = 0x316B5D;
const sempre = Buffer.from('Sempre\0\0', 'latin1'); // 8 bytes
sempre.copy(buffer, offset_siempre);
console.log(`[+] [0x${offset_siempre.toString(16).toUpperCase()}] Alterado para: "Sempre"`);

// 4. Aplicar também o dicionário geral das outras telas
const dict = JSON.parse(fs.readFileSync('F:\\a-projetos\\matribox 2 custom\\modules\\translation_ptbr\\ptbr_dict.json', 'utf8'));

Object.keys(dict).forEach(orig => {
    if (orig === 'Español') return; // Já tratado acima com acento correto
    const target = dict[orig];
    const bOrig = Buffer.from(orig, 'latin1');
    const bTarget = Buffer.from(target, 'latin1');

    if (bTarget.length <= bOrig.length) {
        const padded = Buffer.alloc(bOrig.length, 0x20);
        bTarget.copy(padded);
        let pos = 0;
        while ((pos = buffer.indexOf(bOrig, pos)) !== -1) {
            padded.copy(buffer, pos);
            pos += bOrig.length;
        }
    }
});

fs.writeFileSync(outFile, buffer);
console.log(`\n[OK] Firmware 100% atualizado com "Português", "Tempo de Tela" e "Sempre" em:\n -> ${outFile}`);
