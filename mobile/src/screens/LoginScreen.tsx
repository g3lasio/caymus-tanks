/**
 * Pantalla de Login - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Pantalla para ingresar número de teléfono y solicitar OTP
 * Solo para usuarios ya registrados
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
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { sendOTP } from '../services/authService';
import { Language } from '../i18n/translations';

// Traducciones específicas para la pantalla de login
const LOGIN_TRANSLATIONS = {
  es: {
    title: 'Iniciar Sesión',
    subtitle: 'Ingresa tu número de teléfono para continuar',
    phoneLabel: 'Número de Teléfono',
    phonePlaceholder: '+1 (555) 123-4567',
    continueButton: 'Continuar',
    sending: 'Enviando código...',
    termsText: 'Al continuar, aceptas nuestros',
    termsLink: 'Términos y Condiciones',
    privacyLink: 'Política de Privacidad',
    and: 'y',
    errorInvalidPhone: 'Por favor ingresa un número de teléfono válido',
    errorSendFailed: 'Error al enviar el código. Intenta de nuevo.',
    noAccount: '¿No tienes cuenta?',
    registerLink: 'Regístrate aquí',
    // Mensaje de error para usuarios no registrados
    notRegisteredTitle: '¡Hey, primo!',
    notRegisteredMessage: 'No eres un usuario autorizado. Registra tu cuenta para acceder a la calculadora.',
    notRegisteredButton: 'Registrarme',
    notRegisteredCancel: 'Cancelar',
  },
  en: {
    title: 'Sign In',
    subtitle: 'Enter your phone number to continue',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+1 (555) 123-4567',
    continueButton: 'Continue',
    sending: 'Sending code...',
    termsText: 'By continuing, you agree to our',
    termsLink: 'Terms and Conditions',
    privacyLink: 'Privacy Policy',
    and: 'and',
    errorInvalidPhone: 'Please enter a valid phone number',
    errorSendFailed: 'Failed to send code. Please try again.',
    noAccount: "Don't have an account?",
    registerLink: 'Register here',
    // Error message for unregistered users
    notRegisteredTitle: 'Hey there!',
    notRegisteredMessage: "You're not an authorized user. Register your account to access the calculator.",
    notRegisteredButton: 'Register Now',
    notRegisteredCancel: 'Cancel',
  },
};

interface LoginScreenProps {
  onOTPSent: (phone: string) => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onGoToRegister: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}

export default function LoginScreen({
  onOTPSent,
  onShowTerms,
  onShowPrivacy,
  onGoToRegister,
  language,
  onChangeLanguage,
}: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotRegisteredModal, setShowNotRegisteredModal] = useState(false);

  const t = LOGIN_TRANSLATIONS[language];

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
      // Enviar OTP con verificación de usuario registrado (isLoginAttempt = true)
      const result = await sendOTP(phoneNumber, true);
      
      if (result.success) {
        onOTPSent(phoneNumber);
      } else if (result.error === 'NOT_REGISTERED') {
        // Usuario no registrado - mostrar modal
        setShowNotRegisteredModal(true);
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

  const handleGoToRegister = () => {
    setShowNotRegisteredModal(false);
    onGoToRegister();
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

        {/* Enlace a registro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{t.noAccount} </Text>
          <TouchableOpacity onPress={onGoToRegister}>
            <Text style={styles.registerLink}>{t.registerLink}</Text>
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

      {/* Modal de usuario no registrado */}
      <Modal
        visible={showNotRegisteredModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotRegisteredModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🚫</Text>
            <Text style={styles.modalTitle}>{t.notRegisteredTitle}</Text>
            <Text style={styles.modalMessage}>{t.notRegisteredMessage}</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGoToRegister}
            >
              <Text style={styles.modalButtonText}>{t.notRegisteredButton}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowNotRegisteredModal(false)}
            >
              <Text style={styles.modalCancelText}>{t.notRegisteredCancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 40,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerText: {
    color: '#8892b0',
    fontSize: 14,
  },
  registerLink: {
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
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#112240',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    maxWidth: 350,
    width: '100%',
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    width: '100%',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalCancelButton: {
    paddingVertical: 10,
  },
  modalCancelText: {
    color: '#5a6a8a',
    fontSize: 14,
  },
});
