/**
 * Rutas de Autenticación con Twilio Verify
 * 
 * Este módulo maneja la autenticación de usuarios mediante
 * verificación de número de teléfono con código OTP.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import { Router, Request, Response } from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const router = Router();

// Configuración de Twilio (usar variables de entorno en producción)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'caymus-tanks-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

// Cliente de Twilio
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ============================================================================
// TIPOS
// ============================================================================

interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  subscription: {
    plan: 'free' | 'pro';
    expiresAt?: string;
  };
}

// Almacenamiento temporal de usuarios (usar base de datos en producción)
const users: Map<string, User> = new Map();

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Genera un ID único para el usuario.
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un token JWT para el usuario.
 */
function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, phoneNumber: user.phoneNumber },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Obtiene o crea un usuario por número de teléfono.
 */
function getOrCreateUser(phoneNumber: string): User {
  let user = users.get(phoneNumber);
  
  if (!user) {
    user = {
      id: generateUserId(),
      phoneNumber,
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'free',
      },
    };
    users.set(phoneNumber, user);
  }
  
  return user;
}

// ============================================================================
// RUTAS
// ============================================================================

/**
 * POST /auth/send-otp
 * 
 * Envía un código OTP al número de teléfono proporcionado.
 */
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    // Validar número de teléfono
    if (!phoneNumber || !phoneNumber.match(/^\+[1-9]\d{6,14}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de número inválido. Use formato internacional (+1234567890)',
      });
    }

    // Verificar configuración de Twilio
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'Servicio de verificación no disponible',
      });
    }

    // Enviar código OTP via Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    console.log(`OTP sent to ${phoneNumber}, SID: ${verification.sid}`);

    return res.json({
      success: true,
      message: 'Código enviado exitosamente',
      verificationSid: verification.sid,
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    
    // Manejar errores específicos de Twilio
    if (error.code === 60200) {
      return res.status(400).json({
        success: false,
        message: 'Número de teléfono inválido',
      });
    }
    
    if (error.code === 60203) {
      return res.status(429).json({
        success: false,
        message: 'Demasiados intentos. Espera unos minutos.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al enviar el código. Intenta de nuevo.',
    });
  }
});

/**
 * POST /auth/verify-otp
 * 
 * Verifica el código OTP y autentica al usuario.
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code } = req.body;

    // Validar entrada
    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: 'Número de teléfono y código son requeridos',
      });
    }

    if (!code.match(/^\d{6}$/)) {
      return res.status(400).json({
        success: false,
        message: 'El código debe ser de 6 dígitos',
      });
    }

    // Verificar configuración de Twilio
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'Servicio de verificación no disponible',
      });
    }

    // Verificar código OTP via Twilio Verify
    const verificationCheck = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Código inválido o expirado',
      });
    }

    // Obtener o crear usuario
    const user = getOrCreateUser(phoneNumber);

    // Generar token JWT
    const token = generateToken(user);

    console.log(`User ${user.id} authenticated successfully`);

    return res.json({
      success: true,
      message: 'Verificación exitosa',
      token,
      user,
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);

    if (error.code === 60200) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al verificar el código. Intenta de nuevo.',
    });
  }
});

/**
 * POST /auth/refresh
 * 
 * Refresca el token JWT del usuario.
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; phoneNumber: string };
      const user = users.get(decoded.phoneNumber);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      const newToken = generateToken(user);

      return res.json({
        success: true,
        token: newToken,
        user,
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al refrescar el token',
    });
  }
});

/**
 * GET /auth/me
 * 
 * Obtiene los datos del usuario autenticado.
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; phoneNumber: string };
      const user = users.get(decoded.phoneNumber);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener datos del usuario',
    });
  }
});

export default router;
