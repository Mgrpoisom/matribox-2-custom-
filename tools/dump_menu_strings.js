const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

// Vamos pegar o bloco de texto entre 0x314C00 e 0x317500
const start = 0x314C00;
const end = 0x317500;
const slice = buffer.slice(start, end);

// Extrair todas as strings terminadas em null (\0)
const strings = [];
let current = [];
for (let i = 0; i < slice.length; i++) {
    const b = slice[i];
    if (b === 0) {
        if (current.length >= 3) {
            strings.push(Buffer.from(current).toString('latin1'));
        }
        current = [];
    } else if (b >= 32 && b <= 126 || b >= 160 && b <= 255) {
        current.push(b);
    } else {
        current = [];
    }
}

console.log(`=== ENCONTRADAS ${strings.length} STRINGS NO BLOCO DE MENUS ===\n`);
console.log('Amostra de termos originais dos menus da pedaleira:');
strings.slice(0, 60).forEach((s, idx) => {
    console.log(`[${idx.toString().padStart(3, '0')}] "${s}"`);
});
