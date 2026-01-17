/**
 * CAYMUS TANKS - Base de Datos de Tanques Unificada
 * 
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Este archivo contiene los datos de los 153 tanques de vino.
 * Es la ÚNICA fuente de verdad para los datos de tanques.
 * 
 * IMPORTANTE: Cualquier modificación a los datos de tanques
 * debe hacerse SOLO en este archivo.
 * 
 * @version 1.0.0
 * @date 2026-01-17
 * @tanks 153
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface TankData {
  GALS_PER_INCH: number;  // Galones por pulgada en el cuerpo cilíndrico
  GALS_IN_TOP: number;    // Galones totales en la campana (sección cónica)
  TOP_INCHES: number;     // Altura de la campana en pulgadas
  TOTAL_GALS: number;     // Capacidad total del tanque
}

export interface TankDataCollection {
  [key: string]: TankData;
}

// ============================================================================
// BASE DE DATOS DE TANQUES (153 TANQUES)
// ============================================================================

const tankData: TankDataCollection = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE BL - Tanques pequeños izquierda (4 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "BL1": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL2": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL3": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },
  "BL4": { "GALS_PER_INCH": 82.74, "GALS_IN_TOP": 373.56, "TOP_INCHES": 24.15, "TOTAL_GALS": 16239.42 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE BR - Tanques pequeños derecha (3 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "BR1": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },
  "BR2": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },
  "BR3": { "GALS_PER_INCH": 107.73, "GALS_IN_TOP": 478.88, "TOP_INCHES": 24.25, "TOTAL_GALS": 19523.87 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE A - Tanques grandes (15 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "A1": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A2": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A3": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A4": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A5": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A6": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A7": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A8": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A9": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A10": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A11": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A12": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A13": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A14": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },
  "A15": { "GALS_PER_INCH": 173.0, "GALS_IN_TOP": 1581.0, "TOP_INCHES": 34, "TOTAL_GALS": 52531.2 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE B - Tanques medianos (9 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "B1": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B2": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B3": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B4": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B5": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B6": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B7": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B8": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "B9": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE C - Tanques medianos + pequeños (15 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "C1": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C2": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C3": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C4": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C5": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C6": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C7": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C8": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C9": { "GALS_PER_INCH": 105.325, "GALS_IN_TOP": 916.9, "TOP_INCHES": 41, "TOTAL_GALS": 26051.88 },
  "C10": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C11": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C12": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C13": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C14": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },
  "C15": { "GALS_PER_INCH": 22.307, "GALS_IN_TOP": 91.08, "TOP_INCHES": 12.25, "TOTAL_GALS": 2748 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE D - Tanques variados (17 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "D1": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D2": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D3": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D4": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D5": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D6": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D7": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D8": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D9": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "D10": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "D11": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D12": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D13": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D14": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D15": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D16": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "D17": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE E - Tanques variados (17 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "E1": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E2": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E3": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E4": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E5": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E6": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E7": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E8": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E9": { "GALS_PER_INCH": 106.378, "GALS_IN_TOP": 897.904, "TOP_INCHES": 40.90, "TOTAL_GALS": 32932 },
  "E10": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },
  "E11": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E12": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E13": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E14": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E15": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E16": { "GALS_PER_INCH": 99.737, "GALS_IN_TOP": 652, "TOP_INCHES": 28.50, "TOTAL_GALS": 33212 },
  "E17": { "GALS_PER_INCH": 99.55, "GALS_IN_TOP": 636, "TOP_INCHES": 29, "TOTAL_GALS": 24734 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE F - Tanques pequeños variados (23 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "F1": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F2": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F3": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F4": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F5": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F6": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F7": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F8": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F9": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F10": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F11": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F12": { "GALS_PER_INCH": 44.678, "GALS_IN_TOP": 263.282, "TOP_INCHES": 19.90, "TOTAL_GALS": 6561.717 },
  "F13": { "GALS_PER_INCH": 39.7, "GALS_IN_TOP": 250, "TOP_INCHES": 18.50, "TOTAL_GALS": 5400 },
  "F14": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.50, "TOTAL_GALS": 7346 },
  "F15": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.50, "TOTAL_GALS": 7346 },
  "F16": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.50, "TOTAL_GALS": 7346 },
  "F17": { "GALS_PER_INCH": 53.8, "GALS_IN_TOP": 350, "TOP_INCHES": 18.50, "TOTAL_GALS": 7346 },
  "F18": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F19": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F20": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F21": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F22": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },
  "F23": { "GALS_PER_INCH": 43.6, "GALS_IN_TOP": 250, "TOP_INCHES": 17, "TOTAL_GALS": 5440 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE G - Tanques pequeños (15 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "G1": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G2": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G3": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G4": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G5": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G6": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G7": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G8": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G9": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G10": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G11": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G12": { "GALS_PER_INCH": 48.8, "GALS_IN_TOP": 238.6, "TOP_INCHES": 16, "TOTAL_GALS": 7112 },
  "G13": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },
  "G14": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },
  "G15": { "GALS_PER_INCH": 59.24, "GALS_IN_TOP": 350, "TOP_INCHES": 12, "TOTAL_GALS": 8700 },


  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE H - Tanques extra grandes (7 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "H1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "H7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE I - Tanques extra grandes (7 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "I1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "I7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE J - Tanques extra grandes (7 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "J1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "J7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE K - Tanques extra grandes (7 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "K1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "K7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIE L - Tanques extra grandes (7 tanques)
  // ═══════════════════════════════════════════════════════════════════════════
  "L1": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L2": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L3": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L4": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L5": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L6": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 },
  "L7": { "GALS_PER_INCH": 440.64, "GALS_IN_TOP": 7551.57, "TOP_INCHES": 58.25, "TOTAL_GALS": 161555 }
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Obtiene la lista de todos los nombres de tanques disponibles.
 * @returns Array ordenado de nombres de tanques
 */
export function getTankNames(): string[] {
  return Object.keys(tankData).sort((a, b) => {
    // Ordenar primero por letra, luego por número
    const letterA = a.replace(/[0-9]/g, '');
    const letterB = b.replace(/[0-9]/g, '');
    const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
    const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
    
    if (letterA !== letterB) {
      return letterA.localeCompare(letterB);
    }
    return numA - numB;
  });
}

/**
 * Obtiene los datos de un tanque específico.
 * @param tankName - Nombre del tanque (ej: "F12")
 * @returns Datos del tanque o undefined si no existe
 */
export function getTankData(tankName: string): TankData | undefined {
  return tankData[tankName.toUpperCase()];
}

/**
 * Verifica si un tanque existe en la base de datos.
 * @param tankName - Nombre del tanque
 * @returns true si el tanque existe
 */
export function tankExists(tankName: string): boolean {
  return tankName.toUpperCase() in tankData;
}

/**
 * Obtiene el número total de tanques en la base de datos.
 * @returns Número de tanques
 */
export function getTankCount(): number {
  return Object.keys(tankData).length;
}

/**
 * Agrupa los tanques por serie (letra).
 * @returns Objeto con series como claves y arrays de nombres como valores
 */
export function getTanksBySeries(): { [series: string]: string[] } {
  const grouped: { [series: string]: string[] } = {};
  
  for (const tankName of Object.keys(tankData)) {
    const series = tankName.replace(/[0-9]/g, '');
    if (!grouped[series]) {
      grouped[series] = [];
    }
    grouped[series].push(tankName);
  }
  
  // Ordenar cada serie por número
  for (const series of Object.keys(grouped)) {
    grouped[series].sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
      return numA - numB;
    });
  }
  
  return grouped;
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default tankData;
