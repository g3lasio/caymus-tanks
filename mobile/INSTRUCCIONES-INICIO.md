# 🚀 Cómo Iniciar la App Caymus Calculator

## ⚠️ IMPORTANTE: Primera Ejecución

**Los errores de TypeScript en `mobile/index.ts` y `mobile/App.tsx` son normales antes de la primera ejecución.**

Estos errores desaparecerán automáticamente cuando ejecutes el script por primera vez, ya que instalará las dependencias de Expo.

## Opción 1: Desde la Raíz del Proyecto (Recomendado)

```bash
./start-expo.sh
```

Este script automáticamente:
- ✅ Instala las dependencias si es necesario (primera vez: ~2-3 minutos)
- ✅ Inicia el servidor de Expo con túnel
- ✅ Muestra el QR code para escanear
- ✅ Resuelve los errores de TypeScript

## Opción 2: Desde el Directorio mobile/ (Manual)

```bash
cd mobile
npm install  # Solo la primera vez
npx expo start --tunnel
```

## ¿Qué Hacer Después de Iniciar?

1. **Verás un QR code en la terminal**
2. **En tu iPhone:**
   - Abre el App Store
   - Busca e instala "Expo Go"
   - Abre Expo Go
   - Escanea el QR code que aparece en la terminal
   - ¡La app se cargará en tu iPhone!

## Si Ves Errores de Dependencias

Si al ejecutar ves errores sobre paquetes faltantes, instálalos primero:

```bash
cd mobile
npm install
```

O con upm:
```bash
cd mobile
upm add expo expo-status-bar @react-native-async-storage/async-storage expo-linear-gradient
```

## Configurar el Workflow de Replit (Opcional)

Para que el botón "Run" de Replit ejecute Expo automáticamente:

1. Haz clic en el menú "Workflows" (esquina superior izquierda)
2. Selecciona "New Workflow"
3. Nombre: "Start Expo"
4. Bajo "Tasks", selecciona "Execute Shell Command"
5. Ingresa el comando: `cd mobile && npx expo start --tunnel`
6. Guarda el workflow
7. En el botón "Run", selecciona "Start Expo" del dropdown

## Solución de Problemas

### El QR no aparece
- Asegúrate de que todas las dependencias estén instaladas (`npm install` en mobile/)
- Intenta ejecutar sin `--tunnel`: `npx expo start`

### La app no se carga en Expo Go
- Verifica que tu iPhone y la computadora estén en la misma red Wi-Fi
- Si usas `--tunnel`, puede tardar un poco más en conectar

### Errores de módulos faltantes
- Ejecuta: `cd mobile && npm install`
- O usa: `cd mobile && upm add <nombre-del-paquete>`

## Próximos Pasos: Publicar en App Store

Una vez que la app funcione correctamente en Expo Go, consulta el archivo `mobile/README.md` para instrucciones completas sobre cómo publicar la app en el App Store.

Los pasos principales son:
1. Configurar cuenta de Apple Developer ($99/año)
2. Configurar EAS Build con `eas build:configure`
3. Crear build para iOS: `eas build --platform ios --profile production`
4. Enviar a App Store: `eas submit --platform ios --latest`
