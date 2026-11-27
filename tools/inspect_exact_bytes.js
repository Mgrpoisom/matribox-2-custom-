const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

const offsets = [
    { name: 'Español (UTF-8)', offset: 0x316C11, len: 12 },
    { name: 'Tiempo de Pant.', offset: 0x3168ED, len: 16 },
    { name: 'Siempre', offset: 0x316B5D, len: 8 },
    { name: 'Modo de Pant.', offset: 0x3168E5, len: 14 }
];

offsets.forEach(item => {
    const slice = buffer.slice(item.offset, item.offset + item.len);
    const hex = Array.from(slice).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
    console.log(`${item.name}: [0x${item.offset.toString(16).toUpperCase()}] ${hex} | "${slice.toString('latin1')}"`);
});
