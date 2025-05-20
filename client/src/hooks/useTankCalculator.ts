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

    // NUEVA IMPLEMENTACIÓN SEGÚN LA FÓRMULA CORRECTA
    let convertedGallons = 0;
    let mainBodyGallons = 0;
    let topSectionGallons = 0;
    
    // 1. Restar TOP_INCHES del espacio vacío ingresado
    const adjustedInches = emptySpaceInches - tankData.TOP_INCHES;
    
    if (adjustedInches < 0) {
      // Si el resultado es negativo, significa que solo hay espacio en la sección superior
      convertedGallons = tankData.GALS_IN_TOP;
      topSectionGallons = tankData.GALS_IN_TOP;
      mainBodyGallons = 0;
    } else {
      // 2. Multiplicar el resultado por GALS_PER_INCH
      const mainBodyEmptyGallons = adjustedInches * tankData.GALS_PER_INCH;
      
      // 3. Sumar GALS_IN_TOP
      convertedGallons = mainBodyEmptyGallons + tankData.GALS_IN_TOP;
      
      mainBodyGallons = mainBodyEmptyGallons;
      topSectionGallons = tankData.GALS_IN_TOP;
    }
    
    // Calculamos el total de galones vacíos (convertedGallons)
    
    // El vino en el tanque es el total menos los galones vacíos
    const totalGallons = tankData.TOTAL_GALS - convertedGallons;
    
    // Los galones restantes son los que aún se pueden añadir (galones vacíos)
    const remainingGallons = convertedGallons;
    
    // El porcentaje de llenado es el total de vino entre la capacidad total
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

    // Calculamos el espacio vacío en galones (lo que NO está ocupado por vino)
    const emptyGallons = tankData.TOTAL_GALS - desiredGallons;
    
    // Calculamos cuántos galones de espacio vacío hay en el cuerpo principal (sin contar el top)
    const emptyMainBodyGallons = emptyGallons - tankData.GALS_IN_TOP;
    
    let requiredSpace = 0; // Espacio vacío en pulgadas (lo que medirá el empleado)
    let mainBodyInches = 0;
    let topSectionInches = 0;

    if (emptyMainBodyGallons <= 0) {
      // Si emptyMainBodyGallons es negativo o cero, significa que parte o toda la sección top está ocupada
      // El cuerpo principal está completamente lleno
      mainBodyInches = 0;
      
      // El espacio en la sección top es proporcional a la cantidad de galones vacíos
      topSectionInches = tankData.TOP_INCHES * (emptyGallons / tankData.GALS_IN_TOP);
      
      // El espacio total a medir es solo lo que hay en la sección top
      requiredSpace = topSectionInches;
    } else {
      // El cuerpo principal tiene espacio vacío
      // Toda la sección top está vacía
      topSectionInches = tankData.TOP_INCHES;
      
      // Convertimos los galones vacíos del cuerpo principal a pulgadas
      mainBodyInches = emptyMainBodyGallons / tankData.GALS_PER_INCH;
      
      // El espacio total a medir es la suma del espacio en top + espacio en cuerpo principal
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
