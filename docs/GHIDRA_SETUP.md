# Guia de Configuração da Partição 0 no Ghidra (Sonicake Matribox II)

Este guia documenta o procedimento exato para carregar, descompilar e mapear o binário principal da **Sonicake Matribox II (QME-100)** no **Ghidra**, com base na identificação de hardware confirmada (**Microcontrolador ARM Cortex-M / STM32**).

---

## 🛠️ Requisitos
* **Ghidra** (versão 10.x ou 11.x - gratuito em [ghidra-sre.org](https://ghidra-sre.org/))
* **Java JDK 17+**

---

## 📂 Arquivo para Análise
O arquivo extraído está localizado em:
`firmware/extracted/partition_0_core_dsp.bin` (Tamanho: `3.264.516 bytes` / ~3,11 MB)

---

## ⚙️ Parâmetros Exatos de Importação no Ghidra

Ao criar um novo projeto no Ghidra e arrastar o arquivo `partition_0_core_dsp.bin`, configure exatamente estes parâmetros:

1. **Format:** `Raw Binary`
2. **Language:**
   * Processor: **ARM**
   * Variant: **Cortex** (ou **v7E-M** / **v7**)
   * Endianness: **Little Endian**
   * Address Size: **32-bit**
   * *(String de identificação: `ARM:LE:32:Cortex` ou `ARM:LE:32:v7`)*
3. **Options (Botão "Options..." antes de importar):**
   * **Block Name:** `.text`
   * **Base Address:** `00000000` *(Hexadecimal)*
   * **File Offset:** `32` *(ou `0x20` em hex - descarta o cabeçalho "V130" de 32 bytes para alinhar o Vetor de Interrupções no offset 0x0)*
   * **Length:** `3264484`

---

## 🗺️ Mapa de Memória e Vetores Confirmados

O firmware utiliza periféricos padrão STM32:
* **0x00000000**: Vetor de Reset (`0x00000471` -> código em `0x00000470`)
* **0x0000003C**: Vetor SysTick (`0x0000C1AD` -> rotina em `0x0000C1AC`)
* **0x20008000**: Top of Stack (RAM do Cortex-M)
* **0x20258BA4**: Variável global do contador de milissegundos (`msTicks`)
* **0x40010000**: Periférico **TIM1** (Temporizador PWM de alta resolução / Controle de LED)
* **0x40000000**: Periférico **TIM2** (Temporizador de eventos)
* **0x40005400**: Periférico **I2C1**
* **0x40003800**: Periférico **SPI2**

---

## 🔍 Alvos Principais para Engenharia Reversa (Caminho A - LED Branco)

1. **Rotina de PWM do LED do Footswitch 2:**
   * Localizar as escritas nos registradores de comparação de canal do timer (`TIM1->CCR1`, `CCR2`, `CCR3` ou `TIM2`).
   * No Tap Tempo, a cor atual é **Amarelo** (`Vermelho + Verde`). Para transformá-la em **Branco Puro**, precisamos ativar o canal **Azul** no mesmo ciclo de acendimento.
   
2. **Desacoplamento do LCD:**
   * Rotinas de interface gráfica (telas, caixas modais e popups) ficam na faixa `0x40BA0` - `0x40D00`. **NÃO alterar bytes nessa região** para não introduzir caixas escuras na tela.
