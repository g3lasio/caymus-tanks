#!/bin/bash
echo "🚀 Iniciando Caymus Calculator - Expo App"
echo ""
echo "📦 Verificando dependencias..."
cd mobile

if [ ! -d "node_modules" ]; then
  echo "⏳ Instalando dependencias (esto tomará unos minutos la primera vez)..."
  npm install
fi

echo ""
echo "📱 Para ver la app en tu iPhone:"
echo "   1. Instala 'Expo Go' desde el App Store"
echo "   2. Escanea el QR code que aparecerá abajo"
echo "   3. ¡La app se cargará en tu teléfono!"
echo ""
npx expo start --tunnel
