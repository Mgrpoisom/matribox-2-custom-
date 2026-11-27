const fs = require('fs');

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const buffer = fs.readFileSync(fwFile);

console.log('=== RASTREANDO MOTOR DE TAP TEMPO POR MATEMÁTICA DE BPM (60000ms) ===\n');

// 60000 em uint16 LE: [0x60, 0xEA]
// 60000 em uint32 LE: [0x60, 0xEA, 0x00, 0x00]
// 60000.0f em IEEE 754: [0x00, 0x60, 0x6A, 0x47]

const p0 = buffer.slice(128, 3264516);

function findMatches(pattern, desc) {
    let pos = 0;
    const matches = [];
    while ((pos = p0.indexOf(pattern, pos)) !== -1) {
        matches.push(pos);
        pos += pattern.length;
    }
    console.log(`[${desc}]: ${matches.length} ocorrências`);
    return matches;
}

const uint32Matches = findMatches(Buffer.from([0x60, 0xEA, 0x00, 0x00]), 'UInt32 60000');
const floatMatches = findMatches(Buffer.from([0x00, 0x60, 0x6A, 0x47]), 'Float 60000.0f');

console.log('\nAnalisando ocorrências do cálculo de BPM (UInt32 60000):');
uint32Matches.forEach(off => {
    const fileOff = 128 + off;
    const slice = buffer.slice(fileOff - 16, fileOff + 32);
    console.log(`[0x${fileOff.toString(16).toUpperCase()}] ${slice.toString('hex').match(/../g).join(' ')}`);
});
