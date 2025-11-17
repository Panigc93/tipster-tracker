# 🧪 Tests de Verificación

Esta carpeta contiene componentes y archivos para verificar que los módulos de la aplicación funcionan correctamente.

## TestVerification.tsx

Componente React que verifica todos los módulos de la **Fase 1: Fundamentos y Abstracciones**.

### Tests Incluidos

1. ✅ **Types** - Verifica que los tipos TypeScript funcionan correctamente
2. ✅ **Constants** - Verifica sports, channels, bookmakers, chart colors
3. ✅ **Date Utils** - Verifica formateo, parsing y validación de fechas
4. ✅ **Calculation Utils** - Verifica cálculos de yield, winrate, profit, statistics
5. ✅ **Format Utils** - Verifica formateo de números, moneda, texto
6. ✅ **Validation Utils** - Verifica validaciones de email, odds, stakes, etc.
7. ✅ **Chart Colors** - Verifica generación de colores para gráficos
8. ✅ **Statistics** - Verifica cálculo completo de estadísticas

### Cómo Usar

#### Opción 1: Importar en App.tsx (temporal)

```tsx
import { TestVerification } from './__tests__/TestVerification';

function App() {
  return <TestVerification />;
}
```

#### Opción 2: Agregar ruta en React Router (futuro)

```tsx
<Route path="/test" element={<TestVerification />} />
```

### Resultados

Los resultados se muestran:
- **En pantalla**: Interfaz visual con instrucciones
- **En consola**: Logs detallados con emoji indicators (✅/❌)

### Ejemplo de Output

```
🧪 Resultados de las pruebas:

✅ Test 1: Types: Sport: Fútbol, Channel: Telegram, Result: Ganada
✅ Test 2: Constants: 16 deportes, 6 canales, 28 bookmakers, 10 colores
✅ Test 3: Date Utils: Hoy: 2025-11-17, Ahora: 11:21, ...
✅ Test 4: Calculation Utils: Profit: 2.55u, Yield: 20%, Winrate: 75%
✅ Test 5: Format Utils: [ejemplos]
✅ Test 6: Validation Utils: Todas las validaciones pasaron
✅ Test 7: Chart Colors: 5 colores generados
✅ Test 8: Statistics: Total: 1, Resolved: 1, Won: 1, Winrate: 100%

📊 Total: 8/8 pruebas pasaron
🎉 ¡Todas las pruebas pasaron correctamente!
✅ Fase 1 está completamente funcional
```

### Notas

- Los tests se ejecutan automáticamente al montar el componente (useEffect)
- Usa tolerancia de ±0.01 para comparaciones de números flotantes
- Todos los imports usan path aliases (@shared, @core)
- El componente usa Tailwind CSS para el diseño
