/**
 * Subscription Service - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Maneja las suscripciones mediante Apple In-App Purchase y Google Play Billing
 * usando expo-in-app-purchases
 */

import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// IDs de productos de suscripción (deben coincidir con los configurados en las tiendas)
const SUBSCRIPTION_PRODUCT_IDS = {
  monthly: Platform.select({
    ios: 'com.chyrris.caymus.monthly',
    android: 'com.chyrris.caymus.monthly',
    default: 'com.chyrris.caymus.monthly',
  })!,
};

// ============================================================================
// TIPOS
// ============================================================================

export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt?: Date;
  productId?: string;
  platform?: 'ios' | 'android';
}

export interface PurchaseResult {
  success: boolean;
  message?: string;
  error?: string;
}

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Inicializa el servicio de compras in-app
 */
export async function initializeIAP(): Promise<boolean> {
  try {
    await InAppPurchases.connectAsync();
    console.log('✅ IAP initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing IAP:', error);
    return false;
  }
}

/**
 * Desconecta el servicio de compras in-app
 */
export async function disconnectIAP(): Promise<void> {
  try {
    await InAppPurchases.disconnectAsync();
    console.log('✅ IAP disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting IAP:', error);
  }
}

/**
 * Obtiene los productos de suscripción disponibles
 */
export async function getSubscriptionProducts(): Promise<InAppPurchases.IAPItemDetails[]> {
  try {
    const { results, responseCode } = await InAppPurchases.getProductsAsync([
      SUBSCRIPTION_PRODUCT_IDS.monthly,
    ]);

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      console.log('✅ Products fetched:', results);
      return results;
    } else {
      console.error('❌ Error fetching products, response code:', responseCode);
      return [];
    }
  } catch (error) {
    console.error('❌ Error getting products:', error);
    return [];
  }
}

/**
 * Compra una suscripción mensual
 */
export async function purchaseSubscription(): Promise<PurchaseResult> {
  try {
    // Inicializar IAP si no está inicializado
    const isInitialized = await initializeIAP();
    if (!isInitialized) {
      return {
        success: false,
        error: 'No se pudo inicializar el servicio de pagos',
      };
    }

    // Realizar la compra
    await InAppPurchases.purchaseItemAsync(SUBSCRIPTION_PRODUCT_IDS.monthly);

    // La compra se maneja en el listener de compras
    return {
      success: true,
      message: 'Compra iniciada',
    };
  } catch (error: any) {
    console.error('❌ Error purchasing subscription:', error);
    
    // Manejar errores específicos
    if (error.code === 'E_USER_CANCELLED') {
      return {
        success: false,
        error: 'Compra cancelada',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Error al procesar la compra',
    };
  }
}

/**
 * Restaura las compras anteriores
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  try {
    const isInitialized = await initializeIAP();
    if (!isInitialized) {
      return {
        success: false,
        error: 'No se pudo inicializar el servicio de pagos',
      };
    }

    const { results, responseCode } = await InAppPurchases.getPurchaseHistoryAsync();

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      console.log('✅ Purchase history:', results);
      
      if (results && results.length > 0) {
        return {
          success: true,
          message: 'Compras restauradas exitosamente',
        };
      } else {
        return {
          success: false,
          error: 'No se encontraron compras anteriores',
        };
      }
    } else {
      return {
        success: false,
        error: 'Error al restaurar compras',
      };
    }
  } catch (error: any) {
    console.error('❌ Error restoring purchases:', error);
    return {
      success: false,
      error: error.message || 'Error al restaurar compras',
    };
  }
}

/**
 * Verifica el estado de la suscripción actual
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const isInitialized = await initializeIAP();
    if (!isInitialized) {
      return { isActive: false };
    }

    const { results, responseCode } = await InAppPurchases.getPurchaseHistoryAsync();

    if (responseCode === InAppPurchases.IAPResponseCode.OK && results && results.length > 0) {
      // Buscar la suscripción mensual activa
      const monthlySubscription = results.find(
        (purchase) => purchase.productId === SUBSCRIPTION_PRODUCT_IDS.monthly
      );

      if (monthlySubscription) {
        // Verificar si la suscripción está activa
        // En una implementación real, deberías validar el recibo en el backend
        return {
          isActive: true,
          productId: monthlySubscription.productId,
          platform: Platform.OS as 'ios' | 'android',
        };
      }
    }

    return { isActive: false };
  } catch (error) {
    console.error('❌ Error checking subscription status:', error);
    return { isActive: false };
  }
}

/**
 * Configura un listener para cambios en las compras
 */
export function setPurchaseListener(
  callback: (purchase: InAppPurchases.InAppPurchase) => void
): InAppPurchases.Subscription {
  return InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
    console.log('📦 Purchase listener triggered:', { responseCode, errorCode });

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      results?.forEach((purchase) => {
        console.log('✅ Purchase successful:', purchase);
        callback(purchase);
      });
    } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
      console.log('❌ User canceled the purchase');
    } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
      console.log('⏳ Purchase deferred (awaiting approval)');
    } else {
      console.error('❌ Purchase error:', { responseCode, errorCode });
    }
  });
}

/**
 * Finaliza una compra (acknowledge)
 * IMPORTANTE: Debe llamarse después de validar el recibo en el backend
 */
export async function finishTransaction(purchase: InAppPurchases.InAppPurchase): Promise<void> {
  try {
    await InAppPurchases.finishTransactionAsync(purchase, true);
    console.log('✅ Transaction finished:', purchase.orderId);
  } catch (error) {
    console.error('❌ Error finishing transaction:', error);
  }
}

// ============================================================================
// VALIDACIÓN DE RECIBOS (Backend)
// ============================================================================

/**
 * Valida un recibo de compra en el backend
 * IMPORTANTE: Esta función debe implementarse en el backend de chyrris
 */
export async function validateReceipt(
  purchase: InAppPurchases.InAppPurchase
): Promise<boolean> {
  try {
    // TODO: Implementar validación de recibo en el backend de chyrris
    // Endpoint sugerido: POST https://chyrris.com/api/subscription/validate
    
    // Usar el backend de chyrris.com en producción
    const API_URL = __DEV__ 
      ? 'http://localhost:5000/api/subscription/validate'
      : 'https://chyrris.com/api/subscription/validate';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: Platform.OS,
        productId: purchase.productId,
        transactionReceipt: purchase.transactionReceipt,
        orderId: purchase.orderId,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('❌ Error validating receipt:', error);
    return false;
  }
}
