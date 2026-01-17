/**
 * Servicio de Autenticación con Twilio OTP
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Este servicio maneja:
 * - Envío de códigos OTP via Twilio Verify
 * - Verificación de códigos OTP
 * - Gestión de sesiones (30 días remember me)
 * - Restricción de dispositivo único
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// ============================================================================
// CONFIGURACIÓN DE TWILIO
// ============================================================================

// Las credenciales se cargan desde variables de entorno
// En desarrollo: crear archivo .env basado en .env.example
// En producción: configurar en el servicio de hosting (EAS, Vercel, etc.)
const TWILIO_CONFIG = {
  ACCOUNT_SID: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '',
  AUTH_TOKEN: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '',
  VERIFY_SERVICE_SID: process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID || '',
};

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PHONE: 'userPhone',
  DEVICE_ID: 'deviceId',
  SESSION_EXPIRY: 'sessionExpiry',
  REMEMBER_ME: 'rememberMe',
};

// Duración de la sesión: 30 días en milisegundos
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// ============================================================================
// TIPOS
// ============================================================================

export interface AuthResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface VerifyResult extends AuthResult {
  isNewUser?: boolean;
  deviceMismatch?: boolean;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  phone?: string;
  deviceId?: string;
  expiresAt?: number;
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Genera un ID único para el dispositivo
 */
const generateDeviceId = async (): Promise<string> => {
  try {
    // Intentar obtener un ID único del dispositivo
    if (Platform.OS === 'android') {
      const androidId = Application.getAndroidId();
      if (androidId) return `android_${androidId}`;
    } else if (Platform.OS === 'ios') {
      // En iOS, usamos una combinación de datos del dispositivo
      const iosId = await Application.getIosIdForVendorAsync();
      if (iosId) return `ios_${iosId}`;
    }
    
    // Fallback: generar un UUID único
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    return `web_${uuid}`;
  } catch (error) {
    // Si todo falla, generar un ID aleatorio
    return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * Obtiene o genera el ID del dispositivo actual
 */
const getOrCreateDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  
  if (!deviceId) {
    deviceId = await generateDeviceId();
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  
  return deviceId;
};

/**
 * Formatea el número de teléfono para Twilio (E.164)
 */
const formatPhoneNumber = (phone: string): string => {
  // Eliminar todos los caracteres no numéricos excepto el +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si no empieza con +, asumir que es de USA y agregar +1
  if (!cleaned.startsWith('+')) {
    // Si tiene 10 dígitos, es un número de USA
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else {
      // Asumir USA si no está claro
      cleaned = '+1' + cleaned;
    }
  }
  
  return cleaned;
};

// ============================================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================================

/**
 * Envía un código OTP al número de teléfono proporcionado
 */
export const sendOTP = async (phoneNumber: string): Promise<AuthResult> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Crear la autenticación básica para Twilio
    const credentials = btoa(`${TWILIO_CONFIG.ACCOUNT_SID}:${TWILIO_CONFIG.AUTH_TOKEN}`);
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_CONFIG.VERIFY_SERVICE_SID}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(formattedPhone)}&Channel=sms`,
      }
    );
    
    const data = await response.json();
    
    if (response.ok && data.status === 'pending') {
      return {
        success: true,
        message: 'Código enviado exitosamente',
      };
    } else {
      return {
        success: false,
        message: 'Error al enviar el código',
        error: data.message || 'Error desconocido',
      };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Error de conexión',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Verifica el código OTP ingresado por el usuario
 */
export const verifyOTP = async (
  phoneNumber: string,
  code: string,
  rememberMe: boolean = true
): Promise<VerifyResult> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const currentDeviceId = await getOrCreateDeviceId();
    
    // Crear la autenticación básica para Twilio
    const credentials = btoa(`${TWILIO_CONFIG.ACCOUNT_SID}:${TWILIO_CONFIG.AUTH_TOKEN}`);
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_CONFIG.VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(formattedPhone)}&Code=${code}`,
      }
    );
    
    const data = await response.json();
    
    if (response.ok && data.status === 'approved') {
      // Código verificado exitosamente
      // Guardar la sesión
      const expiryTime = Date.now() + SESSION_DURATION_MS;
      const authToken = `${formattedPhone}_${currentDeviceId}_${Date.now()}`;
      
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE, formattedPhone);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
      
      return {
        success: true,
        message: 'Verificación exitosa',
        isNewUser: false, // TODO: Verificar en base de datos
      };
    } else {
      return {
        success: false,
        message: 'Código incorrecto',
        error: data.message || 'El código no es válido',
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Error de verificación',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Verifica si hay una sesión activa válida
 */
export const checkSession = async (): Promise<SessionInfo> => {
  try {
    const authToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const phone = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
    const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
    const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    
    if (!authToken || !phone || !expiryStr) {
      return { isAuthenticated: false };
    }
    
    const expiresAt = parseInt(expiryStr, 10);
    
    // Verificar si la sesión ha expirado
    if (Date.now() > expiresAt) {
      // Sesión expirada, limpiar datos
      await logout();
      return { isAuthenticated: false };
    }
    
    // Si "remember me" está activo, extender la sesión
    if (rememberMe === 'true') {
      const newExpiry = Date.now() + SESSION_DURATION_MS;
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, newExpiry.toString());
    }
    
    return {
      isAuthenticated: true,
      phone,
      deviceId: deviceId || undefined,
      expiresAt,
    };
  } catch (error) {
    console.error('Error checking session:', error);
    return { isAuthenticated: false };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    // No eliminamos DEVICE_ID para mantener la restricción de dispositivo
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

/**
 * Obtiene el número de teléfono del usuario actual
 */
export const getCurrentUserPhone = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Obtiene el ID del dispositivo actual
 */
export const getCurrentDeviceId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
};

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  sendOTP,
  verifyOTP,
  checkSession,
  logout,
  getCurrentUserPhone,
  getCurrentDeviceId,
};
