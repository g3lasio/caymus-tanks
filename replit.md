# Caymus Wine Tank Calculator - iOS Native App

## Overview

La Caymus Wine Tank Calculator es una aplicación móvil nativa para iOS diseñada para la industria del vino. Permite calcular medidas de volumen de tanques, convirtiendo entre medidas de espacio (en pulgadas) y volumen (en galones) para varios tanques de almacenamiento de vino Caymus.

**IMPORTANTE: Este proyecto ahora es una aplicación React Native con Expo, NO una web app.**

El proyecto Expo completo está en el directorio `mobile/` con sus propias dependencias y configuración, independiente de la raíz del proyecto.

La aplicación incluye:
- ✅ 166 tanques con especificaciones completas (series BL, BR, A-L, incluyendo C10-C15)
- ✅ Cálculos bidireccionales: espacio → galones y galones → espacio (con cálculo proporcional corregido)
- ✅ Visualización en tiempo real del nivel de llenado con gradiente nativo
- ✅ Historial de búsquedas con AsyncStorage
- ✅ Interfaz dark mode con tema premium
- ✅ Optimizada para iPhone y iPad
- ✅ Lista para publicación en App Store

## Cómo Iniciar la App

### 🚀 Método Recomendado: Publicar a Expo

Debido a restricciones de red en Replit, el método más confiable es publicar directamente a tu cuenta de Expo:

```bash
./publicar-expo.sh
```

Este script:
- Te pedirá login a Expo (primera vez)
- Publicará la app a los servidores de Expo
- Te permitirá acceder desde Expo Go sin QR code

**Ventajas:**
- ✅ Sin timeouts ni problemas de conexión
- ✅ Acceso instantáneo desde cualquier lugar
- ✅ Updates automáticos en tu iPhone
- ✅ Puedes compartir con otros usuarios

**Luego:**
1. Abre "Expo Go" en tu iPhone
2. Inicia sesión con tu cuenta de Expo
3. Busca "Caymus Calculator" en tus proyectos
4. ¡Toca para abrir!

### 🔧 Método Alternativo: Servidor Local (Puede Fallar)

```bash
./start-expo.sh
```

⚠️ Nota: El túnel puede tener timeouts en Replit. Usa el método de publicación si tienes problemas.

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