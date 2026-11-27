# Guia de Segurança e Prevenção Anti-Brick (Matribox II)

> [!CAUTION]
> A modificação direta de memória flash em pedaleiras envolve risco real de inutilização do aparelho (*hard brick*). Siga rigorosamente estas orientações antes de qualquer tentativa de gravação via USB.

---

### 1. O Problema Crítico do Windows 11 com Áudio/MIDI USB
No Windows 11, o driver de áudio USB padrão da Microsoft costuma suspender a porta durante transferências volumosas de pacotes exclusivos (SysEx / DFU). Isso faz a barra de progresso travar em **0%** ou congelar em *"Updating in progress"*.

#### Como prevenir:
1. Abra o **Gerenciador de Dispositivos** (`devmgmt.msc`).
2. Conecte a Matribox ligada via USB.
3. Localize o dispositivo em **Controladores de som, vídeo e jogos**.
4. Clique com o botão direito -> **Atualizar driver** -> **Procurar drivers no meu computador** -> **Permitir que eu escolha em uma lista de drivers disponíveis no meu computador**.
5. Selecione o driver genérico **"Dispositivo de Áudio USB Genérico"** da Microsoft.
6. Reinicie o computador antes de abrir o software de gravação.

---

### 2. Modo de Recuperação (DFU / Force Update)
Se a pedaleira travar na inicialização ou a gravação for interrompida:
1. Desconecte a fonte de alimentação da Matribox.
2. Mantenha pressionados os dois footswitches (ou a combinação de botões de recovery indicada pela Sonicake para o seu modelo).
3. Conecte o cabo de alimentação mantendo os botões pressionados por 5 a 8 segundos.
4. A tela entrará no modo **Force Update** (tela preta com texto ou logo fixo).
5. Abra o aplicativo oficial no computador e faça a restauração com o firmware original de fábrica.

---

### 3. Regra de Ouro: Matribox II vs Matribox II Pro
* **Nunca** tente gravar uma imagem compilada para a **Matribox II Pro (QME-200)** na **Matribox II padrão**.
* Os layouts de memória flash, os pinos de interrupção dos footswitches e a tabela de endereçamento do DSP são incompatíveis.
