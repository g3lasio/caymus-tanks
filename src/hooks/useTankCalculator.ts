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
    emptySpaceInches: number
  ): SpaceToGallonsResult => {
    if (emptySpaceInches < 0) {
      throw new Error('Inches of space must be a non-negative number');
    }
    
    if (emptySpaceInches > tankData.TOP_INCHES + (tankData.TOTAL_GALS - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH) {
      throw new Error('La medida de espacio no puede ser mayor que la altura total del tanque');
    }

    let convertedGallons = 0;
    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    
    const adjustedInches = emptySpaceInches - tankData.TOP_INCHES;
    
    if (adjustedInches < 0) {
      const topSectionEmptyGallons = (emptySpaceInches / tankData.TOP_INCHES) * tankData.GALS_IN_TOP;
      convertedGallons = topSectionEmptyGallons;
      topSectionGallons = topSectionEmptyGallons;
      mainBodyGallons = 0;
    } else {
      const mainBodyEmptyGallons = adjustedInches * tankData.GALS_PER_INCH;
      convertedGallons = mainBodyEmptyGallons + tankData.GALS_IN_TOP;
      mainBodyGallons = mainBodyEmptyGallons;
      topSectionGallons = tankData.GALS_IN_TOP;
    }
    
    const totalGallons = tankData.TOTAL_GALS - convertedGallons;
    const remainingGallons = convertedGallons;
    const fillPercentage = (totalGallons / tankData.TOTAL_GALS) * 100;

    return {
      mainBodyGallons,
      topSectionGallons,
      totalGallons,
      remainingGallons,
      fillPercentage
    };
  };

  const calculateGallonsToSpace = (
    tankData: TankData,
    desiredGallons: number
  ): GallonsToSpaceResult => {
    if (desiredGallons < 0 || desiredGallons > tankData.TOTAL_GALS) {
      throw new Error(`Los galones deseados deben estar entre 0 y ${tankData.TOTAL_GALS.toFixed(2)}`);
    }

    const emptyGallons = tankData.TOTAL_GALS - desiredGallons;
    const emptyMainBodyGallons = emptyGallons - tankData.GALS_IN_TOP;
    
    let requiredSpace = 0;
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (emptyMainBodyGallons <= 0) {
      mainBodyInches = 0;
      topSectionInches = tankData.TOP_INCHES * (emptyGallons / tankData.GALS_IN_TOP);
      requiredSpace = topSectionInches;
    } else {
      topSectionInches = tankData.TOP_INCHES;
      mainBodyInches = emptyMainBodyGallons / tankData.GALS_PER_INCH;
      requiredSpace = topSectionInches + mainBodyInches;
    }

    const fillPercentage = (desiredGallons / tankData.TOTAL_GALS) * 100;

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
