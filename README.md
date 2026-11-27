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
| **v1.3.0-PTBR-v1.0** | Tradução nativa completa para **Português do Brasil (PT-BR)** | ✅ Validado | [📥 **Baixar QME-100_PTBR_V1.3.0.bin**](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_PTBR_V1.3.0.bin) |
| **v1.3.0-TREM-v1.1** | PT-BR + **Pattern Tremolo** (Speed Ramp & Slicer) | ⏳ Em desenvolvimento | *Em breve* |
| **v1.3.0-STEREO-v1.2**| PT-BR + Pattern Tremolo + **Stereolizer (Haas)** | ⏳ Em desenvolvimento | *Em breve* |
| **v1.3.0-DUALMOD-v1.3**| PT-BR + Tremolo + Stereo + **Duas Modulações** | ⏳ Em desenvolvimento | *Em breve* |
| **v1.3.0-AMPERO-v2.0** | Todos os anteriores + **Algoritmos Ampero Stomp 2** + **EXP 2 Dual FS** | ⏳ Em planejamento | *Em breve* |

---

## 📌 Visão Geral do Projeto

A **Sonicake Matribox II (QME-100)** utiliza a arquitetura de contêiner `HTFW` (Hotone Firmware). Este projeto visa transformar a pedaleira em uma plataforma aberta e altamente flexível, superando as travas de fábrica com **guardrails estritos de segurança anti-brick**.

---

## 🎯 Escopo Completo de Recursos (Features & Specs)

### 1. 🎛️ Modo Cenas (Scenes / Snapshots)
* Troca instantânea de estados de múltiplos blocos e parâmetros dentro do mesmo preset **sem corte de áudio (*audio gap*) ou latência**.
* Transições suaves mantendo caudas de reverb e delay (*spillover*).

### 2. 🎧 Stereolizer Integrado (Efeito Haas / Micro-Atraso)
* Módulo estéreo com micro-atraso configurável (12ms a 25ms) no canal Direito (R).
* Sensação de **guitarra dobrada (*double-tracking*)** e imagem estéreo 3D ultra-aberta sem consumir blocos extras desnecessários.

### 3. 🌊 Pattern Tremolo (Modulação Rítmica Dinâmica)
* Tremolo inteligente com **oscilador de velocidade variável (*Speed Ramp*)**: acelera e desacelera automaticamente.
* Padrões de corte rítmico (*Slicer / Step-Sequencer*) aproveitando os osciladores do DSP (`Sine`, `Square`, `Cone`, `Ramp`).

### 4. 🔀 Duas Modulações Simultâneas (Dual Modulation)
* Destravamento da matriz do DSP (Partição 0) para permitir **dois blocos de modulação ao mesmo tempo** na cadeia (ex: Chorus + Tremolo, Phaser + Flanger).

### 5. 📦 Portabilidade de Algoritmos da Ampero Stomp 2
* Importação e injeção de tabelas de efeitos, caixas e algoritmos do ecossistema **Hotone Ampero Stomp 2** diretamente na Partição 3 (Banco de Efeitos).

### 6. 🦶 Suporte a Dual Footswitch na EXP 2 (CTRL 4 & CTRL 5)
* Expansão da entrada física `EXP 2 / Footswitch` para reconhecer pedais de footswitch duplo.
* Mapeamento de dois novos controles independentes: **CTRL 4** e **CTRL 5** para acionar/desligar blocos específicos diretamente em modo Stomp, sem precisar navegar entre bancos.

### 7. 🇧🇷 Tradução Nativa para PT-BR
* Tradução completa de todos os menus, alertas e telas para Português do Brasil com alinhamento de memória e *Null-Padding*.

### 8. 🛡️ Guardrails Anti-Brick
* Validador automático de integridade binária: checagem de tamanho exato (`5.447.156 bytes`), alinhamento de 32 bits e offsets fixos de partição antes de qualquer gravação.

---

## 📁 Estrutura Modular

```
matribox 2 custom/
├── modules/
│   ├── core/              # Parsers, repacker e validador de guardrails
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
