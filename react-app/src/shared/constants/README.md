# Constants

Constantes tipadas de la aplicación organizadas por categoría.

## Estructura

```
src/shared/constants/
├── sports.constants.ts       # Deportes e iconos
├── channels.constants.ts      # Canales de tipsters
├── bookmakers.constants.ts    # Casas de apuestas
├── chart.constants.ts         # Configuración de gráficos
├── index.ts                   # Barrel export
└── README.md                  # Este archivo
```

## Sports (Deportes)

### ALL_SPORTS

Array con todos los deportes disponibles en la aplicación.

```typescript
import { ALL_SPORTS } from '@shared/constants';

// Tipo: readonly Sport[]
console.log(ALL_SPORTS);
// ['Futbol', 'Baloncesto', 'Tenis', ...]
```

### SPORT_ICONS

Mapeo de deportes a emojis para representación visual.

```typescript
import { SPORT_ICONS } from '@shared/constants';

// Tipo: Readonly<Record<Sport, string>>
const icon = SPORT_ICONS.Futbol; // '⚽'
const iconBasket = SPORT_ICONS.Baloncesto; // '🏀'
```

### getSportIcon(sport)

Función helper para obtener el icono de un deporte con fallback.

```typescript
import { getSportIcon } from '@shared/constants';

const icon = getSportIcon('Futbol'); // '⚽'
const unknown = getSportIcon('UnknownSport' as any); // '🎲' (Otro)
```

### isValidSport(value)

Type guard para verificar si un string es un deporte válido.

```typescript
import { isValidSport } from '@shared/constants';

const userInput = 'Futbol';
if (isValidSport(userInput)) {
  // TypeScript sabe que userInput es tipo Sport
  const icon = SPORT_ICONS[userInput]; // ✅ Type-safe
}
```

## Channels (Canales)

### ALL_CHANNELS

Array con todos los canales disponibles para tipsters.

```typescript
import { ALL_CHANNELS } from '@shared/constants';

// Tipo: readonly Channel[]
console.log(ALL_CHANNELS);
// ['BlogaBet', 'Telegram', 'TipsterLand', 'Twitter/X', 'Discord', 'Otro']
```

### isValidChannel(value)

Type guard para verificar si un string es un canal válido.

```typescript
import { isValidChannel } from '@shared/constants';

const channel = 'Telegram';
if (isValidChannel(channel)) {
  // channel es tipo Channel
}
```

### getChannelName(channel)

Helper para obtener el nombre de un canal.

```typescript
import { getChannelName } from '@shared/constants';

const name = getChannelName('Twitter/X'); // 'Twitter/X'
```

## Bookmakers (Casas de Apuestas)

### ALL_BOOKMAKERS

Array con todas las casas de apuestas disponibles.

```typescript
import { ALL_BOOKMAKERS } from '@shared/constants';

// Tipo: readonly Bookmaker[]
console.log(ALL_BOOKMAKERS);
// ['1xBet', 'Betfair', 'Bet365', 'William Hill', ...]
```

### isValidBookmaker(value)

Type guard para verificar si un string es una casa de apuestas válida.

```typescript
import { isValidBookmaker } from '@shared/constants';

const bookie = 'Bet365';
if (isValidBookmaker(bookie)) {
  // bookie es tipo Bookmaker
}
```

### getBookmakerName(bookmaker)

Helper para obtener el nombre de una casa de apuestas.

```typescript
import { getBookmakerName } from '@shared/constants';

const name = getBookmakerName('Bet365'); // 'Bet365'
```

## Charts (Gráficos)

### CHART_COLORS

Array de colores hexadecimales para usar en gráficos Chart.js.

```typescript
import { CHART_COLORS } from '@shared/constants';

// Tipo: readonly string[]
console.log(CHART_COLORS);
// ['#1FB8CD', '#FFC185', '#B4413C', ...]
```

### PICK_STATUS_COLORS

Colores específicos para estados de picks.

```typescript
import { PICK_STATUS_COLORS } from '@shared/constants';

const ganada = PICK_STATUS_COLORS.Ganada; // '#10B981' (Green)
const perdida = PICK_STATUS_COLORS.Perdida; // '#EF4444' (Red)
const void_ = PICK_STATUS_COLORS.Void; // '#F59E0B' (Orange)
const pendiente = PICK_STATUS_COLORS.Pendiente; // '#6B7280' (Gray)
```

### DEFAULT_CHART_OPTIONS

Opciones base para todos los gráficos Chart.js.

```typescript
import { DEFAULT_CHART_OPTIONS } from '@shared/constants';

const chartConfig = {
  data: myData,
  options: {
    ...DEFAULT_CHART_OPTIONS,
    // Custom options
  },
};
```

### BAR_CHART_OPTIONS

Opciones específicas para gráficos de barras.

```typescript
import { BAR_CHART_OPTIONS } from '@shared/constants';

const barChart = {
  type: 'bar',
  data: myData,
  options: BAR_CHART_OPTIONS,
};
```

### DOUGHNUT_CHART_OPTIONS

Opciones específicas para gráficos circulares (doughnut/pie).

```typescript
import { DOUGHNUT_CHART_OPTIONS } from '@shared/constants';

const doughnutChart = {
  type: 'doughnut',
  data: myData,
  options: DOUGHNUT_CHART_OPTIONS,
};
```

### getChartColor(index)

Obtiene un color del array por índice con wrap around.

```typescript
import { getChartColor } from '@shared/constants';

const color0 = getChartColor(0); // '#1FB8CD'
const color15 = getChartColor(15); // Wrap around: '#FFC185'
```

### generateChartColors(count)

Genera un array de N colores para datasets.

```typescript
import { generateChartColors } from '@shared/constants';

const colors = generateChartColors(5);
// ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']

// Uso en Chart.js
const chartData = {
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [
    {
      data: [10, 20, 30, 40, 50],
      backgroundColor: generateChartColors(5),
    },
  ],
};
```

### getPickStatusColor(status)

Obtiene el color para un estado de pick específico.

```typescript
import { getPickStatusColor } from '@shared/constants';

const color = getPickStatusColor('Ganada'); // '#10B981'
```

## Uso Completo - Ejemplo Dashboard

```typescript
import { useTipsters, usePicks } from '@shared/hooks';
import {
  ALL_SPORTS,
  SPORT_ICONS,
  getSportIcon,
  generateChartColors,
  BAR_CHART_OPTIONS,
  DOUGHNUT_CHART_OPTIONS,
} from '@shared/constants';

function TipsterDashboard({ tipsterId }: { tipsterId: string }) {
  const { getTipsterById } = useTipsters();
  const { getPicksByTipster } = usePicks();

  const tipster = getTipsterById(tipsterId);
  const picks = getPicksByTipster(tipsterId);

  // Distribución por deporte
  const sportDistribution = ALL_SPORTS.map((sport) => ({
    sport,
    icon: getSportIcon(sport),
    count: picks.filter((p) => p.sport === sport).length,
  })).filter((d) => d.count > 0);

  // Chart.js config para gráfico de deportes
  const sportChartData = {
    labels: sportDistribution.map((d) => `${d.icon} ${d.sport}`),
    datasets: [
      {
        data: sportDistribution.map((d) => d.count),
        backgroundColor: generateChartColors(sportDistribution.length),
      },
    ],
  };

  const sportChart = {
    type: 'doughnut' as const,
    data: sportChartData,
    options: DOUGHNUT_CHART_OPTIONS,
  };

  return (
    <div>
      <h2>{tipster?.name}</h2>
      <Chart {...sportChart} />
    </div>
  );
}
```

## Uso en Select/Dropdown

```typescript
import { ALL_SPORTS, ALL_CHANNELS, ALL_BOOKMAKERS } from '@shared/constants';

function PickFilters() {
  return (
    <div>
      {/* Select de deportes */}
      <select name="sport">
        <option value="">Todos los deportes</option>
        {ALL_SPORTS.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>

      {/* Select de canales */}
      <select name="channel">
        <option value="">Todos los canales</option>
        {ALL_CHANNELS.map((channel) => (
          <option key={channel} value={channel}>
            {channel}
          </option>
        ))}
      </select>

      {/* Select de bookmakers */}
      <select name="bookmaker">
        <option value="">Todas las casas</option>
        {ALL_BOOKMAKERS.map((bookmaker) => (
          <option key={bookmaker} value={bookmaker}>
            {bookmaker}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Type Safety

Todas las constantes están completamente tipadas:

```typescript
import type { Sport, Channel, Bookmaker } from '@shared/types';
import { ALL_SPORTS, isValidSport } from '@shared/constants';

// ✅ Type-safe
const sport: Sport = 'Futbol';

// ❌ Compile error
const invalid: Sport = 'InvalidSport';

// ✅ Runtime validation
const userInput = 'Tenis';
if (isValidSport(userInput)) {
  // TypeScript sabe que userInput es Sport
  const picks = getPicksBySport(userInput); // ✅
}
```

## Extensibilidad

Para añadir nuevos valores:

1. **Actualizar enum** en `src/shared/types/enums.ts`:
   ```typescript
   export type Sport = 'Futbol' | 'Baloncesto' | ... | 'NuevoDeporte';
   ```

2. **Actualizar constantes** en el archivo correspondiente:
   ```typescript
   export const ALL_SPORTS = [..., 'NuevoDeporte'] as const;
   export const SPORT_ICONS = { ..., NuevoDeporte: '🆕' };
   ```

3. **TypeScript validará** automáticamente que todos los lugares que usan `Sport` manejen el nuevo valor.

## Migraciones desde Vanilla JS

```javascript
// ❌ Antes (vanilla JS)
const allSports = ['Fútbol', 'Baloncesto', ...];
const sportIcons = { 'Fútbol': '⚽', ... };

// ✅ Ahora (React + TypeScript)
import { ALL_SPORTS, SPORT_ICONS } from '@shared/constants';
// - Completamente tipado
// - Auto-complete en IDE
// - Validación en compile-time
// - Constantes inmutables (readonly)
```

## Best Practices

1. **Importar desde barrel export**:
   ```typescript
   // ✅ Correcto
   import { ALL_SPORTS, SPORT_ICONS } from '@shared/constants';

   // ❌ Evitar
   import { ALL_SPORTS } from '@shared/constants/sports.constants';
   ```

2. **Usar type guards para validación**:
   ```typescript
   // ✅ Correcto - type-safe
   if (isValidSport(value)) {
     processSport(value); // value es tipo Sport
   }

   // ❌ Evitar - casting manual
   const sport = value as Sport;
   ```

3. **Usar helpers con fallback**:
   ```typescript
   // ✅ Correcto - maneja valores desconocidos
   const icon = getSportIcon(sport);

   // ❌ Evitar - puede fallar
   const icon = SPORT_ICONS[sport];
   ```

4. **No mutar constantes**:
   ```typescript
   // ❌ Error de compilación
   ALL_SPORTS.push('NuevoDeporte');
   SPORT_ICONS.Futbol = '⚾';
   ```

## Related Documentation

- [TypeScript Types](../types/README.md)
- [Context API](../../core/providers/README.md)
- [Chart.js Documentation](https://www.chartjs.org/)
