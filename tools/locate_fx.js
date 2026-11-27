const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

const partitions = [
    { id: 0, start: 128, size: 3264516, desc: 'Core Firmware & DSP Code' },
    { id: 1, start: 3264644, size: 258048, desc: 'UI & Bitmap Display Resources' },
    { id: 2, start: 3522692, size: 131072, desc: 'Factory Presets & Config' },
    { id: 3, start: 3653764, size: 1793400, desc: 'FX Tables, IRs & Audio Data' }
];

console.log('=== MAPEAMENTO DE STRINGS POR PARTIÇÃO ===\n');

partitions.forEach(p => {
    const slice = buffer.slice(p.start, p.start + p.size);
    const text = slice.toString('latin1');
    const matches = text.match(/[\x20-\x7e]{4,}/g) || [];
    
    // Testar presença de termos
    const hasGreenDrive = text.includes('GreenDrive');
    const hasDelay = text.includes('Delay');
    const hasStomp = text.includes('Stomp Mode');
    const hasSonicake = text.includes('Sonicake');
    
    console.log(`Partição ${p.id} (${p.desc}):`);
    console.log(`   Offset: 0x${p.start.toString(16).toUpperCase()} | Tamanho: ${(p.size/1024).toFixed(1)} KB`);
    console.log(`   Strings totais: ${matches.length}`);
    console.log(`   GreenDrive: ${hasGreenDrive} | Delay: ${hasDelay} | Stomp: ${hasStomp} | Sonicake: ${hasSonicake}`);
    
    // Se tiver GreenDrive, mostre amostras de efeitos
    if (hasGreenDrive) {
        const fxList = matches.filter(m => m.endsWith('Drive') || m.endsWith('Dist') || m.endsWith('Amp') || m.includes('Delay') || m.includes('Reverb'));
        console.log(`   -> Exemplos de Efeitos nesta partição (${fxList.length}):`);
        fxList.slice(0, 15).forEach(fx => console.log(`      * ${fx}`));
    }
    console.log('');
});
