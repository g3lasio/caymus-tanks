# 📦 Guía Completa de Publicación - Caymus Calculator

## 📋 Tabla de Contenidos

1. [Preparación Inicial](#preparación-inicial)
2. [Configurar Proyecto Expo](#configurar-proyecto-expo)
3. [Preparar Assets](#preparar-assets)
4. [Build para iOS](#build-para-ios)
5. [Build para Android](#build-para-android)
6. [Publicar en App Store](#publicar-en-app-store)
7. [Publicar en Google Play](#publicar-en-google-play)
8. [Actualizaciones OTA](#actualizaciones-ota)

---

## 1. Preparación Inicial

### 1.1 Crear Cuenta en Expo

```bash
# Si no tienes cuenta
npx expo register

# Si ya tienes cuenta
npx expo login
```

### 1.2 Instalar EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 1.3 Configurar Proyecto

```bash
cd mobile
eas init
```

Este comando te pedirá crear un proyecto en Expo y te dará un **Project ID**. 

**⚠️ IMPORTANTE**: Copia este Project ID y reemplázalo en `mobile/app.json`:

```json
"extra": {
  "eas": {
    "projectId": "AQUÍ_TU_PROJECT_ID"
  }
}
```

También actualiza la URL de updates:
```json
"updates": {
  "url": "https://u.expo.dev/AQUÍ_TU_PROJECT_ID"
}
```

---

## 2. Configurar Proyecto Expo

### 2.1 Verificar Configuración

Revisa que `mobile/app.json` tenga:
- ✅ Nombre correcto de la app
- ✅ Bundle ID único para iOS (`com.caymus.tankcalculator`)
- ✅ Package name para Android (`com.caymus.tankcalculator`)
- ✅ Versión (1.0.0)
- ✅ Project ID de Expo

### 2.2 Verificar Dependencias

```bash
cd mobile
npm install
```

Asegúrate de que `package.json` use las versiones correctas:
- React: 18.2.0
- React Native: 0.76.6
- Expo SDK: ~54.0.13

---

## 3. Preparar Assets

### 3.1 Assets Requeridos

Ver `mobile/ASSETS-REQUERIDOS.md` para detalles completos.

**Mínimo necesario:**
- `assets/icon.png` (1024×1024)
- `assets/splash.png` (1284×2778)
- `assets/adaptive-icon.png` (1024×1024)

### 3.2 Validar Assets

```bash
npx expo prebuild --clean
```

---

## 4. Build para iOS

### 4.1 Requisitos

- Cuenta de Apple Developer ($99/año)
- Acceso a App Store Connect

### 4.2 Configurar Credenciales

```bash
cd mobile
eas credentials
```

Selecciona:
1. iOS → Production
2. "Build credentials" → "Set up a new distribution certificate"
3. "Set up a new provisioning profile"

EAS automáticamente manejará los certificados.

### 4.3 Crear Build de Producción

```bash
# Primera vez - build completo
eas build --platform ios --profile production

# Builds subsecuentes
eas build --platform ios --profile production --auto-submit
```

**Opciones:**
- `--profile preview`: Para testing interno (TestFlight)
- `--profile production`: Para App Store
- `--auto-submit`: Sube automáticamente a App Store Connect

### 4.4 Monitorear Build

```bash
# Ver status del build
eas build:list

# Ver logs en tiempo real
eas build:view --latest
```

El build tarda ~10-20 minutos.

---

## 5. Build para Android

### 5.1 Requisitos

- Cuenta de Google Play Developer ($25 única vez)

### 5.2 Configurar Credenciales

```bash
eas credentials
```

Selecciona:
1. Android → Production
2. "Set up a new Android Keystore"

EAS creará y guardará el keystore automáticamente.

### 5.3 Crear Build de Producción

```bash
# AAB para Google Play
eas build --platform android --profile production

# APK para testing (opcional)
eas build --platform android --profile preview
```

---

## 6. Publicar en App Store

### 6.1 Configurar App Store Connect

1. Ve a [App Store Connect](https://appstoreconnect.apple.com)
2. Crea una nueva app:
   - **Bundle ID**: `com.caymus.tankcalculator`
   - **Nombre**: Caymus Calculator
   - **Idioma principal**: Español (o el que prefieras)
3. Completa la información:
   - Descripción
   - Screenshots (ver sección 6.3)
   - Política de privacidad
   - Categoría: Productividad / Negocios

### 6.2 Screenshots Requeridos

**iPhone (obligatorio)**:
- 6.7" (iPhone 15 Pro Max): 1290×2796
- Mínimo 3 screenshots

**iPad (opcional pero recomendado)**:
- 12.9" (iPad Pro): 2048×2732

**Tip**: Usa simuladores de iOS para capturar screenshots reales.

### 6.3 Submit para Revisión

```bash
cd mobile
eas submit --platform ios --profile production
```

O manualmente desde App Store Connect:
1. Selecciona el build
2. Completa toda la información
3. Click "Submit for Review"

**Tiempo de revisión**: 1-3 días típicamente

---

## 7. Publicar en Google Play

### 7.1 Configurar Google Play Console

1. Ve a [Google Play Console](https://play.google.com/console)
2. Crea una nueva app
3. Completa:
   - Nombre
   - Descripción corta (80 caracteres)
   - Descripción completa (4000 caracteres)
   - Categoría: Herramientas / Negocios

### 7.2 Assets para Google Play

**Screenshots**:
- Teléfono: 1080×1920 (mínimo 2)
- Tablet 7": 1200×1920 (opcional)
- Tablet 10": 1920×1200 (opcional)

**Gráfico de funciones** (opcional):
- 1024×500

**Icono**: Ya está en `app.json`

### 7.3 Submit para Revisión

```bash
cd mobile
eas submit --platform android --profile production
```

O manualmente:
1. Sube el AAB a Google Play Console
2. Completa toda la metadata
3. Submit a "Internal Testing" primero
4. Luego a "Production"

**Tiempo de revisión**: Horas a 1 día típicamente

---

## 8. Actualizaciones OTA

### 8.1 ¿Qué son las OTA Updates?

Actualizaciones instantáneas de JavaScript/assets sin necesidad de nuevo build.

**Casos de uso:**
- ✅ Corrección de bugs en JS
- ✅ Cambios de UI
- ✅ Actualización de datos de tanques
- ❌ Cambios en dependencias nativas
- ❌ Cambios en configuración de Expo

### 8.2 Publicar Actualización OTA

```bash
cd mobile
eas update --branch production --message "Descripción del cambio"
```

### 8.3 Rollback

```bash
# Ver updates
eas update:list --branch production

# Republish una versión anterior
eas update:republish --group [GROUP_ID]
```

---

## 🔒 Configurar Credenciales de Submit

Edita `mobile/eas.json` → `submit` → `production`:

### iOS
```json
"ios": {
  "appleId": "tu-apple-id@ejemplo.com",
  "ascAppId": "1234567890",  // De App Store Connect
  "appleTeamId": "ABC123XYZ"  // De Apple Developer
}
```

### Android
```json
"android": {
  "serviceAccountKeyPath": "./google-service-account.json",
  "track": "internal"  // o "production"
}
```

---

## 📝 Checklist Final

### Antes del Primer Build
- [ ] Project ID configurado en `app.json`
- [ ] Bundle IDs correctos (iOS y Android)
- [ ] Versión actualizada
- [ ] Assets de producción listos
- [ ] Credenciales de Apple/Google configuradas
- [ ] `npm install` ejecutado sin errores

### Antes de Submit
- [ ] App testeada exhaustivamente en Expo Go
- [ ] Screenshots preparados
- [ ] Descripción de la app escrita
- [ ] Política de privacidad preparada
- [ ] Categoría seleccionada
- [ ] Información de contacto correcta

### Post-Launch
- [ ] Monitorear reviews
- [ ] Configurar crash reporting (opcional: Sentry)
- [ ] Plan de actualizaciones OTA

---

## 🆘 Troubleshooting

### Build falla con error de credenciales
```bash
eas credentials --clear-credentials
eas credentials  # Reconfigura desde cero
```

### "Project ID mismatch"
Verifica que el ID en `app.json` coincida con el de `eas init`.

### Assets rechazados
Usa herramientas como [App Icon Generator](https://www.appicon.co/) para generar todos los tamaños necesarios.

### Submit falla
Revisa que toda la metadata esté completa en App Store Connect / Google Play Console.

---

## 📞 Soporte

- [Expo Docs](https://docs.expo.dev)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Expo Forums](https://forums.expo.dev)
