"""
Sonicake Matribox II / II Pro - Firmware Unpacker & Inspector
Utilitário para análise e extração de contêineres de firmware (.bin / .pkg).
"""

import os
import sys
import struct
import zlib
import re
import argparse

def calculate_entropy(data_slice):
    import math
    if not data_slice:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(data_slice.count(bytes([x]))) / len(data_slice)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def find_zlib_streams(data):
    """Procura fluxos compactados zlib/deflate válidos no binário."""
    streams = []
    for i in range(len(data) - 4):
        # zlib headers comuns: 78 01, 78 9C, 78 DA
        if data[i] == 0x78 and data[i+1] in (0x01, 0x9C, 0xDA):
            try:
                decompressed = zlib.decompress(data[i:])
                streams.append((i, len(decompressed)))
            except Exception:
                pass
    return streams

def inspect_firmware(file_path, output_dir):
    print(f"[*] Analisando arquivo: {file_path}")
    if not os.path.exists(file_path):
        print(f"[-] Erro: Arquivo não encontrado: {file_path}")
        return

    with open(file_path, "rb") as f:
        data = f.read()

    file_size = len(data)
    print(f"[+] Tamanho total do arquivo: {file_size} bytes ({file_size / 1024:.2f} KB)")

    # Entropia geral
    entropy = calculate_entropy(data[:min(len(data), 65536)])
    print(f"[+] Entropia inicial (64KB): {entropy:.2f} / 8.00")
    if entropy > 7.2:
        print("[!] Alta entropia detectada: o arquivo contém dados comprimidos ou criptografados.")
    else:
        print("[+] Entropia média/baixa: código e dados brutos presentes (não criptografados).")

    # Header inicial (primeiros 64 bytes)
    print("\n--- Header Hexdump (primeiros 64 bytes) ---")
    header_preview = data[:64]
    for i in range(0, len(header_preview), 16):
        chunk = header_preview[i:i+16]
        hex_str = " ".join(f"{b:02X}" for b in chunk)
        ascii_str = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
        print(f"{i:04X}:  {hex_str:<48}  |{ascii_str}|")

    # Busca de strings reconhecíveis
    print("\n[*] Procurando assinaturas e strings do sistema...")
    strings = re.findall(b"[\x20-\x7e]{4,}", data)
    dsp_keywords = [b"Sonicake", b"Matribox", b"Valeton", b"Hotone", b"DSP", b"NAM", b"CAB", b"DRIVE", b"DELAY", b"REVERB"]
    found_keywords = set()
    for s in strings:
        for kw in dsp_keywords:
            if kw.lower() in s.lower():
                found_keywords.add(s.decode('latin-1', errors='ignore'))

    if found_keywords:
        print(f"[+] {len(found_keywords)} referências encontradas:")
        for kw in list(found_keywords)[:15]:
            print(f"    - {kw}")
    else:
        print("[-] Nenhuma string direta de DSP encontrada no bloco bruto (pode estar compactado).")

    # Busca de blocos zlib
    print("\n[*] Escaneando por blocos compactados (zlib)...")
    zlib_blocks = find_zlib_streams(data)
    if zlib_blocks:
        print(f"[+] Encontrados {len(zlib_blocks)} blocos zlib descompactáveis!")
        os.makedirs(output_dir, exist_ok=True)
        for idx, (offset, size) in enumerate(zlib_blocks):
            print(f"    Bloco {idx}: Offset 0x{offset:06X} -> {size} bytes descompactados")
            try:
                decomp = zlib.decompress(data[offset:])
                out_path = os.path.join(output_dir, f"section_{idx}_0x{offset:06X}.bin")
                with open(out_path, "wb") as out_f:
                    out_f.write(decomp)
                print(f"    -> Salvo em: {out_path}")
            except Exception as e:
                print(f"    -> Erro ao salvar bloco {idx}: {e}")
    else:
        print("[-] Nenhum bloco zlib direto encontrado.")

    # Salva dump bruto para análise no Ghidra / IDA Pro
    raw_dump_path = os.path.join(output_dir, "raw_firmware.bin")
    os.makedirs(output_dir, exist_ok=True)
    with open(raw_dump_path, "wb") as f_out:
        f_out.write(data)
    print(f"\n[+] Dump bruto copiado para: {raw_dump_path}")
    print("[+] Análise concluída com sucesso.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Descompactador e Inspetor de Firmware Sonicake Matribox")
    parser.add_argument("firmware_file", help="Caminho do arquivo de firmware (.bin ou .pkg)")
    parser.add_argument("--out", default="extracted", help="Diretório de saída para arquivos descompactados")
    args = parser.parse_args()

    inspect_firmware(args.firmware_file, args.out)
