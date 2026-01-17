# Checklist de Publicación - Caymus Tanks

**Propiedad de Chyrris Technologies Inc.**
**Fecha:** Enero 2026

---

## Estado General del Proyecto

| Componente | Estado | Notas |
|------------|--------|-------|
| Lógica de cálculo | ✅ Completado | Exponente 2.2 calibrado |
| Base de datos de tanques | ✅ Completado | 153 tanques unificados |
| Código unificado | ✅ Completado | shared/, mobile/, client/ sincronizados |
| Seguridad | ✅ Completado | Credenciales removidas del repo |
| Páginas legales | ✅ Completado | Privacy, Terms, Support, Data Deletion |
| Autenticación OTP | ✅ Completado | Twilio Verify integrado |
| Sistema de suscripción | ✅ Completado | RevenueCat integrado |
| Metadatos de tiendas | ✅ Completado | App Store y Google Play |

---

## Pre-Requisitos para Publicación

### Apple App Store

- [ ] **Cuenta de desarrollador Apple** ($99/año)
  - Registrar en: https://developer.apple.com/programs/
  
- [ ] **Certificados y perfiles**
  - Distribution Certificate
  - App Store Provisioning Profile
  
- [ ] **App Store Connect**
  - Crear app en App Store Connect
  - Configurar bundle ID: `com.chyrris.caymus-tanks`
  
- [ ] **Assets gráficos**
  - [ ] App Icon (1024x1024 PNG)
  - [ ] Screenshots iPhone 6.7" (1290x2796)
  - [ ] Screenshots iPhone 6.5" (1284x2778)
  - [ ] Screenshots iPad 12.9" (2048x2732)
  - [ ] Feature Graphic (opcional)
  
- [ ] **Información requerida**
  - [ ] Descripción en español e inglés
  - [ ] Keywords
  - [ ] URL de política de privacidad (HTTPS)
  - [ ] URL de soporte (HTTPS)
  - [ ] Información de contacto

### Google Play Store

- [ ] **Cuenta de desarrollador Google** ($25 único)
  - Registrar en: https://play.google.com/console/
  
- [ ] **Keystore de producción**
  - Generar nuevo keystore (el anterior fue expuesto)
  - Guardar credenciales de forma segura
  
- [ ] **Google Play Console**
  - Crear app en Play Console
  - Configurar package: `com.chyrris.caymus_tanks`
  
- [ ] **Assets gráficos**
  - [ ] App Icon (512x512 PNG)
  - [ ] Feature Graphic (1024x500)
  - [ ] Screenshots phone (16:9)
  - [ ] Screenshots tablet (opcional)
  
- [ ] **Información requerida**
  - [ ] Descripción corta (80 chars)
  - [ ] Descripción completa
  - [ ] URL de política de privacidad
  - [ ] Declaración de seguridad de datos

---

## Configuración de Servicios Externos

### Twilio (Autenticación OTP)

- [ ] Crear cuenta en Twilio: https://www.twilio.com/
- [ ] Crear Verify Service
- [ ] Obtener credenciales:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_VERIFY_SERVICE_SID`
- [ ] Configurar en variables de entorno del servidor

### RevenueCat (Suscripciones)

- [ ] Crear cuenta en RevenueCat: https://www.revenuecat.com/
- [ ] Configurar proyecto
- [ ] Conectar con App Store Connect
- [ ] Conectar con Google Play Console
- [ ] Crear productos:
  - `caymus_pro_monthly`
  - `caymus_pro_yearly`
  - `caymus_pro_lifetime`
- [ ] Crear entitlement: `pro`
- [ ] Obtener API keys:
  - `REVENUECAT_APPLE_API_KEY`
  - `REVENUECAT_GOOGLE_API_KEY`

---

## Páginas Web Requeridas (HTTPS)

Las tiendas requieren URLs públicas accesibles:

| Página | URL Sugerida | Estado |
|--------|--------------|--------|
| Política de Privacidad | https://chyrris.com/caymus-tanks/privacy | Pendiente hosting |
| Términos de Servicio | https://chyrris.com/caymus-tanks/terms | Pendiente hosting |
| Soporte | https://chyrris.com/caymus-tanks/support | Pendiente hosting |
| Eliminación de Datos | https://chyrris.com/caymus-tanks/data-deletion | Pendiente hosting |

**Opción rápida:** Usar GitHub Pages para hospedar las páginas legales.

---

## Proceso de Build y Publicación

### iOS (EAS Build)

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto
eas build:configure

# 4. Build para App Store
eas build --platform ios --profile production

# 5. Submit a App Store
eas submit --platform ios
```

### Android (EAS Build)

```bash
# 1. Build para Google Play
eas build --platform android --profile production

# 2. Submit a Google Play
eas submit --platform android
```

---

## Antes de Enviar a Revisión

### App Store (Apple)

- [ ] Probar en dispositivo físico iOS
- [ ] Verificar que no hay crashes
- [ ] Verificar funcionamiento offline
- [ ] Completar App Privacy en App Store Connect
- [ ] Responder preguntas de exportación (encryption)
- [ ] Agregar notas para el revisor

### Google Play

- [ ] Probar en dispositivo físico Android
- [ ] Completar cuestionario de contenido
- [ ] Completar declaración de seguridad de datos
- [ ] Configurar países de distribución
- [ ] Configurar precios de suscripción

---

## Post-Publicación

- [ ] Monitorear reviews y ratings
- [ ] Responder a feedback de usuarios
- [ ] Configurar alertas de crashes (Firebase Crashlytics)
- [ ] Planificar actualizaciones futuras

---

## Contactos Importantes

| Rol | Contacto |
|-----|----------|
| Desarrollador | apps@chyrris.com |
| Soporte | support@chyrris.com |
| Legal | legal@chyrris.com |
| Privacidad | privacy@chyrris.com |

---

## Notas Adicionales

1. **Keystore de Android:** El keystore anterior fue expuesto en el repositorio. DEBE generarse uno nuevo antes de publicar.

2. **Bundle ID de iOS:** Cambiado de `com.caymus.tankcalculator` a `com.chyrris.caymus-tanks` para reflejar la propiedad de Chyrris Technologies.

3. **Package de Android:** Cambiado de `com.caymus.tankcalculator` a `com.chyrris.caymus_tanks`.

4. **Tiempo estimado de revisión:**
   - App Store: 24-48 horas (primera vez puede ser más)
   - Google Play: 1-7 días

---

*Documento generado para Chyrris Technologies Inc.*
