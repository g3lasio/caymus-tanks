/**
 * Pantalla de Verificación OTP - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Pantalla para ingresar el código de verificación OTP
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
import { verifyOTP, sendOTP } from '../services/authService';
import { Language } from '../i18n/translations';

// Traducciones específicas para la pantalla de OTP
const OTP_TRANSLATIONS = {
  es: {
    title: 'Verificación',
    subtitle: 'Ingresa el código de 6 dígitos enviado a',
    verifyButton: 'Verificar',
    verifying: 'Verificando...',
    resendCode: '¿No recibiste el código?',
    resendButton: 'Reenviar código',
    resending: 'Reenviando...',
    codeSent: '¡Código reenviado!',
    changeNumber: 'Cambiar número',
    errorInvalidCode: 'Por favor ingresa el código completo de 6 dígitos',
    errorVerifyFailed: 'Código incorrecto. Intenta de nuevo.',
    errorResendFailed: 'Error al reenviar. Intenta de nuevo.',
    waitToResend: 'Espera {seconds}s para reenviar',
  },
  en: {
    title: 'Verification',
    subtitle: 'Enter the 6-digit code sent to',
    verifyButton: 'Verify',
    verifying: 'Verifying...',
    resendCode: "Didn't receive the code?",
    resendButton: 'Resend code',
    resending: 'Resending...',
    codeSent: 'Code sent!',
    changeNumber: 'Change number',
    errorInvalidCode: 'Please enter the complete 6-digit code',
    errorVerifyFailed: 'Incorrect code. Please try again.',
    errorResendFailed: 'Failed to resend. Please try again.',
    waitToResend: 'Wait {seconds}s to resend',
  },
};

interface OTPScreenProps {
  phoneNumber: string;
  onVerified: (result: { isNewUser?: boolean; isOwner?: boolean; userName?: string }) => void;
  onChangeNumber: () => void;
  language: Language;
}

export default function OTPScreen({
  phoneNumber,
  onVerified,
  onChangeNumber,
  language,
}: OTPScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const t = OTP_TRANSLATIONS[language];

  // Countdown para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Auto-focus en el primer input
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    // Manejar pegado de código completo (Auto-fill)
    if (text.length > 1) {
      const pastedCode = text.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = ['', '', '', '', '', ''];
      pastedCode.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);
      
      // Limpiar todos los campos primero para forzar re-render
      inputRefs.current.forEach((ref, i) => {
        if (ref && i < pastedCode.length) {
          ref.setNativeProps({ text: pastedCode[i] });
        }
      });
      
      // Enfocar el último campo o el siguiente vacío
      const nextIndex = Math.min(pastedCode.length, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 100);
      
      if (pastedCode.length === 6) {
        setTimeout(() => {
          handleVerify(newCode.join(''));
        }, 150);
      }
      return;
    }

    // Manejar entrada de un solo dígito
    const digit = text.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError(null);
    setSuccessMessage(null);

    // Auto-avanzar al siguiente input
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
    // Manejar backspace
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || code.join('');
    
    if (fullCode.length !== 6) {
      setError(t.errorInvalidCode);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(phoneNumber, fullCode, true);
      
      if (result.success) {
        onVerified({
          isNewUser: result.isNewUser,
          isOwner: result.isOwner,
          userName: result.userName,
        });
      } else {
        setError(result.error || t.errorVerifyFailed);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(t.errorVerifyFailed);
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await sendOTP(phoneNumber);
      
      if (result.success) {
        setSuccessMessage(t.codeSent);
        setResendCountdown(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || t.errorResendFailed);
      }
    } catch (err) {
      setError(t.errorResendFailed);
    } finally {
      setIsResending(false);
    }
  };

  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 4) {
      return `***-***-${digits.slice(-4)}`;
    }
    return phone;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/caymus-logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        <Text style={styles.phoneDisplay}>{formatPhoneDisplay(phoneNumber)}</Text>

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
              maxLength={Platform.OS === 'ios' ? 6 : 1}
              selectTextOnFocus
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
            />
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {successMessage && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000" size="small" />
              <Text style={styles.buttonText}>{t.verifying}</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>{t.verifyButton}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>{t.resendCode}</Text>
          {resendCountdown > 0 ? (
            <Text style={styles.countdownText}>
              {t.waitToResend.replace('{seconds}', resendCountdown.toString())}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text style={styles.resendButton}>
                {isResending ? t.resending : t.resendButton}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onChangeNumber} style={styles.changeNumberButton}>
          <Text style={styles.changeNumberText}>{t.changeNumber}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Chyrris Technologies</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
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
    width: 180,
    height: 70,
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
  },
  phoneDisplay: {
    fontSize: 18,
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  codeInput: {
    width: 60,
    height: 70,
    backgroundColor: '#112240',
    borderWidth: 2,
    borderColor: '#1e3a5f',
    borderRadius: 12,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: '#00d4ff',
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
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#113311',
    borderWidth: 1,
    borderColor: '#44aa44',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  successText: {
    color: '#44aa44',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 30,
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
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#5a6a8a',
    fontSize: 14,
    marginBottom: 8,
  },
  resendButton: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  countdownText: {
    color: '#5a6a8a',
    fontSize: 14,
  },
  changeNumberButton: {
    alignItems: 'center',
  },
  changeNumberText: {
    color: '#8892b0',
    fontSize: 14,
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
