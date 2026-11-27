const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

console.log('=== ANÁLISE DETALHADA DAS PARTIÇÕES (QME-100 V1.3.0) ===\n');

// Partição 0: 128 até 128 + 3264516
const p0_start = 128;
const p0_size = 3264516;
const p0 = buffer.slice(p0_start, p0_start + p0_size);

console.log(`Partição 0 (Core / DSP): ${p0.length} bytes`);
const p0_text = p0.toString('latin1');
const p0_matches = p0_text.match(/[\x20-\x7e]{4,}/g) || [];

console.log(`Total de strings em P0: ${p0_matches.length}`);

// Procurar por cadeias e blocos de efeito
const fxKeywords = ['wah', 'comp', 'drive', 'dist', 'amp', 'cab', 'eq', 'mod', 'chorus', 'flanger', 'delay', 'reverb', 'preset', 'scene', 'footswitch'];
const foundFx = {};

p0_matches.forEach(str => {
    const lower = str.toLowerCase();
    fxKeywords.forEach(k => {
        if (lower.includes(k) && str.length < 32 && !str.includes('http') && !str.includes('/') && !str.includes('\\')) {
            if (!foundFx[k]) foundFx[k] = new Set();
            foundFx[k].add(str);
        }
    });
});

console.log('\n--- Categorias e Módulos Encontrados no Core (P0) ---');
Object.keys(foundFx).forEach(cat => {
    const items = Array.from(foundFx[cat]).slice(0, 10);
    console.log(`[${cat.toUpperCase()}] (${foundFx[cat].size} encontrados):`);
    items.forEach(it => console.log(`   - ${it}`));
});

// Partição 2: Presets de Fábrica
const p2_start = 3522692;
const p2_size = 131072;
const p2 = buffer.slice(p2_start, p2_start + p2_size);
console.log(`\nPartição 2 (Presets / Config): ${p2.length} bytes`);
const p2_text = p2.toString('latin1');
const p2_presets = p2_text.match(/[A-Z0-9\s]{4,16}/g) || [];
const uniquePresets = Array.from(new Set(p2_presets)).filter(p => p.trim().length >= 4).slice(0, 20);
console.log('Exemplos de Presets de Fábrica em P2:');
uniquePresets.forEach(p => console.log(`   * ${p.trim()}`));
