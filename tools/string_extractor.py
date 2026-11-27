"""
Extrator de Strings e Tabelas de Efeitos
Extrai e organiza parâmetros, nomes de amplificadores, caixas e comandos do firmware.
"""

import sys
import os
import re

def extract_strings(bin_file, output_txt, min_len=4):
    if not os.path.exists(bin_file):
        print(f"[-] Arquivo não encontrado: {bin_file}")
        return

    with open(bin_file, "rb") as f:
        data = f.read()

    pattern = re.compile(rb"[\x20-\x7e]{" + str(min_len).encode() + rb",}")
    matches = pattern.finditer(data)

    results = []
    for match in matches:
        offset = match.start()
        text = match.group().decode('latin-1', errors='ignore')
        results.append((offset, text))

    print(f"[+] Total de strings encontradas: {len(results)}")

    with open(output_txt, "w", encoding="utf-8") as out:
        out.write(f"=== STRINGS DUMP: {os.path.basename(bin_file)} ===\n")
        out.write(f"Tamanho do arquivo: {len(data)} bytes\n\n")
        for offset, text in results:
            out.write(f"[0x{offset:08X}] {text}\n")

    print(f"[+] Relatório salvo em: {output_txt}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python string_extractor.py <arquivo.bin> [saida.txt]")
        sys.exit(1)

    in_file = sys.argv[1]
    out_file = sys.argv[2] if len(sys.argv) > 2 else in_file + "_strings.txt"
    extract_strings(in_file, out_file)
