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
import CalculatorScreen from './screens/CalculatorScreen';
import { checkSession, logout } from './services/authService';
import { Language, LEGAL_CONTENT } from './i18n/translations';

type AuthState = 'loading' | 'login' | 'otp' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState<Language>('es');
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  // Verificar sesión al iniciar
  useEffect(() => {
    checkAuthStatus();
    loadLanguagePreference();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await checkSession();
      if (session.isAuthenticated) {
        setAuthState('authenticated');
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
    setAuthState('otp');
  };

  const handleVerified = () => {
    setAuthState('authenticated');
  };

  const handleChangeNumber = () => {
    setAuthState('login');
    setPhoneNumber('');
  };

  const handleLogout = async () => {
    await logout();
    setAuthState('login');
    setPhoneNumber('');
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

  // Pantalla principal (calculadora)
  return <CalculatorScreen />;
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
});
