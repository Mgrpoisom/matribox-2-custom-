/**
 * MAPEADOR E INSPETOR DE ALGORITMOS DE TREMOLO
 * Autores: Mgrpoisom & CesarMalak
 */

const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';

function inspectTremolo() {
    console.log('=== INSPETOR DE PARÂMETROS DE TREMOLO (QME-100) ===\n');
    if (!fs.existsSync(fwFile)) {
        console.error(`[-] Arquivo não encontrado: ${fwFile}`);
        return;
    }

    const buffer = fs.readFileSync(fwFile);

    const tremolos = [
        { name: 'Sweet Tremolo', offset: 0x36048C },
        { name: 'Synth Tremolo', offset: 0x36A48C },
        { name: 'AC Tremolo',    offset: 0x36F489 },
        { name: 'Bias Trem',     offset: 0x50340B },
        { name: 'Sine Trem',     offset: 0x501F1B }
    ];

    console.log('Algoritmos de Tremolo mapeados na ROM:');
    tremolos.forEach(t => {
        const header = buffer.slice(t.offset - 16, t.offset + 32);
        console.log(`[0x${t.offset.toString(16).toUpperCase()}] ${t.name}`);
    });

    console.log('\nFormas de onda do oscilador LFO disponíveis:');
    console.log(' - Sine (Senoidal)');
    console.log(' - Square (Quadrada / Slicer)');
    console.log(' - Cone (Triangular)');
    console.log(' - Ramp (Rampa para aceleração automática)');
    console.log(' - Reverse (Rampa invertida)');
    console.log('\n[OK] Mapeamento concluído.');
}

inspectTremolo();
