/**
 * Hook de Suscripción
 * 
 * Maneja el estado de suscripción del usuario y proporciona
 * funciones para comprar, restaurar y verificar suscripciones.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import { useState, useEffect, useCallback } from 'react';
import { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import subscriptionService, {
  SubscriptionStatus,
  SubscriptionPackage,
} from '../services/subscriptionService';

// ============================================================================
// TIPOS
// ============================================================================

interface UseSubscriptionReturn {
  // Estado
  status: SubscriptionStatus;
  packages: SubscriptionPackage[];
  isLoading: boolean;
  error: string | null;
  
  // Funciones
  checkStatus: () => Promise<void>;
  loadPackages: () => Promise<void>;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  openManagement: () => Promise<void>;
  
  // Helpers
  isPro: boolean;
  canAccessFeature: (feature: string) => boolean;
}

// ============================================================================
// CARACTERÍSTICAS POR PLAN
// ============================================================================

const FREE_FEATURES = [
  'basic_calculation',
  'tank_selection',
];

const PRO_FEATURES = [
  ...FREE_FEATURES,
  'calculation_history',
  'cloud_sync',
  'export_reports',
  'multiple_devices',
  'priority_support',
  'offline_mode',
  'custom_tanks',
];

// ============================================================================
// HOOK
// ============================================================================

export function useSubscription(): UseSubscriptionReturn {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isActive: false,
    plan: 'free',
    willRenew: false,
  });
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica el estado actual de la suscripción.
   */
  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentStatus = await subscriptionService.getSubscriptionStatus();
      setStatus(currentStatus);
    } catch (err) {
      console.error('Error checking subscription status:', err);
      setError('Error al verificar suscripción');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Carga los paquetes de suscripción disponibles.
   */
  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const availablePackages = await subscriptionService.getOfferings();
      setPackages(availablePackages);
    } catch (err) {
      console.error('Error loading packages:', err);
      setError('Error al cargar planes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Realiza la compra de un paquete.
   */
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await subscriptionService.purchasePackage(pkg);

      if (result.success) {
        await checkStatus();
        return true;
      } else {
        setError(result.error || 'Error en la compra');
        return false;
      }
    } catch (err) {
      console.error('Error purchasing:', err);
      setError('Error al procesar la compra');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkStatus]);

  /**
   * Restaura las compras anteriores.
   */
  const restore = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await subscriptionService.restorePurchases();

      if (result.success) {
        await checkStatus();
        return result.isActive;
      } else {
        setError(result.error || 'Error al restaurar');
        return false;
      }
    } catch (err) {
      console.error('Error restoring:', err);
      setError('Error al restaurar compras');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkStatus]);

  /**
   * Abre la página de gestión de suscripciones.
   */
  const openManagement = useCallback(async () => {
    try {
      await subscriptionService.openSubscriptionManagement();
    } catch (err) {
      console.error('Error opening management:', err);
      setError('Error al abrir configuración');
    }
  }, []);

  /**
   * Verifica si el usuario puede acceder a una característica.
   */
  const canAccessFeature = useCallback((feature: string): boolean => {
    if (status.isActive) {
      return PRO_FEATURES.includes(feature);
    }
    return FREE_FEATURES.includes(feature);
  }, [status.isActive]);

  // Verificar estado al montar
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Escuchar cambios en la información del cliente
  useEffect(() => {
    const removeListener = subscriptionService.addCustomerInfoListener(
      (customerInfo: CustomerInfo) => {
        checkStatus();
      }
    );

    return removeListener;
  }, [checkStatus]);

  return {
    status,
    packages,
    isLoading,
    error,
    checkStatus,
    loadPackages,
    purchase,
    restore,
    openManagement,
    isPro: status.isActive,
    canAccessFeature,
  };
}

export default useSubscription;
