"""
Matribox II - Firmware Checksum & Repacker
Utilitário para verificação e recálculo de integridade (CRC32 / Checksums)
usado antes de gerar um pacote de atualização.
"""

import sys
import zlib
import hashlib
import os

def calculate_checksums(data):
    crc32_val = zlib.crc32(data) & 0xFFFFFFFF
    sha256_val = hashlib.sha256(data).hexdigest()
    sum_bytes = sum(data) & 0xFFFFFFFF
    return {
        "length": len(data),
        "crc32": f"0x{crc32_val:08X}",
        "additive_sum": f"0x{sum_bytes:08X}",
        "sha256": sha256_val
    }

def verify_file(file_path):
    if not os.path.exists(file_path):
        print(f"[-] Arquivo não encontrado: {file_path}")
        return

    with open(file_path, "rb") as f:
        data = f.read()

    info = calculate_checksums(data)
    print(f"\n=== INTEGRIDADE DO ARQUIVO: {os.path.basename(file_path)} ===")
    print(f"Tamanho:       {info['length']} bytes ({info['length']/1024:.2f} KB)")
    print(f"CRC32:         {info['crc32']}")
    print(f"Checksum Adit: {info['additive_sum']}")
    print(f"SHA-256:       {info['sha256']}")
    print("===================================================\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python repack_firmware.py <arquivo.bin>")
        sys.exit(1)
    verify_file(sys.argv[1])
