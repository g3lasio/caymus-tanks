/**
 * Pantalla de Login con OTP
 * 
 * Permite al usuario ingresar su número de teléfono
 * para recibir un código de verificación.
 * 
 * Propiedad de Chyrris Technologies Inc.
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
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface LoginScreenProps {
  onSendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  onNavigateToVerify: (phoneNumber: string) => void;
  onSkip?: () => void;
  isLoading: boolean;
}

export default function LoginScreen({
  onSendOTP,
  onNavigateToVerify,
  onSkip,
  isLoading,
}: LoginScreenProps) {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (text: string) => {
    // Eliminar caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    return cleaned;
  };

  const handleSendOTP = async () => {
    setError(null);

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Por favor ingresa un número de teléfono válido');
      return;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    const result = await onSendOTP(fullNumber);

    if (result.success) {
      onNavigateToVerify(fullNumber);
    } else {
      setError(result.message);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Continuar sin cuenta',
      'Podrás usar la calculadora pero no tendrás acceso a funciones premium ni historial sincronizado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: onSkip },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <Image
          source={require('../../../assets/caymus-logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>
          Ingresa tu número de teléfono para comenzar
        </Text>

        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCodeContainer}>
            <TextInput
              style={styles.countryCodeInput}
              value={countryCode}
              onChangeText={setCountryCode}
              keyboardType="phone-pad"
              maxLength={4}
              placeholder="+1"
              placeholderTextColor="#666"
            />
          </View>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
            keyboardType="phone-pad"
            placeholder="Número de teléfono"
            placeholderTextColor="#666"
            maxLength={15}
            autoFocus
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.hint}>
          Te enviaremos un código de verificación por SMS
        </Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>ENVIAR CÓDIGO</Text>
          )}
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Continuar sin cuenta</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros{' '}
          <Text style={styles.link}>Términos de Servicio</Text> y{' '}
          <Text style={styles.link}>Política de Privacidad</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
    alignItems: 'center',
  },
  logo: {
    width: '60%',
    height: 80,
    maxWidth: 300,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  countryCodeContainer: {
    width: 80,
  },
  countryCodeInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#331111',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#888',
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#d4af37',
    textDecorationLine: 'underline',
  },
});
