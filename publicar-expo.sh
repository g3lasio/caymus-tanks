#!/bin/bash

echo "📲 Caymus Calculator - Publicar a Expo"
echo "========================================"
echo ""

cd mobile

# Verificar si ya está logueado
if ! npx expo whoami &>/dev/null; then
    echo "🔐 Por favor, inicia sesión en tu cuenta de Expo:"
    npx expo login
    echo ""
fi

# Verificar si el proyecto ya tiene ID
if grep -q "REPLACE_WITH_YOUR_EXPO_PROJECT_ID" app.json; then
    echo "🆔 Inicializando proyecto en Expo..."
    echo "    (Esto solo se hace una vez)"
    echo ""
    npx eas init
    echo ""
fi

echo "🚀 Publicando app a Expo..."
echo ""
npx expo publish

echo ""
echo "✅ ¡Listo! Tu app está publicada"
echo ""
echo "📱 Para verla en tu iPhone:"
echo "   1. Abre Expo Go"
echo "   2. Inicia sesión (si no lo has hecho)"
echo "   3. Busca 'Caymus Calculator' en tus proyectos"
echo "   4. ¡Toca para abrir!"
echo ""
echo "💡 Cada vez que hagas cambios, ejecuta nuevamente:"
echo "   ./publicar-expo.sh"
echo ""
