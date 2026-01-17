# Propuesta de Autenticación OTP y Monetización
## Caymus Tanks Calculator - Chyrris Technologies

---

## 1. Sistema de Autenticación OTP

### 1.1 Flujo de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                       │
└─────────────────────────────────────────────────────────────────┘

Usuario Nuevo:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Pantalla │───▶│ Registro │───▶│ Verificar│───▶│ Pago/    │───▶ APP
│  Login   │    │ Teléfono │    │   OTP    │    │ Suscripción│
└──────────┘    └──────────┘    └──────────┘    └──────────┘

Usuario Existente (Remember Me activo - 30 días):
┌──────────┐
│  Splash  │───▶ APP (Acceso directo)
│  Screen  │
└──────────┘

Usuario Existente (Remember Me expirado):
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Pantalla │───▶│ Verificar│───▶│ Remember │───▶ APP
│  Login   │    │   OTP    │    │ Me 30días│
└──────────┘    └──────────┘    └──────────┘
```

### 1.2 Restricción de Dispositivo Único

**Concepto:** Cada cuenta (número de teléfono) solo puede estar activa en UN dispositivo a la vez.

**Implementación:**
1. Al registrarse, se genera un `deviceId` único (usando expo-device + expo-application)
2. Este `deviceId` se almacena en el servidor junto con el número de teléfono
3. Si el usuario intenta acceder desde otro dispositivo:
   - Se muestra mensaje: "Esta cuenta ya está activa en otro dispositivo"
   - Opciones: 
     - "Transferir a este dispositivo" (desactiva el anterior)
     - "Contactar soporte"

**Datos almacenados por usuario:**
```json
{
  "phone": "+1234567890",
  "deviceId": "ABC123-XYZ789",
  "deviceName": "iPhone 14 Pro",
  "lastLogin": "2026-01-17T20:00:00Z",
  "rememberMeExpiry": "2026-02-16T20:00:00Z",
  "subscriptionStatus": "active",
  "subscriptionExpiry": "2026-02-17T20:00:00Z"
}
```

### 1.3 Remember Me (30 días)

**Funcionamiento:**
- Al hacer login exitoso, se guarda un token seguro en AsyncStorage
- El token tiene validez de 30 días
- Al abrir la app, se verifica:
  1. ¿Existe token?
  2. ¿El token no ha expirado?
  3. ¿El deviceId coincide con el registrado en el servidor?
- Si todo es válido → Acceso directo a la app
- Si algo falla → Pantalla de login

---

## 2. Propuesta de Monetización

### 2.1 Análisis del Mercado

**Público objetivo:** Trabajadores de bodegas de vino (Caymus y similares)

**Valor del app:**
- Ahorra tiempo en cálculos manuales
- Reduce errores costosos
- Herramienta especializada sin competencia directa
- Datos confidenciales de tanques específicos

### 2.2 Opciones de Precio

#### Opción A: Suscripción Mensual
| Plan | Precio | Características |
|------|--------|-----------------|
| **Básico** | $4.99/mes | Calculadora básica, 10 cálculos/día |
| **Pro** | $9.99/mes | Ilimitado, historial, soporte prioritario |

#### Opción B: Suscripción Anual (Recomendada)
| Plan | Precio | Ahorro |
|------|--------|--------|
| **Anual** | $49.99/año | ~$10 de ahorro vs mensual |

#### Opción C: Pago Único (Licencia Perpetua)
| Plan | Precio | Características |
|------|--------|-----------------|
| **Lifetime** | $99.99 | Acceso de por vida, actualizaciones incluidas |

### 2.3 Mi Recomendación

**Modelo Híbrido:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA DE PRECIOS                        │
└─────────────────────────────────────────────────────────────────┘

🆓 TRIAL GRATUITO (7 días)
   - Acceso completo a todas las funciones
   - Sin tarjeta de crédito requerida
   - Máximo 20 cálculos durante el trial

💰 SUSCRIPCIÓN MENSUAL: $7.99/mes
   - Cálculos ilimitados
   - Historial completo
   - Soporte por email
   - Cancelar cuando quieras

💎 SUSCRIPCIÓN ANUAL: $59.99/año ($4.99/mes)
   - Todo lo del mensual
   - 2 meses GRATIS
   - Soporte prioritario

🏆 LICENCIA DE POR VIDA: $149.99 (pago único)
   - Acceso permanente
   - Todas las actualizaciones futuras
   - Soporte de por vida
   - Ideal para empresas
```

**Justificación del precio $7.99/mes:**
1. Es una herramienta de trabajo especializada
2. No hay competencia directa
3. El valor que aporta (precisión, tiempo) justifica el costo
4. Es accesible para trabajadores individuales
5. Las empresas pueden pagar la licencia de por vida

---

## 3. Implementación Técnica

### 3.1 Tecnologías Requeridas

| Componente | Tecnología | Costo |
|------------|------------|-------|
| **OTP SMS** | Twilio Verify | ~$0.05/verificación |
| **Pagos** | RevenueCat + App Store/Google Play | 15-30% comisión |
| **Base de datos** | Neon (PostgreSQL serverless) | Gratis hasta 3GB |
| **Backend** | Node.js (ya existente) | - |

### 3.2 Estructura de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  device_id VARCHAR(100),
  device_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  remember_me_token VARCHAR(255),
  remember_me_expiry TIMESTAMP
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  plan VARCHAR(50) NOT NULL, -- 'trial', 'monthly', 'annual', 'lifetime'
  status VARCHAR(20) NOT NULL, -- 'active', 'expired', 'cancelled'
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  revenue_cat_id VARCHAR(100)
);

-- Tabla de uso (para trial)
CREATE TABLE usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  calculation_count INTEGER DEFAULT 0,
  last_reset TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Flujo de Pantallas

```
1. SplashScreen
   └── Verifica token de Remember Me
       ├── Válido → CalculatorScreen
       └── Inválido → LoginScreen

2. LoginScreen
   └── Ingresa número de teléfono
       ├── Usuario nuevo → RegisterScreen
       └── Usuario existente → OTPScreen

3. RegisterScreen
   └── Ingresa información:
       - Nombre (opcional)
       - Acepta términos y NDA
       - Acepta política de privacidad
   └── Envía OTP → OTPScreen

4. OTPScreen
   └── Ingresa código de 6 dígitos
       ├── Válido + Usuario nuevo → PaywallScreen
       └── Válido + Usuario existente → CalculatorScreen

5. PaywallScreen
   └── Muestra planes de suscripción
       ├── Selecciona plan → Proceso de pago
       └── "Iniciar Trial" → CalculatorScreen (7 días gratis)

6. CalculatorScreen
   └── App principal con todas las funciones
```

---

## 4. Páginas a Implementar

### 4.1 Nuevas Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **SplashScreen** | Logo + verificación de sesión |
| **LoginScreen** | Input de teléfono + botón "Continuar" |
| **RegisterScreen** | Formulario de registro + aceptación de términos |
| **OTPScreen** | Input de 6 dígitos + timer de reenvío |
| **PaywallScreen** | Planes de suscripción + botones de compra |

### 4.2 Modificaciones Existentes

| Componente | Cambio |
|------------|--------|
| **App.tsx** | Agregar navegación condicional basada en auth |
| **FloatingMenu** | Agregar opción "Mi Suscripción" y "Cerrar Sesión" |

---

## 5. Costos Estimados

### 5.1 Costos de Desarrollo (Ya cubiertos)
- Implementación de auth: Incluido
- Implementación de pagos: Incluido

### 5.2 Costos Operativos Mensuales

| Servicio | Costo Estimado |
|----------|----------------|
| Twilio (100 usuarios) | ~$5/mes |
| Neon Database | $0 (tier gratis) |
| Apple Developer | $99/año |
| Google Play | $25 (único) |
| **Total inicial** | ~$130 |
| **Total mensual** | ~$5-10/mes |

### 5.3 Proyección de Ingresos

**Escenario conservador (50 usuarios):**
- 30 usuarios mensual ($7.99) = $239.70/mes
- 15 usuarios anual ($59.99) = $74.99/mes promedio
- 5 usuarios lifetime ($149.99) = $62.50/mes promedio
- **Total: ~$377/mes**

**Escenario optimista (200 usuarios):**
- 120 usuarios mensual = $958.80/mes
- 60 usuarios anual = $299.95/mes promedio
- 20 usuarios lifetime = $250/mes promedio
- **Total: ~$1,508/mes**

---

## 6. Próximos Pasos

### Fase 1: Autenticación (1-2 días)
1. ✅ Configurar Twilio Verify
2. ✅ Crear pantallas de Login, Register, OTP
3. ✅ Implementar restricción de dispositivo único
4. ✅ Implementar Remember Me de 30 días

### Fase 2: Suscripciones (1-2 días)
1. ✅ Configurar RevenueCat
2. ✅ Crear PaywallScreen
3. ✅ Implementar trial de 7 días
4. ✅ Conectar con App Store/Google Play

### Fase 3: Publicación (1 semana)
1. ✅ Crear screenshots para tiendas
2. ✅ Escribir descripciones
3. ✅ Subir a App Store Connect
4. ✅ Subir a Google Play Console
5. ✅ Esperar aprobación

---

## 7. Preguntas para Ti

1. **¿Te parece bien el precio de $7.99/mes?** ¿O prefieres más bajo/alto?

2. **¿Quieres ofrecer trial gratuito de 7 días?** Esto puede aumentar conversiones pero también hay riesgo de abuso.

3. **¿Quieres la opción de pago único (lifetime)?** Esto es bueno para empresas pero reduce ingresos recurrentes.

4. **¿Cuántos usuarios estimas que usarán la app?** Esto ayuda a planificar la infraestructura.

5. **¿Tienes cuenta de Twilio?** Si no, necesitamos crearla.

---

*Documento preparado por Manus para Chyrris Technologies*
*Fecha: 17 de Enero, 2026*
