/**
 * Hook de Autenticación
 * 
 * Maneja el estado de autenticación del usuario y proporciona
 * funciones para login, logout y verificación de sesión.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import { useState, useEffect, useCallback } from 'react';
import authService, { User, AuthState } from '../services/authService';

// ============================================================================
// TIPOS
// ============================================================================

interface UseAuthReturn extends AuthState {
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  /**
   * Verifica el estado de autenticación al cargar.
   */
  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const user = await authService.getStoredUser();
        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Error al verificar autenticación',
      });
    }
  }, []);

  /**
   * Envía código OTP al número de teléfono.
   */
  const sendOTP = useCallback(async (phoneNumber: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await authService.sendOTP(phoneNumber);

    setState(prev => ({
      ...prev,
      isLoading: false,
      error: result.success ? null : result.message,
    }));

    return result;
  }, []);

  /**
   * Verifica el código OTP y autentica al usuario.
   */
  const verifyOTP = useCallback(async (phoneNumber: string, code: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await authService.verifyOTP(phoneNumber, code);

    if (result.success && result.user) {
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: result.user,
        error: null,
      });
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result.message,
      }));
    }

    return result;
  }, []);

  /**
   * Cierra la sesión del usuario.
   */
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al cerrar sesión',
      }));
    }
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    sendOTP,
    verifyOTP,
    logout,
    checkAuth,
  };
}

export default useAuth;
