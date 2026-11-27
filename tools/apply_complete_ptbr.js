/**
 * GERADOR DEFINITIVO DO FIRMWARE 100% PT-BR
 * Autores: Mgrpoisom & CesarMalak
 */

const fs = require('fs');
const path = require('path');

const inFile = 'F:\\a-projetos\\matribox 2 custom\\QME-100_FW_USB_V1.3.0.bin';
const scratchOutFile = 'C:\\Users\\kalle\\.gemini\\antigravity\\scratch\\matribox2-firmware-mod\\firmware\\modified\\QME-100_PTBR_V1.3.0.bin';

const buffer = fs.readFileSync(inFile);

console.log('=== APLICANDO TRADUÇÃO COMPLETA DE 105 TERMOS (PT-BR) ===\n');

// Tabela mestre: [Offset em Hex, Tamanho Total do Slot, Texto em Português]
const masterTable = [
    [0x31665D, 24, "Versao do Firmware\0"],
    [0x316675, 16, "Modo Sel. Banco\0"],
    [0x316685, 12, "ATENCAO!\0"],
    [0x316691, 36, "Processando, nao desligue!\0"],
    [0x3166B5, 16, "Entrada Ch(USB)\0"],
    [0x3166C5, 16, "Saida Ch(USB)\0"],
    [0x3166D5, 16, "Entrada Ch(TRS)\0"],
    [0x3166E5, 16, "Saida Ch(TRS)\0"],
    [0x3166F5, 16, "RecMode(Esq)\0"],
    [0x316705, 16, "RecMode(Dir)\0"],
    [0x316715, 16, "Bateria Preset+\0"],
    [0x316725, 16, "Bateria Preset-\0"],
    [0x316735, 12, "Auto Grav.\0"],
    [0x316741, 16, "Nivel de Mon.\0"],
    [0x3168CD, 16, "Guit. Eletrica\0"],
    [0x3168DD, 16, "Modo de Tela\0"],
    [0x3168ED, 16, "Tempo de Tela\0"],
    [0x3168FD, 16, "Guit. Acustica\0"],
    [0x31690D, 16, "Freq. Banda 1\0"],
    [0x31691D, 20, "Ganho Banda 1\0"],
    [0x316931, 16, "Q de Banda 1\0"],
    [0x316941, 16, "Freq. Banda 2\0"],
    [0x316951, 20, "Ganho Banda 2\0"],
    [0x316965, 16, "Q de Banda 2\0"],
    [0x316975, 16, "Freq. Banda 3\0"],
    [0x316985, 20, "Ganho Banda 3\0"],
    [0x316999, 16, "Q de Banda 3\0"],
    [0x3169A9, 16, "Freq. Banda 4\0"],
    [0x3169B9, 20, "Ganho Banda 4\0"],
    [0x3169CD, 16, "Q de Banda 4\0"],
    [0x3169DD, 60, "Isso apagara dados do usuario.\nTem certeza?\0"],
    [0x316A19, 8,  "LIG/DES\0"],
    [0x316A21, 12, "BATERIA\0"],
    [0x316A2D, 12, "Aux a USB\0"],
    [0x316A39, 12, "Modo USB\0"],
    [0x316A45, 12, "Volume GRAV\0"],
    [0x316A51, 4,  "LIG\0"],
    [0x316A55, 16, "Origem do MIDI\0"],
    [0x316A65, 12, "Ajuste CTRL\0"],
    [0x316A71, 8,  "ESTILO\0"],
    [0x316A79, 8,  "GENERO\0"],
    [0x316A81, 16, "Ajuste de EXP\0"],
    [0x316A91, 8,  "GRAVAR\0"],
    [0x316A99, 12, "AFINADOR\0"],
    [0x316AA5, 16, "Volume REPR\0"],
    [0x316AB5, 20, "Padrao de Fabrica\0"],
    [0x316AC9, 20, "Nivel de Entrada\0"],
    [0x316ADD, 16, "Modo de Entrada\0"],
    [0x316AED, 16, "Entrada/\nSaida\0"],
    [0x316AFD, 12, "Tela LCD\0"],
    [0x316B09, 8,  "Idioma\0"],
    [0x316B11, 8,  "Letra\0"],
    [0x316B19, 24, "Pressione com forca\0"],
    [0x316B31, 12, "Nivel Send\0"],
    [0x316B3D, 12, "FS Duplo\0"],
    [0x316B49, 12, "FS Simples\0"],
    [0x316B55, 8,  "Aguarde\0"],
    [0x316B5D, 8,  "Sempre\0"],
    [0x316B65, 48, "Pressione o pedal totalmente para a frente\0"],
    [0x316B95, 12, "Proximo\0"],
    [0x316BA1, 20, "EXP 2/\nFootswitch\0"],
    [0x316BB5, 16, "Origem do Clock\0"],
    [0x316BC5, 16, "Tempo Global\0"],
    [0x316BD5, 8,  "Serial\0"],
    [0x316BDD, 12, "EQ Global\0"],
    [0x316BE9, 16, "Efeito Atual\0"],
    [0x316BF9, 16, "Cadeia de Sinal\0"],
    [0x316C09, 8,  "Nivel\0"],
    // O IDIOMA: UTF-8 "Português" no slot de 12 bytes
    [0x316C11, 12, "Português\0"],
    [0x316C1D, 8,  "Volume\0"],
    [0x316C25, 16, "Nivel Return\0"],
    [0x316C35, 20, "Nivel de Gravacao\0"],
    [0x316C49, 16, "Informacoes\0"],
    [0x316C59, 12, "Posicao\0"],
    [0x316C65, 48, "Levante o pedal totalmente para o calcanhar\0"],
    [0x316C95, 4,  "Nao\0"],
    [0x316C99, 12, "Mixado\0"],
    [0x316CA5, 12, "Concluido\0"],
    [0x316CB1, 12, "Entendido\0"],
    [0x316CBD, 8,  "Falhou\0"],
    [0x316CC5, 8,  "Modo\0"],
    [0x316CCD, 8,  "Ajuste\0"],
    [0x316CD5, 8,  "Vazio\0"],
    [0x316CDD, 8,  "Inicio\0"],
    [0x316CE5, 12, "Paralelo\0"],
    [0x316CF1, 8,  "Brilho\0"],
    [0x316CF9, 20, "Selecione Modulo\0"],
    [0x316D0D, 8,  "Externo\0"],
    [0x316D15, 68, "DSP Sobrecarregado!\nReorganize melhor seus blocos de efeitos\0"],
    [0x316D59, 12, "Modo Stomp\0"],
    [0x316D65, 12, "Cancelar\0"],
    [0x316D71, 8,  "Parar\0"],
    [0x316D79, 16, "Calibrar EXP\0"],
    [0x316D89, 8,  "Limpar\0"],
    [0x316D91, 8,  "Entrar\0"],
    [0x316D99, 20, "Desfazer/Refazer\0"],
    [0x316DAD, 8,  "Sair\0"],
    [0x316DB5, 16, "Ajuste Botoes\0"],
    [0x316DC5, 12, "Botoes\0"],
    [0x316DD1, 32, "Padrao de fabrica restaurado\0"],
    [0x316DF1, 40, "Sonicake Brasil - Mod Mgrpoisom/Malak\0"],
    [0x316E19, 20, "Volume do Preset\0"],
    [0x316E2D, 20, "Ajuste do Preset\0"],
    [0x316E41, 12, "Modo Preset\0"],
    [0x316E4D, 32, "Pressione PARA p/ entrar §\0"]
];

let count = 0;
masterTable.forEach(([offset, slotSize, text]) => {
    const encoded = text.includes('ê') ? Buffer.from(text, 'utf8') : Buffer.from(text, 'latin1');
    if (encoded.length > slotSize) {
        console.error(`[ALERTA] "${text}" tem ${encoded.length} bytes, excede slot de ${slotSize}!`);
        return;
    }
    const slotBuffer = Buffer.alloc(slotSize, 0);
    encoded.copy(slotBuffer);
    slotBuffer.copy(buffer, offset);
    count++;
});

console.log(`[+] Total de ${count} termos traduzidos injetados!`);
console.log(`[+] "Português" ativo no seletor de idiomas (offset 0x316C11)`);
console.log(`[+] "Tempo de Tela" ativo (offset 0x3168ED)`);
console.log(`[+] "Sempre" ativo (offset 0x316B5D)`);

fs.mkdirSync(path.dirname(scratchOutFile), { recursive: true });
fs.writeFileSync(scratchOutFile, buffer);
console.log(`\n[OK] Arquivo gerado em:\n -> ${scratchOutFile}`);
