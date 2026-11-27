const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

const terms = ['Español', 'Espa', 'Siempre', 'Tiempo', 'Pant', 'Auto CAB', 'Footswitch'];

console.log('=== BUSCA DOS TERMOS DA FOTO NO FIRMWARE ===\n');

terms.forEach(term => {
    let pos = 0;
    const found = [];
    // Buscar tanto latin1 quanto utf8
    const bTerm = Buffer.from(term, 'latin1');
    while ((pos = buffer.indexOf(bTerm, pos)) !== -1) {
        found.push(pos);
        pos += bTerm.length;
    }
    console.log(`Termo "${term}": ${found.length} ocorrências`);
    found.forEach(offset => {
        const start = Math.max(0, offset - 10);
        const end = Math.min(buffer.length, offset + term.length + 20);
        const snippet = buffer.slice(start, end).toString('latin1').replace(/[\x00-\x1F]/g, '.');
        console.log(`   [0x${offset.toString(16).toUpperCase()}] ...${snippet}...`);
    });
});
