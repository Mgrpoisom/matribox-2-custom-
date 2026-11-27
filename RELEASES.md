# 📦 Central de Downloads & Histórico de Versões de Firmware

Aqui você encontra os links de download direto das imagens de firmware modificadas e testadas pelo time do projeto (**Mgrpoisom & CesarMalak**).

> [!IMPORTANT]
> Todos os arquivos listados abaixo passam obrigatoriamente pela validação do script `guardrail.js` antes de serem disponibilizados. Sempre confira o hash SHA-256 antes de gravar na sua pedaleira.

---

## 🚀 Tabela de Downloads Diretos (.bin)

| Versão | Codinome | O que traz incluído | Tamanho | Status Guardrail | Link de Download Direto (.bin) |
|---|---|---|---|---|---|
| **v1.3.0-PTBR-v1.1** | *Tradução Definitiva* | Tradução completa dos 105 termos + Seletor **Português** ativo. | `5.447.156 bytes` | ✅ Testado em Hardware | [📥 Baixar QME-100_PTBR_V1.3.0.bin](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_PTBR_V1.3.0.bin) |
| **v1.3.0-WHITELED-v1.2** | *White LED Mod* | Base PT-BR + **Tap Tempo com LED Branco Puro** (Footswitch 2). | `5.447.156 bytes` | ✅ Aprovado Guardrail | [📥 **Baixar QME-100_WHITELED_V1.3.0.bin**](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_WHITELED_V1.3.0.bin) |
| **v1.3.0-TREM-v1.3** | *Pattern Tremolo* | PT-BR + White LED + **Pattern Tremolo Dinâmico** (Speed Ramp + Slicer). | *Em breve* | ⏳ Em desenvolvimento | *Aguardando compilação* |
| **v1.3.0-STEREO-v1.4**| *Stereo Haas* | Recursos anteriores + **Stereolizer (Haas Effect)**. | *Em breve* | ⏳ Em desenvolvimento | *Aguardando compilação* |
| **v1.3.0-DUALMOD-v1.5**| *Dual Modulation*| Recursos anteriores + **Duas Modulações Simultâneas** na cadeia. | *Em breve* | ⏳ Em desenvolvimento | *Aguardando compilação* |
| **v1.3.0-AMPERO-v2.0** | *Ampero Algorithms*| Recursos anteriores + **Algoritmos da Ampero Stomp 2** + **EXP 2 Dual FS**. | *Em breve* | ⏳ Em planejamento | *Aguardando compilação* |

---

## 🔍 Detalhes Técnicos dos Arquivos Disponíveis

### Versão Atual: `v1.3.0-WHITELED-v1.2`
* **Arquivo:** `QME-100_WHITELED_V1.3.0.bin`
* **Download Direto:** [Clique para Baixar QME-100_WHITELED_V1.3.0.bin](https://github.com/Mgrpoisom/matribox-2-custom-/raw/main/firmware/modified/QME-100_WHITELED_V1.3.0.bin)
* **Tamanho:** `5.447.156 bytes`
* **SHA-256:** `D5E7A0416F7B621E872EF471F0AF3D7AC5B921479C116B22B8339077F2C74BB4`
* **Base:** Firmware Oficial Sonicake QME-100 V1.3.0 + PT-BR 105 termos + Patch cirúrgico dos 8 slots de cores de hardware RGB float do Footswitch (Amarelo R=1, G=1, B=0 -> Branco Puro R=1, G=1, B=1).
* **Segurança:** Aprovado 100% pelo `guardrail.js`. Zero alterações na GUI/LCD.
