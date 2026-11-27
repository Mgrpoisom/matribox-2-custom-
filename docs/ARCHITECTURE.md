# Mapeamento do Firmware Sonicake Matribox II (QME-100 V1.3.0)

Arquivo analisado: `QME-100_FW_USB_V1.3.0.bin` (5.447.156 bytes)

---

## 1. Estrutura do Contêiner: HTFW (Hotone Firmware)
O arquivo utiliza o formato padrão de contêiner proprietário da **Hotone/Valeton (Magic: `HTFW`)**, confirmando a compatibilidade de ferramentas de engenharia reversa com a família Hotone Ampero / Valeton GP-200.

### Cabeçalho Global (0x00 - 0x80):
* **Magic:** `HTFW` (`0x48 0x54 0x46 0x57`)
* **Modelo Identificado:** `QME-100` (Matribox II padrão)
* **Versão:** `V1.3.0`
* **Tamanho do Arquivo:** `5.447.156` bytes (`0x00531DF4`)
* **Payload de Dados:** `5.447.036` bytes (`0x00531D7C`)

---

## 2. Mapa das Partições Extraídas

| Partição | Offset no Arquivo | Tamanho | Endereço Destino (Flash/RAM) | Conteúdo Identificado |
|---|---|---|---|---|
| **Partição 0** | `0x00000080` | 3.264.516 bytes (3,11 MB) | `0x00700000` | **Core DSP & Lógica de Sistema:** Código executável ARM/DSP, rotinas de Footswitches, modo Stomp e motor de áudio. |
| **Partição 1** | `0x0031D084` | 258.048 bytes (252 KB) | `0x004E0000` | **Interface Gráfica (UI):** Recursos de tela, fontes e layout de menus. |
| **Partição 2** | `0x0035C084` | 131.072 bytes (128 KB) | `0x00500000` | **Presets de Fábrica:** Patches padrão e configurações de calibração. |
| **Partição 3** | `0x0037C084` | 1.793.400 bytes (1,71 MB) | `0xFFFFFFFF` (ROM Data) | **Tabelas de Efeitos & Áudio:** 96 algoritmos e perfis de pedais (GreenDrive, SwarmDrive, Plexi Dist, Delays, etc.) e dados de IR. |

---

## 3. Onde Modificar para Alcançar Seus Objetivos

### Objetivo 1: Implementar Cenas (Scenes)
* **No Firmware (Partição 0):** A rotina de footswitch e o gerenciador de modos (`Stomp Mode`, `Preset Mode`) estão compilados nesta partição.
* **Via MIDI (Alternativa Imediata):** A pedaleira responde aos códigos de CC mapeados na Partição 0 (Wah: CC 10, Drive: CC 12, Delay: CC 18, etc.).

### Objetivo 2: Colocar Mais de um Efeito (Multi-FX / Dual Chain)
* A lista de 96 modelos de efeitos está na **Partição 3**.
* A matriz de validação que bloqueia colocar 2 delays ou 2 drives está no código executável da **Partição 0** (verificação de tipo de bloco antes de alocar na memória).
