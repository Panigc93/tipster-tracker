#!/bin/bash
echo "🔄 Cambiando a Legacy app..."
cp firebase.legacy.json firebase.json
echo "✅ Configuración cambiada a Legacy (public/)"
echo ""
echo "⚠️  IMPORTANTE: Reinicia los emuladores para aplicar cambios:"
echo "   pkill -9 -f 'firebase.*emulator'"
echo "   firebase emulators:start --only auth,firestore,hosting --import=./emulator-data --export-on-exit"
echo ""
echo "📱 Luego abre: http://localhost:5000"
