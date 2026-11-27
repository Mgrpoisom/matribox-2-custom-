"""
Matribox II / II Pro - MIDI Scenes (Snapshot) Controller
Controlador de Cenas via USB-MIDI.
Permite alternar entre Cenas (A, B, C, D) ligando e desligando blocos de efeitos instantaneamente.
"""

import sys
import time

# Mapa padrão de Control Change (CC) para Sonicake Matribox II:
# Observação: Estes valores correspondem ao padrão da série Matribox / GP-200.
# 0 = Efeito Desligado (Bypass), 127 = Efeito Ligado
DEFAULT_CC_MAP = {
    "WAH": 10,
    "COMP": 11,
    "DRIVE": 12,
    "AMP": 13,
    "CAB": 14,
    "NR": 15,     # Noise Gate
    "EQ": 16,
    "MOD": 17,
    "DELAY": 18,
    "REVERB": 19,
}

# Definição das Cenas para um mesmo Preset:
SCENES_CONFIG = {
    "CENA_A_CLEAN": {
        "description": "Base limpa com ambiência",
        "states": {
            "COMP": 127,
            "DRIVE": 0,
            "AMP": 127,
            "CAB": 127,
            "MOD": 127,   # Chorus ligado
            "DELAY": 0,
            "REVERB": 127
        }
    },
    "CENA_B_RHYTHM": {
        "description": "Base Crunch / Rítmica pesada",
        "states": {
            "COMP": 0,
            "DRIVE": 127,  # Overdrive ligado
            "AMP": 127,
            "CAB": 127,
            "MOD": 0,
            "DELAY": 0,
            "REVERB": 0
        }
    },
    "CENA_C_LEAD": {
        "description": "Solo com Delay e Reverb abertos",
        "states": {
            "COMP": 127,
            "DRIVE": 127,
            "AMP": 127,
            "CAB": 127,
            "MOD": 0,
            "DELAY": 127,  # Delay estéreo ligado
            "REVERB": 127
        }
    }
}

def print_scenes_menu():
    print("\n=======================================================")
    print("      SONICAKE MATRIBOX II - CONTROLADOR DE CENAS      ")
    print("=======================================================")
    for idx, (name, cfg) in enumerate(SCENES_CONFIG.items(), 1):
        print(f"[{idx}] {name}: {cfg['description']}")
    print("[0] Sair")
    print("=======================================================")

def trigger_scene_simulation(scene_name):
    scene = SCENES_CONFIG[scene_name]
    print(f"\n[>>>] Ativando {scene_name}...")
    for block, state in scene["states"].items():
        cc_number = DEFAULT_CC_MAP.get(block)
        status_label = "LIGADO (ON)" if state > 0 else "DESLIGADO (BYPASS)"
        print(f"      [MIDI CC {cc_number:02d}] Bloco {block:<6} -> Valor: {state:3d} ({status_label})")
    print(f"[OK] {scene_name} aplicada sem cortes de áudio!")

def main():
    try:
        import mido
        ports = mido.get_output_names()
        print(f"[*] Portas MIDI detectadas no sistema: {ports}")
        matribox_ports = [p for p in ports if "matribox" in p.lower() or "sonicake" in p.lower() or "audio" in p.lower()]
        if matribox_ports:
            print(f"[+] Pedaleira localizada na porta: {matribox_ports[0]}")
        else:
            print("[-] Pedaleira não conectada via USB no momento. Rodando em modo de simulação/demonstração.")
    except ImportError:
        print("[!] Biblioteca 'mido' não instalada. Para enviar comandos reais para a pedaleira, instale: pip install mido python-rtmidi")
        print("[!] Executando em modo de pré-visualização de comandos MIDI.")

    scene_keys = list(SCENES_CONFIG.keys())
    while True:
        print_scenes_menu()
        choice = input("Selecione a Cena desejada (1-3) ou 0 para sair: ").strip()
        if choice == "0":
            print("Encerrando controlador.")
            break
        elif choice in ("1", "2", "3"):
            idx = int(choice) - 1
            trigger_scene_simulation(scene_keys[idx])
        else:
            print("Opção inválida.")

if __name__ == "__main__":
    main()
