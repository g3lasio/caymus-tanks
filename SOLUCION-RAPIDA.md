# 🔧 Solución Rápida - Iniciar App

## ✅ Problema Resuelto

Eliminé el plugin `expo-font` de la configuración porque no lo estamos usando en la app.

## 🚀 Cómo Iniciar la App

### Opción 1: Usar el Script (Recomendado)

```bash
./start-expo.sh
```

### Opción 2: Comandos Manuales

Si el script no funciona, ejecuta estos comandos uno por uno:

```bash
cd mobile
npx expo start --tunnel
```

### 📱 En tu iPhone

1. Instala **Expo Go** desde el App Store
2. Escanea el QR code que aparece en la terminal
3. ¡La app se cargará en tu teléfono!

## ✅ Tanques C10-C15 Agregados

Los 6 nuevos tanques ya están en el sistema con las especificaciones correctas:

- **Total**: 2,748 galones
- **Galones/pulgada**: 22.307
- **Campana**: 12.25 pulgadas, 91.08 galones
- **Piso cónico**: 48.50 galones (incluido en total)

### Verificación de Datos

- Diámetro: 81" (Radio: 40.50")
- Altura cilindro: 116.90"
- Altura total medible: 129.15"
- Constante conversión: 231 in³/gal ✓

## 🔍 Si Aún Hay Errores

Si ves algún error sobre dependencias faltantes, ejecuta desde la terminal:

```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --tunnel
```

Esto reinstalará todas las dependencias desde cero.
