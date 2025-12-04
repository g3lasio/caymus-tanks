import { useState } from 'react';
import { TankData } from '@/data/tankData';

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

    // Fórmula original del script.js
    const galonesEnCuerpo = (espacioEnPulgadas - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
    const galonesTotales = galonesEnCuerpo + tankData.GALS_IN_TOP;
    const totalGallons = tankData.TOTAL_GALS - galonesTotales;
    
    // Para el breakdown de secciones
    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    
    if (espacioEnPulgadas <= tankData.TOP_INCHES) {
      // Espacio vacío solo en la sección top
      topSectionGallons = (espacioEnPulgadas / tankData.TOP_INCHES) * tankData.GALS_IN_TOP;
      mainBodyGallons = 0;
    } else {
      // Espacio vacío incluye todo el top y parte del cuerpo
      topSectionGallons = tankData.GALS_IN_TOP;
      mainBodyGallons = (espacioEnPulgadas - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
    }

    const remainingGallons = galonesTotales;
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

    // Fórmula original del script.js
    const galonesEspacio = tankData.TOTAL_GALS - galonesDeseados;
    let requiredSpace = 0;
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (galonesEspacio <= tankData.GALS_IN_TOP) {
      // El espacio vacío cabe en la sección top
      requiredSpace = galonesEspacio / tankData.GALS_PER_INCH;
      topSectionInches = requiredSpace;
      mainBodyInches = 0;
    } else {
      // El espacio vacío incluye todo el top y parte del cuerpo
      const galonesCuerpo = galonesEspacio - tankData.GALS_IN_TOP;
      const pulgadasCuerpo = galonesCuerpo / tankData.GALS_PER_INCH;
      requiredSpace = pulgadasCuerpo + tankData.TOP_INCHES;
      topSectionInches = tankData.TOP_INCHES;
      mainBodyInches = pulgadasCuerpo;
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
