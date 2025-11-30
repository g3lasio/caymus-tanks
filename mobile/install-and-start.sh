#!/bin/bash
cd /home/runner/workspace/mobile

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🚀 Starting Expo..."
npx expo start --tunnel
