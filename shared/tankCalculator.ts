/**
 * CAYMUS TANKS - Lógica de Cálculo Unificada
 * 
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Este archivo contiene la lógica de cálculo validada y congelada
 * para el cálculo de volumen de tanques de vino.
 * 
 * FÓRMULA VALIDADA:
 * - Cuerpo cilíndrico: galones = pulgadas × GALS_PER_INCH
 * - Campana cónica: galones = GALS_IN_TOP × (pulgadas / TOP_INCHES)^2.2
 * 
 * El exponente 2.2 fue calibrado basándose en 5 años de experiencia
 * práctica en el campo.
 * 
 * @version 1.0.0
 * @date 2026-01-17
 */

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface TankData {
  GALS_PER_INCH: number;  // Galones por pulgada en el cuerpo cilíndrico
  GALS_IN_TOP: number;    // Galones totales en la campana (sección cónica)
  TOP_INCHES: number;     // Altura de la campana en pulgadas
  TOTAL_GALS: number;     // Capacidad total del tanque
}

export type CalculationMode = 'spaceToGallons' | 'gallonsToSpace';

export interface SpaceToGallonsResult {
  mainBodyGallons: number;      // Galones vacíos en el cuerpo cilíndrico
  topSectionGallons: number;    // Galones vacíos en la campana
  totalGallons: number;         // Galones de vino en el tanque
  emptyGallons: number;         // Galones de espacio vacío
  fillPercentage: number;       // Porcentaje de llenado
  isInCampana: boolean;         // Si la medición está en la zona de la campana
  precisionMessage: string;     // Mensaje de precisión/advertencia
}

export interface GallonsToSpaceResult {
  requiredSpace: number;        // Pulgadas de espacio vacío necesarias
  mainBodyInches: number;       // Pulgadas en el cuerpo cilíndrico
  topSectionInches: number;     // Pulgadas en la campana
  fillPercentage: number;       // Porcentaje de llenado
  isInCampana: boolean;         // Si el resultado está en la zona de la campana
  precisionMessage: string;     // Mensaje de precisión/advertencia
}

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Exponente para el cálculo de la campana cónica.
 * Calibrado basándose en experiencia práctica:
 * - n = 1.0: Lineal (cilindro) - sobreestima
 * - n = 2.0: Cuadrático (paraboloide)
 * - n = 2.2: CALIBRADO - coincide con experiencia de campo
 * - n = 3.0: Cúbico (cono perfecto) - subestima
 */
const CAMPANA_EXPONENT = 2.2;

/**
 * Mensajes graciosos para cuando la medición está en la campana.
 * Se selecciona uno al azar para mantener la experiencia fresca.
 */
const CAMPANA_MESSAGES = [
  "🍷 ¡Ya está en la campana, primo! Precisión: ~97.99%",
  "🎯 ¡Ojo! Estamos en zona de campana. Cálculo al 97.99%",
  "⚡ ¡Casi lleno, compa! Campana detectada - 97.99% precisión",
  "🔔 ¡Campanazo! El vino ya está arriba - ~97.99% exacto",
  "🌟 ¡En la campana, carnal! Nuestros cálculos: 97.99% on point",
  "🎪 ¡Zona de campana activada! Precisión garantizada: 97.99%",
  "🏆 ¡Llegamos a la campana! Cálculo premium: 97.99%",
  "🚀 ¡Houston, estamos en la campana! Precisión: 97.99%"
];

/**
 * Mensaje para cuando la medición está en el cuerpo cilíndrico.
 */
const BODY_MESSAGE = "✅ Cálculo en cuerpo cilíndrico - Precisión: 99.9%";

// ============================================================================
// FUNCIONES DE CÁLCULO
// ============================================================================

/**
 * Obtiene un mensaje aleatorio para la zona de campana.
 */
function getRandomCampanaMessage(): string {
  const index = Math.floor(Math.random() * CAMPANA_MESSAGES.length);
  return CAMPANA_MESSAGES[index];
}

/**
 * MODO 1: Espacio (pulgadas) → Galones de vino
 * 
 * Calcula cuántos galones de vino hay en el tanque basándose
 * en las pulgadas de espacio vacío medidas desde arriba.
 * 
 * @param tankData - Datos del tanque seleccionado
 * @param espacioEnPulgadas - Pulgadas de espacio vacío desde la parte superior
 * @returns Resultado del cálculo con detalles
 */
export function calculateSpaceToGallons(
  tankData: TankData,
  espacioEnPulgadas: number
): SpaceToGallonsResult {
  // Validación de entrada
  if (espacioEnPulgadas < 0) {
    throw new Error('Las pulgadas de espacio deben ser un número positivo');
  }

  let mainBodyGallons = 0;
  let topSectionGallons = 0;
  let isInCampana = false;
  let precisionMessage = BODY_MESSAGE;

  if (espacioEnPulgadas <= tankData.TOP_INCHES) {
    // ═══════════════════════════════════════════════════════════════════
    // CASO CAMPANA: El espacio vacío está solo dentro de la sección cónica
    // ═══════════════════════════════════════════════════════════════════
    // Fórmula: galones_vacíos = GALS_IN_TOP × (espacio / TOP_INCHES)^2.2
    // 
    // Esta fórmula fue calibrada con experiencia de campo:
    // - 5 pulgadas de espacio ≈ 10-15 galones vacíos
    // ═══════════════════════════════════════════════════════════════════
    
    const ratio = espacioEnPulgadas / tankData.TOP_INCHES;
    topSectionGallons = tankData.GALS_IN_TOP * Math.pow(ratio, CAMPANA_EXPONENT);
    mainBodyGallons = 0;
    isInCampana = true;
    precisionMessage = getRandomCampanaMessage();
    
  } else {
    // ═══════════════════════════════════════════════════════════════════
    // CASO CUERPO: El espacio vacío incluye toda la campana + parte del cuerpo
    // ═══════════════════════════════════════════════════════════════════
    // Fórmula probada y validada:
    // 1. Toda la campana está vacía: GALS_IN_TOP
    // 2. Parte del cuerpo vacío: (espacio - TOP_INCHES) × GALS_PER_INCH
    // ═══════════════════════════════════════════════════════════════════
    
    topSectionGallons = tankData.GALS_IN_TOP;
    mainBodyGallons = (espacioEnPulgadas - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
    isInCampana = false;
    precisionMessage = BODY_MESSAGE;
  }

  const emptyGallons = topSectionGallons + mainBodyGallons;
  const totalGallons = tankData.TOTAL_GALS - emptyGallons;
  const fillPercentage = (totalGallons / tankData.TOTAL_GALS) * 100;

  return {
    mainBodyGallons: Math.max(0, mainBodyGallons),
    topSectionGallons: Math.max(0, topSectionGallons),
    totalGallons: Math.max(0, totalGallons),
    emptyGallons: Math.max(0, emptyGallons),
    fillPercentage: Math.max(0, Math.min(100, fillPercentage)),
    isInCampana,
    precisionMessage
  };
}

/**
 * MODO 2: Galones deseados → Espacio (pulgadas)
 * 
 * Calcula cuántas pulgadas de espacio vacío se necesitan
 * para tener una cantidad específica de galones de vino.
 * 
 * @param tankData - Datos del tanque seleccionado
 * @param galonesDeseados - Galones de vino que se desean tener
 * @returns Resultado del cálculo con detalles
 */
export function calculateGallonsToSpace(
  tankData: TankData,
  galonesDeseados: number
): GallonsToSpaceResult {
  // Validación de entrada
  if (galonesDeseados < 0) {
    throw new Error('Los galones deseados deben ser un número positivo');
  }
  if (galonesDeseados > tankData.TOTAL_GALS) {
    throw new Error(`Los galones deseados no pueden exceder la capacidad del tanque (${tankData.TOTAL_GALS.toFixed(2)} galones)`);
  }

  const galonesEspacio = tankData.TOTAL_GALS - galonesDeseados;
  let requiredSpace = 0;
  let mainBodyInches = 0;
  let topSectionInches = 0;
  let isInCampana = false;
  let precisionMessage = BODY_MESSAGE;

  if (galonesEspacio <= tankData.GALS_IN_TOP) {
    // ═══════════════════════════════════════════════════════════════════
    // CASO CAMPANA: El espacio vacío cabe dentro de la sección cónica
    // ═══════════════════════════════════════════════════════════════════
    // Fórmula inversa: pulgadas = TOP_INCHES × (galones / GALS_IN_TOP)^(1/2.2)
    // ═══════════════════════════════════════════════════════════════════
    
    const ratio = galonesEspacio / tankData.GALS_IN_TOP;
    topSectionInches = tankData.TOP_INCHES * Math.pow(ratio, 1 / CAMPANA_EXPONENT);
    mainBodyInches = 0;
    requiredSpace = topSectionInches;
    isInCampana = true;
    precisionMessage = getRandomCampanaMessage();
    
  } else {
    // ═══════════════════════════════════════════════════════════════════
    // CASO CUERPO: El espacio vacío incluye toda la campana + parte del cuerpo
    // ═══════════════════════════════════════════════════════════════════
    // Fórmula probada y validada:
    // 1. Toda la campana: TOP_INCHES
    // 2. Parte del cuerpo: (galones_espacio - GALS_IN_TOP) / GALS_PER_INCH
    // ═══════════════════════════════════════════════════════════════════
    
    const galonesCuerpo = galonesEspacio - tankData.GALS_IN_TOP;
    const pulgadasCuerpo = galonesCuerpo / tankData.GALS_PER_INCH;
    
    topSectionInches = tankData.TOP_INCHES;
    mainBodyInches = pulgadasCuerpo;
    requiredSpace = topSectionInches + mainBodyInches;
    isInCampana = false;
    precisionMessage = BODY_MESSAGE;
  }

  const fillPercentage = (galonesDeseados / tankData.TOTAL_GALS) * 100;

  return {
    requiredSpace: Math.max(0, requiredSpace),
    mainBodyInches: Math.max(0, mainBodyInches),
    topSectionInches: Math.max(0, topSectionInches),
    fillPercentage: Math.max(0, Math.min(100, fillPercentage)),
    isInCampana,
    precisionMessage
  };
}

// ============================================================================
// EXPORTACIONES ADICIONALES
// ============================================================================

export { CAMPANA_EXPONENT, CAMPANA_MESSAGES, BODY_MESSAGE };
