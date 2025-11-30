# Caymus Tanks - Build Instructions

## Estado Actual

**Build Android**: En progreso
- URL: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds/31139b35-f418-4f85-b226-733244846c58
- Profile: preview
- Tipo: APK (para pruebas)

## Build de Android (APK/AAB)

Los builds de Android funcionan automáticamente desde Replit:

```bash
cd mobile

# Preview (APK para pruebas)
npx eas-cli build --profile preview --platform android --non-interactive --no-wait

# Production (AAB para Google Play)
npx eas-cli build --profile production --platform android --non-interactive --no-wait
```

## Build de iOS (IPA)

iOS requiere configurar credenciales de Apple una sola vez de forma interactiva.

### Opción 1: Desde tu PC (Recomendado)

1. Clona el repositorio en tu PC
2. Navega al directorio mobile/
3. Ejecuta:
```bash
cd mobile
npm install
npx eas-cli login  # Login con tu cuenta Expo (g3lasio)
npx eas-cli build --profile production --platform ios
```
4. Sigue las instrucciones para configurar:
   - Apple Developer credentials
   - Certificado de distribución
   - Provisioning profile

### Opción 2: Usando EAS credentials:configure

```bash
cd mobile
npx eas-cli credentials
```

Selecciona:
- Platform: iOS
- Build Type: Production
- Configura los certificados usando la opción "Set up credentials"

## Credenciales de Apple Configuradas

Las credenciales de Apple ya están referenciadas en eas.json:

- **Apple Team ID**: UW276ZH5Q7
- **ASC API Key ID**: GBTBQYA2VP
- **ASC API Key Issuer ID**: 82391172-0f9a-4156-b9f8-4674f2c17ccf

## Verificar Builds

```bash
cd mobile
npx eas-cli build:list --limit 5
```

## Descargar Builds

```bash
# Ver URL de descarga del último build
npx eas-cli build:list --limit 1 --platform android
```

O visita: https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds

## Información del Proyecto

- **App Name**: Caymus Tanks
- **Bundle ID**: com.caymus.tankcalculator (iOS y Android)
- **SDK**: Expo 54
- **React Native**: 0.81.5
- **React**: 18.3.1

## Notas

- El keystore de Android se genera automáticamente con credenciales locales
- Para producción en Google Play, considera migrar a credenciales remotas de EAS
- El archivo credentials.json contiene las credenciales locales de Android (no subir a producción)
