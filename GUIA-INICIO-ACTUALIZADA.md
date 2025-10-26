# 🚀 Guía Actualizada - Cómo Ver la App

## ⚠️ Cambio Importante

`expo publish` ya no está disponible en Expo SDK 54. Hay **dos opciones** para ver tu app:

---

## 📱 Opción 1: Modo Desarrollo (Más Fácil)

### Si Estás en la Misma WiFi

```bash
./iniciar-expo-lan.sh
```

**Requisitos:**
- Tu iPhone debe estar en la MISMA red WiFi que Replit
- Abre Expo Go en el iPhone
- Escanea el QR code

**Ventajas:**
✅ No requiere configuración adicional
✅ Funciona inmediatamente
✅ Ideal para desarrollo y testing

**Desventajas:**
❌ Solo funciona si estás en la misma red WiFi
❌ No funciona si Replit bloquea conexiones LAN

---

## 🌐 Opción 2: Publicar con EAS (Recomendado)

Ya que mencionaste que **tienes todo configurado en tu cuenta de Expo**, esta es la mejor opción:

### Paso 1: Inicializar EAS (Solo Primera Vez)

```bash
cd mobile
npm install -g eas-cli
eas login
eas init
```

Esto te pedirá:
- Login a tu cuenta Expo
- Vincular o crear un proyecto
- Actualizará automáticamente el `app.json` con tu Project ID

### Paso 2: Crear Build Development (Solo Primera Vez)

Para que `eas update` funcione, primero necesitas un build:

```bash
eas build --profile preview --platform ios
```

Esto creará un build que puedes instalar en tu iPhone. Te dará un link para descargarlo.

### Paso 3: Instalar en tu iPhone

1. Abre el link que te dio `eas build` en Safari (iPhone)
2. Instala el perfil
3. Instala la app

### Paso 4: Publicar Updates

Ahora, cada vez que hagas cambios (como agregar tanques):

```bash
./publicar-expo.sh
```

O manualmente:

```bash
cd mobile
eas update --branch production --message "Cambios nuevos"
```

La app en tu iPhone se actualizará automáticamente.

---

## 🤔 ¿Cuál Usar?

| Situación | Método Recomendado |
|-----------|-------------------|
| Testing rápido, misma WiFi | Opción 1: LAN |
| Acceso desde cualquier lugar | Opción 2: EAS |
| Ya tienes cuenta Expo configurada | Opción 2: EAS |
| Primera vez usando Expo | Opción 1: LAN |

---

## 📋 Ya que Tienes Cuenta Expo...

Mencionaste que **"ya tengo todo configurado en mi cuenta de expo"**. 

¿Ya tienes un proyecto existente en Expo? Si es así:

### Vincular Este Código a Tu Proyecto Existente

```bash
cd mobile
npm install -g eas-cli
eas login

# Esto te preguntará si quieres usar un proyecto existente
eas init
```

Selecciona tu proyecto existente cuando te lo pregunte.

### Si Ya Tienes un Build Instalado

Si ya tienes un build de "Caymus Calculator" instalado en tu iPhone:

```bash
cd mobile
eas update --branch production --message "Agregados C10-C15"
```

Y tu app se actualizará automáticamente.

---

## 🆘 Si Sigues Teniendo Problemas

Cuéntame:

1. **¿Ya tienes un proyecto "Caymus Calculator" en tu cuenta de Expo?**
2. **¿Ya tienes la app instalada en tu iPhone?**
3. **¿Estás en la misma WiFi que Replit?**

Con esa información puedo darte instrucciones más específicas.

---

## 🎯 Mientras Tanto...

Los tanques C10-C15 YA ESTÁN en el código con todas las especificaciones correctas:

- Total: 2,748 galones
- GPI: 22.307
- Campana: 12.25", 91.08 gal
- Piso: 48.50 gal

Solo falta que puedas ver la app corriendo. 🚀
