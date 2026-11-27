const fs = require('fs');
const path = require('path');

function parseHTFW(filePath, outputDir) {
    console.log(`[*] Carregando contêiner HTFW: ${filePath}`);
    const buffer = fs.readFileSync(filePath);

    // Checagem de Magic Header
    const magic = buffer.toString('ascii', 0, 4);
    if (magic !== 'HTFW') {
        console.error(`[-] Magic header inválido: esperado HTFW, encontrado ${magic}`);
        return;
    }

    console.log('[+] Magic Header Válido: HTFW (Hotone Firmware Container)');

    const totalSize = buffer.readUInt32LE(8);
    const model = buffer.toString('ascii', 12, 28).replace(/\0/g, '').trim();
    const vMajor = buffer[28];
    const vMinor = buffer[29];
    const vPatch = buffer[30];
    const vBuild = buffer[31];
    const versionStr = `${vMajor}.${vMinor}.${vPatch}.${vBuild}`;

    const payloadSize = buffer.readUInt32LE(0x24);

    console.log(`[+] Modelo de Hardware: ${model}`);
    console.log(`[+] Versão do Firmware: V${versionStr}`);
    console.log(`[+] Tamanho Total:      ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`[+] Tamanho do Payload: ${payloadSize} bytes`);

    // A tabela de partições começa no offset 0x40 (cada entrada tem 16 bytes)
    // Estrutura de cada entrada:
    // [0..3]:   Offset no payload (uint32 LE)
    // [4..7]:   Tamanho da partição (uint32 LE)
    // [8..11]:  Flags / ID / Checksum
    // [12..15]: Endereço de destino / Flash Target
    console.log('\n--- Tabela de Partições (Partitions / Modules) ---');
    const partitions = [];
    let pOffset = 0x40;

    // Os dados brutos das partições começam logo após o cabeçalho (após 0x80)
    // Vamos verificar se o offset é relativo ao início do arquivo ou ao início do payload (0x80 ou 0x100)
    const dataStartOffset = 0x80; // Padrão Hotone HTFW v1

    for (let i = 0; i < 8; i++) {
        const offset = buffer.readUInt32LE(pOffset);
        const size = buffer.readUInt32LE(pOffset + 4);
        const flags = buffer.readUInt32LE(pOffset + 8);
        const targetAddr = buffer.readUInt32LE(pOffset + 12);

        if (size === 0 || offset === 0xFFFFFFFF || pOffset + 16 > buffer.length) {
            break;
        }

        partitions.push({
            index: i,
            relativeOffset: offset,
            fileOffset: dataStartOffset + offset,
            size: size,
            flags: '0x' + flags.toString(16).padStart(8, '0').toUpperCase(),
            targetAddr: '0x' + targetAddr.toString(16).padStart(8, '0').toUpperCase()
        });

        pOffset += 16;
        // Se a próxima entrada for 0xFFFFFFFF, terminamos
        if (buffer.readUInt32LE(pOffset) === 0xFFFFFFFF) break;
    }

    console.table(partitions);

    fs.mkdirSync(outputDir, { recursive: true });

    // Salva metadados do cabeçalho em JSON
    const metadata = {
        magic,
        model,
        version: versionStr,
        totalSize,
        payloadSize,
        headerRawHex: buffer.slice(0, dataStartOffset).toString('hex'),
        partitions: partitions.map(p => ({
            index: p.index,
            offset: p.relativeOffset,
            fileOffset: p.fileOffset,
            size: p.size,
            flags: p.flags,
            targetAddr: p.targetAddr
        }))
    };

    fs.writeFileSync(path.join(outputDir, 'htfw_metadata.json'), JSON.stringify(metadata, null, 2));

    // Extrai cada partição
    partitions.forEach(p => {
        const start = p.fileOffset;
        const end = start + p.size;
        if (end <= buffer.length) {
            const partData = buffer.slice(start, end);
            const partName = `partition_${p.index}_target_${p.targetAddr}_size_${(p.size/1024).toFixed(0)}KB.bin`;
            const outPath = path.join(outputDir, partName);
            fs.writeFileSync(outPath, partData);
            console.log(`[+] Partição ${p.index} salva em: ${partName} (${(p.size/1024).toFixed(2)} KB)`);
        } else {
            console.warn(`[!] Aviso: Partição ${p.index} ultrapassa o final do arquivo!`);
        }
    });

    console.log('\n[OK] Descompactação HTFW finalizada com sucesso!');
}

const args = process.argv.slice(2);
const fwFile = args[0] || 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outDir = args[1] || 'F:\\a-projetos\\matribox 2 custom\\firmware\\extracted';

parseHTFW(fwFile, outDir);
