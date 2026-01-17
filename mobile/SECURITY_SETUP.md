# Configuración de Seguridad - Caymus Tanks Mobile

**Propiedad de Chyrris Technologies Inc.**

---

## ⚠️ IMPORTANTE: Archivos Sensibles

Los siguientes archivos contienen información sensible y **NUNCA** deben ser subidos al repositorio:

- `credentials.json` - Contraseñas del keystore
- `release.keystore` - Archivo de firma de la app
- `*.keystore` - Cualquier archivo keystore

Estos archivos están en `.gitignore` y no serán rastreados por git.

---

## Configuración Inicial

### 1. Crear el archivo de credenciales

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp credentials.example.json credentials.json
```

Edita `credentials.json` con tus valores reales:

```json
{
  "android": {
    "keystore": {
      "keystorePath": "release.keystore",
      "keystorePassword": "TU_CONTRASEÑA_SEGURA",
      "keyAlias": "caymus-key",
      "keyPassword": "TU_CONTRASEÑA_SEGURA"
    }
  }
}
```

### 2. Generar un nuevo Keystore (si es necesario)

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias caymus-key -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Configurar EAS Build

Para builds en la nube con EAS, configura los secretos en Expo:

```bash
eas secret:create --name KEYSTORE_PASSWORD --value "tu_contraseña"
eas secret:create --name KEY_PASSWORD --value "tu_contraseña"
```

---

## Rotación de Credenciales

Si las credenciales fueron expuestas:

1. **Genera un nuevo keystore** con nuevas contraseñas
2. **Actualiza los secretos** en EAS/Expo
3. **Notifica a Google Play** si la app ya está publicada
4. **Revoca** cualquier acceso comprometido

---

## Mejores Prácticas

1. **Usa contraseñas fuertes** (mínimo 16 caracteres, mezcla de tipos)
2. **Almacena las credenciales** en un gestor de contraseñas seguro
3. **Nunca compartas** las credenciales por canales inseguros
4. **Rota las credenciales** periódicamente
5. **Usa variables de entorno** en CI/CD en lugar de archivos

---

*Documento generado para Chyrris Technologies Inc.*
