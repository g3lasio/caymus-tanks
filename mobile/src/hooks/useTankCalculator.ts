/**
 * Hook de React para el cálculo de tanques de vino.
 * 
 * Este hook utiliza la lógica unificada de shared/tankCalculator.ts
 * con el exponente 2.2 calibrado para la campana cónica.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import { useState } from 'react';
import { TankData } from '../data/tankData';

// ============================================================================
// CONSTANTES (importadas de shared/tankCalculator.ts)
// ============================================================================

/**
 * Exponente calibrado para el cálculo de la campana cónica.
 * Validado con 5 años de experiencia práctica.
 */
const CAMPANA_EXPONENT = 2.2;

/**
 * Mensajes graciosos para cuando la medición está en la campana.
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

const BODY_MESSAGE = "✅ Cálculo en cuerpo cilíndrico - Precisión: 99.9%";

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type CalculationMode = 'spaceToGallons' | 'gallonsToSpace';

export interface SpaceToGallonsResult {
  mainBodyGallons: number;
  topSectionGallons: number;
  totalGallons: number;
  remainingGallons: number;
  fillPercentage: number;
  isInCampana: boolean;
  precisionMessage: string;
}

export interface GallonsToSpaceResult {
  requiredSpace: number;
  mainBodyInches: number;
  topSectionInches: number;
  fillPercentage: number;
  isInCampana: boolean;
  precisionMessage: string;
}

export type CalculationResult = SpaceToGallonsResult | GallonsToSpaceResult;

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

function getRandomCampanaMessage(): string {
  const index = Math.floor(Math.random() * CAMPANA_MESSAGES.length);
  return CAMPANA_MESSAGES[index];
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useTankCalculator = () => {
  const [mode, setMode] = useState<CalculationMode>('spaceToGallons');
  const [result, setResult] = useState<CalculationResult | null>(null);

  /**
   * MODO 1: Espacio (pulgadas) → Galones de vino
   * 
   * Fórmula validada:
   * - Campana: galones_vacíos = GALS_IN_TOP × (espacio / TOP_INCHES)^2.2
   * - Cuerpo: galones_vacíos = GALS_IN_TOP + (espacio - TOP_INCHES) × GALS_PER_INCH
   */
  const calculateSpaceToGallons = (
    tankData: TankData,
    espacioEnPulgadas: number
  ): SpaceToGallonsResult => {
    if (espacioEnPulgadas < 0) {
      throw new Error('Las pulgadas de espacio deben ser un número positivo');
    }

    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    let isInCampana = false;
    let precisionMessage = BODY_MESSAGE;

    if (espacioEnPulgadas <= tankData.TOP_INCHES) {
      // ═══════════════════════════════════════════════════════════════════
      // CASO CAMPANA: Usar exponente 2.2 calibrado
      // ═══════════════════════════════════════════════════════════════════
      const ratio = espacioEnPulgadas / tankData.TOP_INCHES;
      topSectionGallons = tankData.GALS_IN_TOP * Math.pow(ratio, CAMPANA_EXPONENT);
      mainBodyGallons = 0;
      isInCampana = true;
      precisionMessage = getRandomCampanaMessage();
    } else {
      // ═══════════════════════════════════════════════════════════════════
      // CASO CUERPO: Fórmula estándar validada
      // ═══════════════════════════════════════════════════════════════════
      topSectionGallons = tankData.GALS_IN_TOP;
      mainBodyGallons = (espacioEnPulgadas - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
      isInCampana = false;
      precisionMessage = BODY_MESSAGE;
    }

    const galonesVacios = topSectionGallons + mainBodyGallons;
    const totalGallons = tankData.TOTAL_GALS - galonesVacios;
    const fillPercentage = (totalGallons / tankData.TOTAL_GALS) * 100;

    return {
      mainBodyGallons: Math.max(0, mainBodyGallons),
      topSectionGallons: Math.max(0, topSectionGallons),
      totalGallons: Math.max(0, totalGallons),
      remainingGallons: Math.max(0, galonesVacios),
      fillPercentage: Math.max(0, Math.min(100, fillPercentage)),
      isInCampana,
      precisionMessage
    };
  };

  /**
   * MODO 2: Galones deseados → Espacio (pulgadas)
   * 
   * Fórmula inversa validada:
   * - Campana: espacio = TOP_INCHES × (galones_espacio / GALS_IN_TOP)^(1/2.2)
   * - Cuerpo: espacio = TOP_INCHES + (galones_espacio - GALS_IN_TOP) / GALS_PER_INCH
   */
  const calculateGallonsToSpace = (
    tankData: TankData,
    galonesDeseados: number
  ): GallonsToSpaceResult => {
    if (galonesDeseados < 0) {
      throw new Error('Los galones deseados deben ser un número positivo');
    }
    if (galonesDeseados > tankData.TOTAL_GALS) {
      throw new Error(`Los galones deseados no pueden exceder ${tankData.TOTAL_GALS.toFixed(2)}`);
    }

    const galonesEspacio = tankData.TOTAL_GALS - galonesDeseados;
    let requiredSpace = 0;
    let mainBodyInches = 0;
    let topSectionInches = 0;
    let isInCampana = false;
    let precisionMessage = BODY_MESSAGE;

    if (galonesEspacio <= tankData.GALS_IN_TOP) {
      // ═══════════════════════════════════════════════════════════════════
      // CASO CAMPANA: Fórmula inversa con exponente 2.2
      // ═══════════════════════════════════════════════════════════════════
      const ratio = galonesEspacio / tankData.GALS_IN_TOP;
      topSectionInches = tankData.TOP_INCHES * Math.pow(ratio, 1 / CAMPANA_EXPONENT);
      mainBodyInches = 0;
      requiredSpace = topSectionInches;
      isInCampana = true;
      precisionMessage = getRandomCampanaMessage();
    } else {
      // ═══════════════════════════════════════════════════════════════════
      // CASO CUERPO: Fórmula estándar validada
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
  };

  const calculate = (
    tankData: TankData,
    value: number
  ): CalculationResult => {
    if (mode === 'spaceToGallons') {
      return calculateSpaceToGallons(tankData, value);
    } else {
      return calculateGallonsToSpace(tankData, value);
    }
  };

  return {
    mode,
    setMode,
    result,
    setResult,
    calculate,
    isSpaceToGallons: (result: CalculationResult): result is SpaceToGallonsResult => {
      return mode === 'spaceToGallons';
    },
    isGallonsToSpace: (result: CalculationResult): result is GallonsToSpaceResult => {
      return mode === 'gallonsToSpace';
    }
  };
};

// Exportar constantes para uso en otros componentes
export { CAMPANA_EXPONENT, CAMPANA_MESSAGES, BODY_MESSAGE };
