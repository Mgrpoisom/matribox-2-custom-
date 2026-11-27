/**
 * HTFW PARSER & EXTRACTOR
 * Autores: Mgrpoisom & CesarMalak
 */

const fs = require('fs');
const path = require('path');

function parseHTFW(filePath, outputDir) {
    console.log(`[*] Carregando contêiner HTFW: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error(`[-] Arquivo não encontrado: ${filePath}`);
        return;
    }
    const buffer = fs.readFileSync(filePath);

    const magic = buffer.toString('ascii', 0, 4);
    if (magic !== 'HTFW') {
        console.error(`[-] Magic header inválido: esperado HTFW, encontrado ${magic}`);
        return;
    }

    const totalSize = buffer.readUInt32LE(8);
    const model = buffer.toString('ascii', 12, 28).replace(/\0/g, '').trim();
    const vMajor = buffer[28];
    const vMinor = buffer[29];
    const vPatch = buffer[30];
    const vBuild = buffer[31];

    console.log(`[+] Modelo: ${model} | Versão: V${vMajor}.${vMinor}.${vPatch}.${vBuild}`);
    console.log(`[+] Tamanho Total: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);

    const partitions = [
        { id: 0, offset: 0, fileOffset: 128, size: 3264516, desc: 'Core Firmware & DSP Code', targetAddr: '0x00700000' },
        { id: 1, offset: 3264516, fileOffset: 3264644, size: 258048, desc: 'UI & Bitmap Resources', targetAddr: '0x004E0000' },
        { id: 2, offset: 3522564, fileOffset: 3522692, size: 131072, desc: 'Factory Presets & Config', targetAddr: '0x00500000' },
        { id: 3, offset: 3653636, fileOffset: 3653764, size: 1793400, desc: 'FX Tables & Audio Data', targetAddr: '0xFFFFFFFF' }
    ];

    console.table(partitions);
}

const fwFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
parseHTFW(fwFile, 'F:\\a-projetos\\matribox 2 custom\\firmware\\extracted');
