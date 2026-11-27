const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

const startOffset = 0x316600;
const endOffset = 0x317000;
const slice = buffer.slice(startOffset, endOffset);

console.log('=== LISTA COMPLETA DOS 132 TERMOS DA TABELA ===\n');

let i = 0;
let index = 0;
while (i < slice.length) {
    while (i < slice.length && slice[i] === 0) i++;
    if (i >= slice.length) break;

    const strStart = i;
    while (i < slice.length && slice[i] !== 0) i++;
    const strEnd = i;

    const rawBytes = slice.slice(strStart, strEnd);
    if (rawBytes.length >= 2) {
        let nullCount = 0;
        while (i < slice.length && slice[i] === 0) {
            nullCount++;
            i++;
        }
        const totalSlot = rawBytes.length + nullCount;
        const fileOffset = '0x' + (startOffset + strStart).toString(16).toUpperCase();
        const text = rawBytes.toString('utf8');

        console.log(`${index.toString().padStart(3, '0')}|${fileOffset}|${totalSlot}|${text}`);
        index++;
    }
}
