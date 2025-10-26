#!/bin/bash

echo "🌐 Caymus Calculator - Modo Web"
echo "================================"
echo ""
echo "ℹ️  Esta es una vista web temporal para que puedas probar la app"
echo "   La app real es nativa (iOS/Android)"
echo ""

cd mobile

if [ ! -d "node_modules" ]; then
  echo "⏳ Instalando dependencias..."
  npm install
  echo ""
fi

echo "🚀 Iniciando modo web..."
echo ""
echo "📱 Se abrirá en el navegador de Replit"
echo "   Podrás probar los cálculos de los tanques C10-C15"
echo ""

npx expo start --web
