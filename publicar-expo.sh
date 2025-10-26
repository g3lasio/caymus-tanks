#!/bin/bash

echo "📲 Caymus Calculator - Publicar a Expo con EAS Update"
echo "======================================================"
echo ""

cd mobile

# Verificar si ya está logueado
echo "👤 Usuario de Expo: $(npx expo whoami 2>/dev/null || echo 'No logueado')"

if ! npx expo whoami &>/dev/null; then
    echo ""
    echo "🔐 Por favor, inicia sesión en tu cuenta de Expo:"
    npx expo login
    echo ""
fi

echo ""
echo "📦 Instalando EAS CLI (si es necesario)..."
if ! command -v eas &> /dev/null; then
    npm install -g eas-cli
fi

echo ""
echo "🔑 Verificando configuración de proyecto..."

# Verificar si ya tiene project ID
if grep -q "REPLACE_WITH_YOUR_EXPO_PROJECT_ID" app.json; then
    echo ""
    echo "⚠️  Necesitas inicializar el proyecto primero:"
    echo ""
    echo "   1. Ejecuta: cd mobile && eas init"
    echo "   2. Sigue las instrucciones para crear/vincular el proyecto"
    echo "   3. Luego ejecuta nuevamente: ./publicar-expo.sh"
    echo ""
    exit 1
fi

echo ""
echo "🚀 Publicando update a Expo..."
echo "   (Esto puede tomar 2-3 minutos)"
echo ""

eas update --branch production --message "Tanques C10-C15 agregados"

UPDATE_STATUS=$?

echo ""
if [ $UPDATE_STATUS -eq 0 ]; then
    echo "✅ ¡Listo! Tu app está actualizada en Expo"
    echo ""
    echo "📱 Para verla en tu iPhone:"
    echo "   1. Abre Expo Go"
    echo "   2. Inicia sesión como: $(npx expo whoami 2>/dev/null)"
    echo "   3. Busca 'Caymus Calculator' en tus proyectos"
    echo "   4. ¡Toca para abrir!"
    echo ""
    echo "🎯 Tanques disponibles:"
    echo "   - C1-C15 (incluyendo los nuevos C10-C15)"
    echo "   - Total: 166 tanques en 12 series"
    echo ""
else
    echo "❌ Error al publicar."
    echo ""
    echo "💡 Primero necesitas inicializar EAS:"
    echo "   cd mobile && eas init"
    echo ""
    echo "   Luego crea un build inicial:"
    echo "   eas build --profile preview --platform ios"
    echo ""
fi
echo ""
