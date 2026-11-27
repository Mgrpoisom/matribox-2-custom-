/**
 * HTFW REPACKER & BUILDER
 * Autores: Mgrpoisom & CesarMalak
 * 
 * Reconstrói o contêiner HTFW a partir das 4 partições e valida a integridade.
 */

const fs = require('fs');
const path = require('path');

function repackHTFW(partitions, outputFile, model = 'QME-100', version = [86, 1, 3, 0]) {
    console.log('====================================================');
    console.log('       REEMPACOTADOR DE FIRMWARE HTFW               ');
    console.log('       Autores: Mgrpoisom & CesarMalak              ');
    console.log('====================================================\n');

    if (partitions.length !== 4) {
        console.error(`[-] Erro: Esperado exatamente 4 partições, recebido ${partitions.length}`);
        return false;
    }

    const header = Buffer.alloc(128, 0);

    // 1. Magic Header
    header.write('HTFW', 0, 4, 'ascii');

    // 2. Flags / Build id original
    header.writeUInt32LE(0x00016737, 4);

    // 3. Modelo (16 bytes em 0x0C)
    header.write(model, 12, 16, 'ascii');

    // 4. Versão (4 bytes em 0x1C)
    header[28] = version[0];
    header[29] = version[1];
    header[30] = version[2];
    header[31] = version[3];

    // 5. Constantes de cabeçalho
    header.writeUInt32LE(0x00040000, 32);

    // 6. Montar tabela de partições em 0x40
    let currentRelativeOffset = 0;
    let pTableOffset = 0x40;

    const defaultFlags = [0x01001912, 0x02001735, 0x10001FED, 0xFFFFFFFF];
    const defaultTargets = [0x00700000, 0x004E0000, 0x00500000, 0xFFFFFFFF];

    partitions.forEach((partBuffer, idx) => {
        const size = partBuffer.length;
        const flags = defaultFlags[idx];
        const target = defaultTargets[idx];

        header.writeUInt32LE(currentRelativeOffset, pTableOffset);
        header.writeUInt32LE(size, pTableOffset + 4);
        header.writeUInt32LE(flags, pTableOffset + 8);
        header.writeUInt32LE(target, pTableOffset + 12);

        console.log(`[+] Partição ${idx}: Offset 0x${(currentRelativeOffset + 128).toString(16).toUpperCase()} | Tamanho: ${size} bytes (${(size/1024).toFixed(1)} KB) | Target: 0x${target.toString(16).padStart(8, '0').toUpperCase()}`);

        currentRelativeOffset += size;
        pTableOffset += 16;
    });

    // 7. Escrever tamanhos totais
    const payloadSize = currentRelativeOffset;
    const totalSize = 128 + payloadSize;

    header.writeUInt32LE(totalSize, 8);
    header.writeUInt32LE(payloadSize, 0x24);

    console.log(`\n[+] Tamanho do Payload: ${payloadSize} bytes`);
    console.log(`[+] Tamanho Total:      ${totalSize} bytes`);

    // 8. Concatenar tudo
    const finalBuffer = Buffer.concat([header, ...partitions]);

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, finalBuffer);

    console.log(`\n[OK] Firmware reempacotado com sucesso em:\n -> ${outputFile}`);
    return true;
}

module.exports = { repackHTFW };
