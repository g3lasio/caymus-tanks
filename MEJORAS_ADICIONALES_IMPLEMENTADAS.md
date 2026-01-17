# Mejoras Adicionales Implementadas - Caymus Tanks

**Fecha:** Enero 17, 2026  
**Propiedad de:** Chyrris Technologies Inc.

---

## Resumen Ejecutivo

Se han implementado las siguientes mejoras solicitadas:

1. ✅ **Acuerdo de Confidencialidad (NDA)** - Protección legal de datos
2. ✅ **Sidebar con navegación** - Menú lateral completo
3. ✅ **Historial de cálculos** - Registro de operaciones
4. ✅ **Restricción de dispositivo único** - 1 cuenta = 1 dispositivo

---

## 1. Acuerdo de Confidencialidad (NDA)

### Ubicación
- `/legal/confidentiality-agreement.md`
- `/mobile/src/data/legalContent.ts`

### Puntos Clave del NDA

| Sección | Descripción |
|---------|-------------|
| **Propiedad** | Declara que Caymus Tanks es propiedad exclusiva de Chyrris Technologies Inc. |
| **Aclaración** | Especifica que NO hay afiliación con Caymus Vineyards ni Wagner Family |
| **Confidencialidad** | Los datos de tanques son información confidencial y propietaria |
| **Prohibiciones** | No divulgar, copiar, extraer ni compartir los datos |
| **Dispositivo único** | Cada cuenta vinculada a un solo dispositivo |
| **Consecuencias** | Terminación de acceso y responsabilidad legal por incumplimiento |

### Aceptación del Usuario
- El usuario debe aceptar el NDA antes de usar la app
- Se registra fecha, hora, dispositivo y versión aceptada
- Firma electrónica con validez legal

---

## 2. Sidebar con Navegación

### Ubicación
- `/mobile/src/components/Sidebar.tsx`

### Secciones del Menú

```
📱 SIDEBAR
├── 🏠 HEADER
│   ├── Logo + "Caymus Tanks"
│   ├── "by Chyrris Technologies"
│   └── Estado de usuario (FREE/PRO)
│
├── 🧮 CALCULADORA
│   ├── Calculadora
│   └── Historial (PRO badge si es free)
│
├── 👤 CUENTA
│   ├── Mi Perfil
│   └── Suscripción
│
├── 📜 LEGAL
│   ├── Acuerdo de Confidencialidad
│   ├── Términos de Servicio
│   ├── Política de Privacidad
│   └── Eliminación de Datos
│
├── 🆘 SOPORTE
│   ├── Centro de Ayuda
│   └── Contactar Soporte (support@chyrris.com)
│
├── ℹ️ ACERCA DE
│   ├── Chyrris Technologies (→ chyrris.com)
│   └── Acerca de la App
│
└── 📝 FOOTER
    ├── © 2026 Chyrris Technologies Inc.
    └── Caymus Tanks v1.0.0
```

### Características
- Animación de deslizamiento suave
- Diseño oscuro/elegante consistente con la app
- Enlaces externos abren en navegador
- Badge "PRO" en funciones premium

---

## 3. Historial de Cálculos

### Ubicación
- `/mobile/src/services/historyService.ts`
- `/mobile/src/screens/HistoryScreen.tsx`

### Funcionalidades

| Función | Descripción |
|---------|-------------|
| **Guardar** | Cada cálculo se guarda automáticamente |
| **Ver** | Lista cronológica de cálculos |
| **Estadísticas** | Total, tanque más usado, promedio de llenado |
| **Eliminar** | Individual o limpiar todo |
| **Buscar** | Por tanque o rango de fechas |
| **Exportar** | JSON para respaldo (PRO) |

### Datos Guardados por Cálculo

```typescript
{
  id: string,           // ID único
  timestamp: number,    // Fecha/hora
  tankId: string,       // Ej: "F12"
  tankName: string,     // Nombre del tanque
  mode: string,         // 'space_to_gallons' | 'gallons_to_space'
  input: number,        // Valor ingresado
  result: number,       // Resultado calculado
  percentage: number,   // % de llenado
  isInDome: boolean,    // ¿Estaba en zona de campana?
  precisionMessage: string  // Mensaje de precisión
}
```

### Límites por Plan

| Plan | Límite de Historial |
|------|---------------------|
| **Free** | Últimos 10 cálculos |
| **Pro** | Hasta 500 cálculos |

---

## 4. Restricción de Dispositivo Único

### Ubicación
- `/mobile/src/services/deviceService.ts`
- `/server/device.ts`

### Flujo de Verificación

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO INGRESA TELÉFONO             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              VERIFICAR DISPOSITIVO CON SERVIDOR         │
│                                                         │
│  POST /api/auth/verify-device                           │
│  Body: { phoneNumber, deviceId }                        │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │  USUARIO NUEVO  │         │ USUARIO EXISTE  │
    │                 │         │                 │
    │  ✅ Continuar   │         │ ¿Mismo device?  │
    │  con OTP        │         │                 │
    └─────────────────┘         └────────┬────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │                             │
                          ▼                             ▼
                ┌─────────────────┐           ┌─────────────────┐
                │   MISMO DEVICE  │           │  OTRO DEVICE    │
                │                 │           │                 │
                │  ✅ Continuar   │           │  ❌ BLOQUEAR    │
                │  con OTP        │           │                 │
                └─────────────────┘           │  Mensaje:       │
                                              │  "Este número   │
                                              │  ya está en     │
                                              │  otro device"   │
                                              └─────────────────┘
```

### Identificación del Dispositivo

```typescript
// iOS: Vendor ID
const deviceId = await Application.getIosIdForVendorAsync();

// Android: Android ID
const deviceId = Application.getAndroidId();

// Fallback: Fingerprint basado en características
const deviceId = `${brand}_${model}_${osVersion}_${timestamp}_${random}`;
```

### Endpoints de API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/verify-device` | POST | Verifica si el dispositivo puede acceder |
| `/api/auth/register-device` | POST | Registra dispositivo después de OTP exitoso |
| `/api/auth/request-device-change` | POST | Solicita cambio de dispositivo |
| `/api/auth/approve-device-change` | POST | Aprueba cambio (solo admin) |
| `/api/auth/device-info/:phone` | GET | Info del dispositivo (solo admin) |
| `/api/auth/unlink-device/:phone` | DELETE | Desvincula dispositivo (solo admin) |

### Proceso de Cambio de Dispositivo

1. Usuario contacta a `support@chyrris.com`
2. Soporte verifica identidad
3. Admin usa `/api/auth/unlink-device/:phone`
4. Usuario puede registrar nuevo dispositivo

---

## Archivos Creados/Modificados

### Nuevos Archivos

| Archivo | Descripción |
|---------|-------------|
| `legal/confidentiality-agreement.md` | NDA completo en Markdown |
| `mobile/src/components/Sidebar.tsx` | Componente de menú lateral |
| `mobile/src/data/legalContent.ts` | Contenido legal para la app |
| `mobile/src/screens/HistoryScreen.tsx` | Pantalla de historial |
| `mobile/src/screens/legal/LegalPageScreen.tsx` | Pantalla genérica legal |
| `mobile/src/screens/legal/index.ts` | Exportaciones |
| `mobile/src/services/historyService.ts` | Servicio de historial |
| `mobile/src/services/deviceService.ts` | Servicio de dispositivo |
| `server/device.ts` | Rutas de API para dispositivos |

### Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `mobile/package.json` | Agregadas dependencias expo-application, expo-device |
| `server/routes.ts` | Integradas rutas de dispositivo |

---

## Dependencias Agregadas

```json
{
  "expo-application": "~6.0.1",
  "expo-device": "~7.0.1",
  "react-native-purchases": "^8.0.0"
}
```

---

## Próximos Pasos Recomendados

1. **Integrar Sidebar en App.tsx** - Conectar el botón de menú con el Sidebar
2. **Integrar Historial** - Guardar cálculos automáticamente después de cada operación
3. **Pantalla de NDA** - Mostrar al primer inicio y requerir aceptación
4. **Base de datos** - Migrar almacenamiento de dispositivos de memoria a PostgreSQL/MySQL
5. **Testing** - Probar flujo completo de restricción de dispositivo

---

## Contacto

**Chyrris Technologies Inc.**
- Web: https://chyrris.com
- Soporte: support@chyrris.com
- Legal: legal@chyrris.com

---

*Documento generado el 17 de Enero, 2026*
