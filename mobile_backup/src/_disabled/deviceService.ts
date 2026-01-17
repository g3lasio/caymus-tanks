/**
 * Servicio de Gestión de Dispositivo Único
 * 
 * Maneja la vinculación de cuentas a un solo dispositivo
 * para prevenir el uso compartido de cuentas.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ============================================================================
// TIPOS
// ============================================================================

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  osName: string;
  osVersion: string;
  appVersion: string;
  registeredAt: number;
}

export interface DeviceVerificationResult {
  isValid: boolean;
  isNewDevice: boolean;
  currentDevice: DeviceInfo;
  registeredDevice?: DeviceInfo;
  error?: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const DEVICE_KEY = '@caymus_tanks_device';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// ============================================================================
// FUNCIONES LOCALES
// ============================================================================

/**
 * Genera un identificador único para el dispositivo actual.
 * Combina varios identificadores para crear un fingerprint único.
 */
export async function generateDeviceId(): Promise<string> {
  try {
    let deviceId = '';

    if (Platform.OS === 'ios') {
      // En iOS, usamos el identificador del vendor
      deviceId = await Application.getIosIdForVendorAsync() || '';
    } else if (Platform.OS === 'android') {
      // En Android, usamos el Android ID
      deviceId = Application.getAndroidId() || '';
    }

    // Si no tenemos ID, generamos uno basado en características del dispositivo
    if (!deviceId) {
      const brand = Device.brand || 'unknown';
      const model = Device.modelName || 'unknown';
      const osVersion = Device.osVersion || 'unknown';
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      
      deviceId = `${brand}_${model}_${osVersion}_${timestamp}_${random}`
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase();
    }

    return deviceId;
  } catch (error) {
    console.error('Error generating device ID:', error);
    // Fallback: generar ID aleatorio
    return `fallback_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

/**
 * Obtiene la información completa del dispositivo actual.
 */
export async function getCurrentDeviceInfo(): Promise<DeviceInfo> {
  const deviceId = await generateDeviceId();
  
  return {
    deviceId,
    deviceName: Device.deviceName || 'Unknown Device',
    deviceModel: Device.modelName || 'Unknown Model',
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion || 'Unknown',
    appVersion: Application.nativeApplicationVersion || '1.0.0',
    registeredAt: Date.now(),
  };
}

/**
 * Guarda la información del dispositivo registrado localmente.
 */
export async function saveRegisteredDevice(device: DeviceInfo): Promise<void> {
  try {
    await AsyncStorage.setItem(DEVICE_KEY, JSON.stringify(device));
  } catch (error) {
    console.error('Error saving device info:', error);
    throw error;
  }
}

/**
 * Obtiene la información del dispositivo registrado localmente.
 */
export async function getRegisteredDevice(): Promise<DeviceInfo | null> {
  try {
    const data = await AsyncStorage.getItem(DEVICE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
}

/**
 * Elimina la información del dispositivo registrado.
 */
export async function clearRegisteredDevice(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_KEY);
  } catch (error) {
    console.error('Error clearing device info:', error);
    throw error;
  }
}

// ============================================================================
// FUNCIONES DE VERIFICACIÓN
// ============================================================================

/**
 * Verifica si el dispositivo actual está autorizado para esta cuenta.
 */
export async function verifyDevice(phoneNumber: string): Promise<DeviceVerificationResult> {
  try {
    const currentDevice = await getCurrentDeviceInfo();
    const registeredDevice = await getRegisteredDevice();

    // Si no hay dispositivo registrado, es un nuevo registro
    if (!registeredDevice) {
      return {
        isValid: true,
        isNewDevice: true,
        currentDevice,
      };
    }

    // Verificar si el dispositivo actual coincide con el registrado
    const isValid = currentDevice.deviceId === registeredDevice.deviceId;

    return {
      isValid,
      isNewDevice: false,
      currentDevice,
      registeredDevice,
      error: isValid ? undefined : 'Este número ya está registrado en otro dispositivo.',
    };
  } catch (error) {
    console.error('Error verifying device:', error);
    return {
      isValid: false,
      isNewDevice: false,
      currentDevice: await getCurrentDeviceInfo(),
      error: 'Error al verificar el dispositivo.',
    };
  }
}

/**
 * Registra el dispositivo actual en el servidor.
 */
export async function registerDevice(
  phoneNumber: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceInfo = await getCurrentDeviceInfo();

    const response = await fetch(`${API_BASE_URL}/api/auth/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        phoneNumber,
        device: deviceInfo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Verificar si es error de dispositivo ya registrado
      if (data.code === 'DEVICE_ALREADY_REGISTERED') {
        return {
          success: false,
          error: 'Este número ya está registrado en otro dispositivo. Contacta a soporte para cambiar de dispositivo.',
        };
      }
      return {
        success: false,
        error: data.message || 'Error al registrar dispositivo.',
      };
    }

    // Guardar dispositivo localmente
    await saveRegisteredDevice(deviceInfo);

    return { success: true };
  } catch (error) {
    console.error('Error registering device:', error);
    return {
      success: false,
      error: 'Error de conexión. Verifica tu internet.',
    };
  }
}

/**
 * Verifica el dispositivo con el servidor antes de enviar OTP.
 */
export async function verifyDeviceWithServer(
  phoneNumber: string
): Promise<{ canProceed: boolean; isNewUser: boolean; error?: string }> {
  try {
    const deviceInfo = await getCurrentDeviceInfo();

    const response = await fetch(`${API_BASE_URL}/api/auth/verify-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        deviceId: deviceInfo.deviceId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.code === 'DEVICE_MISMATCH') {
        return {
          canProceed: false,
          isNewUser: false,
          error: '⚠️ Este número ya está vinculado a otro dispositivo.\n\nPor seguridad, cada cuenta solo puede usarse en un dispositivo.\n\nContacta a support@chyrris.com para solicitar un cambio de dispositivo.',
        };
      }
      return {
        canProceed: false,
        isNewUser: false,
        error: data.message || 'Error al verificar dispositivo.',
      };
    }

    return {
      canProceed: true,
      isNewUser: data.isNewUser || false,
    };
  } catch (error) {
    console.error('Error verifying device with server:', error);
    // En caso de error de red, permitir continuar (verificación offline)
    return {
      canProceed: true,
      isNewUser: true,
    };
  }
}

/**
 * Solicita cambio de dispositivo (requiere aprobación de soporte).
 */
export async function requestDeviceChange(
  phoneNumber: string,
  reason: string
): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  try {
    const currentDevice = await getCurrentDeviceInfo();

    const response = await fetch(`${API_BASE_URL}/api/auth/request-device-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        newDevice: currentDevice,
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al solicitar cambio de dispositivo.',
      };
    }

    return {
      success: true,
      ticketId: data.ticketId,
    };
  } catch (error) {
    console.error('Error requesting device change:', error);
    return {
      success: false,
      error: 'Error de conexión. Verifica tu internet.',
    };
  }
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  generateDeviceId,
  getCurrentDeviceInfo,
  saveRegisteredDevice,
  getRegisteredDevice,
  clearRegisteredDevice,
  verifyDevice,
  registerDevice,
  verifyDeviceWithServer,
  requestDeviceChange,
};
