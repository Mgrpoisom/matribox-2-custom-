/**
 * VALIDADOR DE GUARDRAILS ANTI-BRICK
 * Autores: Mgrpoisom & CesarMalak
 * 
 * Checa rigorosamente qualquer binário modificado antes de permitir o flash.
 */

const fs = require('fs');
const path = require('path');

const EXPECTED_SPECS = {
    TOTAL_SIZE: 5447156,
    MAGIC: 'HTFW',
    MODEL: 'QME-100',
    PAYLOAD_SIZE: 5447036,
    DATA_START_OFFSET: 0x80,
    PARTITIONS: [
        { id: 0, offset: 0, size: 3264516, targetAddr: '0x00700000' },
        { id: 1, offset: 3264516, size: 258048, targetAddr: '0x004E0000' },
        { id: 2, offset: 3522564, size: 131072, targetAddr: '0x00500000' },
        { id: 3, offset: 3653636, size: 1793400, targetAddr: '0xFFFFFFFF' }
    ]
};

function validateFirmware(filePath) {
    console.log('====================================================');
    console.log('       VALIDAÇÃO DE GUARDRAILS ANTI-BRICK          ');
    console.log('       Projeto: Matribox II Custom Firmware         ');
    console.log('       Autores: Mgrpoisom & CesarMalak              ');
    console.log('====================================================\n');

    if (!fs.existsSync(filePath)) {
        console.error(`[ERRO FATAL] Arquivo não encontrado: ${filePath}`);
        return false;
    }

    const buffer = fs.readFileSync(filePath);
    let passed = true;

    // 1. Checagem de Tamanho Total Exato
    console.log(`[*] Checando tamanho total do arquivo...`);
    if (buffer.length !== EXPECTED_SPECS.TOTAL_SIZE) {
        console.error(`[FALHA] Tamanho do arquivo inválido!`);
        console.error(`   Esperado: ${EXPECTED_SPECS.TOTAL_SIZE} bytes`);
        console.error(`   Obtido:   ${buffer.length} bytes (Diferença: ${buffer.length - EXPECTED_SPECS.TOTAL_SIZE})`);
        passed = false;
    } else {
        console.log(`[OK] Tamanho total 100% íntegro: ${buffer.length} bytes.`);
    }

    // 2. Checagem do Magic Header
    const magic = buffer.toString('ascii', 0, 4);
    if (magic !== EXPECTED_SPECS.MAGIC) {
        console.error(`[FALHA] Magic Header inválido! Esperado: ${EXPECTED_SPECS.MAGIC}, Obtido: ${magic}`);
        passed = false;
    } else {
        console.log(`[OK] Magic Header HTFW verificado com sucesso.`);
    }

    // 3. Checagem do Modelo
    const model = buffer.toString('ascii', 12, 28).replace(/\0/g, '').trim();
    if (model !== EXPECTED_SPECS.MODEL) {
        console.error(`[FALHA] Modelo inválido! Esperado: ${EXPECTED_SPECS.MODEL}, Obtido: ${model}`);
        passed = false;
    } else {
        console.log(`[OK] Modelo compatível: ${model}.`);
    }

    // 4. Checagem dos Offsets das Partições
    console.log(`[*] Validando alinhamento e offsets de partições...`);
    let pOffset = 0x40;
    for (let i = 0; i < EXPECTED_SPECS.PARTITIONS.length; i++) {
        const expected = EXPECTED_SPECS.PARTITIONS[i];
        const actualOffset = buffer.readUInt32LE(pOffset);
        const actualSize = buffer.readUInt32LE(pOffset + 4);
        const actualTarget = '0x' + buffer.readUInt32LE(pOffset + 12).toString(16).padStart(8, '0').toUpperCase();

        if (actualOffset !== expected.offset || actualSize !== expected.size || actualTarget !== expected.targetAddr) {
            console.error(`[FALHA] Partição ${i} corrompida ou deslocada!`);
            console.error(`   Esperado: Offset ${expected.offset}, Size ${expected.size}, Target ${expected.targetAddr}`);
            console.error(`   Obtido:   Offset ${actualOffset}, Size ${actualSize}, Target ${actualTarget}`);
            passed = false;
        } else {
            console.log(`   [OK] Partição ${i}: Alinhada em 0x${(expected.offset + 0x80).toString(16).toUpperCase()} (${(expected.size/1024).toFixed(0)} KB)`);
        }
        pOffset += 16;
    }

    console.log('\n----------------------------------------------------');
    if (passed) {
        console.log('[STATUS: APROVADO] O arquivo atende a todos os guardrails.');
        console.log('O risco de brick estrutural está ELIMINADO para este pacote.');
        console.log('----------------------------------------------------');
        return true;
    } else {
        console.error('[STATUS: REPROVADO] O arquivo VIOLA os guardrails de segurança.');
        console.error('NUNCA envie este arquivo para a pedaleira.');
        console.error('----------------------------------------------------');
        return false;
    }
}

const targetFile = process.argv[2] || 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
validateFirmware(targetFile);
