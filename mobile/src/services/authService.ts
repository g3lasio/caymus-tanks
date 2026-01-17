/**
 * Servicio de Autenticación con Twilio OTP
 * 
 * Este servicio maneja la autenticación de usuarios mediante
 * verificación de número de teléfono con código OTP.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// URL del backend API (configurar en producción)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.chyrris.com';

// Claves de almacenamiento
const STORAGE_KEYS = {
  AUTH_TOKEN: '@caymus_auth_token',
  USER_DATA: '@caymus_user_data',
  PHONE_NUMBER: '@caymus_phone_number',
};

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  subscription?: {
    plan: 'free' | 'pro';
    expiresAt?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  verificationSid?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Envía un código OTP al número de teléfono proporcionado.
 * 
 * @param phoneNumber - Número de teléfono con código de país (ej: +1234567890)
 * @returns Respuesta del servidor
 */
export async function sendOTP(phoneNumber: string): Promise<SendOTPResponse> {
  try {
    // Validar formato del número
    if (!phoneNumber.match(/^\+[1-9]\d{6,14}$/)) {
      return {
        success: false,
        message: 'Formato de número inválido. Use formato internacional (+1234567890)',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al enviar el código',
      };
    }

    // Guardar el número de teléfono temporalmente
    await AsyncStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, phoneNumber);

    return {
      success: true,
      message: 'Código enviado exitosamente',
      verificationSid: data.verificationSid,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Error de conexión. Verifica tu internet.',
    };
  }
}

/**
 * Verifica el código OTP ingresado por el usuario.
 * 
 * @param phoneNumber - Número de teléfono
 * @param code - Código OTP de 6 dígitos
 * @returns Respuesta del servidor con token y datos del usuario
 */
export async function verifyOTP(phoneNumber: string, code: string): Promise<VerifyOTPResponse> {
  try {
    // Validar código
    if (!code.match(/^\d{6}$/)) {
      return {
        success: false,
        message: 'El código debe ser de 6 dígitos',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Código inválido o expirado',
      };
    }

    // Guardar token y datos del usuario
    if (data.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    }
    if (data.user) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    }

    return {
      success: true,
      message: 'Verificación exitosa',
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Error de conexión. Verifica tu internet.',
    };
  }
}

/**
 * Obtiene el token de autenticación almacenado.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Obtiene los datos del usuario almacenados.
 */
export async function getStoredUser(): Promise<User | null> {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
}

/**
 * Verifica si el usuario está autenticado.
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}

/**
 * Cierra la sesión del usuario.
 */
export async function logout(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.PHONE_NUMBER,
    ]);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

/**
 * Refresca el token de autenticación.
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const currentToken = await getAuthToken();
    if (!currentToken) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    if (!response.ok) {
      // Token inválido, cerrar sesión
      await logout();
      return false;
    }

    const data = await response.json();
    if (data.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    }

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  sendOTP,
  verifyOTP,
  getAuthToken,
  getStoredUser,
  isAuthenticated,
  logout,
  refreshToken,
};
