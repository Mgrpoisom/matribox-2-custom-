/**
 * MAPEAMENTO E CUSTOMIZADOR DE CORES DOS LEDS (RGB)
 * Autores: Mgrpoisom & CesarMalak
 * 
 * Hardware: Footswitches RGB com canais PWM (Red, Green, Blue).
 */

const RGB_COLOR_DEFINITIONS = {
    BLACK:   { hex: "0x000000", r: 0,   g: 0,   b: 0   },
    RED:     { hex: "0xFF0000", r: 255, g: 0,   b: 0   },
    GREEN:   { hex: "0x00FF00", r: 0,   g: 255, b: 0   },
    BLUE:    { hex: "0x0000FF", r: 0,   g: 0,   b: 255 },
    YELLOW:  { hex: "0xFFFF00", r: 255, g: 255, b: 0   }, // Padrão de fábrica do Tap Tempo
    CYAN:    { hex: "0x00FFFF", r: 0,   g: 255, b: 255 },
    MAGENTA: { hex: "0xFF00FF", r: 255, g: 0,   b: 255 },
    WHITE:   { hex: "0xFFFFFF", r: 255, g: 255, b: 255 }  // Nosso alvo para o White LED Mod
};

console.log('=== DEFINIÇÕES DE CORES RGB PARA FOOTSWITCHES ===');
console.table(RGB_COLOR_DEFINITIONS);

module.exports = { RGB_COLOR_DEFINITIONS };
