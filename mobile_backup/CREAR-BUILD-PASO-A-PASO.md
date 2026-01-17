# Crear Build de Caymus Calculator - Paso a Paso

## El Problema
EAS Build no puede generar las credenciales (keystore para Android, certificados para iOS) en modo automático desde Replit porque requiere interacción.

## La Solución: Usar el Dashboard de Expo

### Paso 1: Ir al Dashboard de Expo
1. Abre tu navegador y ve a: **https://expo.dev**
2. Inicia sesión con tu cuenta **g3lasio**

### Paso 2: Navegar al Proyecto
1. Click en tu proyecto **caymus-calculator**
2. En el menú izquierdo, click en **Builds**

### Paso 3: Crear Build de Android (APK)
1. Click en el botón **"Create a build"** (arriba a la derecha)
2. Selecciona:
   - **Platform**: Android
   - **Build profile**: preview
3. Click en **"Run build"**
4. Expo te preguntará si quieres generar un nuevo Keystore - **Selecciona "Generate new keystore"**
5. Espera 10-15 minutos mientras se compila
6. Cuando termine, descarga el archivo **APK**

### Paso 4: Instalar APK en tu Android
1. Transfiere el APK a tu teléfono Android
2. Abre el archivo APK
3. Si te pide permisos, activa "Instalar de fuentes desconocidas"
4. La app se instalará

---

## Para iOS (IPA)

### Requisitos Previos para iOS
- Tu Apple ID (email de tu cuenta de Apple Developer)
- Tu Team ID de Apple Developer

### Paso 1: Crear Build de iOS
1. En el Dashboard de Expo, click en **"Create a build"**
2. Selecciona:
   - **Platform**: iOS
   - **Build profile**: preview
3. Expo te pedirá conectar tu cuenta de Apple Developer
4. Sigue las instrucciones para autorizar Expo
5. Espera 15-20 minutos

### Paso 2: Instalar en iPhone
Para el perfil "preview", el IPA se puede instalar directamente escaneando un QR que Expo te proporcionará.

---

## Notas Importantes

- **No necesitas Mac** - EAS Build compila todo en la nube
- **Android**: El APK de preview se puede instalar directamente
- **iOS**: Requiere que registres tu dispositivo en Apple Developer o uses TestFlight

## Links Útiles
- Dashboard: https://expo.dev/accounts/g3lasio/projects/caymus-calculator
- Builds: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
