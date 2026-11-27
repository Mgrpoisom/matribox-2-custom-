/**
 * CONTROLADOR DE CENAS VIA USB-MIDI CC
 * Autores: Mgrpoisom & CesarMalak
 */

const DEFAULT_CC_MAP = {
    WAH: 10,
    COMP: 11,
    DRIVE: 12,
    AMP: 13,
    CAB: 14,
    NR: 15,
    EQ: 16,
    MOD: 17,
    DELAY: 18,
    REVERB: 19
};

const SCENES = {
    "Cena A (Limpo)": { COMP: 127, DRIVE: 0, AMP: 127, CAB: 127, MOD: 127, DELAY: 0, REVERB: 127 },
    "Cena B (Base)":  { COMP: 0, DRIVE: 127, AMP: 127, CAB: 127, MOD: 0, DELAY: 0, REVERB: 0 },
    "Cena C (Solo)":  { COMP: 127, DRIVE: 127, AMP: 127, CAB: 127, MOD: 0, DELAY: 127, REVERB: 127 }
};

console.log('=== CONTROLADOR DE CENAS MATRIBOX II ===');
console.log('Autores: Mgrpoisom & CesarMalak\n');

Object.keys(SCENES).forEach(sceneName => {
    console.log(`[*] ${sceneName}:`);
    const states = SCENES[sceneName];
    Object.keys(states).forEach(block => {
        const val = states[block];
        const status = val > 0 ? 'ON' : 'BYPASS';
        console.log(`    CC ${DEFAULT_CC_MAP[block]}: ${block} -> ${val} (${status})`);
    });
    console.log('');
});
