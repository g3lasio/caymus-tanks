# Análisis Completo del Proyecto Caymus Tanks

## Fecha: 17 de Enero, 2026

---

## PROBLEMAS IDENTIFICADOS

### 1. Problema Principal: Entry Point Incorrecto para EAS Build

**Síntoma:** 
```
yarn expo export:embed --eager --platform ios --dev false exited with non-zero code: 1
Import stack:
 node_modules/expo/AppEntry.js
 | import "../../App"
```

**Causa Raíz:**
EAS Build en la nube usa una estructura de directorios diferente a la local. Cuando EAS Build clona el repositorio, el directorio `mobile/` se convierte en el directorio raíz del build. El problema es que:

1. Tenemos `package.json` con `"main": "index.js"`
2. Pero también tenemos `app.json` con `"entryPoint": "./index.js"`
3. EAS Build puede estar confundido entre estas dos configuraciones

**Evidencia:**
- `npx expo export --platform ios` funciona PERFECTAMENTE en local
- El error solo ocurre en EAS Build (cloud)

### 2. Problema: Configuración de EAS Build

**Archivo `eas.json`:**
- Falta `projectId` válido (actualmente tiene "caymus-tanks" como string, no como UUID)
- El proyecto necesita estar vinculado a una cuenta de Expo

**Archivo `app.json`:**
- `"owner": "chyrris"` - Debe coincidir con la cuenta de Expo
- `"extra.eas.projectId"` - Debe ser un UUID válido generado por EAS

### 3. Problema: Estructura de Archivos Duplicada

Tenemos DOS archivos App.tsx:
- `/mobile/App.tsx` (raíz) - 393 líneas con toda la lógica
- `/mobile/src/App.tsx` - Archivo duplicado/legacy

Esto puede causar confusión en el bundler.

---

## SOLUCIÓN DEFINITIVA

### Paso 1: Eliminar archivo duplicado
- Eliminar `/mobile/src/App.tsx` (ya no se usa)

### Paso 2: Simplificar configuración de entry point
- Usar SOLO `package.json` con `"main": "index.js"`
- ELIMINAR `"entryPoint"` de `app.json` (no es necesario con Expo SDK 52)

### Paso 3: Corregir app.json
- Eliminar `"entryPoint"` 
- Eliminar `"owner"` (se configura automáticamente con EAS)
- Eliminar `"extra.eas.projectId"` (se genera automáticamente con `eas build:configure`)

### Paso 4: Ejecutar `eas build:configure` en Replit
- Esto vinculará el proyecto con la cuenta de Expo
- Generará el projectId correcto

---

## ARCHIVOS A MODIFICAR

1. **Eliminar:** `/mobile/src/App.tsx`
2. **Modificar:** `/mobile/app.json` - Eliminar entryPoint, owner, extra.eas
3. **Mantener:** `/mobile/index.js` - Entry point correcto
4. **Mantener:** `/mobile/App.tsx` - Componente principal
5. **Mantener:** `/mobile/package.json` - main: "index.js"

---

## CONFIGURACIÓN FINAL ESPERADA

### package.json
```json
{
  "main": "index.js",
  ...
}
```

### index.js
```javascript
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

### app.json (SIN entryPoint, SIN owner, SIN extra.eas)
```json
{
  "expo": {
    "name": "Caymus Tank Calculator",
    "slug": "caymus-tanks",
    "version": "1.0.0",
    ...
  }
}
```

---

## PASOS PARA EL USUARIO EN REPLIT

1. `git pull origin main`
2. `cd mobile`
3. `eas build:configure` (esto vinculará el proyecto y generará projectId)
4. `eas build --platform ios --profile production`
