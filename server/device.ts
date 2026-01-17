/**
 * Rutas de API para Gestión de Dispositivos
 * 
 * Maneja la verificación y registro de dispositivos únicos
 * para prevenir el uso compartido de cuentas.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import { Router, Request, Response } from 'express';

const router = Router();

// ============================================================================
// TIPOS
// ============================================================================

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  osName: string;
  osVersion: string;
  appVersion: string;
  registeredAt: number;
}

interface UserDevice {
  phoneNumber: string;
  device: DeviceInfo;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

interface DeviceChangeRequest {
  id: string;
  phoneNumber: string;
  currentDeviceId: string;
  newDevice: DeviceInfo;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  processedAt?: number;
  processedBy?: string;
}

// ============================================================================
// ALMACENAMIENTO EN MEMORIA (Reemplazar con base de datos en producción)
// ============================================================================

const userDevices: Map<string, UserDevice> = new Map();
const deviceChangeRequests: Map<string, DeviceChangeRequest> = new Map();

// ============================================================================
// RUTAS
// ============================================================================

/**
 * POST /api/auth/verify-device
 * 
 * Verifica si un dispositivo puede acceder a una cuenta.
 * Se llama ANTES de enviar el OTP.
 */
router.post('/verify-device', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, deviceId } = req.body;

    if (!phoneNumber || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Número de teléfono y ID de dispositivo son requeridos.',
      });
    }

    // Normalizar número de teléfono
    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    // Buscar si el usuario ya tiene un dispositivo registrado
    const existingUserDevice = userDevices.get(normalizedPhone);

    // Usuario nuevo - puede continuar
    if (!existingUserDevice) {
      return res.json({
        success: true,
        isNewUser: true,
        message: 'Usuario nuevo. Puede continuar con el registro.',
      });
    }

    // Usuario existente - verificar dispositivo
    if (existingUserDevice.device.deviceId === deviceId) {
      return res.json({
        success: true,
        isNewUser: false,
        message: 'Dispositivo verificado correctamente.',
      });
    }

    // Dispositivo diferente - BLOQUEAR
    return res.status(403).json({
      success: false,
      code: 'DEVICE_MISMATCH',
      message: 'Este número ya está registrado en otro dispositivo.',
      registeredDevice: {
        deviceName: existingUserDevice.device.deviceName,
        registeredAt: existingUserDevice.device.registeredAt,
      },
    });
  } catch (error) {
    console.error('Error verifying device:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

/**
 * POST /api/auth/register-device
 * 
 * Registra un dispositivo para una cuenta.
 * Se llama DESPUÉS de verificar el OTP exitosamente.
 */
router.post('/register-device', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, device } = req.body;

    if (!phoneNumber || !device) {
      return res.status(400).json({
        success: false,
        message: 'Número de teléfono e información del dispositivo son requeridos.',
      });
    }

    // Normalizar número de teléfono
    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    // Verificar si ya existe un dispositivo registrado
    const existingUserDevice = userDevices.get(normalizedPhone);

    if (existingUserDevice && existingUserDevice.device.deviceId !== device.deviceId) {
      return res.status(403).json({
        success: false,
        code: 'DEVICE_ALREADY_REGISTERED',
        message: 'Este número ya está registrado en otro dispositivo.',
      });
    }

    // Registrar o actualizar dispositivo
    const userDevice: UserDevice = {
      phoneNumber: normalizedPhone,
      device: {
        ...device,
        registeredAt: existingUserDevice?.device.registeredAt || Date.now(),
      },
      createdAt: existingUserDevice?.createdAt || Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    };

    userDevices.set(normalizedPhone, userDevice);

    console.log(`Device registered for ${normalizedPhone}: ${device.deviceId}`);

    return res.json({
      success: true,
      message: 'Dispositivo registrado correctamente.',
      device: {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        registeredAt: userDevice.device.registeredAt,
      },
    });
  } catch (error) {
    console.error('Error registering device:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

/**
 * POST /api/auth/request-device-change
 * 
 * Solicita un cambio de dispositivo (requiere aprobación manual).
 */
router.post('/request-device-change', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, newDevice, reason } = req.body;

    if (!phoneNumber || !newDevice || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos.',
      });
    }

    // Normalizar número de teléfono
    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    // Verificar que el usuario existe
    const existingUserDevice = userDevices.get(normalizedPhone);

    if (!existingUserDevice) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    // Crear solicitud de cambio
    const requestId = `DCR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const changeRequest: DeviceChangeRequest = {
      id: requestId,
      phoneNumber: normalizedPhone,
      currentDeviceId: existingUserDevice.device.deviceId,
      newDevice,
      reason,
      status: 'pending',
      createdAt: Date.now(),
    };

    deviceChangeRequests.set(requestId, changeRequest);

    console.log(`Device change request created: ${requestId} for ${normalizedPhone}`);

    // TODO: Enviar notificación a admin (email)

    return res.json({
      success: true,
      message: 'Solicitud de cambio de dispositivo enviada. Recibirás una respuesta en 24-48 horas.',
      ticketId: requestId,
    });
  } catch (error) {
    console.error('Error requesting device change:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

/**
 * POST /api/auth/approve-device-change
 * 
 * Aprueba una solicitud de cambio de dispositivo (solo admin).
 */
router.post('/approve-device-change', async (req: Request, res: Response) => {
  try {
    const { requestId, adminId } = req.body;

    // TODO: Verificar que el usuario es admin

    const changeRequest = deviceChangeRequests.get(requestId);

    if (!changeRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada.',
      });
    }

    if (changeRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Esta solicitud ya fue procesada.',
      });
    }

    // Actualizar dispositivo del usuario
    const userDevice = userDevices.get(changeRequest.phoneNumber);
    
    if (userDevice) {
      userDevice.device = {
        ...changeRequest.newDevice,
        registeredAt: Date.now(),
      };
      userDevice.updatedAt = Date.now();
      userDevices.set(changeRequest.phoneNumber, userDevice);
    }

    // Actualizar solicitud
    changeRequest.status = 'approved';
    changeRequest.processedAt = Date.now();
    changeRequest.processedBy = adminId;
    deviceChangeRequests.set(requestId, changeRequest);

    console.log(`Device change approved: ${requestId}`);

    // TODO: Notificar al usuario por SMS

    return res.json({
      success: true,
      message: 'Cambio de dispositivo aprobado.',
    });
  } catch (error) {
    console.error('Error approving device change:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

/**
 * GET /api/auth/device-info/:phoneNumber
 * 
 * Obtiene información del dispositivo registrado (solo admin).
 */
router.get('/device-info/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.params;

    // TODO: Verificar que el usuario es admin

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    const userDevice = userDevices.get(normalizedPhone);

    if (!userDevice) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    return res.json({
      success: true,
      device: userDevice,
    });
  } catch (error) {
    console.error('Error getting device info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

/**
 * DELETE /api/auth/unlink-device/:phoneNumber
 * 
 * Desvincula un dispositivo de una cuenta (solo admin).
 */
router.delete('/unlink-device/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.params;

    // TODO: Verificar que el usuario es admin

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    if (!userDevices.has(normalizedPhone)) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    userDevices.delete(normalizedPhone);

    console.log(`Device unlinked for ${normalizedPhone}`);

    return res.json({
      success: true,
      message: 'Dispositivo desvinculado correctamente.',
    });
  } catch (error) {
    console.error('Error unlinking device:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

export default router;
