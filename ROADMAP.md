# ROADMAP DO PROJETO: Matribox II Custom Firmware (QME-100)

**Autores / Mantenedores:** Mgrpoisom & CesarMalak  
**Hardware Alvo:** Sonicake Matribox II (`QME-100`)  
**Base Oficial:** Firmware `V1.3.0` (`HTFW` Container)

---

## 🎯 Especificação Detalhada das Features

### 1. Customização de Cor do LED: Tap Tempo Branco Puro (White LED Mod)
- **Status:** Em desenvolvimento ativo.
- **Objetivo:** Substituir a pulsação do LED do Tap Tempo (atualmente Amarelo: `R=255, G=255, B=0`) para **Branco Puro** (`R=255, G=255, B=255`).
- **Alvo:** Rotina do temporizador de pulso de BPM na Partição 0 (`0x00700000`).

### 2. Sistema de Cenas (Scenes / Snapshots)
- Alternância de múltiplos blocos e parâmetros com 1 toque de footswitch sem corte de áudio (*audio gap*).

### 3. Módulo Stereolizer (Haas Effect)
- Implementação de atraso estéreo de milissegundos (12ms a 25ms) no canal R para efeito de guitarra dobrada em estéreo real.

### 4. Pattern Tremolo (LFO Rítmico Dinâmico)
- Aceleração e desaceleração cíclica automática da velocidade (*Speed Ramp*) e cortes rítmicos em passos (*Slicer*).

### 5. Duas Modulações Simultâneas (Dual MOD Chain)
- Remoção da trava do DSP na Partição 0 para alocação de 2 blocos de modulação no mesmo preset.

### 6. Algoritmos Portados da Ampero Stomp 2
- Injeção de modelos de amplificadores, caixas e drives da Ampero Stomp 2 na Partição 3.

### 7. Suporte a Dual Footswitch na EXP 2 (CTRL 4 & CTRL 5)
- Mapeamento de dois botões adicionais no modo Stomp através da entrada de expressão.

### 8. Tradução Completa para PT-BR
- **Status:** ✅ Concluído e testado com sucesso em hardware real (`v1.3.0-ptbr-v1.1`).
