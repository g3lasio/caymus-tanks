/**
 * Pantalla de Verificación OTP
 * 
 * Permite al usuario ingresar el código de verificación
 * enviado a su número de teléfono.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface VerifyOTPScreenProps {
  phoneNumber: string;
  onVerifyOTP: (phoneNumber: string, code: string) => Promise<{ success: boolean; message: string }>;
  onResendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  onGoBack: () => void;
  isLoading: boolean;
}

export default function VerifyOTPScreen({
  phoneNumber,
  onVerifyOTP,
  onResendOTP,
  onGoBack,
  isLoading,
}: VerifyOTPScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer para reenvío de código
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    // Solo permitir dígitos
    const digit = text.replace(/\D/g, '').slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError(null);

    // Auto-avanzar al siguiente campo
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verificar cuando se completa el código
    if (digit && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Retroceder al campo anterior si se presiona backspace en campo vacío
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    const result = await onVerifyOTP(phoneNumber, codeToVerify);

    if (!result.success) {
      setError(result.message);
      // Limpiar código en caso de error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError(null);

    const result = await onResendOTP(phoneNumber);

    if (!result.success) {
      setError(result.message);
      setCanResend(true);
    }
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return phone;
    return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Image
          source={require('../../../assets/caymus-logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verificación</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos enviado a{'\n'}
          <Text style={styles.phoneNumber}>{maskPhoneNumber(phoneNumber)}</Text>
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
                error && styles.codeInputError,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={isLoading || code.join('').length !== 6}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>VERIFICAR</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>
                ¿No recibiste el código? <Text style={styles.resendLink}>Reenviar</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendTimer}>
              Reenviar código en {resendTimer}s
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          El código expira en 10 minutos
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
  backButton: {
    position: 'absolute',
    left: 20,
    top: 24,
    zIndex: 1,
  },
  backButtonText: {
    color: '#d4af37',
    fontSize: 16,
  },
  logo: {
    width: '50%',
    height: 60,
    maxWidth: 250,
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
    lineHeight: 24,
  },
  phoneNumber: {
    color: '#d4af37',
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: '#d4af37',
  },
  codeInputError: {
    borderColor: '#ff4444',
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
  button: {
    backgroundColor: '#d4af37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: '#888',
    fontSize: 14,
  },
  resendLink: {
    color: '#d4af37',
    fontWeight: '600',
  },
  resendTimer: {
    color: '#666',
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
  },
});
