@echo off
title Sonicake Matribox II - Simulador Oficial de Firmware
color 0A

echo ==========================================================
echo       SONICAKE MATRIBOX II - SIMULADOR DE UI REAL
echo       Autores: Mgrpoisom ^& CesarMalak
echo ==========================================================
echo.
echo [*] Carregando assets oficiais e interface...
echo [*] Abrindo simulador no seu navegador padrao...
echo.

start "" "%~dp0ui_simulator\index.html"

echo [OK] Simulador aberto com sucesso!
echo Voce ja pode interagir com os pedais, footswitches e medidores.
echo.
timeout /t 5 >nul
exit
