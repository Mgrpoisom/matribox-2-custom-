# Guia de Configuração da Partição 0 no Ghidra

Este guia documenta o procedimento exato para carregar e descompilar o binário principal da **Sonicake Matribox II (QME-100)** no **Ghidra**.

---

## 🛠️ Requisitos
* **Ghidra** (versão 10.x ou 11.x - gratuito em [ghidra-sre.org](https://ghidra-sre.org/))
* **Java JDK 17+**

---

## 📂 Arquivo para Análise
O arquivo extraído está localizado em:
`firmware/extracted/partition_0_core_dsp.bin` (Tamanho: `3.264.516 bytes` / ~3,11 MB)

---

## ⚙️ Parâmetros de Importação no Ghidra

Ao criar um novo projeto no Ghidra e arrastar o arquivo `partition_0_core_dsp.bin`, configure exatamente estes parâmetros:

1. **Format:** `Raw Binary`
2. **Language:**
   * Processor: **ARM**
   * Variant: **v7** (ou v7T)
   * Endianness: **Little Endian**
   * Address Size: **32-bit**
   * *(String de identificação: `ARM:LE:32:v7`)*
3. **Options (Botão "Options..." antes de importar):**
   * **Block Name:** `.text`
   * **Base Address:** `00700000` *(Hexadecimal)*
   * **File Offset:** `0`
   * **Length:** `3264516` (automático)

---

## 🔍 Alvos Principais para Engenharia Reversa

Com o projeto aberto e o auto-analysis concluído:

1. **Rotinas de Footswitches e LEDs:**
   * Procurar por referências aos offsets `0x313FF5` (`FS1`) e `0x314001` (`FS2`).
   * Rastrear a função de timer de interrupção do Tap Tempo para isolar o registrador do LED sem tocar na GUI.
2. **Matriz de Validação de Blocos de Efeito (Dual Mod):**
   * Localizar a função que valida a seleção de blocos (evitando colocar 2 modulações ou 2 delays).
   * Identificar o ponto de retorno condicional (`CMP / BNE`) para aplicar o patch de desbloqueio.
3. **Modo Cenas (Scene Mode):**
   * Rastrear como a pedaleira lê o estado de bypass dos blocos no preset ativo em RAM.
