/**
 * Componente Sidebar
 * 
 * Menú lateral con navegación a páginas legales, historial,
 * configuración y about us.
 * 
 * Propiedad de Chyrris Technologies Inc.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  userName?: string;
  userPhone?: string;
  isPro?: boolean;
}

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showBadge,
  badgeText,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <View style={styles.menuTextContainer}>
      <View style={styles.menuTitleRow}>
        <Text style={styles.menuTitle}>{title}</Text>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.menuSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

export default function Sidebar({
  visible,
  onClose,
  onNavigate,
  userName,
  userPhone,
  isPro = false,
}: SidebarProps) {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar style="light" />
      
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Sidebar Container */}
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logo}>🍷</Text>
                  <View>
                    <Text style={styles.appName}>Caymus Tanks</Text>
                    <Text style={styles.companyName}>by Chyrris Technologies</Text>
                  </View>
                </View>
                
                {userPhone && (
                  <View style={styles.userInfo}>
                    <Text style={styles.userPhone}>{userPhone}</Text>
                    <View style={[styles.statusBadge, isPro && styles.statusBadgePro]}>
                      <Text style={styles.statusText}>
                        {isPro ? '⭐ PRO' : 'FREE'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Main Menu */}
              <MenuSection title="CALCULADORA">
                <MenuItem
                  icon="🧮"
                  title="Calculadora"
                  subtitle="Calcular volumen de tanques"
                  onPress={() => {
                    onNavigate('Calculator');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="📜"
                  title="Historial"
                  subtitle="Ver cálculos anteriores"
                  onPress={() => {
                    onNavigate('History');
                    onClose();
                  }}
                  showBadge={!isPro}
                  badgeText="PRO"
                />
              </MenuSection>

              <MenuSection title="CUENTA">
                <MenuItem
                  icon="👤"
                  title="Mi Perfil"
                  subtitle="Configuración de cuenta"
                  onPress={() => {
                    onNavigate('Profile');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="⭐"
                  title="Suscripción"
                  subtitle={isPro ? 'Plan Pro activo' : 'Actualizar a Pro'}
                  onPress={() => {
                    onNavigate('Subscription');
                    onClose();
                  }}
                />
              </MenuSection>

              <MenuSection title="LEGAL">
                <MenuItem
                  icon="🔒"
                  title="Acuerdo de Confidencialidad"
                  subtitle="NDA y uso de datos"
                  onPress={() => {
                    onNavigate('ConfidentialityAgreement');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="📋"
                  title="Términos de Servicio"
                  subtitle="Condiciones de uso"
                  onPress={() => {
                    onNavigate('TermsOfService');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="🛡️"
                  title="Política de Privacidad"
                  subtitle="Cómo protegemos tus datos"
                  onPress={() => {
                    onNavigate('PrivacyPolicy');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="🗑️"
                  title="Eliminación de Datos"
                  subtitle="Solicitar eliminación de cuenta"
                  onPress={() => {
                    onNavigate('DataDeletion');
                    onClose();
                  }}
                />
              </MenuSection>

              <MenuSection title="SOPORTE">
                <MenuItem
                  icon="❓"
                  title="Centro de Ayuda"
                  subtitle="FAQ y soporte técnico"
                  onPress={() => {
                    onNavigate('Support');
                    onClose();
                  }}
                />
                <MenuItem
                  icon="✉️"
                  title="Contactar Soporte"
                  subtitle="support@chyrris.com"
                  onPress={() => openExternalLink('mailto:support@chyrris.com')}
                />
              </MenuSection>

              <MenuSection title="ACERCA DE">
                <MenuItem
                  icon="🏢"
                  title="Chyrris Technologies"
                  subtitle="Visitar sitio web"
                  onPress={() => openExternalLink('https://chyrris.com')}
                />
                <MenuItem
                  icon="ℹ️"
                  title="Acerca de la App"
                  subtitle="Versión 1.0.0"
                  onPress={() => {
                    onNavigate('About');
                    onClose();
                  }}
                />
              </MenuSection>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  © {new Date().getFullYear()} Chyrris Technologies Inc.
                </Text>
                <Text style={styles.footerVersion}>
                  Caymus Tanks v1.0.0
                </Text>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#0a0a0a',
    borderRightWidth: 1,
    borderRightColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    backgroundColor: '#111',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 40,
    marginRight: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  companyName: {
    fontSize: 12,
    color: '#666',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userPhone: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgePro: {
    backgroundColor: '#d4af37',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: '#444',
  },
  badge: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#444',
  },
  footerVersion: {
    fontSize: 10,
    color: '#333',
    marginTop: 4,
  },
});
