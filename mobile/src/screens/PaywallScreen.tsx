/**
 * Pantalla de Paywall - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 *
 * FIX: Reemplazado el sistema IAP de Apple (que fallaba en App Store)
 * por una redirección al sitio web chyrris.com/caymus-tanks/subscribe
 * donde el usuario gestiona su suscripción via Stripe.
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
  Linking,
,
  SafeAreaView,
} from \'react-native\';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

// URL de la página de suscripción en el sitio web
const SUBSCRIPTION_URL = 'https://chyrris.com/caymus-tanks/subscribe';

interface PaywallScreenProps {
  onSubscriptionActivated: () => void;
  language: Language;
}

export default function PaywallScreen({
  onSubscriptionActivated,
  language,
}: PaywallScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userPhone, setUserPhone] = useState<string>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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
      feature6: 'Acceso a todos los modelos de tanques',
      priceLabel: 'Suscripción Mensual',
      price: '$6.99',
      autoRenew: 'Se renueva automáticamente cada mes',
      cancelAnytime: 'Cancela cuando quieras',
      subscribeButton: 'Suscribirse Ahora',
      checkStatusButton: 'Ya me suscribí — Verificar',
      howItWorks: '¿Cómo funciona?',
      step1: '1. Toca "Suscribirse Ahora"',
      step2: '2. Completa el pago en nuestro sitio web',
      step3: '3. Regresa a la app y toca "Ya me suscribí"',
      termsNote: 'Al suscribirte aceptas nuestros Términos de Servicio y Política de Privacidad.',
      checkingStatus: 'Verificando suscripción...',
      notActiveTitle: 'Suscripción no encontrada',
      notActiveMessage: 'No encontramos una suscripción activa para tu número. Si ya te suscribiste, espera unos minutos y vuelve a intentarlo.',
      activeTitle: '¡Suscripción Activa!',
      activeMessage: 'Tu suscripción está activa. ¡Disfruta de Caymus Pro!',
      errorTitle: 'Error',
      errorMessage: 'No se pudo abrir el navegador. Visita chyrris.com/caymus-tanks/subscribe desde tu navegador.',
    },
    en: {
      title: 'Welcome to Caymus Pro!',
      subtitle: 'Get full access to all features',
      feature1: 'Unlimited tank calculations',
      feature2: 'Saved calculation history',
      feature3: 'Priority support',
      feature4: 'Automatic updates',
      feature5: 'No ads',
      feature6: 'Access to all tank models',
      priceLabel: 'Monthly Subscription',
      price: '$6.99',
      autoRenew: 'Automatically renews every month',
      cancelAnytime: 'Cancel anytime',
      subscribeButton: 'Subscribe Now',
      checkStatusButton: 'I already subscribed — Verify',
      howItWorks: 'How it works?',
      step1: '1. Tap "Subscribe Now"',
      step2: '2. Complete payment on our website',
      step3: '3. Return to the app and tap "I already subscribed"',
      termsNote: 'By subscribing you accept our Terms of Service and Privacy Policy.',
      checkingStatus: 'Verifying subscription...',
      notActiveTitle: 'Subscription not found',
      notActiveMessage: 'We could not find an active subscription for your number. If you already subscribed, wait a few minutes and try again.',
      activeTitle: 'Subscription Active!',
      activeMessage: 'Your subscription is active. Enjoy Caymus Pro!',
      errorTitle: 'Error',
      errorMessage: 'Could not open browser. Visit chyrris.com/caymus-tanks/subscribe from your browser.',
    },
  };

  const strings = t[language];

  useEffect(() => {
    loadUserPhone();
  }, []);

  const loadUserPhone = async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');
      if (phone) setUserPhone(phone);
    } catch (e) {
      console.error('Error loading phone:', e);
    }
  };

  /**
   * Abre el navegador con la página de suscripción.
   */
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const lang = language === 'es' ? 'es' : 'en';
      const url = `${SUBSCRIPTION_URL}?phone=${encodeURIComponent(userPhone)}&lang=${lang}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(strings.errorTitle, strings.errorMessage);
      }
    } catch (error) {
      console.error('Error opening subscription URL:', error);
      Alert.alert(strings.errorTitle, strings.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verifica si el usuario ya se suscribió consultando el backend.
   * Si el pago falló (past_due), muestra mensaje con link de gestión.
   */
  const handleCheckStatus = async () => {
    try {
      setIsCheckingStatus(true);
      if (!userPhone) {
        Alert.alert(strings.errorTitle, 'No se encontró tu número de teléfono.');
        return;
      }
      const response = await fetch(
        `https://chyrris.com/api/users/profile?phone=${encodeURIComponent(userPhone)}`
      );
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      if (data.success) {
        const status = data.subscriptionStatus;
        
        // Usuario con acceso activo (active o owner)
        if (status === 'active' || data.isOwner) {
          await AsyncStorage.setItem('subscriptionStatus', 'active');
          if (data.subscriptionExpiry) {
            await AsyncStorage.setItem(
              'subscriptionExpiry',
              new Date(data.subscriptionExpiry).getTime().toString()
            );
          } else {
            await AsyncStorage.setItem(
              'subscriptionExpiry',
              (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()
            );
          }
          Alert.alert(
            strings.activeTitle,
            strings.activeMessage,
            [{ text: 'OK', onPress: () => onSubscriptionActivated() }]
          );
          return;
        }
        
        // Pago fallido (tarjeta declinada)
        if (status === 'past_due') {
          Alert.alert(
            language === 'es' ? 'Pago Fallido' : 'Payment Failed',
            language === 'es' 
              ? 'Tu último pago no pudo procesarse. Por favor actualiza tu método de pago.'
              : 'Your last payment could not be processed. Please update your payment method.',
            [
              { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
              {
                text: language === 'es' ? 'Gestionar Suscripción' : 'Manage Subscription',
                onPress: () => {
                  const manageUrl = `https://chyrris.com/api/stripe/customer-portal?phone=${encodeURIComponent(userPhone)}`;
                  Linking.openURL(manageUrl);
                },
              },
            ]
          );
          return;
        }
        
        // Suscripción cancelada o expirada
        if (status === 'cancelled' || status === 'expired') {
          Alert.alert(
            language === 'es' ? 'Suscripción Inactiva' : 'Inactive Subscription',
            language === 'es'
              ? 'Tu suscripción ha sido cancelada o expiró. Suscríbete nuevamente para continuar.'
              : 'Your subscription was cancelled or expired. Subscribe again to continue.',
            [
              { text: 'OK', style: 'cancel' },
              {
                text: language === 'es' ? 'Suscribirse' : 'Subscribe',
                onPress: handleSubscribe,
              },
            ]
          );
          return;
        }
        
        // Sin suscripción (none o pending)
        Alert.alert(strings.notActiveTitle, strings.notActiveMessage);
      } else {
        Alert.alert(strings.notActiveTitle, strings.notActiveMessage);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      Alert.alert(
        strings.errorTitle,
        language === 'es'
          ? 'Error al verificar. Revisa tu conexión e intenta de nuevo.'
          : 'Verification error. Check your connection and try again.'
      );
    } finally {
      setIsCheckingStatus(false);
    }
  };;

  const features = [
    strings.feature1,
    strings.feature2,
    strings.feature3,
    strings.feature4,
    strings.feature5,
    strings.feature6,
  ];

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
            <Text style={styles.icon}>🍷</Text>
            <Text style={styles.title}>{strings.title}</Text>
            <Text style={styles.subtitle}>{strings.subtitle}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Card */}
          <View style={styles.pricingCard}>
            <Text style={styles.priceLabel}>{strings.priceLabel}</Text>
            <Text style={styles.price}>
              {strings.price}
              <Text style={styles.pricePeriod}>/mes</Text>
            </Text>
            <Text style={styles.renewalInfo}>{strings.autoRenew}</Text>
            <Text style={styles.cancelInfo}>{strings.cancelAnytime}</Text>
          </View>

          {/* How it works */}
          <View style={styles.howItWorksContainer}>
            <Text style={styles.howItWorksTitle}>{strings.howItWorks}</Text>
            <Text style={styles.howItWorksStep}>{strings.step1}</Text>
            <Text style={styles.howItWorksStep}>{strings.step2}</Text>
            <Text style={styles.howItWorksStep}>{strings.step3}</Text>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={isLoading || isCheckingStatus}
          >
            {isLoading ? (
              <ActivityIndicator color="#0a1628" />
            ) : (
              <>
                <Text style={styles.subscribeButtonText}>
                  {strings.subscribeButton}
                </Text>
                <Text style={styles.subscribeButtonSubtext}>
                  {strings.price}/mes
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Check Status Button */}
          <TouchableOpacity
            style={[styles.checkStatusButton, isCheckingStatus && styles.buttonDisabled]}
            onPress={handleCheckStatus}
            disabled={isLoading || isCheckingStatus}
          >
            {isCheckingStatus ? (
              <View style={styles.checkingRow}>
                <ActivityIndicator color="#00d4ff" size="small" />
                <Text style={styles.checkStatusButtonText}>
                  {' '}{strings.checkingStatus}
                </Text>
              </View>
            ) : (
              <Text style={styles.checkStatusButtonText}>
                {strings.checkStatusButton}
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms Note */}
          <Text style={styles.termsNote}>{strings.termsNote}</Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
  pricePeriod: {
    fontSize: 22,
    color: '#8892b0',
    fontWeight: 'normal',
  },
  howItWorksContainer: {
    backgroundColor: 'rgba(17, 34, 64, 0.4)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 10,
  },
  howItWorksStep: {
    fontSize: 14,
    color: '#ccd6f6',
    marginBottom: 6,
    lineHeight: 20,
  },
  checkStatusButton: {
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  checkStatusButtonText: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '600',
  },
  checkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
