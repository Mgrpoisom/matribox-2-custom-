const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function calculateEntropy(buffer) {
    if (!buffer || buffer.length === 0) return 0;
    const freqs = new Array(256).fill(0);
    for (let i = 0; i < buffer.length; i++) {
        freqs[buffer[i]]++;
    }
    let entropy = 0;
    const len = buffer.length;
    for (let i = 0; i < 256; i++) {
        if (freqs[i] > 0) {
            const p = freqs[i] / len;
            entropy -= p * Math.log2(p);
        }
    }
    return entropy;
}

function findZlibStreams(buffer) {
    const streams = [];
    const maxScan = Math.min(buffer.length - 4, 10 * 1024 * 1024);
    for (let i = 0; i < maxScan; i++) {
        if (buffer[i] === 0x78 && (buffer[i+1] === 0x01 || buffer[i+1] === 0x9C || buffer[i+1] === 0xDA)) {
            try {
                const decompressed = zlib.inflateSync(buffer.slice(i, Math.min(buffer.length, i + 4 * 1024 * 1024)));
                if (decompressed.length > 64) {
                    streams.push({ offset: i, decompressedLength: decompressed.length, data: decompressed });
                    i += 16; // Skip forward a bit
                }
            } catch (e) {
                // Not valid zlib stream
            }
        }
    }
    return streams;
}

function inspectFirmware(filePath, outDir) {
    console.log(`[*] Analisando arquivo: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error(`[-] Arquivo não encontrado: ${filePath}`);
        return;
    }

    const data = fs.readFileSync(filePath);
    console.log(`[+] Tamanho total do arquivo: ${data.length} bytes (${(data.length / 1024).toFixed(2)} KB)`);

    const entropy = calculateEntropy(data.slice(0, Math.min(data.length, 65536)));
    console.log(`[+] Entropia inicial (64KB): ${entropy.toFixed(2)} / 8.00`);

    console.log('\n--- Header Hexdump (primeiros 128 bytes) ---');
    for (let i = 0; i < Math.min(128, data.length); i += 16) {
        const slice = data.slice(i, i + 16);
        const hex = Array.from(slice).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
        const ascii = Array.from(slice).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
        console.log(`${i.toString(16).padStart(4, '0').toUpperCase()}:  ${hex.padEnd(48, ' ')}  |${ascii}|`);
    }

    console.log('\n[*] Procurando assinaturas e strings...');
    const text = data.toString('latin1');
    const matches = text.match(/[\x20-\x7e]{4,}/g) || [];
    const keywords = ['sonicake', 'matribox', 'qme', 'valeton', 'dsp', 'drive', 'delay', 'reverb', 'amp', 'cab', 'nam'];
    const foundKeywords = new Set();
    matches.forEach(m => {
        const lower = m.toLowerCase();
        if (keywords.some(k => lower.includes(k))) {
            foundKeywords.add(m);
        }
    });

    console.log(`[+] Total de strings legíveis encontradas: ${matches.length}`);
    console.log(`[+] Strings relevantes encontradas: ${foundKeywords.size}`);
    Array.from(foundKeywords).slice(0, 30).forEach(kw => console.log(`    - ${kw}`));

    console.log('\n[*] Escaneando por blocos compactados (zlib)...');
    const zlibBlocks = findZlibStreams(data);
    if (zlibBlocks.length > 0) {
        console.log(`[+] Encontrados ${zlibBlocks.length} blocos zlib descompactáveis!`);
        fs.mkdirSync(outDir, { recursive: true });
        zlibBlocks.forEach((block, idx) => {
            console.log(`    Bloco ${idx}: Offset 0x${block.offset.toString(16).toUpperCase()} -> ${block.decompressedLength} bytes descompactados`);
            const outPath = path.join(outDir, `section_${idx}_0x${block.offset.toString(16).toUpperCase()}.bin`);
            fs.writeFileSync(outPath, block.data);
            console.log(`    -> Salvo em: ${outPath}`);
        });
    } else {
        console.log('[-] Nenhum bloco zlib direto encontrado.');
    }

    // Salva strings dump
    fs.mkdirSync(outDir, { recursive: true });
    const stringsDumpPath = path.join(outDir, 'strings_dump.txt');
    fs.writeFileSync(stringsDumpPath, matches.join('\n'), 'utf8');
    console.log(`\n[+] Dump completo de todas as strings salvo em: ${stringsDumpPath}`);
}

const args = process.argv.slice(2);
const firmwarePath = args[0] || 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const outDirectory = args[1] || 'F:\\a-projetos\\matribox 2 custom\\firmware\\extracted';

inspectFirmware(firmwarePath, outDirectory);
