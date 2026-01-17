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
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface FloatingMenuProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (tankId: string) => void;
  backgroundColor: string;
  onChangeBackgroundColor: (color: string) => void;
  language: 'es' | 'en';
  onChangeLanguage: (lang: 'es' | 'en') => void;
}

interface HistoryItem {
  tankId: string;
  info: string;
  timestamp: number;
}

type PageType = 'menu' | 'nda' | 'privacy' | 'legal' | 'history' | 'settings' | 'help' | null;

// ============================================================================
// CONTENIDO LEGAL EN ESPAÑOL
// ============================================================================

const LEGAL_CONTENT = {
  nda: {
    title: 'Acuerdo de Confidencialidad',
    content: `ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN

Fecha de entrada en vigor: Enero 2026

PARTES:
- Chyrris Technologies Inc. ("La Empresa")
- El Usuario de la Aplicación ("El Usuario")

1. PROPÓSITO
Este Acuerdo de Confidencialidad establece los términos bajo los cuales el Usuario acepta mantener la confidencialidad de la información propietaria contenida en la aplicación Caymus Tank Calculator.

2. INFORMACIÓN CONFIDENCIAL
Se considera información confidencial:
• Todos los datos de especificaciones de tanques (capacidades, dimensiones, fórmulas)
• Los algoritmos de cálculo utilizados en la aplicación
• Cualquier información técnica relacionada con los tanques de vino
• Los métodos de calibración y medición

3. OBLIGACIONES DEL USUARIO
El Usuario se compromete a:
• NO divulgar la información confidencial a terceros
• NO copiar, reproducir o distribuir los datos de tanques
• NO utilizar la información para fines distintos a su trabajo autorizado
• Proteger la información con el mismo cuidado que protegería su propia información confidencial

4. PROPIEDAD
• La aplicación Caymus Tank Calculator es propiedad exclusiva de Chyrris Technologies Inc.
• Esta aplicación NO tiene afiliación con Caymus Vineyards ni con Wagner Family of Wine
• Los datos de tanques son información propietaria de Chyrris Technologies Inc.

5. RESTRICCIÓN DE DISPOSITIVO
El Usuario acepta que su cuenta está vinculada a un único dispositivo. El uso compartido de cuentas está estrictamente prohibido.

6. DURACIÓN
Este acuerdo permanece vigente mientras el Usuario tenga acceso a la aplicación y por un período de 5 años después de la terminación del acceso.

7. CONSECUENCIAS DEL INCUMPLIMIENTO
El incumplimiento de este acuerdo puede resultar en:
• Terminación inmediata del acceso a la aplicación
• Acciones legales por daños y perjuicios
• Responsabilidad por pérdidas comerciales

Al usar esta aplicación, el Usuario confirma que ha leído, entendido y acepta los términos de este Acuerdo de Confidencialidad.

© 2026 Chyrris Technologies Inc. Todos los derechos reservados.`
  },
  privacy: {
    title: 'Política de Privacidad',
    content: `POLÍTICA DE PRIVACIDAD

Última actualización: Enero 2026

Chyrris Technologies Inc. ("nosotros", "nuestro" o "la Empresa") opera la aplicación Caymus Tank Calculator. Esta página le informa sobre nuestras políticas con respecto a la recopilación, uso y divulgación de información personal.

1. INFORMACIÓN QUE RECOPILAMOS

1.1 Información de Cuenta:
• Número de teléfono (para autenticación OTP)
• Identificador único de dispositivo

1.2 Datos de Uso:
• Historial de cálculos realizados
• Preferencias de la aplicación
• Registros de acceso

2. USO DE LA INFORMACIÓN

Utilizamos la información recopilada para:
• Proporcionar y mantener el servicio
• Autenticar usuarios y prevenir acceso no autorizado
• Mejorar la experiencia del usuario
• Cumplir con obligaciones legales

3. ALMACENAMIENTO DE DATOS

• Los datos se almacenan de forma segura en servidores protegidos
• Implementamos medidas de seguridad estándar de la industria
• Los datos de cálculos se almacenan localmente en su dispositivo

4. COMPARTIR INFORMACIÓN

NO vendemos, comercializamos ni transferimos su información personal a terceros, excepto:
• Cuando sea requerido por ley
• Para proteger nuestros derechos legales
• Con su consentimiento explícito

5. SUS DERECHOS

Usted tiene derecho a:
• Acceder a sus datos personales
• Solicitar la corrección de datos inexactos
• Solicitar la eliminación de sus datos
• Retirar su consentimiento en cualquier momento

6. ELIMINACIÓN DE DATOS

Para solicitar la eliminación de sus datos, contacte a:
support@chyrris.com

7. CAMBIOS A ESTA POLÍTICA

Nos reservamos el derecho de actualizar esta política. Los cambios serán notificados a través de la aplicación.

8. CONTACTO

Para preguntas sobre esta política:
Email: info@chyrris.com
Web: https://chyrris.com

© 2026 Chyrris Technologies Inc.`
  },
  legal: {
    title: 'Términos y Condiciones',
    content: `TÉRMINOS Y CONDICIONES DE USO

Última actualización: Enero 2026

Por favor lea estos términos cuidadosamente antes de usar la aplicación Caymus Tank Calculator.

1. ACEPTACIÓN DE TÉRMINOS

Al acceder y usar esta aplicación, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo, no use la aplicación.

2. DESCRIPCIÓN DEL SERVICIO

Caymus Tank Calculator es una herramienta de cálculo para tanques de vino que permite:
• Calcular volúmenes basados en mediciones de espacio
• Convertir entre galones y pulgadas de espacio
• Mantener un historial de cálculos

3. LICENCIA DE USO

Se le otorga una licencia limitada, no exclusiva y no transferible para usar la aplicación únicamente para fines laborales autorizados.

4. RESTRICCIONES

Usted NO puede:
• Copiar, modificar o distribuir la aplicación
• Realizar ingeniería inversa del software
• Usar la aplicación para fines ilegales
• Compartir su cuenta con terceros
• Extraer o copiar los datos de tanques

5. PROPIEDAD INTELECTUAL

• Todos los derechos de propiedad intelectual pertenecen a Chyrris Technologies Inc.
• Las marcas, logos y nombres comerciales son propiedad de sus respectivos dueños
• Esta aplicación NO está afiliada con Caymus Vineyards

6. PRECISIÓN DE CÁLCULOS

• Los cálculos se proporcionan "tal cual"
• La precisión en la zona de campana es aproximadamente 97.99%
• La precisión en el cuerpo cilíndrico es aproximadamente 99.9%
• El usuario es responsable de verificar los resultados críticos

7. LIMITACIÓN DE RESPONSABILIDAD

Chyrris Technologies Inc. no será responsable por:
• Pérdidas derivadas del uso de la aplicación
• Errores en los cálculos debido a datos de entrada incorrectos
• Interrupciones del servicio

8. TERMINACIÓN

Podemos terminar su acceso en cualquier momento si:
• Viola estos términos
• Incumple el acuerdo de confidencialidad
• Usa la aplicación de manera indebida

9. LEY APLICABLE

Estos términos se rigen por las leyes del Estado de California, Estados Unidos.

10. CONTACTO

Para consultas legales:
Email: legal@chyrris.com
Web: https://chyrris.com

© 2026 Chyrris Technologies Inc. Todos los derechos reservados.`
  }
};

const TRANSLATIONS = {
  es: {
    menu: 'Menú',
    nda: 'Acuerdo de Confidencialidad',
    privacy: 'Política de Privacidad',
    legal: 'Términos y Condiciones',
    history: 'Historial de Cálculos',
    settings: 'Configuración',
    help: 'Ayuda y Soporte',
    close: 'Cerrar',
    clearHistory: 'Limpiar Historial',
    noHistory: 'No hay historial de cálculos',
    language: 'Idioma',
    backgroundColor: 'Color de Fondo',
    spanish: 'Español',
    english: 'English',
    sendFeedback: 'Enviar Feedback',
    feedbackPlaceholder: 'Escribe tu mensaje, pregunta o sugerencia...',
    send: 'Enviar',
    feedbackSent: '¡Mensaje enviado! Te contactaremos pronto.',
    yourEmail: 'Tu email (opcional)',
    subject: 'Asunto',
  },
  en: {
    menu: 'Menu',
    nda: 'Confidentiality Agreement',
    privacy: 'Privacy Policy',
    legal: 'Terms and Conditions',
    history: 'Calculation History',
    settings: 'Settings',
    help: 'Help & Support',
    close: 'Close',
    clearHistory: 'Clear History',
    noHistory: 'No calculation history',
    language: 'Language',
    backgroundColor: 'Background Color',
    spanish: 'Español',
    english: 'English',
    sendFeedback: 'Send Feedback',
    feedbackPlaceholder: 'Write your message, question or suggestion...',
    send: 'Send',
    feedbackSent: 'Message sent! We will contact you soon.',
    yourEmail: 'Your email (optional)',
    subject: 'Subject',
  }
};

const BACKGROUND_COLORS = [
  { name: 'Azul Oscuro', value: '#0a1628' },
  { name: 'Negro', value: '#000000' },
  { name: 'Azul Marino', value: '#0d1b2a' },
  { name: 'Gris Oscuro', value: '#1a1a2e' },
  { name: 'Verde Oscuro', value: '#0d1f0d' },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FloatingMenu({
  history,
  onClearHistory,
  onSelectHistoryItem,
  backgroundColor,
  onChangeBackgroundColor,
  language,
  onChangeLanguage,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const t = TRANSLATIONS[language];

  const openPage = (page: PageType) => {
    setCurrentPage(page);
    setIsOpen(false);
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
      `${feedbackText}\n\n---\nEmail de contacto: ${feedbackEmail || 'No proporcionado'}`
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

  // Renderizar página de contenido legal
  const renderLegalPage = (type: 'nda' | 'privacy' | 'legal') => (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{LEGAL_CONTENT[type].title}</Text>
          <TouchableOpacity onPress={closePage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pageContent}>
          <Text style={styles.legalText}>{LEGAL_CONTENT[type].content}</Text>
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

  // Renderizar página de configuración
  const renderSettingsPage = () => (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t.settings}</Text>
          <TouchableOpacity onPress={closePage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pageContent}>
          {/* Idioma */}
          <View style={styles.settingSection}>
            <Text style={styles.settingLabel}>{t.language}</Text>
            <View style={styles.settingOptions}>
              <TouchableOpacity
                style={[styles.settingOption, language === 'es' && styles.settingOptionActive]}
                onPress={() => onChangeLanguage('es')}
              >
                <Text style={[styles.settingOptionText, language === 'es' && styles.settingOptionTextActive]}>
                  🇪🇸 {t.spanish}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.settingOption, language === 'en' && styles.settingOptionActive]}
                onPress={() => onChangeLanguage('en')}
              >
                <Text style={[styles.settingOptionText, language === 'en' && styles.settingOptionTextActive]}>
                  🇺🇸 {t.english}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color de fondo */}
          <View style={styles.settingSection}>
            <Text style={styles.settingLabel}>{t.backgroundColor}</Text>
            <View style={styles.colorOptions}>
              {BACKGROUND_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    backgroundColor === color.value && styles.colorOptionActive
                  ]}
                  onPress={() => onChangeBackgroundColor(color.value)}
                >
                  {backgroundColor === color.value && (
                    <Text style={styles.colorCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.floatingButtonText}>☰</Text>
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal visible={isOpen} animationType="fade" transparent={true}>
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{t.menu}</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('history')}>
              <Text style={styles.menuItemIcon}>📋</Text>
              <Text style={styles.menuItemText}>{t.history}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('settings')}>
              <Text style={styles.menuItemIcon}>⚙️</Text>
              <Text style={styles.menuItemText}>{t.settings}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('nda')}>
              <Text style={styles.menuItemIcon}>📜</Text>
              <Text style={styles.menuItemText}>{t.nda}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('privacy')}>
              <Text style={styles.menuItemIcon}>🔒</Text>
              <Text style={styles.menuItemText}>{t.privacy}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('legal')}>
              <Text style={styles.menuItemIcon}>⚖️</Text>
              <Text style={styles.menuItemText}>{t.legal}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => openPage('help')}>
              <Text style={styles.menuItemIcon}>❓</Text>
              <Text style={styles.menuItemText}>{t.help}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCloseButton} onPress={() => setIsOpen(false)}>
              <Text style={styles.menuCloseButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Páginas */}
      {currentPage === 'nda' && renderLegalPage('nda')}
      {currentPage === 'privacy' && renderLegalPage('privacy')}
      {currentPage === 'legal' && renderLegalPage('legal')}
      {currentPage === 'history' && renderHistoryPage()}
      {currentPage === 'settings' && renderSettingsPage()}
      {currentPage === 'help' && renderHelpPage()}
    </>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#112240',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 20,
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
  menuCloseButton: {
    marginTop: 16,
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
  settingSection: {
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 12,
  },
  settingOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  settingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#112240',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    alignItems: 'center',
  },
  settingOptionActive: {
    borderColor: '#00d4ff',
    backgroundColor: '#0d2847',
  },
  settingOptionText: {
    color: '#8892b0',
    fontSize: 14,
  },
  settingOptionTextActive: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderColor: '#00d4ff',
    borderWidth: 3,
  },
  colorCheckmark: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
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
