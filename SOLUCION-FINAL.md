# 🎯 Solución Final - Timeout en Replit

## ❌ Por Qué Falla el Modo Local

Replit **bloquea las conexiones de red directas** que Expo necesita:
- ❌ Túnel (ngrok) - timeout
- ❌ LAN - timeout
- ❌ Conexiones directas - bloqueadas

**Ningún modo local funciona en Replit por restricciones de red.**

---

## ✅ Solución: Usar EAS (Expo Application Services)

Como ya estás logueado en Expo (`g3lasio`), solo necesitas vincular este proyecto a tu cuenta.

---

## 📋 Pasos Exactos (5 minutos)

### Paso 1: Inicializar EAS

Ejecuta esto en la terminal de Replit:

```bash
cd mobile
npx eas-cli init
```

Te preguntará:
- **"Would you like to create a project?"** → Responde: **Yes**
- **"What would you like to name your project?"** → Escribe: **caymus-calculator**

Esto automáticamente:
- Creará el proyecto en tu cuenta de Expo
- Actualizará `app.json` con tu Project ID
- Configurará todo para publicar

### Paso 2: Configurar Update Channel

```bash
npx eas-cli update:configure
```

Solo presiona Enter para aceptar los defaults.

### Paso 3: Publicar la App

```bash
npx eas-cli update --branch production --message "App inicial con C10-C15"
```

### Paso 4: Ver en tu iPhone

La app se publicará a Expo, pero **necesitas un build para verla**.

Ejecuta:

```bash
npx eas-cli build --profile preview --platform ios
```

Esto tardará ~10-15 minutos. Te dará un link para instalar en tu iPhone.

---

## ⚡ Opción Rápida: Usar Expo Go con Build Preview

Si ya tienes builds anteriores de "Caymus Calculator" en Expo Go, puedes:

```bash
cd mobile
npx eas-cli update --branch preview --message "C10-C15"
```

Y la app se actualizará automáticamente.

---

## 🔑 Comandos Resumidos

```bash
# 1. Inicializar (solo primera vez)
cd mobile
npx eas-cli init

# 2. Configurar updates (solo primera vez)
npx eas-cli update:configure

# 3. Crear build preview (solo primera vez)
npx eas-cli build --profile preview --platform ios

# 4. Publicar cambios futuros
npx eas-cli update --branch production --message "Tu mensaje"
```

---

## 💡 Alternativa: Desarrollo Web

Si necesitas ver la app YA sin esperar builds:

```bash
cd mobile
npx expo start --web
```

Esto abrirá la app en el navegador de Replit. No es perfecto (no es nativo), pero puedes probar los cálculos inmediatamente.

---

## ❓ ¿Qué Hacer Ahora?

**Opción A (Recomendada):** 
Ejecuta `cd mobile && npx eas-cli init` y sigue las instrucciones.

**Opción B (Ver algo ya):**
Ejecuta `cd mobile && npx expo start --web` para ver en navegador.

**Opción C:**
Si ya tienes un proyecto "Caymus Calculator" en Expo, dime y te ayudo a vincularlo.
