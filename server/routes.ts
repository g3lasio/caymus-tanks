/**
 * Rutas del Servidor
 * 
 * Registra todas las rutas de la API.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./auth";
import deviceRoutes from "./device";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Rutas de autenticación (OTP con Twilio)
  app.use('/api/auth', authRoutes);

  // Rutas de gestión de dispositivos
  app.use('/api/auth', deviceRoutes);

  // Ruta de información de la app
  app.get('/api/info', (req, res) => {
    res.json({
      name: 'Caymus Tanks API',
      version: '1.0.0',
      company: 'Chyrris Technologies Inc.',
      website: 'https://chyrris.com',
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
