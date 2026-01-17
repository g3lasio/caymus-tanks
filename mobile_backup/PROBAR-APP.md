# 🧪 Guía: Cómo Probar la App Caymus Calculator

## ✅ App Actualmente Corriendo

Tu app Expo está activa y lista para probar. Tienes 3 opciones:

---

## 📱 Opción 1: Expo Go en tu Teléfono (Recomendada)

**Esta es la versión NATIVA real de tu app - la más precisa para probar**

### Paso 1: Instalar Expo Go
- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Paso 2: Ver el QR Code

En Replit, ve al panel de **Console/Logs** o **Workflows** y busca el workflow "Start Expo App". Verás un QR code ASCII que se ve así:

```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ ██▄▄ ▀▄▀█▀█▀█ █ ▄▄▄▄▄ █
█ █   █ █▀▄  ██▀█▀▀ ▀ █ █   █ █
...
```

### Paso 3: Escanear y Abrir

1. Abre **Expo Go** en tu teléfono
2. Toca el botón de **"Scan QR Code"**
3. Apunta la cámara al QR en tu pantalla de Replit
4. ¡La app se cargará automáticamente!

### Alternativa: URL Directa

Si no puedes escanear el QR, en Expo Go:
1. Toca "Enter URL manually"
2. Pega: `exp://gw3gq60-g3lasio-8081.exp.direct`
3. Toca "Connect"

---

## 🌐 Opción 2: Navegador Web (Pruebas Rápidas)

**⚠️ Nota:** Esta es una versión web simulada (React Native Web), NO la app nativa. Úsala solo para verificar lógica y cálculos rápidamente.

### En Replit:

1. **En el panel de preview de Replit**, deberías ver la app web
2. O abre en nueva pestaña: La URL del webview de Replit

### Probar Localmente:

Si estás trabajando en un navegador externo:
1. El servidor Metro está en `http://localhost:8081`
2. Para abrir la versión web, presiona `w` en la consola de Expo

**Limitaciones de la versión web:**
- No tiene acceso a LinearGradient nativo
- AsyncStorage puede comportarse diferente
- No representa la experiencia móvil real

---

## 🚀 Opción 3: Publicar a Expo (Acceso Permanente)

**Esta opción te permite acceder a la app desde cualquier lugar sin depender del servidor de Replit**

### Paso 1: Publicar

En la terminal de Replit:
```bash
cd mobile && npx expo publish
```

O usa el script:
```bash
./publicar-expo.sh
```

### Paso 2: Acceder desde Expo Go

1. Abre Expo Go en tu teléfono
2. Inicia sesión con tu cuenta (@g3lasio)
3. Ve a la pestaña "Projects"
4. Busca "Caymus Calculator"
5. ¡Toca para abrir!

**Ventajas:**
- ✅ No necesitas que Replit esté corriendo
- ✅ Acceso desde cualquier lugar
- ✅ Puedes compartir con otros usuarios
- ✅ Updates automáticos cuando vuelvas a publicar

---

## 🧪 Qué Probar en la App

### Funcionalidad Principal:

1. **Búsqueda de Tanques:**
   - Prueba buscar: BL1, BR1, A1, C1, C10, D1, etc.
   - Verifica que los 166 tanques estén disponibles

2. **Cálculo Espacio → Galones:**
   - Selecciona un tanque (ej: C10)
   - Ingresa espacio vacío (ej: 5 pulgadas)
   - Verifica que calcule los galones correctamente
   - Revisa que el porcentaje de llenado sea correcto

3. **Cálculo Galones → Espacio:**
   - Cambia a modo "Galones → Espacio"
   - Ingresa galones deseados (ej: 2000)
   - Verifica que calcule el espacio requerido

4. **Visualización de Tanque:**
   - Verifica que el tanque visual muestre el gradiente
   - Revisa que el nivel de llenado sea preciso
   - Prueba con diferentes valores

5. **Historial:**
   - Busca varios tanques
   - Verifica que se guarden en el historial
   - Toca un tanque del historial para volver a cargarlo

6. **Edge Cases:**
   - Prueba con valores en 0
   - Prueba con valores máximos (capacidad total del tanque)
   - Verifica manejo de errores con valores inválidos

### Tanques Específicos a Probar:

- **C10-C15**: Los nuevos tanques añadidos
  - Total: 2,748 galones
  - GPI: 22.307
  - Top: 12.25 pulgadas

- **BL1-BL4**: Tanques grandes
  - Total: 16,239.42 galones

- **A1-A15**: Serie completa
  - Total: 52,531.2 galones

---

## 🐛 Solución de Problemas

### "QR code no funciona"
- Asegúrate de que ambos dispositivos estén en la misma red
- Intenta con la URL manual en Expo Go
- Verifica que el workflow "Start Expo App" esté corriendo

### "App se carga pero pantalla blanca"
- Revisa los logs en la consola de Expo
- Busca errores en rojo en los logs
- Intenta hacer reload (agita el teléfono y toca "Reload")

### "Cambios no se reflejan"
- En Expo Go, agita el teléfono
- Toca "Reload" para refrescar
- O presiona `r` en la consola de Expo en Replit

### "Gradiente no se ve"
- Esto es normal en la versión web
- Usa Expo Go para ver el gradiente nativo real

---

## 📊 Checklist de Pruebas

Antes de crear builds de producción, verifica:

- [ ] Todos los 166 tanques son accesibles
- [ ] Cálculos de espacio → galones funcionan
- [ ] Cálculos de galones → espacio funcionan
- [ ] Visualización de tanque muestra gradiente
- [ ] Historial guarda y carga tanques correctamente
- [ ] UI se ve bien en iPhone y iPad
- [ ] Dark mode funciona correctamente
- [ ] No hay errores en la consola
- [ ] Performance es fluida (no lag)
- [ ] Teclado no tapa los inputs

---

## 🎯 Próximos Pasos

Una vez que hayas probado todo y esté funcionando:

1. **Crear builds de preview** para instalación permanente
2. **Crear builds de producción** para las tiendas
3. **Seguir las guías:**
   - `PASOS-RAPIDOS-BUILDS.md` - Guía rápida
   - `CREAR-BUILDS-IPA-APK.md` - Guía completa

---

**💡 Tip:** Usa Expo Go para desarrollo diario y crea builds solo cuando necesites probar features específicas de dispositivo o para distribución.
