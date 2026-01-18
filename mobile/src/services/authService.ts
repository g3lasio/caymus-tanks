/**
 * Servicio de Autenticación con Twilio OTP
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Este servicio maneja:
 * - Envío de códigos OTP via Twilio Verify
 * - Verificación de códigos OTP
 * - Gestión de sesiones (30 días remember me)
 * - Restricción de dispositivo único
 * - Registro de nuevos usuarios con nombre
 * - Lógica de propietario (acceso gratuito)
 * - Validación de usuarios registrados vs nuevos
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
// CONFIGURACIÓN DE PROPIETARIO
// ============================================================================

// Números de teléfono con acceso gratuito permanente (propietarios)
const OWNER_PHONE_NUMBERS = [
  '+12025493519',  // Número del propietario principal
];

// ============================================================================
// BASE DE DATOS LOCAL DE USUARIOS REGISTRADOS
// ============================================================================

// En una implementación real, esto sería una base de datos en el servidor
// Por ahora usamos AsyncStorage para simular la base de datos local
const REGISTERED_USERS_KEY = 'registeredUsers';

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PHONE: 'userPhone',
  USER_NAME: 'userName',
  DEVICE_ID: 'deviceId',
  SESSION_EXPIRY: 'sessionExpiry',
  REMEMBER_ME: 'rememberMe',
  IS_REGISTERED: 'isRegistered',
  IS_OWNER: 'isOwner',
  SUBSCRIPTION_STATUS: 'subscriptionStatus',
  SUBSCRIPTION_EXPIRY: 'subscriptionExpiry',
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
  isOwner?: boolean;
  deviceMismatch?: boolean;
  userName?: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  phone?: string;
  userName?: string;
  deviceId?: string;
  expiresAt?: number;
  isOwner?: boolean;
  isRegistered?: boolean;
  subscriptionStatus?: 'active' | 'expired' | 'trial' | 'none';
}

export interface UserProfile {
  phone: string;
  name: string;
  isOwner: boolean;
  subscriptionStatus: 'active' | 'expired' | 'trial' | 'none';
  subscriptionExpiry?: number;
}

export interface RegisteredUser {
  phone: string;
  name: string;
  registeredAt: number;
  isOwner: boolean;
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

/**
 * Verifica si un número de teléfono es de un propietario
 */
export const isOwnerPhone = (phone: string): boolean => {
  const formattedPhone = formatPhoneNumber(phone);
  return OWNER_PHONE_NUMBERS.includes(formattedPhone);
};

// ============================================================================
// FUNCIONES DE GESTIÓN DE USUARIOS REGISTRADOS
// ============================================================================

/**
 * Obtiene la lista de usuarios registrados
 */
const getRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

/**
 * Guarda un nuevo usuario en la lista de registrados
 */
const saveRegisteredUser = async (user: RegisteredUser): Promise<void> => {
  try {
    const users = await getRegisteredUsers();
    // Verificar si ya existe
    const existingIndex = users.findIndex(u => u.phone === user.phone);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving registered user:', error);
  }
};

/**
 * Verifica si un número de teléfono está registrado
 */
export const isPhoneRegistered = async (phone: string): Promise<{ 
  isRegistered: boolean; 
  user?: RegisteredUser;
  isOwner: boolean;
}> => {
  const formattedPhone = formatPhoneNumber(phone);
  
  // Los propietarios siempre tienen acceso (pueden hacer login sin registro previo)
  if (isOwnerPhone(formattedPhone)) {
    return { isRegistered: true, isOwner: true };
  }
  
  const users = await getRegisteredUsers();
  const user = users.find(u => u.phone === formattedPhone);
  
  return { 
    isRegistered: !!user, 
    user: user || undefined,
    isOwner: false,
  };
};

// ============================================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================================

/**
 * Envía un código OTP al número de teléfono proporcionado
 * @param phoneNumber - Número de teléfono
 * @param isLoginAttempt - Si es true, verifica que el usuario esté registrado primero
 */
export const sendOTP = async (
  phoneNumber: string, 
  isLoginAttempt: boolean = false
): Promise<AuthResult & { isOwner?: boolean }> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Si es un intento de login, verificar que el usuario esté registrado
    if (isLoginAttempt) {
      const { isRegistered, isOwner } = await isPhoneRegistered(formattedPhone);
      
      // Los propietarios siempre pueden hacer login
      if (!isRegistered && !isOwner) {
        return {
          success: false,
          message: '¡Hey! No eres un usuario autorizado.',
          error: 'NOT_REGISTERED',
        };
      }
    }
    
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
        isOwner: isOwnerPhone(formattedPhone),
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
 * Envía OTP para registro de nuevo usuario (no verifica si está registrado)
 */
export const sendOTPForRegistration = async (phoneNumber: string): Promise<AuthResult & { isOwner?: boolean }> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Verificar si ya está registrado
    const { isRegistered, isOwner } = await isPhoneRegistered(formattedPhone);
    
    if (isRegistered && !isOwner) {
      return {
        success: false,
        message: 'Este número ya está registrado. Por favor, inicia sesión.',
        error: 'ALREADY_REGISTERED',
      };
    }
    
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
        isOwner: isOwnerPhone(formattedPhone),
      };
    } else {
      return {
        success: false,
        message: 'Error al enviar el código',
        error: data.message || 'Error desconocido',
      };
    }
  } catch (error) {
    console.error('Error sending OTP for registration:', error);
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
      const expiryTime = Date.now() + SESSION_DURATION_MS;
      const authToken = `${formattedPhone}_${currentDeviceId}_${Date.now()}`;
      
      // Verificar si es un usuario existente
      const { isRegistered, user, isOwner: ownerStatus } = await isPhoneRegistered(formattedPhone);
      const isNewUser = !isRegistered && !ownerStatus;
      
      // Guardar la sesión
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE, formattedPhone);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.IS_OWNER, ownerStatus.toString());
      
      // Si es usuario existente, cargar su nombre
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, user.name);
        await AsyncStorage.setItem(STORAGE_KEYS.IS_REGISTERED, 'true');
      }
      
      // Si es propietario, dar suscripción permanente
      if (ownerStatus) {
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, 'active');
        await AsyncStorage.setItem(STORAGE_KEYS.IS_REGISTERED, 'true');
        // Fecha muy lejana para propietarios
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRY, (Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toString());
      }
      
      return {
        success: true,
        message: ownerStatus ? '¡Bienvenido, propietario!' : 'Verificación exitosa',
        isNewUser,
        isOwner: ownerStatus,
        userName: user?.name || undefined,
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
 * Registra un nuevo usuario con su nombre
 */
export const registerUser = async (
  name: string,
  acceptedTerms: boolean = true
): Promise<AuthResult> => {
  try {
    if (!name || name.trim().length < 2) {
      return {
        success: false,
        message: 'El nombre debe tener al menos 2 caracteres',
      };
    }
    
    if (!acceptedTerms) {
      return {
        success: false,
        message: 'Debes aceptar los términos y condiciones',
      };
    }
    
    const phone = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
    if (!phone) {
      return {
        success: false,
        message: 'No hay sesión activa',
      };
    }
    
    // Guardar el nombre y marcar como registrado
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name.trim());
    await AsyncStorage.setItem(STORAGE_KEYS.IS_REGISTERED, 'true');
    
    // Verificar si es propietario
    const ownerStatus = isOwnerPhone(phone);
    
    // Guardar en la lista de usuarios registrados
    await saveRegisteredUser({
      phone,
      name: name.trim(),
      registeredAt: Date.now(),
      isOwner: ownerStatus,
    });
    
    // Si no es propietario, iniciar período de prueba o requerir suscripción
    if (!ownerStatus) {
      const existingStatus = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
      if (!existingStatus) {
        // Nuevo usuario: dar 7 días de prueba
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, 'trial');
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRY, (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
      }
    }
    
    return {
      success: true,
      message: `¡Bienvenido, ${name.trim()}!`,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Error al registrar usuario',
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
    const userName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
    const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
    const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    const isRegistered = await AsyncStorage.getItem(STORAGE_KEYS.IS_REGISTERED);
    const isOwner = await AsyncStorage.getItem(STORAGE_KEYS.IS_OWNER);
    const subscriptionStatus = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
    
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
      userName: userName || undefined,
      deviceId: deviceId || undefined,
      expiresAt,
      isOwner: isOwner === 'true',
      isRegistered: isRegistered === 'true',
      subscriptionStatus: (subscriptionStatus as SessionInfo['subscriptionStatus']) || 'none',
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
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    // Mantener USER_PHONE, USER_NAME, IS_REGISTERED para reconocer al usuario
    // No eliminamos DEVICE_ID para mantener la restricción de dispositivo
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

/**
 * Cierra sesión completamente (borra todos los datos)
 */
export const logoutComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    await AsyncStorage.removeItem(STORAGE_KEYS.IS_REGISTERED);
    await AsyncStorage.removeItem(STORAGE_KEYS.IS_OWNER);
    await AsyncStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
    await AsyncStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRY);
    // No eliminamos DEVICE_ID
  } catch (error) {
    console.error('Error logging out completely:', error);
  }
};

/**
 * Obtiene el perfil del usuario actual
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const phone = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
    const name = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
    const isOwner = await AsyncStorage.getItem(STORAGE_KEYS.IS_OWNER);
    const subscriptionStatus = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
    const subscriptionExpiry = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRY);
    
    if (!phone) return null;
    
    return {
      phone,
      name: name || '',
      isOwner: isOwner === 'true',
      subscriptionStatus: (subscriptionStatus as UserProfile['subscriptionStatus']) || 'none',
      subscriptionExpiry: subscriptionExpiry ? parseInt(subscriptionExpiry, 10) : undefined,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Obtiene el número de teléfono del usuario actual
 */
export const getCurrentUserPhone = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Obtiene el nombre del usuario actual
 */
export const getCurrentUserName = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
};

/**
 * Obtiene el ID del dispositivo actual
 */
export const getCurrentDeviceId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
};

/**
 * Verifica el estado de la suscripción
 */
export const checkSubscription = async (): Promise<{
  isActive: boolean;
  status: 'active' | 'expired' | 'trial' | 'none';
  daysRemaining?: number;
}> => {
  try {
    const isOwner = await AsyncStorage.getItem(STORAGE_KEYS.IS_OWNER);
    
    // Propietarios siempre tienen acceso
    if (isOwner === 'true') {
      return { isActive: true, status: 'active' };
    }
    
    const status = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
    const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRY);
    
    if (!status || status === 'none') {
      return { isActive: false, status: 'none' };
    }
    
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();
      
      if (now > expiry) {
        // Suscripción expirada
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, 'expired');
        return { isActive: false, status: 'expired' };
      }
      
      const daysRemaining = Math.ceil((expiry - now) / (24 * 60 * 60 * 1000));
      return {
        isActive: true,
        status: status as 'active' | 'trial',
        daysRemaining,
      };
    }
    
    return { isActive: status === 'active', status: status as 'active' | 'expired' | 'trial' | 'none' };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false, status: 'none' };
  }
};

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  sendOTP,
  sendOTPForRegistration,
  verifyOTP,
  registerUser,
  checkSession,
  logout,
  logoutComplete,
  getUserProfile,
  getCurrentUserPhone,
  getCurrentUserName,
  getCurrentDeviceId,
  isOwnerPhone,
  isPhoneRegistered,
  checkSubscription,
};
