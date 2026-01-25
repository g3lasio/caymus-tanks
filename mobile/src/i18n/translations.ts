// ============================================================================
// TRADUCCIONES CENTRALIZADAS - CAYMUS TANK CALCULATOR
// ============================================================================

export type Language = 'es' | 'en';

export interface Translations {
  // Menu
  menu: string;
  history: string;
  help: string;
  logout: string;
  
  // Legal
  nda: string;
  privacy: string;
  legal: string;
  
  // Calculator
  tankSelection: string;
  calculationMode: string;
  spaceToGallons: string;
  gallonsToSpace: string;
  inchesOfSpace: string;
  desiredGallons: string;
  calculate: string;
  reset: string;
  results: string;
  
  // Tank specs
  tankSpecs: string;
  totalCapacity: string;
  gallonsPerInch: string;
  bellCapacity: string;
  bellHeight: string;
  
  // Results
  wineGallons: string;
  emptySpace: string;
  fillPercentage: string;
  requiredSpace: string;
  
  // Warnings
  bellZoneWarning: string;
  bodyZoneSuccess: string;
  
  // History
  clearHistory: string;
  noHistory: string;
  
  // Help
  sendFeedback: string;
  feedbackPlaceholder: string;
  send: string;
  feedbackSent: string;
  yourEmail: string;
  subject: string;
  
  // General
  close: string;
  language: string;
  spanish: string;
  english: string;
  tanks: string;
  searchTank: string;
  
  // Placeholders & hints
  enterSpaceHint: string;
  enterGallonsHint: string;
  selectTankFirst: string;
  invalidInches: string;
  invalidGallons: string;
  errorDeviceMismatch: string;
  errorInvalidCode: string;
  errorVerifyFailed: string;
  
  // Footer
  allRightsReserved: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    // Menu
    menu: 'Menú',
    history: 'Historial de Cálculos',
    help: 'Ayuda y Soporte',
    logout: 'Cerrar Sesión',
    
    // Legal
    nda: 'Acuerdo de Confidencialidad',
    privacy: 'Política de Privacidad',
    legal: 'Términos y Condiciones',
    
    // Calculator
    tankSelection: 'Selección de Tanque',
    calculationMode: 'Modo de Cálculo',
    spaceToGallons: 'Espacio → Galones',
    gallonsToSpace: 'Galones → Espacio',
    inchesOfSpace: 'Pulgadas de Espacio',
    desiredGallons: 'Galones Deseados',
    calculate: 'CALCULAR',
    reset: 'RESETEAR',
    results: 'Resultados',
    
    // Tank specs
    tankSpecs: 'Especificaciones del Tanque',
    totalCapacity: 'Capacidad Total',
    gallonsPerInch: 'Galones/Pulgada',
    bellCapacity: 'Capacidad Campana',
    bellHeight: 'Altura Campana',
    
    // Results
    wineGallons: 'Galones de Vino',
    emptySpace: 'Espacio Vacío',
    fillPercentage: 'Porcentaje de Llenado',
    requiredSpace: 'Espacio Requerido',
    
    // Warnings
    bellZoneWarning: '⚠️ Zona de Campana - Precisión ~97.99%',
    bodyZoneSuccess: '✓ Zona del Cuerpo - Precisión ~99.9%',
    
    // History
    clearHistory: 'Limpiar Historial',
    noHistory: 'No hay historial de cálculos',
    
    // Help
    sendFeedback: 'Enviar Feedback',
    feedbackPlaceholder: 'Escribe tu mensaje, pregunta o sugerencia...',
    send: 'Enviar',
    feedbackSent: '¡Mensaje enviado! Te contactaremos pronto.',
    yourEmail: 'Tu email (opcional)',
    subject: 'Asunto',
    
    // General
    close: 'Cerrar',
    language: 'Idioma',
    spanish: 'Español',
    english: 'English',
    tanks: 'Tanques',
    searchTank: '🔍 Buscar tanque...',
    
    // Placeholders & hints
    enterSpaceHint: 'Ingrese la medida de espacio vacío desde la parte superior del tanque',
    enterGallonsHint: 'Ingrese la cantidad de galones de vino deseados',
    selectTankFirst: 'Por favor selecciona un tanque primero',
    invalidInches: 'Por favor ingresa un número válido de pulgadas',
    invalidGallons: 'Por favor ingresa un número válido de galones entre 0 y',
    errorDeviceMismatch: 'Dispositivo no autorizado. Esta cuenta ya está vinculada a otro dispositivo. El uso compartido puede resultar en el bloqueo permanente.',
    errorInvalidCode: 'Código inválido. Por favor ingresa los 6 dígitos.',
    errorVerifyFailed: 'Error al verificar el código. Inténtalo de nuevo.',
    
    // Footer
    allRightsReserved: 'Todos los derechos reservados',
  },
  en: {
    // Menu
    menu: 'Menu',
    history: 'Calculation History',
    help: 'Help & Support',
    logout: 'Log Out',
    
    // Legal
    nda: 'Confidentiality Agreement',
    privacy: 'Privacy Policy',
    legal: 'Terms and Conditions',
    
    // Calculator
    tankSelection: 'Tank Selection',
    calculationMode: 'Calculation Mode',
    spaceToGallons: 'Space → Gallons',
    gallonsToSpace: 'Gallons → Space',
    inchesOfSpace: 'Inches of Space',
    desiredGallons: 'Desired Gallons',
    calculate: 'CALCULATE',
    reset: 'RESET',
    results: 'Results',
    
    // Tank specs
    tankSpecs: 'Tank Specifications',
    totalCapacity: 'Total Capacity',
    gallonsPerInch: 'Gallons/Inch',
    bellCapacity: 'Bell Capacity',
    bellHeight: 'Bell Height',
    
    // Results
    wineGallons: 'Wine Gallons',
    emptySpace: 'Empty Space',
    fillPercentage: 'Fill Percentage',
    requiredSpace: 'Required Space',
    
    // Warnings
    bellZoneWarning: '⚠️ Bell Zone - Accuracy ~97.99%',
    bodyZoneSuccess: '✓ Body Zone - Accuracy ~99.9%',
    
    // History
    clearHistory: 'Clear History',
    noHistory: 'No calculation history',
    
    // Help
    sendFeedback: 'Send Feedback',
    feedbackPlaceholder: 'Write your message, question or suggestion...',
    send: 'Send',
    feedbackSent: 'Message sent! We will contact you soon.',
    yourEmail: 'Your email (optional)',
    subject: 'Subject',
    
    // General
    close: 'Close',
    language: 'Language',
    spanish: 'Español',
    english: 'English',
    tanks: 'Tanks',
    searchTank: '🔍 Search tank...',
    
    // Placeholders & hints
    enterSpaceHint: 'Enter the empty space measurement from the top of the tank',
    enterGallonsHint: 'Enter the desired wine gallons',
    selectTankFirst: 'Please select a tank first',
    invalidInches: 'Please enter a valid number of inches',
    invalidGallons: 'Please enter a valid number of gallons between 0 and',
    errorDeviceMismatch: 'Unauthorized device. This account is already linked to another device. Account sharing may result in a permanent ban.',
    errorInvalidCode: 'Invalid code. Please enter all 6 digits.',
    errorVerifyFailed: 'Failed to verify code. Please try again.',
    
    // Footer
    allRightsReserved: 'All rights reserved',
  }
};

// ============================================================================
// CONTENIDO LEGAL EN ESPAÑOL E INGLÉS
// ============================================================================

export const LEGAL_CONTENT = {
  es: {
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

	5. RESTRICCIÓN DE DISPOSITIVO ÚNICO
	Por motivos de seguridad y protección de datos, cada cuenta de usuario está vinculada a un único dispositivo físico. El intento de acceder desde múltiples dispositivos o compartir credenciales resultará en el bloqueo permanente de la cuenta. El sistema monitorea activamente los identificadores de dispositivo para prevenir el uso no autorizado.

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
  },
  en: {
    nda: {
      title: 'Confidentiality Agreement',
      content: `CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

Effective Date: January 2026

PARTIES:
- Chyrris Technologies Inc. ("The Company")
- The Application User ("The User")

1. PURPOSE
This Confidentiality Agreement establishes the terms under which the User agrees to maintain the confidentiality of proprietary information contained in the Caymus Tank Calculator application.

2. CONFIDENTIAL INFORMATION
The following is considered confidential information:
• All tank specification data (capacities, dimensions, formulas)
• The calculation algorithms used in the application
• Any technical information related to wine tanks
• Calibration and measurement methods

3. USER OBLIGATIONS
The User agrees to:
• NOT disclose confidential information to third parties
• NOT copy, reproduce or distribute tank data
• NOT use the information for purposes other than authorized work
• Protect the information with the same care as their own confidential information

4. OWNERSHIP
• The Caymus Tank Calculator application is the exclusive property of Chyrris Technologies Inc.
• This application is NOT affiliated with Caymus Vineyards or Wagner Family of Wine
• Tank data is proprietary information of Chyrris Technologies Inc.

	5. SINGLE DEVICE RESTRICTION
	For security and data protection reasons, each user account is linked to a single physical device. Attempting to access from multiple devices or sharing credentials will result in a permanent account ban. The system actively monitors device identifiers to prevent unauthorized use.

6. DURATION
This agreement remains in effect while the User has access to the application and for a period of 5 years after termination of access.

7. CONSEQUENCES OF BREACH
Breach of this agreement may result in:
• Immediate termination of application access
• Legal action for damages
• Liability for business losses

By using this application, the User confirms that they have read, understood and accept the terms of this Confidentiality Agreement.

© 2026 Chyrris Technologies Inc. All rights reserved.`
    },
    privacy: {
      title: 'Privacy Policy',
      content: `PRIVACY POLICY

Last updated: January 2026

Chyrris Technologies Inc. ("we", "our" or "the Company") operates the Caymus Tank Calculator application. This page informs you about our policies regarding the collection, use and disclosure of personal information.

1. INFORMATION WE COLLECT

1.1 Account Information:
• Phone number (for OTP authentication)
• Unique device identifier

1.2 Usage Data:
• Calculation history
• Application preferences
• Access logs

2. USE OF INFORMATION

We use the collected information to:
• Provide and maintain the service
• Authenticate users and prevent unauthorized access
• Improve user experience
• Comply with legal obligations

3. DATA STORAGE

• Data is stored securely on protected servers
• We implement industry-standard security measures
• Calculation data is stored locally on your device

4. SHARING INFORMATION

We do NOT sell, trade or transfer your personal information to third parties, except:
• When required by law
• To protect our legal rights
• With your explicit consent

5. YOUR RIGHTS

You have the right to:
• Access your personal data
• Request correction of inaccurate data
• Request deletion of your data
• Withdraw your consent at any time

6. DATA DELETION

To request deletion of your data, contact:
support@chyrris.com

7. CHANGES TO THIS POLICY

We reserve the right to update this policy. Changes will be notified through the application.

8. CONTACT

For questions about this policy:
Email: info@chyrris.com
Web: https://chyrris.com

© 2026 Chyrris Technologies Inc.`
    },
    legal: {
      title: 'Terms and Conditions',
      content: `TERMS AND CONDITIONS OF USE

Last updated: January 2026

Please read these terms carefully before using the Caymus Tank Calculator application.

1. ACCEPTANCE OF TERMS

By accessing and using this application, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the application.

2. SERVICE DESCRIPTION

Caymus Tank Calculator is a calculation tool for wine tanks that allows:
• Calculate volumes based on space measurements
• Convert between gallons and inches of space
• Maintain a calculation history

3. LICENSE OF USE

You are granted a limited, non-exclusive, non-transferable license to use the application solely for authorized work purposes.

4. RESTRICTIONS

You may NOT:
• Copy, modify or distribute the application
• Reverse engineer the software
• Use the application for illegal purposes
• Share your account with third parties
• Extract or copy tank data

5. INTELLECTUAL PROPERTY

• All intellectual property rights belong to Chyrris Technologies Inc.
• Trademarks, logos and trade names are the property of their respective owners
• This application is NOT affiliated with Caymus Vineyards

6. CALCULATION ACCURACY

• Calculations are provided "as is"
• Accuracy in the bell zone is approximately 97.99%
• Accuracy in the cylindrical body is approximately 99.9%
• The user is responsible for verifying critical results

7. LIMITATION OF LIABILITY

Chyrris Technologies Inc. will not be liable for:
• Losses arising from use of the application
• Errors in calculations due to incorrect input data
• Service interruptions

8. TERMINATION

We may terminate your access at any time if:
• You violate these terms
• You breach the confidentiality agreement
• You misuse the application

9. APPLICABLE LAW

These terms are governed by the laws of the State of California, United States.

10. CONTACT

For legal inquiries:
Email: legal@chyrris.com
Web: https://chyrris.com

© 2026 Chyrris Technologies Inc. All rights reserved.`
    }
  }
};
