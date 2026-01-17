/**
 * CAYMUS TANKS - Módulo Compartido
 * 
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Este módulo exporta toda la lógica y datos compartidos
 * entre la aplicación móvil y el cliente web.
 * 
 * @version 1.0.0
 * @date 2026-01-17
 */

// ============================================================================
// EXPORTACIONES DE DATOS DE TANQUES
// ============================================================================

export {
  default as tankData,
  getTankNames,
  getTankData,
  tankExists,
  getTankCount,
  getTanksBySeries,
  type TankData,
  type TankDataCollection
} from './tankData';

// ============================================================================
// EXPORTACIONES DE LÓGICA DE CÁLCULO
// ============================================================================

export {
  calculateSpaceToGallons,
  calculateGallonsToSpace,
  CAMPANA_EXPONENT,
  CAMPANA_MESSAGES,
  BODY_MESSAGE,
  type CalculationMode,
  type SpaceToGallonsResult,
  type GallonsToSpaceResult
} from './tankCalculator';
