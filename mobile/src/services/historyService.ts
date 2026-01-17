/**
 * Servicio de Historial de Cálculos
 * 
 * Maneja el almacenamiento y recuperación del historial
 * de cálculos del usuario.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TIPOS
// ============================================================================

export interface CalculationRecord {
  id: string;
  timestamp: number;
  tankId: string;
  tankName: string;
  mode: 'space_to_gallons' | 'gallons_to_space';
  input: number;
  result: number;
  percentage: number;
  isInDome: boolean;
  precisionMessage?: string;
}

export interface HistoryStats {
  totalCalculations: number;
  mostUsedTank: string | null;
  averagePercentage: number;
  lastCalculation: number | null;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const HISTORY_KEY = '@caymus_tanks_history';
const MAX_HISTORY_ITEMS = 500; // Límite de registros
const MAX_FREE_HISTORY = 10; // Límite para usuarios free

// ============================================================================
// FUNCIONES
// ============================================================================

/**
 * Genera un ID único para cada registro.
 */
function generateId(): string {
  return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene todo el historial de cálculos.
 */
export async function getHistory(isPro: boolean = false): Promise<CalculationRecord[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return [];

    const history: CalculationRecord[] = JSON.parse(data);
    
    // Usuarios free solo ven los últimos 10
    if (!isPro) {
      return history.slice(0, MAX_FREE_HISTORY);
    }
    
    return history;
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

/**
 * Agrega un nuevo cálculo al historial.
 */
export async function addToHistory(record: Omit<CalculationRecord, 'id' | 'timestamp'>): Promise<CalculationRecord> {
  try {
    const newRecord: CalculationRecord = {
      ...record,
      id: generateId(),
      timestamp: Date.now(),
    };

    const data = await AsyncStorage.getItem(HISTORY_KEY);
    let history: CalculationRecord[] = data ? JSON.parse(data) : [];

    // Agregar al inicio
    history.unshift(newRecord);

    // Limitar tamaño
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    return newRecord;
  } catch (error) {
    console.error('Error adding to history:', error);
    throw error;
  }
}

/**
 * Elimina un registro específico del historial.
 */
export async function deleteFromHistory(id: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return;

    let history: CalculationRecord[] = JSON.parse(data);
    history = history.filter((record) => record.id !== id);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error deleting from history:', error);
    throw error;
  }
}

/**
 * Limpia todo el historial.
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}

/**
 * Obtiene estadísticas del historial.
 */
export async function getHistoryStats(): Promise<HistoryStats> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) {
      return {
        totalCalculations: 0,
        mostUsedTank: null,
        averagePercentage: 0,
        lastCalculation: null,
      };
    }

    const history: CalculationRecord[] = JSON.parse(data);
    
    if (history.length === 0) {
      return {
        totalCalculations: 0,
        mostUsedTank: null,
        averagePercentage: 0,
        lastCalculation: null,
      };
    }

    // Contar tanques más usados
    const tankCounts: Record<string, number> = {};
    let totalPercentage = 0;

    for (const record of history) {
      tankCounts[record.tankId] = (tankCounts[record.tankId] || 0) + 1;
      totalPercentage += record.percentage;
    }

    // Encontrar el tanque más usado
    let mostUsedTank: string | null = null;
    let maxCount = 0;
    for (const [tankId, count] of Object.entries(tankCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsedTank = tankId;
      }
    }

    return {
      totalCalculations: history.length,
      mostUsedTank,
      averagePercentage: totalPercentage / history.length,
      lastCalculation: history[0]?.timestamp || null,
    };
  } catch (error) {
    console.error('Error getting history stats:', error);
    return {
      totalCalculations: 0,
      mostUsedTank: null,
      averagePercentage: 0,
      lastCalculation: null,
    };
  }
}

/**
 * Busca en el historial por tanque.
 */
export async function searchHistory(
  tankId?: string,
  startDate?: number,
  endDate?: number
): Promise<CalculationRecord[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return [];

    let history: CalculationRecord[] = JSON.parse(data);

    if (tankId) {
      history = history.filter((record) => record.tankId === tankId);
    }

    if (startDate) {
      history = history.filter((record) => record.timestamp >= startDate);
    }

    if (endDate) {
      history = history.filter((record) => record.timestamp <= endDate);
    }

    return history;
  } catch (error) {
    console.error('Error searching history:', error);
    return [];
  }
}

/**
 * Exporta el historial como JSON.
 */
export async function exportHistory(): Promise<string> {
  try {
    const history = await getHistory(true);
    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error('Error exporting history:', error);
    throw error;
  }
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  getHistory,
  addToHistory,
  deleteFromHistory,
  clearHistory,
  getHistoryStats,
  searchHistory,
  exportHistory,
};
