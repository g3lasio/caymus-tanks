#!/bin/bash

echo "📲 Caymus Calculator - Modo LAN"
echo "================================"
echo ""
echo "⚠️  IMPORTANTE: Tu iPhone debe estar en la MISMA red WiFi que Replit"
echo ""

cd mobile

if [ ! -d "node_modules" ]; then
  echo "⏳ Instalando dependencias..."
  npm install
  echo ""
fi

echo "📱 Instrucciones:"
echo "   1. Conecta tu iPhone a la MISMA WiFi que tu computadora"
echo "   2. Abre Expo Go en tu iPhone"
echo "   3. Escanea el QR code que aparecerá abajo"
echo ""
echo "🚀 Iniciando servidor Expo en modo LAN..."
echo ""

npx expo start --lan
