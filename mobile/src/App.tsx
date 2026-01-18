/**
 * App Principal - Caymus Tank Calculator
 * Propiedad de Chyrris Technologies Inc.
 * 
 * Maneja la navegación entre pantallas de autenticación y la calculadora
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import RegisterScreen from './screens/RegisterScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import { checkSession, logout, isOwnerPhone, SessionInfo } from './services/authService';
import { Language, LEGAL_CONTENT } from './i18n/translations';

type AuthState = 'loading' | 'login' | 'otp' | 'register' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Verificar sesión al iniciar
  useEffect(() => {
    checkAuthStatus();
    loadLanguagePreference();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await checkSession();
      if (session.isAuthenticated) {
        setPhoneNumber(session.phone || '');
        setUserName(session.userName || '');
        setIsOwner(session.isOwner || false);
        
        // Si está autenticado pero no registrado, ir a registro
        if (!session.isRegistered) {
          setAuthState('register');
        } else {
          setAuthState('authenticated');
        }
      } else {
        setAuthState('login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState('login');
    }
  };

  const loadLanguagePreference = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) {
        setLanguage(savedLang as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleOTPSent = (phone: string) => {
    setPhoneNumber(phone);
    setIsOwner(isOwnerPhone(phone));
    setAuthState('otp');
  };

  const handleVerified = async (verifyResult: { isNewUser?: boolean; isOwner?: boolean; userName?: string }) => {
    setIsOwner(verifyResult.isOwner || false);
    
    if (verifyResult.userName) {
      setUserName(verifyResult.userName);
    }
    
    // Si es usuario nuevo o no tiene nombre, ir a registro
    if (verifyResult.isNewUser || !verifyResult.userName) {
      setAuthState('register');
    } else {
      // Usuario existente con nombre, mostrar bienvenida
      setShowWelcome(true);
      setAuthState('authenticated');
      
      // Ocultar bienvenida después de 3 segundos
      setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
    }
  };

  const handleRegistered = (name: string) => {
    setUserName(name);
    setShowWelcome(true);
    setAuthState('authenticated');
    
    // Ocultar bienvenida después de 3 segundos
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  };

  const handleChangeNumber = () => {
    setAuthState('login');
    setPhoneNumber('');
  };

  const handleLogout = async () => {
    await logout();
    setAuthState('login');
    setPhoneNumber('');
    setUserName('');
    setIsOwner(false);
  };

  // Modal para mostrar términos y privacidad
  const renderLegalModal = () => {
    if (!showLegalModal) return null;

    const content = showLegalModal === 'terms' 
      ? LEGAL_CONTENT[language].legal 
      : LEGAL_CONTENT[language].privacy;

    return (
      <Modal visible={true} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{content.title}</Text>
            <TouchableOpacity onPress={() => setShowLegalModal(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.legalText}>{content.content}</Text>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // Modal de bienvenida
  const renderWelcomeModal = () => {
    if (!showWelcome) return null;

    return (
      <Modal visible={true} animationType="fade" transparent={true}>
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeIcon}>{isOwner ? '👑' : '🎉'}</Text>
            <Text style={styles.welcomeTitle}>
              {language === 'es' 
                ? `¡Bienvenido${userName ? ', ' + userName : ''}!`
                : `Welcome${userName ? ', ' + userName : ''}!`}
            </Text>
            {isOwner && (
              <Text style={styles.welcomeSubtitle}>
                {language === 'es' 
                  ? 'Cuenta de Propietario - Acceso Completo'
                  : 'Owner Account - Full Access'}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Pantalla de carga
  if (authState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  // Pantalla de login
  if (authState === 'login') {
    return (
      <>
        <LoginScreen
          onOTPSent={handleOTPSent}
          onShowTerms={() => setShowLegalModal('terms')}
          onShowPrivacy={() => setShowLegalModal('privacy')}
          language={language}
          onChangeLanguage={handleLanguageChange}
        />
        {renderLegalModal()}
      </>
    );
  }

  // Pantalla de OTP
  if (authState === 'otp') {
    return (
      <OTPScreen
        phoneNumber={phoneNumber}
        onVerified={handleVerified}
        onChangeNumber={handleChangeNumber}
        language={language}
      />
    );
  }

  // Pantalla de registro
  if (authState === 'register') {
    return (
      <>
        <RegisterScreen
          phoneNumber={phoneNumber}
          isOwner={isOwner}
          onRegistered={handleRegistered}
          onShowTerms={() => setShowLegalModal('terms')}
          onShowPrivacy={() => setShowLegalModal('privacy')}
          language={language}
        />
        {renderLegalModal()}
      </>
    );
  }

  // Pantalla principal (calculadora)
  return (
    <>
      <CalculatorScreen 
        userName={userName}
        isOwner={isOwner}
        onLogout={handleLogout}
      />
      {renderWelcomeModal()}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a1628',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#112240',
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0d1f3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  closeButtonText: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  legalText: {
    color: '#ccd6f6',
    fontSize: 14,
    lineHeight: 22,
  },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    backgroundColor: '#112240',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00d4ff',
    marginHorizontal: 40,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#ffd700',
    textAlign: 'center',
  },
});
