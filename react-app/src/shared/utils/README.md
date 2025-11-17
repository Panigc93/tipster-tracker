# Utilities

Conjunto completo de funciones de utilidad para la aplicación, organizadas por categoría.

## Estructura

```
src/shared/utils/
├── date.utils.ts          # Manejo y formateo de fechas
├── calculation.utils.ts   # Cálculos estadísticos
├── format.utils.ts        # Formateo de números y texto
├── validation.utils.ts    # Validación de datos
├── index.ts              # Barrel export
└── README.md             # Este archivo
```

## Date Utils

### Formateo de Fechas

```typescript
import { formatDate, formatTime, formatDateTime } from '@shared/utils';

formatDate('2025-01-15') // '15/01/2025'
formatDate('2025-01-15', { format: 'long' }) // '15 de enero de 2025'
formatTime('14:30') // '14:30'
formatDateTime('2025-01-15', '14:30') // '2025-01-15T14:30:00.000Z'
```

### Validación y Parsing

```typescript
import { isValidDate, parseDate, getCurrentDate } from '@shared/utils';

isValidDate('2025-01-15') // true
parseDate('2025-01-15') // Date object
getCurrentDate() // '2025-11-17'
```

### Fechas Relativas

```typescript
import { formatRelativeDate, getDaysDifference, isWithinDays } from '@shared/utils';

formatRelativeDate('2025-11-16') // 'hace 1 día'
getDaysDifference('2025-11-01', '2025-11-17') // 16
isWithinDays('2025-11-10', 7) // true
```

## Calculation Utils

### Cálculos Básicos

```typescript
import {
  calculatePickProfit,
  calculateYield,
  calculateWinrate
} from '@shared/utils';

const pick = { odds: 1.85, stake: 3, result: 'Ganada', isResolved: true };
calculatePickProfit(pick) // 2.55 (ganancia)

calculateYield(100, 500) // 20 (20% yield)
calculateWinrate(15, 20) // 75 (75% winrate)
```

### Estadísticas Completas

```typescript
import { calculateTipsterStats } from '@shared/utils';

const picks = [...]; // Array de picks
const stats = calculateTipsterStats(picks);
// Retorna: { totalPicks, winrate, yield, avgOdds, avgStake, distribuciones, ... }
```

### Seguibilidad (Traceability)

```typescript
import { calculateTraceability } from '@shared/utils';

const traceability = calculateTraceability(picks, follows);
// { traceabilityPercentage, followedCount, totalPicksSinceFirstFollow, firstFollowDate }
```

## Format Utils

### Números y Porcentajes

```typescript
import {
  formatNumber,
  formatPercentage,
  formatNumberWithSeparators
} from '@shared/utils';

formatNumber(123.456, 2) // '123.46'
formatPercentage(45.678) // '45.68%'
formatNumberWithSeparators(1234567.89) // '1.234.567,89'
```

### Moneda y Unidades

```typescript
import { formatCurrency, formatUnits, formatProfit } from '@shared/utils';

formatCurrency(1234.56) // '1.234,56 €'
formatUnits(5.5) // '5.50u'
formatProfit(50.5) // '+50.50'
formatProfit(-20.75) // '-20.75'
```

### Texto

```typescript
import { truncateText, capitalize, toTitleCase, pluralize } from '@shared/utils';

truncateText('Este es un texto muy largo', 10) // 'Este es...'
capitalize('hola mundo') // 'Hola mundo'
toTitleCase('hola mundo cruel') // 'Hola Mundo Cruel'
pluralize(5, 'pick', 'picks') // '5 picks'
```

## Validation Utils

### Validaciones de Negocio

```typescript
import { isValidOdds, isValidStake, isValidEmail } from '@shared/utils';

isValidOdds(1.85) // true (>= 1.01)
isValidOdds(0.5) // false
isValidStake(5) // true (1-10)
isValidStake(11) // false
isValidEmail('test@example.com') // true
```

### Validaciones Generales

```typescript
import {
  isNotEmpty,
  isInRange,
  hasMinLength,
  isDefined,
  isPositive
} from '@shared/utils';

isNotEmpty('hello') // true
isInRange(5, 1, 10) // true
hasMinLength('password', 6) // true
isDefined(null) // false
isPositive(5) // true
```

### Validaciones Compuestas

```typescript
import { validateAll, validateAny } from '@shared/utils';

// Todas deben pasar
validateAll([
  () => isNotEmpty(name),
  () => isValidEmail(email),
  () => hasMinLength(password, 6)
])

// Al menos una debe pasar
validateAny([
  () => isValidEmail(contact),
  () => isValidURL(contact)
])
```

## Uso Completo - Ejemplo Componente

```typescript
import { useTipsters, usePicks } from '@shared/hooks';
import {
  calculateTipsterStats,
  formatPercentage,
  formatProfit,
  formatDate,
  formatRelativeDate,
} from '@shared/utils';

function TipsterCard({ tipsterId }: { tipsterId: string }) {
  const { getTipsterById } = useTipsters();
  const { getPicksByTipster } = usePicks();

  const tipster = getTipsterById(tipsterId);
  const picks = getPicksByTipster(tipsterId);
  const stats = calculateTipsterStats(picks);

  if (!tipster) return null;

  return (
    <div className="tipster-card">
      <h3>{tipster.name}</h3>
      <p>Canal: {tipster.channel}</p>
      <p>Última pick: {formatRelativeDate(tipster.lastPickDate || '')}</p>
      
      <div className="stats">
        <div>
          <span>Winrate:</span>
          <span>{formatPercentage(stats.winrate)}</span>
        </div>
        <div>
          <span>Yield:</span>
          <span>{formatPercentage(stats.yield)}</span>
        </div>
        <div>
          <span>Profit:</span>
          <span className={stats.totalProfit > 0 ? 'positive' : 'negative'}>
            {formatProfit(stats.totalProfit)}u
          </span>
        </div>
        <div>
          <span>Total Picks:</span>
          <span>{stats.totalPicks}</span>
        </div>
      </div>
    </div>
  );
}
```

## Type Safety

Todas las utilidades están completamente tipadas:

```typescript
import type { Pick, Statistics } from '@shared/types';
import { calculateTipsterStats } from '@shared/utils';

const picks: Pick[] = [...];
const stats: Statistics = calculateTipsterStats(picks);
// TypeScript valida que picks sea Pick[] y stats sea Statistics
```

## Performance

- **Cálculos**: Optimizados con `for...of` en lugar de `.forEach()`
- **Traceability**: Usa `Set` para búsquedas O(1) de IDs
- **Formateo**: Usa `Intl` API nativa del navegador
- **Memoización**: Funciones puras sin side effects

## Testing

Todas las funciones son puras y fáciles de testear:

```typescript
import { calculateYield, formatPercentage } from '@shared/utils';

describe('calculateYield', () => {
  it('calcula yield correctamente', () => {
    expect(calculateYield(100, 500)).toBe(20);
  });

  it('retorna 0 si totalStaked es 0', () => {
    expect(calculateYield(100, 0)).toBe(0);
  });
});
```

## Migration from Vanilla JS

```javascript
// ❌ Antes (vanilla JS)
function calculateYield_(totalProfit, totalStaked) {
  return totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
}

// ✅ Ahora (React + TypeScript)
import { calculateYield, roundToDecimals } from '@shared/utils';

const yield = roundToDecimals(calculateYield(totalProfit, totalStaked), 2);
// - Type-safe
// - Separación de responsabilidades (cálculo vs formateo)
// - Reutilizable
// - Testeable
```

## Best Practices

1. **Separar cálculo y formateo**:
   ```typescript
   // ✅ Correcto
   const yield = calculateYield(profit, staked);
   const formatted = formatPercentage(yield);

   // ❌ Evitar
   const formattedYield = `${calculateYield(profit, staked)}%`;
   ```

2. **Usar validaciones antes de cálculos**:
   ```typescript
   if (isValidOdds(odds) && isValidStake(stake)) {
     const profit = calculatePickProfit(pick);
   }
   ```

3. **Manejar valores opcionales**:
   ```typescript
   const dateStr = tipster.lastPickDate;
   const formatted = dateStr ? formatRelativeDate(dateStr) : 'Sin picks';
   ```

## Related Documentation

- [TypeScript Types](../types/README.md)
- [Constants](../constants/README.md)
- [Custom Hooks](../hooks/README.md)
- [Calculation Logic (Vanilla JS)](../../../../public/js/utils/calculations.js)
