# Caymus Wine Tank Calculator - iOS/Android Native App

## Overview

La Caymus Wine Tank Calculator es una aplicación móvil nativa para iOS y Android diseñada para la industria del vino. Permite calcular medidas de volumen de tanques, convirtiendo entre medidas de espacio (en pulgadas) y volumen (en galones) para varios tanques de almacenamiento de vino Caymus.

**IMPORTANTE: Este proyecto es una aplicación React Native con Expo, NO una web app.**

El proyecto Expo completo está en el directorio `mobile/` con sus propias dependencias y configuración, independiente de la raíz del proyecto.

La aplicación incluye:
- ✅ 166 tanques con especificaciones completas (series BL, BR, A-L, incluyendo C10-C15)
- ✅ Cálculos bidireccionales: espacio → galones y galones → espacio (con cálculo proporcional corregido)
- ✅ Visualización en tiempo real del nivel de llenado con gradiente nativo
- ✅ Historial de búsquedas con AsyncStorage
- ✅ Interfaz dark mode con tema premium
- ✅ Optimizada para iPhone y iPad
- ✅ Configurada para publicación en App Store y Google Play
- ✅ EAS Build configurado para generar IPA y APK/AAB

## Cómo Probar la App en Desarrollo

### 🚀 Método 1: Expo Go (Más Rápido)

```bash
./publicar-expo.sh
```

Este script publica la app a Expo para acceso desde Expo Go sin QR code.

**Luego:**
1. Abre "Expo Go" en tu iPhone/Android
2. Inicia sesión con tu cuenta de Expo (@g3lasio)
3. Busca "Caymus Calculator" en tus proyectos
4. ¡Toca para abrir!

### 📦 Método 2: Archivos Instalables (IPA/APK)

**Para crear archivos IPA (iOS) y APK/AAB (Android) listos para instalar o publicar en las tiendas:**

Ver guías detalladas:
- **Guía rápida:** `mobile/PASOS-RAPIDOS-BUILDS.md`
- **Guía completa:** `mobile/CREAR-BUILDS-IPA-APK.md`

**Resumen:**
1. Ve a https://expo.dev/accounts/g3lasio/projects/caymus-calculator/builds
2. Click en "Create a build"
3. Selecciona plataforma (iOS/Android) y perfil (preview/production)
4. Espera 10-20 minutos
5. Descarga el archivo IPA, APK o AAB

**Project ID configurado:** `8583be63-c95e-4b16-8812-0b1c2ebee11e`

### Archivos del Proyecto Móvil

```
mobile/
├── src/
│   ├── components/TankVisual.tsx      # Visualización de tanque con LinearGradient
│   ├── data/tankData.ts              # 160+ tanques (12 series)
│   ├── hooks/useTankCalculator.ts     # Lógica de cálculo corregida
│   └── screens/CalculatorScreen.tsx   # Pantalla principal
├── assets/                            # Iconos y assets
├── App.tsx                            # Punto de entrada
├── app.json                           # Configuración de Expo con bundle ID
├── eas.json                           # Configuración de EAS Build para App Store
└── package.json                       # Dependencias de Expo (separadas de la raíz)
```

### Documentación Completa

- **🚀 Inicio rápido**: `mobile/INSTRUCCIONES-INICIO.md`
- **📦 Publicación (iOS/Android)**: `mobile/PUBLICACION-GUIA-COMPLETA.md`
- **🎨 Assets requeridos**: `mobile/ASSETS-REQUERIDOS.md`
- **📖 README general**: `mobile/README.md`

## Nota Técnica

El proyecto mantiene dos package.json separados:
- **Raíz**: Dependencias de la web app anterior (React 18, no se usa actualmente)
- **mobile/**: Dependencias de Expo (React 19.1.0, React Native, AsyncStorage, etc.)

El script `start-expo.sh` instala y ejecuta desde `mobile/` automáticamente.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Mobile App (Expo/React Native)

**La app actual está completamente en React Native:**

- **Framework**: React Native 0.81.4 con Expo SDK 54
- **Lenguaje**: TypeScript para type safety
- **UI**: Componentes nativos de React Native (View, Text, ScrollView, etc.)
- **Persistencia**: AsyncStorage para historial de búsquedas
- **Visualización**: LinearGradient nativo para el indicador de nivel de tanque
- **Estado**: React Hooks personalizados para la lógica de cálculo

### Core Calculation Engine

La aplicación implementa cálculos sofisticados de volumen de tanques:

- **Geometría de Tanques**: Diferentes ratios de galones por pulgada para cuerpo principal vs sección superior
- **Cálculo Proporcional**: Cuando el espacio vacío está solo en la sección superior, calcula proporcionalmente en lugar de asumir todo el tope vacío
- **Múltiples Series**: Soporte para BL, BR, A, B, C, D, E, F, G, H, I, J, K, L series con especificaciones únicas
- **Conversión Bidireccional**: Espacio-a-galones y galones-a-espacio
- **Feedback Visual**: Porcentaje de llenado en tiempo real con gradiente