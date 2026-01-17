/**
 * Servicio de Suscripciones con RevenueCat
 * 
 * Este servicio maneja las suscripciones de usuarios mediante
 * RevenueCat para iOS y Android.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOfferings,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// Claves de API de RevenueCat (configurar en producción)
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID || '';

// Identificadores de productos
export const PRODUCT_IDS = {
  MONTHLY: 'caymus_pro_monthly',
  YEARLY: 'caymus_pro_yearly',
  LIFETIME: 'caymus_pro_lifetime',
};

// Identificador del entitlement premium
const ENTITLEMENT_ID = 'pro';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_yearly' | 'pro_lifetime';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan;
  expiresAt?: Date;
  willRenew: boolean;
}

export interface SubscriptionPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  pricePerMonth?: string;
  package: PurchasesPackage;
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

let isInitialized = false;

/**
 * Inicializa el SDK de RevenueCat.
 * Debe llamarse al inicio de la aplicación.
 */
export async function initializeSubscriptions(): Promise<void> {
  if (isInitialized) return;

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.warn('RevenueCat API key not configured');
      return;
    }

    Purchases.configure({ apiKey });
    isInitialized = true;
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    throw error;
  }
}

/**
 * Identifica al usuario en RevenueCat.
 * Debe llamarse después de la autenticación.
 */
export async function identifyUser(userId: string): Promise<void> {
  try {
    if (!isInitialized) {
      await initializeSubscriptions();
    }
    await Purchases.logIn(userId);
    console.log(`User ${userId} identified in RevenueCat`);
  } catch (error) {
    console.error('Error identifying user:', error);
    throw error;
  }
}

/**
 * Cierra la sesión del usuario en RevenueCat.
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('User logged out from RevenueCat');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}

// ============================================================================
// CONSULTAS DE SUSCRIPCIÓN
// ============================================================================

/**
 * Obtiene el estado actual de la suscripción del usuario.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    if (!isInitialized) {
      return { isActive: false, plan: 'free', willRenew: false };
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (!entitlement) {
      return { isActive: false, plan: 'free', willRenew: false };
    }

    // Determinar el plan basado en el producto
    let plan: SubscriptionPlan = 'free';
    if (entitlement.productIdentifier.includes('monthly')) {
      plan = 'pro_monthly';
    } else if (entitlement.productIdentifier.includes('yearly')) {
      plan = 'pro_yearly';
    } else if (entitlement.productIdentifier.includes('lifetime')) {
      plan = 'pro_lifetime';
    }

    return {
      isActive: true,
      plan,
      expiresAt: entitlement.expirationDate ? new Date(entitlement.expirationDate) : undefined,
      willRenew: entitlement.willRenew,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { isActive: false, plan: 'free', willRenew: false };
  }
}

/**
 * Verifica si el usuario tiene acceso premium.
 */
export async function hasPremiumAccess(): Promise<boolean> {
  const status = await getSubscriptionStatus();
  return status.isActive;
}

// ============================================================================
// OFERTAS Y PAQUETES
// ============================================================================

/**
 * Obtiene las ofertas de suscripción disponibles.
 */
export async function getOfferings(): Promise<SubscriptionPackage[]> {
  try {
    if (!isInitialized) {
      await initializeSubscriptions();
    }

    const offerings = await Purchases.getOfferings();
    const packages: SubscriptionPackage[] = [];

    if (offerings.current?.availablePackages) {
      for (const pkg of offerings.current.availablePackages) {
        const product = pkg.product;
        
        let pricePerMonth: string | undefined;
        
        // Calcular precio mensual para planes anuales
        if (pkg.identifier.includes('yearly') && product.price) {
          const monthlyPrice = product.price / 12;
          pricePerMonth = `${product.currencyCode} ${monthlyPrice.toFixed(2)}/mes`;
        }

        packages.push({
          id: pkg.identifier,
          title: product.title,
          description: product.description,
          price: product.priceString,
          pricePerMonth,
          package: pkg,
        });
      }
    }

    return packages;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return [];
  }
}

// ============================================================================
// COMPRAS
// ============================================================================

/**
 * Realiza la compra de un paquete de suscripción.
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Verificar si la compra otorgó el entitlement
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: isActive,
      customerInfo,
    };
  } catch (error: any) {
    console.error('Error purchasing package:', error);

    // Manejar errores específicos
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return {
        success: false,
        error: 'Compra cancelada',
      };
    }

    if (error.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      return {
        success: false,
        error: 'Ya tienes esta suscripción activa',
      };
    }

    if (error.code === PURCHASES_ERROR_CODE.NETWORK_ERROR) {
      return {
        success: false,
        error: 'Error de conexión. Verifica tu internet.',
      };
    }

    return {
      success: false,
      error: 'Error al procesar la compra. Intenta de nuevo.',
    };
  }
}

/**
 * Restaura las compras anteriores del usuario.
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  isActive: boolean;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: true,
      isActive,
    };
  } catch (error: any) {
    console.error('Error restoring purchases:', error);

    return {
      success: false,
      isActive: false,
      error: 'Error al restaurar compras. Intenta de nuevo.',
    };
  }
}

// ============================================================================
// GESTIÓN DE SUSCRIPCIÓN
// ============================================================================

/**
 * Abre la página de gestión de suscripciones del sistema.
 */
export async function openSubscriptionManagement(): Promise<void> {
  try {
    // En iOS, esto abre la configuración de suscripciones de Apple
    // En Android, esto abre la configuración de suscripciones de Google Play
    await Purchases.showManageSubscriptions();
  } catch (error) {
    console.error('Error opening subscription management:', error);
    throw error;
  }
}

// ============================================================================
// LISTENERS
// ============================================================================

/**
 * Registra un listener para cambios en la información del cliente.
 */
export function addCustomerInfoListener(
  callback: (customerInfo: CustomerInfo) => void
): () => void {
  Purchases.addCustomerInfoUpdateListener(callback);
  
  // Retornar función para remover el listener
  return () => {
    Purchases.removeCustomerInfoUpdateListener(callback);
  };
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  initializeSubscriptions,
  identifyUser,
  logoutUser,
  getSubscriptionStatus,
  hasPremiumAccess,
  getOfferings,
  purchasePackage,
  restorePurchases,
  openSubscriptionManagement,
  addCustomerInfoListener,
};
