/**
 * Subscription Service - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 *
 * NOTA: El sistema IAP de Apple fue reemplazado por una redirección web
 * a chyrris.com/caymus-tanks/subscribe donde el usuario gestiona su
 * suscripción via Stripe. Este archivo es un stub para compatibilidad.
 *
 * La lógica de suscripción ahora está en PaywallScreen.tsx
 */

export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt?: Date;
  productId?: string;
}

export interface PurchaseResult {
  success: boolean;
  message?: string;
  error?: string;
}

/** @deprecated Usar PaywallScreen con redirect web en su lugar */
export async function initializeIAP(): Promise<boolean> {
  console.warn('IAP deprecated: use web redirect instead');
  return false;
}

/** @deprecated Usar PaywallScreen con redirect web en su lugar */
export async function disconnectIAP(): Promise<void> {
  // no-op
}

/** @deprecated Usar PaywallScreen con redirect web en su lugar */
export async function purchaseSubscription(): Promise<PurchaseResult> {
  return { success: false, error: 'IAP deprecated - use web redirect' };
}

/** @deprecated Usar PaywallScreen con redirect web en su lugar */
export async function restorePurchases(): Promise<PurchaseResult> {
  return { success: false, error: 'IAP deprecated - use web redirect' };
}

/** @deprecated Usar PaywallScreen con redirect web en su lugar */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  return { isActive: false };
}
