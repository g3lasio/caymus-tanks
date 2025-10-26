# 🔧 Solución al Error de Timeout

## ❌ Problema Identificado

El error "request timed out" ocurre porque:
- **Replit tiene restricciones de red** que bloquean el túnel ngrok
- El modo túnel local no funciona confiablemente en este ambiente
- Esto es común en ambientes de desarrollo en la nube

## ✅ Solución: Publicar a Tu Cuenta de Expo

Ya que tienes tu cuenta de Expo configurada, **la mejor solución es publicar la app directamente a Expo** en lugar de usar el túnel local.

---

## 🚀 Instrucciones Paso a Paso

### 1️⃣ Ejecuta el Script Automatizado

```bash
./publicar-expo.sh
```

Este script automáticamente:
- Te pedirá login a Expo (si no lo has hecho)
- Inicializará el proyecto (primera vez)
- Publicará tu app a los servidores de Expo
- Te mostrará cómo acceder desde tu iPhone

### 2️⃣ Abre en tu iPhone

1. Abre la app **Expo Go**
2. Inicia sesión con tu cuenta de Expo
3. Verás "Caymus Calculator" en tu lista de proyectos
4. ¡Toca para abrir!

---

## 💡 Ventajas de Este Método

✅ **Sin QR Code** - Acceso directo desde Expo Go
✅ **Sin Timeouts** - No depende de túneles locales
✅ **Más Rápido** - Carga instantánea
✅ **Funciona Siempre** - Desde cualquier lugar
✅ **Fácil Compartir** - Puedes dar acceso a otros

---

## 🔄 Para Futuras Actualizaciones

Cada vez que agregues tanques o hagas cambios:

```bash
./publicar-expo.sh
```

La app se actualizará automáticamente en tu iPhone (sin reinstalar).

---

## 📊 Tanques C10-C15 Ya Están Listos

Los 6 nuevos tanques están en el código y listos para probar:

- **C10, C11, C12, C13, C14, C15**
- Total: 2,748 galones
- GPI: 22.307
- Campana: 12.25", 91.08 gal
- Piso cónico: 48.50 gal

---

## 🆘 Si Necesitas Ayuda

### Opción A: Publicación Manual

```bash
cd mobile
npx expo login          # Login a tu cuenta
npx eas init            # Inicializar (solo primera vez)
npx expo publish        # Publicar la app
```

### Opción B: EAS Update (Alternativa)

```bash
cd mobile
npx eas init
npx eas update --branch preview --message "Tanques C10-C15"
```

---

## 📝 Nota Importante

- He **detenido el servidor local** que estaba causando el timeout
- El método de publicación a Expo es **más confiable** para Replit
- Una vez publicado, funcionará **perfectamente** desde Expo Go
