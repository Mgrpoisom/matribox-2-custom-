# 🎸 Matribox II Custom Firmware & Modding Toolkit (QME-100)

> Projeto de engenharia reversa, customização de firmware e expansão de recursos para a pedaleira **Sonicake Matribox II**.

---

## 👥 Autores & Mantenedores
* **Mgrpoisom**
* **CesarMalak**

---

## 📦 Downloads Diretos de Firmware (.bin Pronto para Gravar)

Acesse e baixe os arquivos binários finais prontos para carregar no software da Sonicake:

👉 **[Ver Central Completa de Downloads (RELEASES.md)](RELEASES.md)**

| Versão | Modificações Incluídas | Status | Download Direto (.bin) |
|---|---|---|---|
| **v1.3.0-PTBR-v1.1** | Tradução nativa completa de 105 termos + Seletor **Português** | ✅ Validado em Hardware | [📥 **Baixar QME-100_PTBR_V1.3.0.bin**](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_PTBR_V1.3.0.bin) |
| **v1.3.0-WHITELED-v1.2-BETA**| PT-BR + **Tap Tempo com LED Branco Puro** (Build de Testes) | 🧪 Em testes ativos | [📥 **Baixar QME-100_WHITELED_BETA_V1.3.0.bin**](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_WHITELED_BETA_V1.3.0.bin) |
| **v1.3.0-TREM-v1.3** | PT-BR + White LED + **Pattern Tremolo** (Speed Ramp & Slicer) | ⏳ Em planejamento | *Em breve* |
| **v1.3.0-STEREO-v1.4**| Recursos anteriores + **Stereolizer (Haas Effect)** | ⏳ Em planejamento | *Em breve* |
| **v1.3.0-DUALMOD-v1.5**| Recursos anteriores + **Duas Modulações Simultâneas** | ⏳ Em planejamento | *Em breve* |
| **v1.3.0-AMPERO-v2.0** | Todos os anteriores + **Algoritmos Ampero Stomp 2** + **EXP 2 Dual FS** | ⏳ Em planejamento | *Em breve* |

---

## 🎯 Escopo Completo de Recursos (Features & Specs)

### 1. 💡 Tap Tempo com LED Branco Puro (White LED Mod)
* Substituição da cor padrão amarela do LED de pulso do Tap Tempo por **Branco Puro (*Full RGB: R=255, G=255, B=255*)**.
* Visual moderno no footswitch (estilo modeladores premium como Quad Cortex / Helix).

### 2. 🎛️ Modo Cenas (Scenes / Snapshots)
* Troca instantânea de estados de múltiplos blocos e parâmetros dentro do mesmo preset **sem corte de áudio (*audio gap*) ou latência**.
* Transições suaves mantendo caudas de reverb e delay (*spillover*).

### 3. 🎧 Stereolizer Integrado (Efeito Haas / Micro-Atraso)
* Módulo estéreo com micro-atraso configurável (12ms a 25ms) no canal Direito (R).
* Sensação de **guitarra dobrada (*double-tracking*)** e imagem estéreo 3D ultra-aberta sem consumir blocos extras.

### 4. 🌊 Pattern Tremolo (Modulação Rítmica Dinâmica)
* Tremolo inteligente com **oscilador de velocidade variável (*Speed Ramp*)**: acelera e desacelera automaticamente.
* Padrões de corte rítmico (*Slicer / Step-Sequencer*) aproveitando os osciladores do DSP (`Sine`, `Square`, `Cone`, `Ramp`).

### 5. 🔀 Duas Modulações Simultâneas (Dual Modulation)
* Destravamento da matriz do DSP (Partição 0) para permitir **dois blocos de modulação ao mesmo tempo** na cadeia (ex: Chorus + Tremolo, Phaser + Flanger).

### 6. 📦 Portabilidade de Algoritmos da Ampero Stomp 2
* Importação e injeção de tabelas de efeitos, caixas e algoritmos do ecossistema **Hotone Ampero Stomp 2** diretamente na Partição 3 (Banco de Efeitos).

### 7. 🦶 Suporte a Dual Footswitch na EXP 2 (CTRL 4 & CTRL 5)
* Expansão da entrada física `EXP 2 / Footswitch` para reconhecer pedais de footswitch duplo.
* Mapeamento de dois novos controles independentes: **CTRL 4** e **CTRL 5** para acionar blocos diretamente em modo Stomp.

### 8. 🇧🇷 Tradução Nativa para PT-BR
* Tradução completa de todos os 105 menus, alertas e telas para Português do Brasil com alinhamento de memória e *Null-Padding*.

### 9. 🛡️ Guardrails Anti-Brick
* Validador automático de integridade binária: checagem de tamanho exato (`5.447.156 bytes`), alinhamento de 32 bits e offsets fixos de partição antes de qualquer gravação.

---

## 📁 Estrutura Modular

```
matribox 2 custom/
├── modules/
│   ├── core/              # Parsers, repacker e validador de guardrails
│   ├── led_customizer/    # Mapeamento e patches de cores RGB dos LEDs (White LED Mod)
│   ├── translation_ptbr/  # Dicionário e injetor de PT-BR
│   ├── pattern_tremolo/   # Mapeamento do oscilador de tremolo dinâmico
│   ├── dual_mod/          # Destravamento de múltiplos blocos de modulação
│   ├── ampero_port/       # Injetor de algoritmos da Ampero Stomp 2
│   ├── exp2_dual_fs/      # Rotina de leitura de CTRL 4 e CTRL 5 na EXP 2
│   └── midi_scenes/       # Controlador de cenas e automação USB-MIDI
├── firmware/
│   ├── original/          # Firmware oficial de fábrica (QME-100 V1.3.0)
│   ├── extracted/         # Partições desmontadas para análise
│   └── modified/          # Firmwares compilados e aprovados pelos guardrails
├── docs/
│   ├── ARCHITECTURE.md    # Mapeamento técnico da memória, DSP e partições
│   └── SAFETY_GUIDE.md    # Prevenção de falhas e guia de recuperação
├── RELEASES.md            # Histórico de versões e links de download
├── package.json           # Scripts de automação npm
└── README.md              # Documentação principal
```

---

## ⚠️ Disclaimer
Projeto independente de pesquisa e engenharia reversa comunitária por Mgrpoisom & CesarMalak. Não afiliado à Sonicake, Hotone ou Valeton.
