import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Linking,
  Switch,
} from 'react-native';
import { TRANSLATIONS, LEGAL_CONTENT, Language } from '../i18n/translations';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface FloatingMenuProps {
  isVisible: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (tankId: string) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  userName?: string;
  isOwner?: boolean;
  onLogout?: () => void;
}

interface HistoryItem {
  tankId: string;
  info: string;
  timestamp: number;
}

type PageType = 'nda' | 'privacy' | 'legal' | 'history' | 'help' | null;

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FloatingMenu({
  isVisible,
  onClose,
  history,
  onClearHistory,
  onSelectHistoryItem,
  language,
  onChangeLanguage,
  userName = '',
  isOwner = false,
  onLogout,
}: FloatingMenuProps) {
  const [currentPage, setCurrentPage] = useState<PageType>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const t = TRANSLATIONS[language];
  const legalContent = LEGAL_CONTENT[language];

  const openPage = (page: PageType) => {
    setCurrentPage(page);
    // No cerramos el sidebar aquí, se cierra cuando el usuario cierra la página
  };

  const closePage = () => {
    setCurrentPage(null);
    setFeedbackSent(false);
    setFeedbackText('');
    setFeedbackEmail('');
    setFeedbackSubject('');
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent(feedbackSubject || 'Feedback - Caymus Calculator');
    const body = encodeURIComponent(
      `${feedbackText}\n\n---\nEmail: ${feedbackEmail || 'Not provided'}`
    );
    Linking.openURL(`mailto:info@chyrris.com?subject=${subject}&body=${body}`);
    setFeedbackSent(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLanguageToggle = () => {
    onChangeLanguage(language === 'es' ? 'en' : 'es');
  };

  const handleLogout = () => {
    onClose();
    if (onLogout) {
      onLogout();
    }
  };

  // Renderizar página de contenido legal
  const renderLegalPage = (type: 'nda' | 'privacy' | 'legal') => (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{legalContent[type].title}</Text>
          <TouchableOpacity onPress={closePage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pageContent}>
          <Text style={styles.legalText}>{legalContent[type].content}</Text>
        </ScrollView>
      </View>
    </Modal>
  );

  // Renderizar página de historial
  const renderHistoryPage = () => (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t.history}</Text>
          <TouchableOpacity onPress={closePage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pageContent}>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>{t.noHistory}</Text>
          ) : (
            <>
              {history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => {
                    onSelectHistoryItem(item.tankId);
                    closePage();
                  }}
                >
                  <View style={styles.historyItemHeader}>
                    <Text style={styles.historyTankId}>{item.tankId}</Text>
                    <Text style={styles.historyDate}>{formatDate(item.timestamp)}</Text>
                  </View>
                  {item.info && <Text style={styles.historyInfo}>{item.info}</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.clearButton} onPress={onClearHistory}>
                <Text style={styles.clearButtonText}>{t.clearHistory}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  // Renderizar página de ayuda
  const renderHelpPage = () => (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t.help}</Text>
          <TouchableOpacity onPress={closePage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pageContent}>
          {feedbackSent ? (
            <View style={styles.feedbackSuccess}>
              <Text style={styles.feedbackSuccessIcon}>✓</Text>
              <Text style={styles.feedbackSuccessText}>{t.feedbackSent}</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.feedbackInput}
                placeholder={t.yourEmail}
                placeholderTextColor="#666"
                value={feedbackEmail}
                onChangeText={setFeedbackEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.feedbackInput}
                placeholder={t.subject}
                placeholderTextColor="#666"
                value={feedbackSubject}
                onChangeText={setFeedbackSubject}
              />
              <TextInput
                style={[styles.feedbackInput, styles.feedbackTextArea]}
                placeholder={t.feedbackPlaceholder}
                placeholderTextColor="#666"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.sendButton, !feedbackText && styles.sendButtonDisabled]}
                onPress={handleSendFeedback}
                disabled={!feedbackText}
              >
                <Text style={styles.sendButtonText}>{t.send}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      {/* Modal del menú (sidebar) */}
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sidebarContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.menuTitle}>{t.menu}</Text>
            
            {/* FEATURES PRINCIPALES (Visibles y prominentes) */}
            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('history')}>
              <Text style={styles.menuItemIcon}>📋</Text>
              <Text style={styles.menuItemText}>{t.history}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('nda')}>
              <Text style={styles.menuItemIcon}>📜</Text>
              <Text style={styles.menuItemText}>{t.nda}</Text>
            </TouchableOpacity>

            {/* Spacer para empujar elementos al fondo */}
            <View style={styles.spacer} />

            {/* Información del usuario */}
            {userName && (
              <View style={styles.userInfoContainer}>
                <Text style={styles.userIcon}>{isOwner ? '👑' : '👤'}</Text>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userName}</Text>
                  {isOwner && (
                    <Text style={styles.ownerBadge}>
                      {language === 'es' ? 'Propietario' : 'Owner'}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* INFORMACIÓN LEGAL (Compacta y discreta) */}
            <View style={styles.legalFooter}>
              <TouchableOpacity onPress={() => openPage('privacy')}>
                <Text style={styles.legalFooterText}>{t.privacy}</Text>
              </TouchableOpacity>
              <Text style={styles.legalSeparator}>•</Text>
              <TouchableOpacity onPress={() => openPage('legal')}>
                <Text style={styles.legalFooterText}>{t.legal}</Text>
              </TouchableOpacity>
              <Text style={styles.legalSeparator}>•</Text>
              <TouchableOpacity onPress={() => openPage('help')}>
                <Text style={styles.legalFooterText}>{t.help}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            {/* Toggle de idioma al final */}
            <View style={styles.languageToggleContainer}>
              <Text style={styles.languageLabel}>ES</Text>
              <Switch
                value={language === 'en'}
                onValueChange={handleLanguageToggle}
                trackColor={{ false: '#00d4ff', true: '#00d4ff' }}
                thumbColor={language === 'en' ? '#fff' : '#fff'}
                ios_backgroundColor="#1e3a5f"
                style={styles.languageSwitch}
              />
              <Text style={styles.languageLabel}>EN</Text>
            </View>

            {/* Botón de Logout (siempre visible) */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>{t.logout}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCloseButton} onPress={onClose}>
              <Text style={styles.menuCloseButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Páginas */}
      {currentPage === 'nda' && renderLegalPage('nda')}
      {currentPage === 'privacy' && renderLegalPage('privacy')}
      {currentPage === 'legal' && renderLegalPage('legal')}
      {currentPage === 'history' && renderHistoryPage()}
      {currentPage === 'help' && renderHelpPage()}
    </>
  );
}

// Exportar función para abrir el menú desde el header
export const MenuButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>☰</Text>
  </TouchableOpacity>
);

// Exportar ref para controlar el menú desde fuera
export { FloatingMenu };

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: '80%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: '#112240',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderRightWidth: 2,
    borderRightColor: '#00d4ff',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#1e3a5f',
    marginVertical: 10,
  },
  spacer: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  userIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#ccd6f6',
    fontSize: 16,
    fontWeight: '600',
  },
  ownerBadge: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  legalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  legalFooterText: {
    fontSize: 11,
    color: '#8892b0',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    color: '#444',
    marginHorizontal: 6,
    fontSize: 10,
  },
  languageToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 10,
    backgroundColor: '#0d1f3c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  languageLabel: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  languageSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: '#331111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  menuCloseButton: {
    paddingVertical: 12,
    backgroundColor: '#0d1f3c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  menuCloseButtonText: {
    textAlign: 'center',
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#112240',
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
  },
  pageTitle: {
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
  pageContent: {
    flex: 1,
    padding: 20,
  },
  legalText: {
    color: '#ccd6f6',
    fontSize: 14,
    lineHeight: 22,
  },
  emptyText: {
    color: '#8892b0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  historyItem: {
    backgroundColor: '#112240',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTankId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  historyDate: {
    fontSize: 12,
    color: '#8892b0',
  },
  historyInfo: {
    fontSize: 14,
    color: '#ccd6f6',
    marginTop: 6,
  },
  clearButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#331111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  clearButtonText: {
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackInput: {
    backgroundColor: '#112240',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  feedbackTextArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#1e3a5f',
  },
  sendButtonText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackSuccess: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  feedbackSuccessIcon: {
    fontSize: 60,
    color: '#00d4ff',
    marginBottom: 20,
  },
  feedbackSuccessText: {
    fontSize: 18,
    color: '#ccd6f6',
    textAlign: 'center',
  },
});
