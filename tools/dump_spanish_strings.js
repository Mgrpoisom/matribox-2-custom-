const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

const start = 0x316900;
const end = 0x317400;
const slice = buffer.slice(start, end);

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

console.log('=== STRINGS EM ESPANHOL (0x316900 a 0x317400) ===');
strings.slice(0, 80).forEach((s, idx) => {
    console.log(`[${idx.toString().padStart(3, '0')}] "${s}"`);
});
