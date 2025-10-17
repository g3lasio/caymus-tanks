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

### Inicio Rápido

```bash
./start-expo.sh
```

Este script automáticamente:
- Instala las dependencias de Expo en `mobile/` si es necesario
- Inicia el servidor de Expo con túnel
- Muestra el QR code para escanear

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

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with a custom dark theme and wine industry-inspired color palette
- **UI Components**: Radix UI primitives via shadcn/ui for accessible, customizable components
- **State Management**: React hooks with custom tank calculator hook (`useTankCalculator`)
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Animations**: Framer Motion for smooth tank fill animations and visual feedback

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with JSON responses
- **Development Server**: Vite integration for hot module replacement in development
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **In-Memory Storage**: Fallback MemStorage implementation for development/testing
- **Local Storage**: Browser localStorage for calculation history and user preferences
- **Tank Data**: Static JSON configuration with comprehensive tank specifications

### Authentication and Authorization
- **Current State**: Basic user schema defined but not implemented in UI
- **Prepared Infrastructure**: Drizzle schema with users table including username/password fields
- **Session Management**: Prepared for connect-pg-simple session storage
- **Future Implementation**: Ready for login/registration system expansion

### External Dependencies
- **Database**: Neon serverless PostgreSQL for production data persistence
- **Development Tools**: 
  - ESBuild for fast production bundling
  - TypeScript compiler for type checking
  - Replit development environment integration
- **UI Libraries**: Comprehensive Radix UI component set for consistent user experience
- **Validation**: Zod for runtime type validation and schema generation
- **Date Handling**: date-fns for calculation timestamps and history management

### Core Calculation Engine
The application implements sophisticated tank volume calculations that account for:
- **Tank Geometry**: Different gallon-per-inch ratios for main body vs top sections
- **Precision Calculations**: Handles both positive and negative space measurements
- **Multiple Tank Types**: Support for BL, BR, A, B, and C series tanks with unique specifications
- **Bidirectional Conversion**: Space-to-gallons and gallons-to-space calculations
- **Visual Feedback**: Real-time tank fill percentage visualization

### Configuration Management
- **Build Configuration**: Vite config with path aliases and plugin system
- **TypeScript Configuration**: Strict mode with modern ES features and path mapping
- **Tailwind Configuration**: Custom color scheme and component styling
- **Drizzle Configuration**: Database connection and migration management
- **Component Configuration**: shadcn/ui setup with custom theme integration