# ROADMAP DO PROJETO: Matribox II Custom Firmware (QME-100)

**Autores / Mantenedores:** Mgrpoisom & CesarMalak  
**Hardware Alvo:** Sonicake Matribox II (`QME-100`)  
**Base Oficial:** Firmware `V1.3.0` (`HTFW` Container)

---

## 🎯 Especificação Detalhada das Features

### 1. Sistema de Cenas (Scenes / Snapshots)
- Alternância de múltiplos blocos e parâmetros com 1 toque de footswitch.
- Sem corte de áudio (*audio gap*).
- Preservação de caudas de ambiência (Delay/Reverb spillover).

### 2. Módulo Stereolizer (Haas Effect)
- Implementação de atraso estéreo de milissegundos (12ms a 25ms) no canal R.
- Efeito de guitarra dobrada em estéreo real (L/R separados).

### 3. Pattern Tremolo (LFO Rítmico Dinâmico)
- Aceleração e desaceleração cíclica automática da velocidade de oscilação (*Speed Ramp*).
- Modo *Slicer* com subdivisões rítmicas e cortes em passos (*step-sequencer*).

### 4. Duas Modulações Simultâneas (Dual MOD Chain)
- Remoção da trava do DSP na Partição 0 para alocação de 2 blocos de modulação no mesmo preset (ex: Chorus + Tremolo).

### 5. Algoritmos Portados da Ampero Stomp 2
- Injeção de modelos de amplificadores, caixas e drives do ecossistema Ampero Stomp 2 na Partição 3.

### 6. Suporte a Dual Footswitch na EXP 2 (CTRL 4 & CTRL 5)
- Leitura analógica/digital na entrada EXP 2 para suportar pedal duplo de footswitch.
- Mapeamento de dois botões adicionais no modo Stomp: **CTRL 4** e **CTRL 5**.

### 7. Tradução Completa para PT-BR
- Menus, configurações globais e alertas totalmente em Português do Brasil com alinhamento de memória e *Null-Padding*.

### 8. Validação por Guardrails Anti-Brick
- Nenhuma compilação é liberada para teste sem validação de tamanho (`5.447.156 bytes`), alinhamento e offsets.
