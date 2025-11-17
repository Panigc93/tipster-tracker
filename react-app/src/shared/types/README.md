# 📦 Tipos TypeScript - Tipster Tracker

Este módulo contiene todos los tipos, interfaces y enumeraciones de la aplicación.

## 📂 Estructura

```
shared/types/
├── enums.ts        # Enumeraciones y constantes
├── index.ts        # Tipos e interfaces principales
└── types.ts        # Barrel export (re-exporta todo)
```

## 🎯 Uso

### Importar constantes tipadas
```typescript
import { Sport, Channel, PickResult, PickType } from '@shared/types';
import type { Sport as SportType, Channel as ChannelType } from '@shared/types';

const sport: SportType = Sport.FUTBOL;
const result = PickResult.GANADA; // Type inferido automáticamente
```

### Importar tipos
```typescript
import type { Tipster, Pick, UserFollow, Statistics } from '@shared/types';

const tipster: Tipster = {
  id: '123',
  uid: 'user-uid',
  name: 'Mi Tipster',
  channel: Channel.TELEGRAM,
  createdDate: '2025-01-01',
  lastPickDate: null,
};
```

### Importar DTOs para CRUD
```typescript
import type { CreatePickDTO, UpdateTipsterDTO } from '@shared/types';

const newPick: CreatePickDTO = {
  tipsterId: 'tipster-123',
  match: 'Real Madrid vs Barcelona',
  sport: Sport.FUTBOL,
  // ... resto de campos
};
```

## 📋 Tipos Principales

### 🎯 Tipster
- **Tipster**: Interfaz completa con id y uid
- **CreateTipsterDTO**: Para crear tipsters (sin id/uid)
- **UpdateTipsterDTO**: Para actualizar tipsters (campos opcionales)

### 🎲 Pick
- **Pick**: Interfaz completa de un pronóstico
- **CreatePickDTO**: Para crear picks
- **UpdatePickDTO**: Para actualizar picks

### 👤 UserFollow
- **UserFollow**: Seguimiento de pick por usuario
- **CreateFollowDTO**: Para crear follows
- **UpdateFollowDTO**: Para actualizar follows

### 📊 Statistics
- **Statistics**: Estadísticas completas (yield, winrate, profit, etc.)
- **ComparisonStats**: Comparación tipster vs usuario
- **TraceabilityStats**: Estadísticas de seguibilidad

### 🔍 Filters
- **DashboardFilters**: Filtros del dashboard
- **AllPicksFilters**: Filtros de vista All Picks
- **MyPicksFilters**: Filtros de vista My Picks

### 🌐 State
- **AuthState**: Estado de autenticación
- **TipstersState**: Estado de tipsters
- **PicksState**: Estado de picks
- **FollowsState**: Estado de follows

## 🔤 Constantes Tipadas

### Sport
Deportes disponibles (Fútbol, Baloncesto, Tenis, etc.)
```typescript
Sport.FUTBOL, Sport.BALONCESTO, Sport.TENIS, etc.
```

### Channel
Canales de origen (BlogaBet, Telegram, TipsterLand, etc.)
```typescript
Channel.TELEGRAM, Channel.BLOGABET, etc.
```

### Bookmaker
Casas de apuestas (Bet365, Betfair, etc.)
```typescript
Bookmaker.BET365, Bookmaker.BETFAIR, etc.
```

### PickType
Tipos de pick (Pre, Live, Combinado)
```typescript
PickType.PRE, PickType.LIVE, PickType.COMBINADO
```

### PickResult
Resultados (Ganada, Perdida, Void, Pendiente)
```typescript
PickResult.GANADA, PickResult.PERDIDA, PickResult.VOID, PickResult.PENDIENTE
```

### SortBy
Criterios de ordenación (yield, winrate, totalPicks, name)
```typescript
SortBy.YIELD, SortBy.WINRATE, SortBy.TOTAL_PICKS, SortBy.NAME
```

### LastPickDays
Rangos de días (all, 7, 30, 90)
```typescript
LastPickDays.ALL, LastPickDays.SEVEN, LastPickDays.THIRTY, LastPickDays.NINETY
```

## ✨ Características

- ✅ **Tipos estrictos**: TypeScript strict mode habilitado
- ✅ **DTOs separados**: Tipos específicos para Create/Update
- ✅ **Constantes tipadas**: Valores constantes con autocompletado usando `as const`
- ✅ **Legacy support**: `string` como fallback para valores legacy
- ✅ **Documentación JSDoc**: Todos los tipos documentados
- ✅ **Barrel exports**: Importación centralizada desde `@shared/types`
- ✅ **Sin enums**: Usamos constantes con `as const` (mejor para bundling y type safety)

## 🔧 Convenciones

### Naming
- **Interfaces**: PascalCase (ej: `Tipster`, `UserFollow`)
- **Constantes**: PascalCase (ej: `Sport`, `PickResult`)
- **Valores de constantes**: UPPER_CASE (ej: `Sport.FUTBOL`)
- **Tipos de constantes**: PascalCase (ej: `type Sport = ...`)
- **DTOs**: Sufijo DTO (ej: `CreatePickDTO`, `UpdateTipsterDTO`)

### Legacy Support
Los campos con constantes tipadas aceptan también `string` para compatibilidad:
```typescript
sport: Sport | string  // Acepta Sport.FUTBOL o "Fútbol"
```

### Por qué `as const` en lugar de `enum`
- **Mejor tree-shaking**: Los objetos con `as const` se optimizan mejor
- **Type safety**: TypeScript infiere tipos literales exactos
- **No runtime overhead**: Los enums generan código JavaScript extra
- **Más flexible**: Fácil combinar con union types

### Campos Opcionales
- **Create DTOs**: Solo obligatorios los esenciales
- **Update DTOs**: Todos los campos opcionales (partial update)

## 🚀 Migración desde JavaScript

Los tipos están basados en el código original en `public/js/`:

| Archivo Original | Tipo TypeScript |
|-----------------|----------------|
| `constants.js` → `allSports` | `Sport` const + type |
| `constants.js` → `allChannels` | `Channel` const + type |
| `constants.js` → `allBookmakers` | `Bookmaker` const + type |
| `tipster.service.js` → tipster data | `Tipster` interface |
| `pick.service.js` → pick data | `Pick` interface |
| `follow.service.js` → follow data | `UserFollow` interface |
| `state.js` → dashboardFilters | `DashboardFilters` interface |

## 📝 Notas

- Los IDs de Firestore son strings auto-generados (no numéricos)
- Las fechas usan formato ISO string (YYYY-MM-DD para date, YYYY-MM-DDTHH:MM:SS para datetime)
- El campo `uid` siempre es del usuario propietario (Firebase Auth)
- Los campos `status` en Pick son legacy (considerar deprecar)
