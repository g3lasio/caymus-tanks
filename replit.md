# Caymus Tanks - iOS/Android Native App

## Overview

La Caymus Tanks es una aplicación móvil nativa para iOS y Android diseñada para la industria del vino. Permite calcular medidas de volumen de tanques, convirtiendo entre medidas de espacio (en pulgadas) y volumen (en galones) para varios tanques de almacenamiento de vino Caymus.

**IMPORTANTE: Este proyecto es una aplicación React Native con Expo ubicada en el directorio `mobile/`.**

La aplicación incluye:
- 166 tanques con especificaciones completas (series BL, BR, A-L, incluyendo C10-C15)
- Cálculos bidireccionales: espacio a galones y galones a espacio
- Visualización en tiempo real del nivel de llenado con gradiente nativo
- Historial de búsquedas con AsyncStorage
- Interfaz dark mode con tema premium dorado (#d4af37)
- Header y footer fijos (no se mueven con el scroll)
- Grilla de 4 columnas para selección de tanques
- Configurada para publicación en App Store y Google Play

## Estructura del Proyecto

```
/
├── mobile/                    # App React Native/Expo (PROYECTO PRINCIPAL)
│   ├── src/
│   │   ├── screens/CalculatorScreen.tsx   # Pantalla principal
│   │   ├── components/TankVisual.tsx      # Visualización de tanque
│   │   ├── data/tankData.ts               # 166 tanques
│   │   └── hooks/useTankCalculator.ts     # Lógica de cálculo
│   ├── assets/                # Iconos y splash screens
│   ├── app.json               # Configuración de Expo
│   ├── eas.json               # Configuración de EAS Build con credenciales Apple
│   ├── package.json           # Dependencias React Native
│   ├── .easignore             # Ignora archivos de raíz en builds
│   └── .npmrc                 # Configuración npm aislada
├── server/                    # Servidor Express (solo info)
├── node_modules/              # Dependencias web (no usadas por mobile)
└── package.json               # Dependencias web legacy
```

## Configuración de EAS Build

**Project ID:** `8583be63-c95e-4b16-8812-0b1c2ebee11e`

**Credenciales Apple configuradas:**
- Apple Team ID: `UW276ZH5Q7`
- ASC API Key ID: `GBTBQYA2VP`
- ASC API Key Issuer ID: `82391172-0f9a-4156-b9f8-4674f2c17ccf`

**Bundle Identifiers:**
- iOS: `com.caymus.tankcalculator`
- Android: `com.caymus.tankcalculator`

## Comandos de Build

Desde el directorio `mobile/`:

```bash
# Preview (APK/IPA para pruebas)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Production (AAB/IPA para tiendas)
eas build --profile production --platform android
eas build --profile production --platform ios
```

## Desarrollo Local

El workflow "Start Expo App" inicia el servidor de desarrollo:
- Expo Go: Escanear QR o conectar via `exp://ahm9qje-g3lasio-8081.exp.direct`
- Web preview: `http://localhost:8081`

## Recent Changes (Nov 30, 2025)

### EAS Build Configurado
- Build de Android iniciado exitosamente en EAS Build (servidores de Expo)
- Keystore de Android generado localmente para builds automáticos
- .easignore en raíz para ignorar dependencias web conflictivas
- Slug cambiado a `caymus-calculator` para coincidir con proyecto EAS
- Agregado ITSAppUsesNonExemptEncryption para iOS

### Estructura del Build
- Android: Usa credenciales locales (credentials.json + release.keystore)
- iOS: Requiere configuración interactiva una vez (certificados Apple)
- Documentación completa en mobile/BUILD-INSTRUCTIONS.md

### Cambios Anteriores
- Header y footer fijos (no se mueven con scroll)
- Grilla de tanques en 4 columnas (más compacta)
- Buscador de tanque más pequeño (70px)
- Input y botón "Tanques" en paralelo

## User Preferences

Preferred communication style: Simple, everyday language.
Company name: Chyrris Technologies
App name: Caymus Tanks

## Technical Stack

- **Framework**: React Native 0.81.5 con Expo SDK 54
- **React**: 18.3.1 (requerido por Expo SDK 54)
- **Lenguaje**: TypeScript
- **Persistencia**: AsyncStorage
- **Build**: EAS Build (cloud)
- **Distribución**: App Store + Google Play
