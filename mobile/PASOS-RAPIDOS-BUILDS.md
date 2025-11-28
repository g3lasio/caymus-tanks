# ⚡ Pasos Rápidos para Crear IPA y APK

## 🎯 Lo que Necesitas Saber

Tu app ya está 100% lista. Solo falta generar los archivos instalables.

## 📱 APK para Android (Pruebas) - 5 minutos

1. Ve a: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
2. Click en **"Create a build"**
3. Selecciona **Android** y **profile: preview**
4. Deja que Expo genere las credenciales automáticamente
5. Espera 10-15 minutos
6. Descarga el **APK** y instálalo en tu Android

**✅ Resultado:** Archivo `.apk` que puedes instalar en cualquier Android

## 🍎 IPA para iOS (App Store) - Requiere Apple Developer

### Requisitos Previos:
- Cuenta de Apple Developer ($99/año): https://developer.apple.com
- App creada en App Store Connect: https://appstoreconnect.apple.com

### Pasos:

1. **Crea app-specific password:**
   - Ve a https://appleid.apple.com
   - Sign-In and Security > App-Specific Passwords
   - Genera uno nuevo (guárdalo)

2. **Crea el build:**
   - Ve a https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Click **"Create a build"**
   - Selecciona **iOS** y **profile: production**
   - Ingresa tu Apple ID y app-specific password
   - Espera 15-20 minutos

3. **Descarga el IPA:**
   - Click en Download cuando termine
   - Archivo listo para subir a App Store Connect

**✅ Resultado:** Archivo `.ipa` para publicar en App Store

## 🤖 AAB para Google Play (Publicación) - Requiere Google Play Console

### Requisitos Previos:
- Cuenta de Google Play Developer ($25 una sola vez)
- App creada en Google Play Console: https://play.google.com/console

### Pasos:

1. **Crea el build:**
   - Ve a https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
   - Click **"Create a build"**
   - Selecciona **Android** y **profile: production**
   - Deja que Expo genere el keystore
   - Espera 10-15 minutos

2. **Descarga el AAB:**
   - Click en Download cuando termine
   - Archivo listo para subir a Google Play Console

**✅ Resultado:** Archivo `.aab` para publicar en Google Play

## 🎬 Orden Recomendado

1. **Primero:** APK de preview → Prueba en tu Android
2. **Segundo:** Si todo funciona, crea builds de producción
3. **Tercero:** Sube a las tiendas y espera aprobación (2-7 días)

## 📍 Links Importantes

- Dashboard Expo Builds: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Apple ID Management: https://appleid.apple.com

---

**💡 Cualquier duda, revisa:** `CREAR-BUILDS-IPA-APK.md` (guía completa)
