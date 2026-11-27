# 📦 Central de Downloads & Histórico de Versões de Firmware

Aqui você encontra os links de download direto das imagens de firmware modificadas e testadas pelo time do projeto (**Mgrpoisom & CesarMalak**).

> [!IMPORTANT]
> Todos os arquivos listados abaixo passam obrigatoriamente pela validação do script `guardrail.js` antes de serem disponibilizados. Sempre confira o hash SHA-256 antes de gravar na sua pedaleira.

---

## 🚀 Tabela de Downloads Diretos (.bin)

| Versão | Codinome | O que traz incluído | Tamanho | Status Guardrail | Link de Download Direto (.bin) |
|---|---|---|---|---|---|
| **v1.3.0-PTBR-v1.1** | *Tradução Definitiva* | Tradução completa dos 105 termos + Seletor **Português** ativo. | `5.447.156 bytes` | ✅ Testado em Hardware | [📥 Baixar QME-100_PTBR_V1.3.0.bin](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_PTBR_V1.3.0.bin) |
| **v1.3.0-WHITELED-v1.2** | *White LED Mod* | Base PT-BR + **Tap Tempo com LED Branco Puro** (Footswitch 2). | — | 🔬 Em pesquisa (binário removido: patch ainda não validado) | *Indisponível* |
| **v1.3.0-TREM-v1.3** | *Pattern Tremolo Pêndulo* | Base PT-BR + **Pattern Tremolo Pêndulo** (`1/4` → `1/8` → `1/16` → `1/8` → `1/4` contínuo guiado pelo Tap Tempo no efeito **Tremolo**). | `5.447.156 bytes` | 🧪 Pronto para Teste | [📥 **Baixar QME-100_PATTERN_TREM_V1.3.0.bin**](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_PATTERN_TREM_V1.3.0.bin) |
| **v1.3.0-STEREO-v1.4**| *Stereo Haas* | Recursos anteriores + **Stereolizer (Haas Effect)**. | *Em breve* | ⏳ Em desenvolvimento | *Aguardando compilação* |
| **v1.3.0-DUALMOD-v1.5**| *Dual Modulation*| Recursos anteriores + **Duas Modulações Simultâneas** na cadeia. | *Em breve* | ⏳ Em desenvolvimento | *Aguardando compilação* |
| **v1.3.0-AMPERO-v2.0** | *Ampero Algorithms*| Recursos anteriores + **Algoritmos da Ampero Stomp 2** + **EXP 2 Dual FS**. | *Em breve* | ⏳ Em planejamento | *Aguardando compilação* |

---

## 🔍 Detalhes Técnicos dos Arquivos Disponíveis

### Versão com Modulação Pêndulo: `v1.3.0-TREM-v1.3`
* **Arquivo:** `QME-100_PATTERN_TREM_V1.3.0.bin`
* **Tamanho:** `5.447.156 bytes`
* **SHA-256:** `7B66DA64371ED02F4CC53ED66A1F5F4953E5335DDD006B09B9A7E434D4E0A4C1`
* **Autores:** Mgrpoisom & CesarMalak
* **Recursos:**
  - Tradução nativa completa PT-BR (105 termos).
  - **Pattern Tremolo Pêndulo (1 ➔ 2 ➔ 3 ➔ 2 ➔ 1)**:
    - Alterna continuamente em onda triangular a cada 4 tempos:
      - `1/4` (Semínima) ➔ `1/8` (Colcheia) ➔ `1/16` (Semicolcheia) ➔ `1/8` (Colcheia) ➔ `1/4` (Semínima)...
    - Mantém a interface e o descritor de fábrica 100% seguros (sem riscos de conflito com presets).
    - Máquina de estados em assembly ARM Thumb-2 no oscilador do efeito Tremolo (Partição 3). Sincronizado 100% com o Tap Tempo em tempo real.

### Versão Estável de Tradução: `v1.3.0-PTBR-v1.1`
* **Arquivo:** `QME-100_PTBR_V1.3.0.bin` (único testado em hardware)
* **Tamanho:** `5.447.156 bytes`
* **Base:** Firmware Oficial Sonicake QME-100 V1.3.0 + PT-BR 105 termos.

### Pesquisa em andamento: White LED
* Tentativas anteriores (offsets `0x40C1D`/`0x40C59`, `0x2CCBA` e a tabela float `0x4B935`-`0x4BC29`) **não alteraram o LED** ou causaram efeitos colaterais, e foram descartadas.
* Próximo passo: rastrear o valor de cor retornado pela função em `0x2CC34` até o driver PWM, antes de aplicar qualquer patch.
