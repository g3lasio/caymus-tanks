# 📦 Guía Completa: Crear Archivos IPA y APK

## ✅ Proyecto Configurado

Tu proyecto Caymus Calculator ya está correctamente configurado:
- ✅ Project ID: `8583be63-c95e-4b16-8812-0b1c2ebee11e`
- ✅ Bundle ID iOS: `com.caymus.tankcalculator`
- ✅ Package Android: `com.caymus.tankcalculator`
- ✅ EAS configurado en `eas.json`

## 🚀 Método Recomendado: Interfaz Web de Expo

Debido a las limitaciones de comandos interactivos en Replit, la forma más confiable es usar la interfaz web de Expo.

### 📱 Paso 1: Crear Build de Android (APK para Pruebas)

1. **Ve a Expo Dashboard:**
   - Abre: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Inicia sesión con tu cuenta de Expo

2. **Crear Nuevo Build:**
   - Click en **"Create a build"** o **"New Build"**
   - Selecciona **Android**
   - Selecciona **Build profile: preview** (esto crea un APK instalable)

3. **Configurar Credenciales:**
   - Expo te preguntará si quieres que genere las credenciales automáticamente
   - Selecciona **"Let Expo handle it"** (Expo generará el Keystore por ti)
   - Esto es seguro y recomendado para comenzar

4. **Esperar el Build:**
   - El proceso toma 10-15 minutos
   - Recibirás un email cuando termine
   - Puedes ver el progreso en tiempo real en el dashboard

5. **Descargar el APK:**
   - Una vez completado, verás un botón **"Download"**
   - Descarga el archivo `.apk`
   - Instálalo en tu teléfono Android para probar

### 🍎 Paso 2: Crear Build de iOS (IPA para App Store)

**⚠️ REQUISITO: Necesitas una cuenta de Apple Developer ($99/año)**

#### Opción A: Build para Pruebas Internas (Preview)

1. **Ve a Expo Dashboard:**
   - https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Click en **"Create a build"**
   - Selecciona **iOS**
   - Selecciona **Build profile: preview**

2. **Configurar Credenciales iOS:**
   - Expo te pedirá tu **Apple ID** y **app-specific password**
   - Para crear un app-specific password:
     - Ve a https://appleid.apple.com
     - Sección "Sign-In and Security"
     - Genera un password específico para apps
   
3. **Registrar Dispositivos (para builds de preview):**
   - Expo te pedirá el UDID de tu iPhone
   - Para obtenerlo:
     - Conecta tu iPhone a tu Mac
     - Abre Finder > selecciona tu iPhone
     - Click donde dice el nombre del modelo > se mostrará el UDID
     - Cópialo y pégalo en Expo
   
4. **Esperar el Build:**
   - 15-20 minutos aproximadamente
   - Recibirás email cuando termine

5. **Instalar en iPhone:**
   - Descarga el archivo `.tar.gz`
   - Expo te dará un link directo para instalarlo en tu iPhone
   - O usa Apple Configurator 2 en Mac

#### Opción B: Build para App Store (Producción)

1. **Crear App en App Store Connect:**
   - Ve a https://appstoreconnect.apple.com
   - Click en "My Apps" > "+" > "New App"
   - Bundle ID: `com.caymus.tankcalculator`
   - Nombre: "Caymus Calculator" (o el que prefieras)

2. **Crear Build en Expo:**
   - https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Click **"Create a build"**
   - Selecciona **iOS**
   - Selecciona **Build profile: production**

3. **Configurar Credenciales:**
   - Apple ID y app-specific password
   - Expo generará certificados y provisioning profiles automáticamente

4. **Descargar IPA:**
   - Cuando termine, descarga el archivo `.ipa`
   - Este archivo se sube a App Store Connect

### 🤖 Paso 3: Build de Android para Google Play (AAB)

**Para publicar en Google Play Store necesitas AAB, no APK**

1. **Crear Aplicación en Google Play Console:**
   - Ve a https://play.google.com/console
   - Crea una nueva aplicación
   - Package name: `com.caymus.tankcalculator`

2. **Crear Build de Producción:**
   - https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Click **"Create a build"**
   - Selecciona **Android**
   - Selecciona **Build profile: production** (esto crea AAB, no APK)

3. **Configurar Upload Key:**
   - Expo generará el keystore automáticamente
   - Importante: Guarda las credenciales que Expo te de

4. **Descargar AAB:**
   - Archivo `.aab` para subir a Google Play
   - Este formato es obligatorio para publicación en la tienda

## 🔧 Método Alternativo: Línea de Comandos (Avanzado)

Si prefieres usar comandos, puedes intentar:

```bash
cd mobile

# Para Android Preview (APK)
npx eas-cli build --profile preview --platform android

# Para Android Producción (AAB)
npx eas-cli build --profile production --platform android

# Para iOS Preview
npx eas-cli build --profile preview --platform ios

# Para iOS Producción (IPA)
npx eas-cli build --profile production --platform ios
```

**⚠️ Nota:** Estos comandos son interactivos y pueden tener problemas en Replit. La interfaz web es más confiable.

## 📋 Resumen de Archivos que Obtendrás

### Para Pruebas:
- ✅ **Android**: `caymus-calculator-preview.apk` (instalable directamente)
- ✅ **iOS**: `caymus-calculator-preview.tar.gz` (instalar vía link o Apple Configurator)

### Para Publicación:
- ✅ **Android**: `caymus-calculator-production.aab` (subir a Google Play)
- ✅ **iOS**: `caymus-calculator-production.ipa` (subir a App Store Connect)

## 🎯 Próximos Pasos Después de Obtener los Archivos

### Para App Store (iOS):
1. Abre App Store Connect
2. Selecciona tu app
3. Ve a la sección "TestFlight" o "App Store"
4. Sube el archivo `.ipa` usando Transporter app o Xcode
5. Completa la información requerida (screenshots, descripción, etc.)
6. Envía para revisión

### Para Google Play (Android):
1. Abre Google Play Console
2. Selecciona tu app
3. Ve a "Production" o "Internal testing"
4. Click en "Create new release"
5. Sube el archivo `.aab`
6. Completa la información requerida
7. Envía para revisión

## 🔒 Seguridad de Credenciales

- Expo almacena todas las credenciales de forma segura en sus servidores
- Nunca se guardan en tu código o en Replit
- Puedes regenerarlas en cualquier momento desde el dashboard de Expo
- Para producción, considera usar EAS Submit para automatizar el envío a las tiendas

## ❓ Problemas Comunes

### "Build failed: Unable to resolve iOS credentials"
- Asegúrate de tener una cuenta de Apple Developer activa
- Verifica que el app-specific password sea correcto
- Intenta regenerar el app-specific password

### "Keystore not found"
- Deja que Expo genere el keystore automáticamente
- No intentes usar uno existente la primera vez

### "Bundle ID already in use"
- Cambia el bundle ID en `mobile/app.json` a uno único
- Ejemplo: `com.tuempresa.caymus.calculator`

## 📞 Soporte

- Documentación EAS: https://docs.expo.dev/build/introduction/
- Foro de Expo: https://forums.expo.dev/
- Discord de Expo: https://discord.gg/expo

---

**💡 Tip:** Empieza siempre con builds de **preview** para probar en tus dispositivos antes de crear builds de producción para las tiendas.
