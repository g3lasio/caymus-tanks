/**
 * Pantalla de Registro - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Permite a nuevos usuarios registrarse con su nombre
 * y aceptar los términos de suscripción
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
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { registerUser, isOwnerPhone } from '../services/authService';
import { TRANSLATIONS, Language } from '../i18n/translations';

interface RegisterScreenProps {
  phoneNumber: string;
  isOwner: boolean;
  onRegistered: (name: string) => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  language: Language;
}

export default function RegisterScreen({
  phoneNumber,
  isOwner,
  onRegistered,
  onShowTerms,
  onShowPrivacy,
  language,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedSubscription, setAcceptedSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleRegister = async () => {
    if (!name.trim()) {
      setError(language === 'es' ? 'Por favor ingresa tu nombre' : 'Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError(language === 'es' ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters');
      return;
    }

    if (!acceptedTerms) {
      setError(language === 'es' ? 'Debes aceptar los términos y condiciones' : 'You must accept the terms and conditions');
      return;
    }

    if (!isOwner && !acceptedSubscription) {
      setError(language === 'es' ? 'Debes aceptar los términos de suscripción' : 'You must accept the subscription terms');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await registerUser(name.trim(), acceptedTerms);
      
      if (result.success) {
        onRegistered(name.trim());
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(language === 'es' ? 'Error al registrar. Intenta de nuevo.' : 'Registration error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (phone: string) => {
    // Formatear para mostrar: +1 (202) 549-3519
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0a1628', '#112240', '#0a1628']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeIcon}>👋</Text>
            <Text style={styles.title}>
              {language === 'es' ? '¡Casi listo!' : 'Almost there!'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'es' 
                ? 'Completa tu registro para continuar'
                : 'Complete your registration to continue'}
            </Text>
          </View>

          {/* Número verificado */}
          <View style={styles.verifiedContainer}>
            <Text style={styles.verifiedIcon}>✓</Text>
            <View style={styles.verifiedInfo}>
              <Text style={styles.verifiedLabel}>
                {language === 'es' ? 'Número verificado' : 'Verified number'}
              </Text>
              <Text style={styles.verifiedPhone}>{formatPhone(phoneNumber)}</Text>
            </View>
          </View>

          {/* Badge de propietario */}
          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerIcon}>👑</Text>
              <Text style={styles.ownerText}>
                {language === 'es' ? 'Cuenta de Propietario' : 'Owner Account'}
              </Text>
              <Text style={styles.ownerSubtext}>
                {language === 'es' ? 'Acceso gratuito permanente' : 'Permanent free access'}
              </Text>
            </View>
          )}

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>
              {language === 'es' ? 'Tu nombre' : 'Your name'}
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(null);
              }}
              placeholder={language === 'es' ? 'Ingresa tu nombre' : 'Enter your name'}
              placeholderTextColor="#666"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={50}
            />

            {/* Términos y condiciones */}
            <View style={styles.checkboxContainer}>
              <Switch
                value={acceptedTerms}
                onValueChange={setAcceptedTerms}
                trackColor={{ false: '#1e3a5f', true: '#00d4ff' }}
                thumbColor={acceptedTerms ? '#fff' : '#ccc'}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                {language === 'es' ? 'Acepto los ' : 'I accept the '}
                <Text style={styles.link} onPress={onShowTerms}>
                  {language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
                </Text>
                {language === 'es' ? ' y la ' : ' and '}
                <Text style={styles.link} onPress={onShowPrivacy}>
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </Text>
              </Text>
            </View>

            {/* Términos de suscripción (solo si no es propietario) */}
            {!isOwner && (
              <View style={styles.subscriptionContainer}>
                <View style={styles.subscriptionHeader}>
                  <Text style={styles.subscriptionIcon}>💳</Text>
                  <Text style={styles.subscriptionTitle}>
                    {language === 'es' ? 'Información de Suscripción' : 'Subscription Information'}
                  </Text>
                </View>
                
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionText}>
                    {language === 'es' 
                      ? '• Suscripción mensual: $5.99/mes'
                      : '• Monthly subscription: $5.99/month'}
                  </Text>
                  <Text style={styles.subscriptionText}>
                    {language === 'es' 
                      ? '• Acceso inmediato a todas las funciones'
                      : '• Immediate access to all features'}
                  </Text>
                  <Text style={styles.subscriptionText}>
                    {language === 'es' 
                      ? '• Cancela cuando quieras'
                      : '• Cancel anytime'}
                  </Text>
                  <Text style={styles.subscriptionText}>
                    {language === 'es' 
                      ? '• Al cancelar, pierdes acceso al instante'
                      : '• Upon cancellation, you lose access instantly'}
                  </Text>
                </View>

                <View style={styles.checkboxContainer}>
                  <Switch
                    value={acceptedSubscription}
                    onValueChange={setAcceptedSubscription}
                    trackColor={{ false: '#1e3a5f', true: '#00d4ff' }}
                    thumbColor={acceptedSubscription ? '#fff' : '#ccc'}
                    style={styles.checkbox}
                  />
                  <Text style={styles.checkboxLabel}>
                    {language === 'es' 
                      ? 'Entiendo y acepto los términos de suscripción'
                      : 'I understand and accept the subscription terms'}
                  </Text>
                </View>
              </View>
            )}

            {/* Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Botón de registro */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (!name.trim() || !acceptedTerms || (!isOwner && !acceptedSubscription)) && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading || !name.trim() || !acceptedTerms || (!isOwner && !acceptedSubscription)}
            >
              {isLoading ? (
                <ActivityIndicator color="#0a1628" />
              ) : (
                <Text style={styles.registerButtonText}>
                  {language === 'es' ? 'Completar Registro' : 'Complete Registration'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 30,
  },
  welcomeIcon: {
    fontSize: 48,
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
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  verifiedIcon: {
    fontSize: 24,
    color: '#00d4ff',
    marginRight: 12,
  },
  verifiedInfo: {
    flex: 1,
  },
  verifiedLabel: {
    fontSize: 12,
    color: '#8892b0',
    marginBottom: 2,
  },
  verifiedPhone: {
    fontSize: 16,
    color: '#ccd6f6',
    fontWeight: '600',
  },
  ownerBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    alignItems: 'center',
  },
  ownerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  ownerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 4,
  },
  ownerSubtext: {
    fontSize: 14,
    color: '#ccd6f6',
  },
  form: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ccd6f6',
    borderWidth: 2,
    borderColor: '#1e3a5f',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 12,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
  },
  link: {
    color: '#00d4ff',
    textDecorationLine: 'underline',
  },
  subscriptionContainer: {
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccd6f6',
  },
  subscriptionInfo: {
    marginBottom: 16,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 6,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#1e3a5f',
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#0a1628',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    color: '#4a5568',
    fontSize: 12,
  },
});
