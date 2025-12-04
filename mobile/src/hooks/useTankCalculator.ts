import { useState } from 'react';
import { TankData } from '../data/tankData';

export type CalculationMode = 'spaceToGallons' | 'gallonsToSpace';

export interface SpaceToGallonsResult {
  mainBodyGallons: number;
  topSectionGallons: number;
  totalGallons: number;
  remainingGallons: number;
  fillPercentage: number;
}

export interface GallonsToSpaceResult {
  requiredSpace: number;
  mainBodyInches: number;
  topSectionInches: number;
  fillPercentage: number;
}

export type CalculationResult = SpaceToGallonsResult | GallonsToSpaceResult;

export const useTankCalculator = () => {
  const [mode, setMode] = useState<CalculationMode>('spaceToGallons');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateSpaceToGallons = (
    tankData: TankData,
    espacioEnPulgadas: number
  ): SpaceToGallonsResult => {
    if (espacioEnPulgadas < 0) {
      throw new Error('Inches of space must be a non-negative number');
    }

    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    let galonesVacios = 0;
    
    if (espacioEnPulgadas <= tankData.TOP_INCHES) {
      // CASO CAMPANA: Espacio vacío está solo dentro de la sección cónica (top)
      // Usamos proporcionalidad lineal para el cono: pulgadas/altura_total × capacidad_total
      topSectionGallons = (espacioEnPulgadas / tankData.TOP_INCHES) * tankData.GALS_IN_TOP;
      mainBodyGallons = 0;
      galonesVacios = topSectionGallons;
    } else {
      // CASO CUERPO: Espacio vacío incluye toda la campana + parte del cuerpo cilíndrico
      // Fórmula original del script.js para el cuerpo cilíndrico
      topSectionGallons = tankData.GALS_IN_TOP;
      mainBodyGallons = (espacioEnPulgadas - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
      galonesVacios = topSectionGallons + mainBodyGallons;
    }

    const totalGallons = tankData.TOTAL_GALS - galonesVacios;
    const remainingGallons = galonesVacios;
    const fillPercentage = (totalGallons / tankData.TOTAL_GALS) * 100;

    return {
      mainBodyGallons,
      topSectionGallons,
      totalGallons: Math.max(0, totalGallons),
      remainingGallons: Math.max(0, remainingGallons),
      fillPercentage: Math.max(0, Math.min(100, fillPercentage))
    };
  };

  const calculateGallonsToSpace = (
    tankData: TankData,
    galonesDeseados: number
  ): GallonsToSpaceResult => {
    if (galonesDeseados < 0 || galonesDeseados > tankData.TOTAL_GALS) {
      throw new Error(`Los galones deseados deben estar entre 0 y ${tankData.TOTAL_GALS.toFixed(2)}`);
    }

    const galonesEspacio = tankData.TOTAL_GALS - galonesDeseados;
    let requiredSpace = 0;
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (galonesEspacio <= tankData.GALS_IN_TOP) {
      // CASO CAMPANA: El espacio vacío cabe dentro de la sección cónica (top)
      // Usamos proporcionalidad lineal inversa: galones/capacidad_total × altura_total
      topSectionInches = (galonesEspacio / tankData.GALS_IN_TOP) * tankData.TOP_INCHES;
      mainBodyInches = 0;
      requiredSpace = topSectionInches;
    } else {
      // CASO CUERPO: El espacio vacío incluye toda la campana + parte del cuerpo cilíndrico
      // Fórmula original del script.js para el cuerpo cilíndrico
      const galonesCuerpo = galonesEspacio - tankData.GALS_IN_TOP;
      const pulgadasCuerpo = galonesCuerpo / tankData.GALS_PER_INCH;
      topSectionInches = tankData.TOP_INCHES;
      mainBodyInches = pulgadasCuerpo;
      requiredSpace = topSectionInches + mainBodyInches;
    }

    const fillPercentage = (galonesDeseados / tankData.TOTAL_GALS) * 100;

    return {
      requiredSpace,
      mainBodyInches,
      topSectionInches,
      fillPercentage
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
