# 🍷 Caymus Wine Tank Calculator - Mobile App

Aplicación móvil nativa para iOS y Android que permite calcular volúmenes de tanques de vino Caymus.

## ✨ Características

- ✅ Cálculo bidireccional: espacio → galones y galones → espacio
- ✅ 160+ tanques soportados (series BL, BR, A-L)
- ✅ Visualización en tiempo real del nivel de llenado
- ✅ Historial de búsquedas persistente
- ✅ Interfaz dark mode premium
- ✅ Optimizado para iPhone, iPad y Android

## 🚀 Inicio Rápido

### Para Desarrollo Local

```bash
# Desde la raíz del proyecto
./start-expo.sh
```

Luego escanea el QR code con Expo Go en tu dispositivo.

**Más detalles**: Ver `INSTRUCCIONES-INICIO.md`

## 📦 Publicación en App Store / Google Play

**⚠️ IMPORTANTE**: Antes de publicar, necesitas:

1. **Configurar Expo Project ID**
2. **Reemplazar assets placeholder** con imágenes de producción (1024×1024)
3. **Configurar credenciales** de Apple Developer / Google Play

### Guías Completas

- **📖 Guía de Publicación Completa**: `PUBLICACION-GUIA-COMPLETA.md`
- **🎨 Especificaciones de Assets**: `ASSETS-REQUERIDOS.md`
- **🔧 Instrucciones de Inicio**: `INSTRUCCIONES-INICIO.md`

### Publicación Rápida (Resumen)

```bash
cd mobile

# 1. Inicializar proyecto Expo (primera vez)
eas init

# 2. Configurar credenciales
eas credentials

# 3. Build para iOS
eas build --platform ios --profile production

# 4. Build para Android
eas build --platform android --profile production

# 5. Submit a stores
eas submit --platform ios
eas submit --platform android
```

**Detalles completos en**: `PUBLICACION-GUIA-COMPLETA.md`

## 🏗️ Estructura del Proyecto

```
mobile/
├── src/
│   ├── components/
│   │   └── TankVisual.tsx          # Visualización del tanque
│   ├── data/
│   │   └── tankData.ts             # 160+ especificaciones de tanques
│   ├── hooks/
│   │   └── useTankCalculator.ts    # Lógica de cálculo
│   └── screens/
│       └── CalculatorScreen.tsx    # Pantalla principal
├── assets/                          # Iconos y splash screens
├── App.tsx                          # Punto de entrada
├── app.json                         # Configuración de Expo
├── eas.json                         # Configuración de builds
└── package.json                     # Dependencias

Documentación/
├── INSTRUCCIONES-INICIO.md         # Cómo ejecutar localmente
├── PUBLICACION-GUIA-COMPLETA.md    # Guía paso a paso para publicar
└── ASSETS-REQUERIDOS.md            # Especificaciones de imágenes
```

## 🛠️ Tecnologías

- **Framework**: React Native 0.76.6
- **SDK**: Expo 54
- **Lenguaje**: TypeScript
- **Persistencia**: AsyncStorage
- **UI**: Componentes nativos + LinearGradient
- **Build**: EAS Build

## 📝 Configuración Actual

### iOS
- **Bundle ID**: `com.caymus.tankcalculator`
- **Versión**: 1.0.0
- **Build Number**: 1

### Android
- **Package**: `com.caymus.tankcalculator`
- **Version Code**: 1

## 🔄 Actualizaciones OTA

```bash
# Publicar actualización instantánea (sin rebuild)
eas update --branch production --message "Descripción"
```

Las actualizaciones OTA permiten cambios en JavaScript/UI sin necesidad de nueva revisión de las tiendas.

## ⚙️ Dependencias Principales

```json
{
  "expo": "~54.0.13",
  "react": "18.2.0",
  "react-native": "0.76.6",
  "@react-native-async-storage/async-storage": "~2.1.0",
  "expo-linear-gradient": "~14.0.1"
}
```

## 🆘 Troubleshooting

### Errores de TypeScript antes de primera ejecución
**Normal**. Se resuelven automáticamente al ejecutar `./start-expo.sh` por primera vez.

### Build falla
```bash
# Limpiar credenciales
eas credentials --clear-credentials

# Reconfigurar
eas credentials
```

### Assets rechazados
Verifica que los iconos sean 1024×1024 PNG. Ver `ASSETS-REQUERIDOS.md`.

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [React Native Docs](https://reactnative.dev)

## 📄 Licencia

Propietario - Caymus Vineyards

---

**¿Listo para publicar?** Lee `PUBLICACION-GUIA-COMPLETA.md` para el proceso completo paso a paso.
