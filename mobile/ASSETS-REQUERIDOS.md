# 📱 Assets Requeridos para Publicación

## ⚠️ IMPORTANTE

Los assets actuales son placeholders. Antes de publicar en App Store o Google Play, debes reemplazarlos con imágenes de producción de alta calidad.

## Assets Necesarios

### 📱 iOS

#### Icon (Icono de App)
- **Archivo**: `assets/icon.png`
- **Tamaño**: 1024×1024 px
- **Formato**: PNG sin transparencia
- **Uso**: Icono principal de la app en iOS
- **Requisitos**:
  - Sin bordes redondeados (iOS los agrega automáticamente)
  - Fondo sólido
  - Diseño centrado

#### Splash Screen
- **Archivo**: `assets/splash.png`
- **Tamaño**: 1284×2778 px (iPhone 13 Pro Max)
- **Formato**: PNG
- **Uso**: Pantalla de carga inicial
- **Recomendación**: Logo de Caymus centrado sobre fondo #0a0a0a

### 🤖 Android

#### Adaptive Icon
- **Archivo**: `assets/adaptive-icon.png`
- **Tamaño**: 1024×1024 px
- **Formato**: PNG con transparencia permitida
- **Uso**: Icono adaptativo para Android
- **Nota**: Android recorta automáticamente en diferentes formas (círculo, cuadrado, etc.)

### 🌐 Web (Opcional)

#### Favicon
- **Archivo**: `assets/favicon.png`
- **Tamaño**: 48×48 px
- **Formato**: PNG
- **Uso**: Favicon para versión web

## 🎨 Guía de Diseño

### Colores de Marca Caymus
- **Fondo oscuro**: #0a0a0a (negro profundo)
- **Acento**: Tonos de vino (burgundy, dark red)
- **Texto**: Blanco o dorado para contraste

### Recomendaciones
1. **Simplicidad**: Iconos claros y reconocibles
2. **Contraste**: Asegura buena visibilidad en fondos claros y oscuros
3. **Profesionalismo**: Diseño acorde a la industria del vino
4. **Consistencia**: Misma identidad visual en todos los assets

## 📋 Checklist Antes de Publicar

- [ ] Icono principal (1024×1024) sin transparencia
- [ ] Splash screen con branding de Caymus
- [ ] Adaptive icon para Android
- [ ] Favicon para web (opcional)
- [ ] Todos los assets optimizados (tamaño de archivo reducido)
- [ ] Revisar que se vean bien en diferentes dispositivos

## 🔧 Cómo Reemplazar

1. Crear los assets con las especificaciones correctas
2. Reemplazar los archivos en `mobile/assets/`:
   - `icon.png`
   - `splash.png`
   - `adaptive-icon.png`
   - `favicon.png`
3. Ejecutar `npx expo prebuild --clean` para regenerar assets nativos
4. Probar en Expo Go para verificar

## 🎯 Herramientas Recomendadas

- **Diseño**: Figma, Adobe Illustrator, Sketch
- **Optimización**: TinyPNG, ImageOptim
- **Preview**: Expo Asset Generator (online tool)
