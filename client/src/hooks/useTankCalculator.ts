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
    emptySpaceInches: number
  ): SpaceToGallonsResult => {
    // Validation
    if (emptySpaceInches < 0) {
      throw new Error('Inches of space must be a non-negative number');
    }
    
    if (emptySpaceInches > tankData.TOP_INCHES + (tankData.TOTAL_GALS - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH) {
      throw new Error('La medida de espacio no puede ser mayor que la altura total del tanque');
    }

    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    
    // El espacio vacío es lo que se mide desde la parte superior
    if (emptySpaceInches < tankData.TOP_INCHES) {
      // El espacio vacío está solo en la sección superior
      // Por lo tanto, se ha llenado parte de la sección superior
      topSectionGallons = tankData.GALS_IN_TOP - (emptySpaceInches * (tankData.GALS_IN_TOP / tankData.TOP_INCHES));
      // El cuerpo principal está completamente vacío
      mainBodyGallons = 0;
    } else {
      // El espacio vacío incluye toda la sección superior y parte del cuerpo principal
      // La sección superior está completamente llena
      topSectionGallons = tankData.GALS_IN_TOP;
      
      // Calculamos cuántos galones hay en el cuerpo principal
      // Primero, determinamos cuántas pulgadas del cuerpo principal están llenas
      const filledMainBodyInches = (tankData.TOTAL_GALS - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH - (emptySpaceInches - tankData.TOP_INCHES);
      
      // Si hay pulgadas llenas en el cuerpo principal, calculamos los galones
      if (filledMainBodyInches > 0) {
        mainBodyGallons = filledMainBodyInches * tankData.GALS_PER_INCH;
      }
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
      throw new Error(`Los galones deseados deben estar entre 0 y ${tankData.TOTAL_GALS.toFixed(2)}`);
    }

    // Calculamos el espacio vacío en galones
    const emptyGallons = tankData.TOTAL_GALS - desiredGallons;
    let requiredSpace = 0; // Espacio vacío en pulgadas (lo que medirá el empleado)
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (desiredGallons <= tankData.GALS_IN_TOP) {
      // El vino solo llega a la sección superior
      // Calculamos qué porción de la sección superior está ocupada
      const filledTopPortion = desiredGallons / tankData.GALS_IN_TOP;
      // El espacio vacío en la sección superior
      topSectionInches = tankData.TOP_INCHES * (1 - filledTopPortion);
      // Todo el espacio del cuerpo principal está vacío
      mainBodyInches = (tankData.TOTAL_GALS - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH;
      requiredSpace = topSectionInches + mainBodyInches;
    } else {
      // El vino ocupa toda la sección superior y parte del cuerpo principal
      // La sección superior está completamente llena, no hay espacio vacío allí
      topSectionInches = 0;
      
      // Calculamos los galones que ocupan el cuerpo principal
      const mainBodyGallons = desiredGallons - tankData.GALS_IN_TOP;
      // Calculamos las pulgadas llenas en el cuerpo principal
      const filledMainBodyInches = mainBodyGallons / tankData.GALS_PER_INCH;
      // El espacio vacío en el cuerpo principal
      mainBodyInches = (tankData.TOTAL_GALS - tankData.GALS_IN_TOP) / tankData.GALS_PER_INCH - filledMainBodyInches;
      requiredSpace = mainBodyInches;
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
