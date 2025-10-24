# Caymus Wine Tank Calculator - iOS Native App

## Overview

La Caymus Wine Tank Calculator es una aplicación móvil nativa para iOS diseñada para la industria del vino. Permite calcular medidas de volumen de tanques, convirtiendo entre medidas de espacio (en pulgadas) y volumen (en galones) para varios tanques de almacenamiento de vino Caymus.

**IMPORTANTE: Este proyecto ahora es una aplicación React Native con Expo, NO una web app.**

El proyecto Expo completo está en el directorio `mobile/` con sus propias dependencias y configuración, independiente de la raíz del proyecto.

La aplicación incluye:
- ✅ Especificaciones completas de tanques (series BL, BR, A, B, C, D, E, F, G, H, I, J, K, L)
- ✅ Cálculos bidireccionales: espacio → galones y galones → espacio (con cálculo proporcional corregido)
- ✅ Visualización en tiempo real del nivel de llenado con gradiente nativo
- ✅ Historial de búsquedas con AsyncStorage
- ✅ Interfaz dark mode con tema premium
- ✅ Optimizada para iPhone y iPad
- ✅ Lista para publicación en App Store

## Cómo Iniciar la App

### ⚠️ Nota Importante

Los errores de TypeScript en `mobile/index.ts` y `mobile/App.tsx` son **normales antes de la primera ejecución**. Se resolverán automáticamente cuando ejecutes el script y se instalen las dependencias.

### Inicio Rápido

```bash
./start-expo.sh
```

Este script automáticamente:
- Instala las dependencias de Expo en `mobile/` si es necesario (primera vez: ~2-3 min)
- Inicia el servidor de Expo con túnel
- Muestra el QR code para escanear
- Resuelve los errores de TypeScript

**Luego:**
1. Instala "Expo Go" en tu iPhone desde el App Store
2. Escanea el QR code que aparece en la terminal
3. ¡La app se cargará en tu iPhone!

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

- **Instrucciones de inicio**: Ver `mobile/INSTRUCCIONES-INICIO.md`
- **Publicación en App Store**: Ver `mobile/README.md`

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