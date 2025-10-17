# Caymus Wine Tank Calculator - iOS App

Aplicación móvil nativa para iOS que permite calcular volúmenes de tanques de vino Caymus.

## Características

- ✅ Cálculo bidireccional: espacio → galones y galones → espacio
- ✅ Soporte para múltiples series de tanques (BL, BR, A, B, C, D, E, F, G, H, I, J, K, L)
- ✅ Visualización en tiempo real del nivel de llenado
- ✅ Historial de búsquedas con AsyncStorage
- ✅ Interfaz dark mode con tema premium de vinos
- ✅ Diseño optimizado para iPhone y iPad

## Requisitos para Publicación en App Store

### 1. Cuenta de Apple Developer
- Inscríbete en el [Apple Developer Program](https://developer.apple.com/programs/) ($99/año)
- Obtén tu Apple ID, Team ID y App ID

### 2. Cuenta de Expo
- Crea una cuenta gratuita en [Expo.dev](https://expo.dev)
- Instala Expo CLI: `npm install -g eas-cli`
- Inicia sesión: `eas login`

## Pasos para Publicar en App Store

### Paso 1: Configurar Credenciales de iOS

```bash
cd mobile
eas build:configure
```

### Paso 2: Construir para iOS

```bash
# Build para pruebas en dispositivo
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

### Paso 3: Probar en tu iPhone

1. Instala la app Expo Go en tu iPhone desde el App Store
2. Escanea el QR code que aparece al ejecutar:
   ```bash
   npx expo start
   ```

O si quieres probar el build de desarrollo:
```bash
eas build --platform ios --profile development
```

### Paso 4: Publicar en App Store

Una vez que el build de producción esté listo:

```bash
eas submit --platform ios --latest
```

Necesitarás proporcionar:
- Apple ID
- App-specific password
- Team ID
- App ID

### Paso 5: App Store Connect

1. Ve a [App Store Connect](https://appstoreconnect.apple.com/)
2. Completa la información de la app:
   - Descripción
   - Capturas de pantalla
   - Palabras clave
   - Categoría: Productividad o Negocios
3. Envía para revisión

## Desarrollo Local

### Instalar dependencias

Desde el directorio `mobile/`:
```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm start
```

Luego:
- Presiona `i` para abrir en iOS Simulator (requiere Mac)
- Escanea el QR con la app Expo Go en tu iPhone

### Actualizar la app después de publicar

```bash
# Actualización Over-The-Air (sin pasar por revisión de App Store para cambios menores)
eas update --branch production --message "Descripción del cambio"
```

## Estructura del Proyecto

```
mobile/
├── src/
│   ├── components/
│   │   └── TankVisual.tsx       # Visualización del tanque
│   ├── data/
│   │   └── tankData.ts          # Datos de especificaciones de tanques
│   ├── hooks/
│   │   └── useTankCalculator.ts # Lógica de cálculo
│   └── screens/
│       └── CalculatorScreen.tsx # Pantalla principal
├── assets/
│   ├── icon.png                 # Icono de la app
│   └── caymus-logo.jpeg         # Logo de Caymus
├── App.tsx                      # Punto de entrada
├── app.json                     # Configuración de Expo
├── eas.json                     # Configuración de EAS Build
└── package.json                 # Dependencias
```

## Soporte

Para problemas o preguntas sobre la publicación:
- [Documentación de Expo EAS](https://docs.expo.dev/build/introduction/)
- [Guía de App Store](https://developer.apple.com/app-store/review/guidelines/)

## Licencia

Propiedad de Caymus Vineyards.
