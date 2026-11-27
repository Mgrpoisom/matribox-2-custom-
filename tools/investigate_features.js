const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

console.log('=== INVESTIGAÇÃO DE IDIOMAS NO FIRMWARE (QME-100) ===\n');

// Vamos procurar blocos de texto multilíngue
const languages = ['English', 'Deutsch', 'Italiano', 'Español', 'Français', 'Português'];
const samplePhrases = [
    'Todos los Derechos',
    'Tutti i diritti',
    'Alle Rechte',
    'Footswitch',
    'Reset',
    'Settings',
    'Preset'
];

samplePhrases.forEach(phrase => {
    let pos = 0;
    const found = [];
    while ((pos = buffer.indexOf(phrase, pos)) !== -1) {
        found.push(pos);
        pos += phrase.length;
    }
    console.log(`Frase "${phrase}": encontrada em ${found.length} locais`);
    found.slice(0, 5).forEach(offset => {
        // Exibir contexto ao redor da string (64 bytes antes e depois)
        const start = Math.max(0, offset - 16);
        const end = Math.min(buffer.length, offset + phrase.length + 32);
        const snippet = buffer.slice(start, end).toString('latin1').replace(/[\x00-\x1F]/g, '.');
        console.log(`   [0x${offset.toString(16).toUpperCase()}] ...${snippet}...`);
    });
});

console.log('\n=== INVESTIGAÇÃO DE TREMOLO NO FIRMWARE ===\n');
const tremoloTerms = ['Tremolo', 'tremolo', 'TREMOLO', 'Opto', 'Bias', 'Sine', 'Square', 'Pattern', 'Ramp', 'LFO'];
tremoloTerms.forEach(term => {
    let pos = 0;
    const found = [];
    while ((pos = buffer.indexOf(term, pos)) !== -1) {
        found.push(pos);
        pos += term.length;
    }
    if (found.length > 0) {
        console.log(`Termo "${term}": ${found.length} ocorrências`);
        found.slice(0, 4).forEach(offset => {
            const start = Math.max(0, offset - 10);
            const end = Math.min(buffer.length, offset + term.length + 20);
            const snippet = buffer.slice(start, end).toString('latin1').replace(/[\x00-\x1F]/g, '.');
            console.log(`   [0x${offset.toString(16).toUpperCase()}] ...${snippet}...`);
        });
    }
});
