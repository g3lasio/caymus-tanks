# 📲 Publicar App a Tu Cuenta de Expo

## 🚀 Opción 1: Publicación Rápida con Expo Publish (Recomendado)

Esta es la forma más rápida de ver tu app funcionando:

### Paso 1: Configurar Project ID

Primero necesitas obtener tu Project ID de Expo:

```bash
cd mobile
npx eas init
```

Esto te pedirá:
1. Login a tu cuenta de Expo
2. Crear o vincular un proyecto
3. Automáticamente actualizará `app.json` con tu Project ID

### Paso 2: Publicar la App

```bash
npx expo publish
```

Esto subirá tu app a los servidores de Expo.

### Paso 3: Abrir en tu iPhone

1. Abre **Expo Go** en tu iPhone
2. Inicia sesión con tu cuenta de Expo
3. Verás "Caymus Calculator" en la lista de proyectos
4. Toca para abrir - ¡sin QR code necesario!

---

## 🔧 Opción 2: EAS Update (Más Moderno)

Si prefieres usar EAS (el sistema nuevo de Expo):

### Configurar y Publicar

```bash
cd mobile

# Inicializar (si no lo has hecho)
npx eas init

# Publicar un update
npx eas update --branch preview --message "Agregados tanques C10-C15"
```

### Abrir en iPhone

1. Primero necesitas crear un build preview:
   ```bash
   npx eas build --profile preview --platform ios
   ```
2. Instala el build en tu iPhone (te dará un link)
3. Luego todos los updates futuros se descargan automáticamente

---

## ⚡ ¿Cuál Usar?

| Método | Velocidad | Mejor Para |
|--------|-----------|------------|
| **expo publish** | ⚡ Rápido (2-3 min) | Ver cambios inmediatamente |
| **eas update** | 🐢 Lento primera vez | Production, updates automáticos |

**Recomendación**: Usa `expo publish` para desarrollo rápido.

---

## 🔍 Solución al Timeout

El problema del timeout ocurre porque:
- Replit tiene restricciones de red
- ngrok (túnel) puede ser bloqueado
- Publicar a Expo evita este problema completamente

**Ventajas de publicar a Expo:**
✅ No necesitas QR code
✅ Funciona desde cualquier lugar
✅ Más rápido y confiable
✅ Puedes compartir con otros usuarios
✅ Se actualiza automáticamente

---

## 📝 Comandos Completos

```bash
# Detener el servidor local actual (si está corriendo)
# Ctrl+C en la terminal donde corre expo

cd mobile

# Login a Expo (si no lo has hecho)
npx expo login

# Inicializar proyecto
npx eas init

# Publicar la app
npx expo publish

# Listo! Ahora abre Expo Go en tu iPhone y busca "Caymus Calculator"
```

---

## 💡 Después de Publicar

Una vez publicado, cada vez que hagas cambios:

```bash
cd mobile
npx expo publish
```

Y la app se actualizará en tu iPhone automáticamente (sin reinstalar).
