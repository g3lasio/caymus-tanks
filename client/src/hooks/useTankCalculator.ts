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
    inchesSpace: number
  ): SpaceToGallonsResult => {
    // Validation
    if (inchesSpace < 0) {
      throw new Error('Inches of space must be a non-negative number');
    }

    let mainBodyGallons = 0;
    let topSectionGallons = 0;

    if (inchesSpace <= tankData.TOP_INCHES) {
      // Only space in top section
      topSectionGallons = (tankData.TOP_INCHES - inchesSpace) * 
        (tankData.GALS_IN_TOP / tankData.TOP_INCHES);
    } else {
      // Space in both top and main sections
      topSectionGallons = tankData.GALS_IN_TOP;
      mainBodyGallons = (inchesSpace - tankData.TOP_INCHES) * tankData.GALS_PER_INCH;
    }

    const totalGallons = mainBodyGallons + topSectionGallons;
    const remainingGallons = tankData.TOTAL_GALS - totalGallons;
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
    // Validation
    if (desiredGallons < 0 || desiredGallons > tankData.TOTAL_GALS) {
      throw new Error(`Desired gallons must be between 0 and ${tankData.TOTAL_GALS.toFixed(2)}`);
    }

    const gallonsSpace = tankData.TOTAL_GALS - desiredGallons;
    let requiredSpace = 0;
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (gallonsSpace <= tankData.GALS_IN_TOP) {
      // Space only in top section
      topSectionInches = (gallonsSpace / tankData.GALS_IN_TOP) * tankData.TOP_INCHES;
      requiredSpace = topSectionInches;
    } else {
      // Space in both top and main sections
      topSectionInches = tankData.TOP_INCHES;
      mainBodyInches = (gallonsSpace - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH;
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
