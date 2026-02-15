/**
 * Pantalla de Paywall - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Muestra los planes de suscripción y maneja el proceso de compra
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  initializeIAP,
  purchaseSubscription,
  restorePurchases,
  setPurchaseListener,
  validateReceipt,
  finishTransaction,
  getSubscriptionProducts,
} from '../services/subscriptionService';
import type { InAppPurchase } from 'expo-in-app-purchases';
import { Language } from '../i18n/translations';

interface PaywallScreenProps {
  onSubscriptionActivated: () => void;
  language: Language;
}

export default function PaywallScreen({
  onSubscriptionActivated,
  language,
}: PaywallScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState<string>('$6.99');

  // Traducciones
  const t = {
    es: {
      title: '¡Bienvenido a Caymus Pro!',
      subtitle: 'Obtén acceso completo a todas las funciones',
      feature1: 'Cálculos ilimitados de tanques',
      feature2: 'Historial de cálculos guardado',
      feature3: 'Soporte prioritario',
      feature4: 'Actualizaciones automáticas',
      feature5: 'Sin anuncios',
      priceLabel: 'Suscripción mensual',
      subscribeButton: 'Suscribirse ahora',
      restoreButton: 'Restaurar compras',
      cancelAnytime: 'Cancela cuando quieras',
      autoRenew: 'Se renueva automáticamente cada mes',
      termsNote: 'Al suscribirte, aceptas nuestros Términos de Servicio',
      processingPayment: 'Procesando pago...',
      validatingPurchase: 'Validando compra...',
      errorTitle: 'Error',
      errorMessage: 'Hubo un problema con la compra. Intenta de nuevo.',
      restoreSuccess: '¡Compras restauradas!',
      restoreError: 'No se encontraron compras anteriores',
      noProductsError: 'No se pudieron cargar los productos. Verifica tu conexión.',
    },
    en: {
      title: 'Welcome to Caymus Pro!',
      subtitle: 'Get full access to all features',
      feature1: 'Unlimited tank calculations',
      feature2: 'Saved calculation history',
      feature3: 'Priority support',
      feature4: 'Automatic updates',
      feature5: 'No ads',
      priceLabel: 'Monthly subscription',
      subscribeButton: 'Subscribe now',
      restoreButton: 'Restore purchases',
      cancelAnytime: 'Cancel anytime',
      autoRenew: 'Automatically renews every month',
      termsNote: 'By subscribing, you accept our Terms of Service',
      processingPayment: 'Processing payment...',
      validatingPurchase: 'Validating purchase...',
      errorTitle: 'Error',
      errorMessage: 'There was a problem with the purchase. Please try again.',
      restoreSuccess: 'Purchases restored!',
      restoreError: 'No previous purchases found',
      noProductsError: 'Could not load products. Check your connection.',
    },
  };

  const strings = t[language];

  // Inicializar IAP al montar el componente
  useEffect(() => {
    initializeSubscription();
    return () => {
      // Cleanup se maneja en el servicio
    };
  }, []);

  const initializeSubscription = async () => {
    try {
      setIsInitializing(true);
      
      // Inicializar IAP
      const initialized = await initializeIAP();
      if (!initialized) {
        setError(strings.noProductsError);
        setIsInitializing(false);
        return;
      }

      // Obtener productos para mostrar el precio real
      const products = await getSubscriptionProducts();
      if (products.length > 0) {
        setProductPrice(products[0].price);
      }

      // Configurar listener de compras
      const subscription = setPurchaseListener(handlePurchaseUpdate);

      setIsInitializing(false);
    } catch (err) {
      console.error('Error initializing subscription:', err);
      setError(strings.noProductsError);
      setIsInitializing(false);
    }
  };

  const handlePurchaseUpdate = async (purchase: InAppPurchase) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Purchase update received:', purchase);

      // Validar el recibo con el backend
      const isValid = await validateReceipt(purchase);

      if (isValid) {
        // Finalizar la transacción
        await finishTransaction(purchase);

        // Notificar que la suscripción está activa
        Alert.alert(
          language === 'es' ? '¡Éxito!' : 'Success!',
          language === 'es' 
            ? '¡Tu suscripción está activa! Disfruta de Caymus Pro.'
            : 'Your subscription is active! Enjoy Caymus Pro.',
          [
            {
              text: 'OK',
              onPress: () => onSubscriptionActivated(),
            },
          ]
        );
      } else {
        setError(strings.errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error handling purchase:', err);
      setError(strings.errorMessage);
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await purchaseSubscription();

      if (!result.success) {
        if (result.error !== 'Compra cancelada') {
          setError(result.error || strings.errorMessage);
        }
        setIsLoading(false);
      }
      // Si es exitoso, el listener manejará el resto
    } catch (err) {
      console.error('Error subscribing:', err);
      setError(strings.errorMessage);
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await restorePurchases();

      if (result.success) {
        Alert.alert(
          language === 'es' ? '¡Éxito!' : 'Success!',
          strings.restoreSuccess,
          [
            {
              text: 'OK',
              onPress: () => onSubscriptionActivated(),
            },
          ]
        );
      } else {
        Alert.alert(
          strings.errorTitle,
          strings.restoreError
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error restoring purchases:', err);
      setError(strings.errorMessage);
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>
          {language === 'es' ? 'Cargando...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0a1628', '#112240', '#0a1628']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.icon}>💎</Text>
            <Text style={styles.title}>{strings.title}</Text>
            <Text style={styles.subtitle}>{strings.subtitle}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {[
              strings.feature1,
              strings.feature2,
              strings.feature3,
              strings.feature4,
              strings.feature5,
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Card */}
          <View style={styles.pricingCard}>
            <Text style={styles.priceLabel}>{strings.priceLabel}</Text>
            <Text style={styles.price}>{productPrice}/mes</Text>
            <Text style={styles.renewalInfo}>{strings.autoRenew}</Text>
            <Text style={styles.cancelInfo}>{strings.cancelAnytime}</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0a1628" />
            ) : (
              <>
                <Text style={styles.subscribeButtonText}>
                  {strings.subscribeButton}
                </Text>
                <Text style={styles.subscribeButtonSubtext}>
                  {productPrice}/mes
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Restore Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isLoading}
          >
            <Text style={styles.restoreButtonText}>
              {strings.restoreButton}
            </Text>
          </TouchableOpacity>

          {/* Terms Note */}
          <Text style={styles.termsNote}>{strings.termsNote}</Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a1628',
  },
  loadingText: {
    color: '#8892b0',
    fontSize: 16,
    marginTop: 16,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
  },
  featuresContainer: {
    backgroundColor: 'rgba(17, 34, 64, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 20,
    color: '#00d4ff',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: '#ccd6f6',
    flex: 1,
  },
  pricingCard: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00d4ff',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 12,
  },
  renewalInfo: {
    fontSize: 14,
    color: '#ccd6f6',
    marginBottom: 4,
  },
  cancelInfo: {
    fontSize: 14,
    color: '#8892b0',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a1628',
  },
  subscribeButtonSubtext: {
    fontSize: 14,
    color: '#0a1628',
    marginTop: 4,
    opacity: 0.8,
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#00d4ff',
    textDecorationLine: 'underline',
  },
  termsNote: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
