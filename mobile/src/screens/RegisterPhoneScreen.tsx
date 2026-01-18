/**
 * Pantalla de Registro (Paso 1: Teléfono) - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Primera pantalla del flujo de registro para nuevos usuarios
 * Solicita el número de teléfono antes de enviar OTP
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Switch,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { sendOTPForRegistration } from '../services/authService';
import { Language } from '../i18n/translations';

// Traducciones específicas para la pantalla de registro
const REGISTER_TRANSLATIONS = {
  es: {
    title: 'Crear Cuenta',
    subtitle: 'Regístrate para acceder a la calculadora de tanques',
    phoneLabel: 'Número de Teléfono',
    phonePlaceholder: '+1 (555) 123-4567',
    continueButton: 'Registrarme',
    sending: 'Enviando código...',
    termsText: 'Al continuar, aceptas nuestros',
    termsLink: 'Términos y Condiciones',
    privacyLink: 'Política de Privacidad',
    and: 'y',
    errorInvalidPhone: 'Por favor ingresa un número de teléfono válido',
    errorSendFailed: 'Error al enviar el código. Intenta de nuevo.',
    errorAlreadyRegistered: 'Este número ya está registrado. Por favor, inicia sesión.',
    haveAccount: '¿Ya tienes cuenta?',
    loginLink: 'Inicia sesión',
    // Información de suscripción
    subscriptionTitle: 'Información de Suscripción',
    subscriptionTrial: '7 días de prueba gratis',
    subscriptionPrice: 'Después $4.99/mes',
    subscriptionCancel: 'Cancela cuando quieras',
  },
  en: {
    title: 'Create Account',
    subtitle: 'Register to access the tank calculator',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+1 (555) 123-4567',
    continueButton: 'Register',
    sending: 'Sending code...',
    termsText: 'By continuing, you agree to our',
    termsLink: 'Terms and Conditions',
    privacyLink: 'Privacy Policy',
    and: 'and',
    errorInvalidPhone: 'Please enter a valid phone number',
    errorSendFailed: 'Failed to send code. Please try again.',
    errorAlreadyRegistered: 'This number is already registered. Please sign in.',
    haveAccount: 'Already have an account?',
    loginLink: 'Sign in',
    // Subscription info
    subscriptionTitle: 'Subscription Information',
    subscriptionTrial: '7-day free trial',
    subscriptionPrice: 'Then $4.99/month',
    subscriptionCancel: 'Cancel anytime',
  },
};

interface RegisterPhoneScreenProps {
  onOTPSent: (phone: string, isOwner: boolean) => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onGoToLogin: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}

export default function RegisterPhoneScreen({
  onOTPSent,
  onShowTerms,
  onShowPrivacy,
  onGoToLogin,
  language,
  onChangeLanguage,
}: RegisterPhoneScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = REGISTER_TRANSLATIONS[language];

  const formatPhoneInput = (text: string) => {
    // Permitir solo números y el signo +
    const cleaned = text.replace(/[^\d+]/g, '');
    setPhoneNumber(cleaned);
    setError(null);
  };

  const validatePhone = (phone: string): boolean => {
    // Validar que tenga al menos 10 dígitos
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleContinue = async () => {
    if (!validatePhone(phoneNumber)) {
      setError(t.errorInvalidPhone);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Enviar OTP para registro (verifica que NO esté registrado)
      const result = await sendOTPForRegistration(phoneNumber);
      
      if (result.success) {
        onOTPSent(phoneNumber, result.isOwner || false);
      } else if (result.error === 'ALREADY_REGISTERED') {
        setError(t.errorAlreadyRegistered);
      } else {
        setError(result.error || t.errorSendFailed);
      }
    } catch (err) {
      setError(t.errorSendFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = () => {
    onChangeLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Toggle de idioma en la esquina superior derecha */}
      <View style={styles.languageToggle}>
        <Text style={styles.languageLabel}>ES</Text>
        <Switch
          value={language === 'en'}
          onValueChange={handleLanguageToggle}
          trackColor={{ false: '#00d4ff', true: '#00d4ff' }}
          thumbColor="#fff"
          ios_backgroundColor="#1e3a5f"
          style={styles.languageSwitch}
        />
        <Text style={styles.languageLabel}>EN</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/caymus-logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>

          {/* Info de suscripción */}
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionTitle}>💳 {t.subscriptionTitle}</Text>
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionItem}>✓ {t.subscriptionTrial}</Text>
              <Text style={styles.subscriptionItem}>✓ {t.subscriptionPrice}</Text>
              <Text style={styles.subscriptionItem}>✓ {t.subscriptionCancel}</Text>
            </View>
          </View>

          {/* Input de teléfono */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.phoneLabel}</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={formatPhoneInput}
              placeholder={t.phonePlaceholder}
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={15}
            />
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Botón continuar */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.buttonText}>{t.sending}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>{t.continueButton}</Text>
            )}
          </TouchableOpacity>

          {/* Enlace a login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t.haveAccount} </Text>
            <TouchableOpacity onPress={onGoToLogin}>
              <Text style={styles.loginLink}>{t.loginLink}</Text>
            </TouchableOpacity>
          </View>

          {/* Términos y privacidad */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>{t.termsText}</Text>
            <View style={styles.termsLinks}>
              <TouchableOpacity onPress={onShowTerms}>
                <Text style={styles.termsLink}>{t.termsLink}</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> {t.and} </Text>
              <TouchableOpacity onPress={onShowPrivacy}>
                <Text style={styles.termsLink}>{t.privacyLink}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  languageToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  languageLabel: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  languageSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 25,
  },
  subscriptionInfo: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subscriptionDetails: {
    gap: 8,
  },
  subscriptionItem: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#112240',
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: '#331111',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#1e3a5f',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: '#8892b0',
    fontSize: 14,
  },
  loginLink: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    color: '#5a6a8a',
    fontSize: 12,
  },
  termsLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  termsLink: {
    color: '#00d4ff',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#5a6a8a',
    fontSize: 12,
  },
});
