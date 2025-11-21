# AGENTS.md - Documentación del Proyecto Tipster Tracker

---

## ⚠️ IMPORTANTE - DESARROLLO CON REACT

**SIEMPRE EJECUTAR npm run dev DESDE LA CARPETA `react-app/`:**

```bash
# ✅ CORRECTO - Proyecto React (Vite)
cd /home/cgarciap/Escritorio/tipster-tracker/react-app
npm run dev
# Servidor en: http://localhost:5173

# ❌ INCORRECTO - Proyecto antiguo (Firebase Emulators)
cd /home/cgarciap/Escritorio/tipster-tracker
npm run dev
# Este levanta Firebase Emulators en puerto 5000
```

**Estructura del repositorio:**
- `/public/` → Proyecto ORIGINAL vanilla JS (NO USAR para desarrollo)
- `/react-app/` → Proyecto REACT migración (USAR ESTE)

---

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Modelo de Datos](#modelo-de-datos)
5. [Módulos y Responsabilidades](#módulos-y-responsabilidades)
6. [Flujo de Datos](#flujo-de-datos)
7. [Interfaz de Usuario](#interfaz-de-usuario)
8. [Sistema de Estilos](#sistema-de-estilos)
9. [Convenciones de Código](#convenciones-de-código)
10. [Comandos y Desarrollo](#comandos-y-desarrollo)
11. [Problemas Conocidos y Mejoras](#problemas-conocidos-y-mejoras)

---

## Resumen Ejecutivo

**Tipster Tracker** es una aplicación web SPA (Single Page Application) para seguimiento y análisis de pronósticos deportivos (picks) de tipsters. Permite a los usuarios registrar tipsters, gestionar sus picks, hacer seguimiento de sus propias apuestas y analizar estadísticas detalladas.

### Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript vanilla (ES6+ modules)
- **Backend/BaaS**: Firebase (Firestore, Authentication, Hosting)
- **Librerías**: Chart.js (gráficos), Lucide Icons (iconografía)
- **Deploy**: Firebase Hosting con CI/CD automático via GitHub Actions
- **Control de versiones**: Git/GitHub

### Características Principales
- ✅ Autenticación de usuarios (login/signup/password reset)
- ✅ Gestión CRUD de tipsters
- ✅ Gestión CRUD de picks (pronósticos)
- ✅ Sistema de seguimiento de picks (follows)
- ✅ Dashboards con estadísticas en tiempo real
- ✅ Filtrado avanzado multi-criterio
- ✅ Visualización de datos con gráficos interactivos
- ✅ Comparación de resultados (tipster vs usuario)
- ✅ Cálculo de métricas: yield, winrate, profit, seguibilidad

---

## Arquitectura General

### Arquitectura Frontend
```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│                    (SPA Container)                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│                      app.js                             │
│              (Orquestador principal)                    │
│  • Inicializa Firebase                                  │
│  • Setup listeners de autenticación                     │
│  • Importa y coordina todos los módulos                 │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   ┌────────┐    ┌─────────┐    ┌──────────┐
   │  Core  │    │  Data   │    │ Services │
   └────────┘    └─────────┘    └──────────┘
   │ init.js     │ constants   │ tipster   │
   │ auth.js     │ listeners   │ pick      │
   │ state.js    └─────────┘   │ follow    │
   └────────┘                  └──────────┘
        ↓              ↓              ↓
   ┌────────┐    ┌─────────┐    ┌──────────┐
   │ Utils  │    │  Views  │    │  Modals  │
   └────────┘    └─────────┘    └──────────┘
   │ calculations│ dashboard   │ tipster   │
   │ filters     │ all-picks   │ pick      │
   │ ui-helpers  │ my-picks    │ follow    │
   │ date-utils  │ tipster-det │           │
   └────────┘    │ charts      │           │
                 └─────────┘   └──────────┘
```

### Arquitectura de Datos (Firebase)
```
Firebase Project
├── Authentication (uid basado)
├── Firestore Database
│   ├── tipsters (collection)
│   │   └── {tipsterId} (document)
│   │       ├── uid: string
│   │       ├── name: string
│   │       ├── channel: string
│   │       ├── createdDate: string (ISO)
│   │       └── lastPickDate: string (ISO)
│   │
│   ├── picks (collection)
│   │   └── {pickId} (document)
│   │       ├── uid: string
│   │       ├── tipsterId: string
│   │       ├── sport: string
│   │       ├── odds: number
│   │       ├── stake: number (1-10)
│   │       ├── pickType: string (Pre/Live/Combinado)
│   │       ├── betType: string
│   │       ├── date: string (YYYY-MM-DD)
│   │       ├── time: string (HH:MM)
│   │       ├── dateTime: string (ISO full)
│   │       ├── result: string (Ganada/Perdida/Void)
│   │       ├── isResolved: boolean
│   │       ├── match: string
│   │       ├── bookmaker: string
│   │       └── comments: string
│   │
│   └── userFollows (collection)
│       └── {followId} (document)
│           ├── uid: string
│           ├── pickId: string
│           ├── tipsterId: string
│           ├── userOdds: number
│           ├── userStake: number
│           ├── userResult: string
│           ├── userIsResolved: boolean
│           └── followDate: string (ISO)
│
└── Hosting (public/)
```

---

## Estructura de Archivos

```
tipster-tracker/
├── .firebase/                    # Configuración local de Firebase
├── .github/
│   └── workflows/
│       └── firebase-hosting-main.yml  # CI/CD automático
├── emulator-data/                # Datos del emulador de Firebase
├── public/                       # Directorio servido por Firebase Hosting
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css        # Sistema de diseño completo
│   │   └── img/
│   │       ├── icon.svg
│   │       ├── logo-filled-text.svg
│   │       └── logo-filled.svg
│   ├── js/
│   │   ├── config/
│   │   │   ├── firebase.config.js        # Credenciales (en .gitignore)
│   │   │   └── firebase.config.example.js # Template
│   │   ├── core/
│   │   │   ├── init.js          # Inicialización Firebase
│   │   │   ├── auth.js          # Autenticación
│   │   │   └── state.js         # Estado global
│   │   ├── data/
│   │   │   ├── constants.js     # Constantes de la app
│   │   │   └── listeners-init.js # Listeners Firestore
│   │   ├── services/
│   │   │   ├── tipster.service.js # CRUD tipsters
│   │   │   ├── pick.service.js    # CRUD picks
│   │   │   └── follow.service.js  # CRUD follows
│   │   ├── utils/
│   │   │   ├── calculations.js   # Cálculos estadísticos
│   │   │   ├── filters.js        # Lógica de filtrado
│   │   │   ├── ui-helpers.js     # Helpers de UI
│   │   │   └── date-utils.js     # Utilidades de fechas
│   │   ├── views/
│   │   │   ├── dashboard.js      # Vista dashboard
│   │   │   ├── all-picks.js      # Vista todas las picks
│   │   │   ├── my-picks.js       # Vista mis picks
│   │   │   ├── tipster-detail.js # Vista detalle tipster
│   │   │   └── charts.js         # Gráficos Chart.js
│   │   ├── modals/
│   │   │   ├── tipster-modal.js  # Modal añadir tipster
│   │   │   ├── pick-modal.js     # Modal añadir/editar pick
│   │   │   └── follow-modal.js   # Modal seguir pick
│   │   └── app.js                # Punto de entrada principal
│   └── index.html                # HTML principal (SPA)
├── .firebaserc                   # Alias proyectos Firebase
├── firebase.json                 # Configuración hosting/emulators
├── firestore.rules               # Reglas de seguridad
├── firestore.indexes.json        # Índices compuestos
├── package.json                  # Dependencias npm
└── AGENTS.md                     # Este archivo
```

---

## Modelo de Datos

### Colección: `tipsters`
```typescript
{
  id: string,              // Auto-generado por Firestore
  uid: string,             // ID del usuario propietario (Firebase Auth)
  name: string,            // Nombre del tipster
  channel: string,         // Canal origen (Telegram, BlogaBet, etc.)
  createdDate: string,     // Fecha creación (YYYY-MM-DD)
  lastPickDate: string     // Última pick registrada (YYYY-MM-DD) - calculado
}
```

### Colección: `picks`
```typescript
{
  id: string,              // Auto-generado por Firestore
  uid: string,             // ID del usuario propietario
  tipsterId: string,       // Referencia al tipster
  sport: string,           // Deporte (Fútbol, Baloncesto, Tenis, etc.)
  odds: number,            // Cuota de la apuesta (ej: 1.85)
  stake: number,           // Unidades apostadas (1-10)
  pickType: string,        // Tipo: Pre, Live, Combinado
  betType: string,         // Descripción de la apuesta
  date: string,            // Fecha (YYYY-MM-DD)
  time: string,            // Hora (HH:MM)
  dateTime: string,        // Combinación ISO completa para ordenación
  result: string,          // Resultado: Ganada, Perdida, Void
  isResolved: boolean,     // Si está resuelta la pick
  match: string,           // Partido/evento
  bookmaker: string,       // Casa de apuestas
  comments: string         // Comentarios adicionales
}
```

### Colección: `userFollows`
```typescript
{
  id: string,              // Auto-generado por Firestore
  uid: string,             // ID del usuario propietario
  pickId: string,          // Referencia a la pick original
  tipsterId: string,       // Referencia al tipster
  userOdds: number,        // Cuota que consiguió el usuario
  userStake: number,       // Stake del usuario
  userResult: string,      // Resultado usuario: Ganada, Perdida, Void
  userIsResolved: boolean, // Si el usuario resolvió su apuesta
  followDate: string       // Fecha del seguimiento (ISO)
}
```

### Estado Global (state.js)
```typescript
state = {
  // Usuario y sesión
  currentUser: object | null,           // Usuario autenticado Firebase
  
  // Listeners de Firestore (funciones unsubscribe)
  unsubscribeTipsters: function | null,
  unsubscribePicks: function | null,
  unsubscribeFollows: function | null,
  
  // Datos en memoria
  tipsters: array,                      // Array de tipsters
  picks: array,                         // Array de picks
  userFollows: array,                   // Array de follows
  
  // Navegación
  currentView: string,                  // Vista activa: 'dashboard', 'allPicks', 'myPicks', 'tipsterDetail'
  currentTipsterId: string | null,      // ID del tipster en vista detalle
  
  // IDs incrementales (obsoletos - Firestore genera IDs)
  nextTipsterId: number,
  nextPickId: number,
  nextFollowId: number,
  
  // Gráficos
  charts: object,                       // Instancias de Chart.js
  
  // Filtros del dashboard
  dashboardFilters: {
    sports: array,                      // Deportes seleccionados
    channels: array,                    // Canales seleccionados
    yieldMin: number,                   // Yield mínimo (-1000 = sin filtro)
    lastPickDays: string,               // 'all', '7', '30', '90'
    sortBy: string,                     // 'yield', 'winrate', 'totalPicks', 'name'
    searchQuery: string                 // Búsqueda por nombre
  },
  
  // Timer para debounce
  yieldDebounceTimer: object | null
}
```

---

## Módulos y Responsabilidades

### 📁 core/ - Núcleo de la aplicación

#### **init.js** - Inicialización de Firebase
```javascript
// Responsabilidades:
// - Inicializar Firebase con firebaseConfig
// - Configurar emuladores para desarrollo local
// - Exportar instancias: auth, db

// Exports principales:
export { auth, db }

// Detalles importantes:
// - Detecta localhost y activa emuladores automáticamente
// - Auth emulator: localhost:9099
// - Firestore emulator: localhost:8080
// - Maneja errores de configuración
```

#### **auth.js** - Sistema de autenticación
```javascript
// Responsabilidades:
// - Gestionar autenticación de usuarios
// - Controlar visibilidad de pantallas (auth/main)
// - Listeners de estado de autenticación

// Funciones principales:
setupAuthListeners()      // Configura onAuthStateChanged
handleLogin(e)            // Login con email/password
handleSignup(e)           // Registro de nuevo usuario
handleLogout()            // Cerrar sesión
sendPasswordReset(email)  // Recuperación de contraseña

// Flujo:
// 1. onAuthStateChanged detecta cambios
// 2. Si hay usuario → muestra mainApp, oculta authScreen
// 3. Si no hay usuario → muestra authScreen, oculta mainApp
// 4. Inicializa app cuando usuario está autenticado
```

#### **state.js** - Estado global
```javascript
// Responsabilidades:
// - Almacenar estado global de la aplicación
// - Único objeto state exportado
// - Modificable por todos los módulos

// Export principal:
export { state }

// Uso en otros módulos:
import { state } from './core/state.js';
state.tipsters.push(newTipster);
```

---

### 📁 data/ - Datos y constantes

#### **constants.js** - Constantes de la aplicación
```javascript
// Exports principales:
export const allSports        // Array de deportes disponibles
export const allBookmakers    // Array de casas de apuestas
export const allChannels      // Array de canales de tipsters
export const sportIcons       // Objeto con emojis por deporte
export const chartColors      // Array de colores hexadecimales para gráficos

// Ejemplo de uso:
// allSports = ['Fútbol', 'Baloncesto', 'Tenis', ...]
// sportIcons = { 'Fútbol': '⚽', 'Baloncesto': '🏀', ... }
// chartColors = ['#3B82F6', '#10B981', '#F59E0B', ...]
```

#### **listeners-init.js** - Listeners de Firestore
```javascript
// Responsabilidades:
// - Configurar listeners en tiempo real de Firestore
// - Sincronizar datos con estado global
// - Actualizar vistas cuando cambian los datos

// Funciones principales:
setupTipstersListener()   // Listener de tipsters collection
setupPicksListener()      // Listener de picks collection
setupFollowsListener()    // Listener de userFollows collection

// Patrón de uso:
// 1. db.collection('tipsters').where('uid', '==', uid).onSnapshot()
// 2. Actualiza state.tipsters, state.picks, state.userFollows
// 3. Llama a funciones render según vista activa
// 4. Maneja errores y muestra alerts

// Variables unsubscribe almacenadas en state:
// - state.unsubscribeTipsters
// - state.unsubscribePicks
// - state.unsubscribeFollows
```

---

### 📁 services/ - Servicios de datos

#### **tipster.service.js** - CRUD de tipsters
```javascript
// Funciones CRUD:
addTipsterToFirestore(name, channel)       // Crear tipster
updateTipsterInFirestore(id, updates)     // Actualizar tipster
deleteTipsterFromFirestore(id)            // Eliminar tipster
confirmResetTipster(tipsterId)             // Reset con confirmación

// Detalles:
// - Todas las operaciones incluyen uid del usuario
// - Usa showLoading() para feedback visual
// - Maneja errores con try/catch y alerts
// - Los listeners actualizan la UI automáticamente
```

#### **pick.service.js** - CRUD de picks
```javascript
// Funciones CRUD:
addPickToFirestore(pickData)               // Crear pick
updatePickInFirestore(id, updates)         // Actualizar pick
deletePickFromFirestore(id)                // Eliminar pick
editPick(pickId)                           // Abre modal de edición

// Campos calculados:
// - dateTime: combinación de date + time en formato ISO
// - Validación de campos obligatorios
// - Relación con tipsterId
```

#### **follow.service.js** - CRUD de follows
```javascript
// Funciones CRUD:
addFollowToFirestore(followData)           // Crear follow
updateFollowInFirestore(id, updates)       // Actualizar follow
deleteFollowFromFirestore(id)              // Eliminar follow

// Características:
// - Relaciona pickId con usuario
// - Permite diferentes odds/stake que el tipster
// - Permite resultado diferente (match/diverge)
// - followDate en formato ISO
```

---

### 📁 utils/ - Utilidades

#### **calculations.js** - Cálculos estadísticos
```javascript
// Funciones principales:
calculateTraceability(tipsterId)          // Porcentaje seguibilidad
calculateStats(tipsterId)                 // Estadísticas completas del tipster
calculatePersonalStats()                  // Estadísticas globales del usuario
calculateFollowStats(tipsterId)           // Estadísticas de follows de un tipster

// Fórmulas clave:
// Yield: (profit / totalStaked) * 100
// Winrate: (ganadas / totalResueltas) * 100
// Profit: (odds - 1) * stake (ganada) | -stake (perdida)
// Seguibilidad: (picksFollowed / totalPicksDesdeFirstFollow) * 100

// Retorna objeto con:
// - totalPicks, resolvedPicks, wonPicks
// - winrate, yield, totalProfit, totalStaked
// - avgOdds, avgStake
// - oddsDistribution, stakeDistribution
// - sportDistribution, pickTypeDistribution
```

#### **filters.js** - Sistema de filtrado
```javascript
// Funciones principales:
initializeFilters()                        // Inicializa valores de filtros
applyFilters()                             // Aplica filtros del dashboard
filterPicks()                              // Filtra picks en All Picks view
filterFollowedPicks()                      // Filtra picks seguidas
filterTipsters()                           // Filtra tipsters por criterios
resetFilters()                             // Resetea todos los filtros

// Criterios de filtrado:
// Dashboard: sports, channels, yieldMin, lastPickDays, sortBy, search
// All Picks: tipster, sport, status, channel, bookmaker, result
// My Picks: tipster, result, match/diverge

// Lógica multi-criterio con AND
```

#### **ui-helpers.js** - Helpers de interfaz
```javascript
// Funciones principales:
showLoading(show)                          // Muestra/oculta loading overlay
closeModal(modalId)                        // Cierra modal específico
confirm(message)                           // Diálogo de confirmación nativo
switchViewUI(viewName)                     // Cambia vista activa
switchDetailTabUI(tabName)                 // Cambia tab en tipster detail
toggleDropdown(dropdownId)                 // Toggle dropdown custom
updateDropdownText(dropdownId)             // Actualiza texto dropdown
toggleFilterCheckboxUI(event)              // Toggle checkbox visual
clearSearchUI()                            // Limpia input de búsqueda
updateFilterSelects()                      // Actualiza selects de filtros
updatePickTipsterSelect()                  // Actualiza select de tipsters

// Lucide icons:
// - Se inicializan con lucide.createIcons()
// - Llamar después de modificar DOM
```

#### **date-utils.js** - Utilidades de fechas
```javascript
// Funciones principales:
formatDate(dateString)                     // YYYY-MM-DD → DD/MM/YYYY
formatTime(timeString)                     // HH:MM → HH:MM (validado)
formatDateTime(dateString, timeString)     // Combina en ISO completo
parseDate(dateString)                      // Parse seguro de fechas
isValidDate(dateString)                    // Valida formato fecha

// Uso en picks:
// - date: YYYY-MM-DD (para input type="date")
// - time: HH:MM (para input type="time")
// - dateTime: ISO completo para ordenación
```

---

### 📁 views/ - Vistas de la aplicación

#### **dashboard.js** - Vista principal
```javascript
// Funciones principales:
renderDashboard()                          // Renderiza grid de tipsters
renderDashboardPersonalStats()             // Estadísticas personales
setupDashboardListeners()                  // Event listeners del dashboard

// Componentes:
// 1. Personal Stats (8 stat-cards):
//    - Total Picks, Picks Resueltas, Winrate, Yield
//    - Total Ganancia, Total Apostado, Stake Medio, Cuota Media
//
// 2. Filtros:
//    - Deportes (multi-select), Canales (multi-select)
//    - Yield mínimo, Última pick, Ordenar por
//    - Búsqueda por nombre
//
// 3. Grid de Tipster Cards:
//    - Nombre, canal, estadísticas
//    - Click → showTipsterDetail()

// Lógica:
// - Filtra state.tipsters según dashboardFilters
// - Calcula stats con calculateStats()
// - Ordena según sortBy
// - Renderiza HTML dinámicamente
```

#### **all-picks.js** - Tabla de todas las picks
```javascript
// Funciones principales:
renderAllPicks()                           // Renderiza tabla completa de picks

// Componentes:
// 1. Filtros:
//    - Tipster, Deporte, Estado, Canal, Bookmaker, Resultado
//
// 2. Tabla:
//    - Fecha, Tipster, Deporte, Match, Tipo Apuesta
//    - Cuota, Stake, Resultado, Tipo Pick, Canal, Bookmaker
//    - Acciones: Editar, Eliminar, Seguir
//
// 3. Empty state si no hay picks

// Lógica:
// - Filtra state.picks con filterPicks()
// - Ordena por fecha descendente
// - Muestra badge de resultado con colores
// - Botón "Seguir" solo si no está seguida
// - Botones de acción inline
```

#### **my-picks.js** - Picks seguidas por el usuario
```javascript
// Funciones principales:
renderMyPicks()                            // Renderiza tabla de follows

// Componentes:
// 1. Stats de seguibilidad (4 stat-cards):
//    - Total Follows, Follows Resueltos, Winrate Follows, Yield Follows
//
// 2. Filtros:
//    - Tipster, Resultado, Match/Diverge
//
// 3. Tabla comparativa:
//    - Datos tipster vs datos usuario
//    - Indicador de match/diverge
//    - Acciones: Editar follow, Eliminar follow

// Lógica:
// - Combina state.userFollows con state.picks
// - Compara resultados tipster vs usuario
// - Calcula estadísticas de seguimiento
// - Permite editar odds/stake/resultado del usuario
```

#### **tipster-detail.js** - Detalle de tipster
```javascript
// Funciones principales:
renderTipsterDetail(tipsterId)             // Vista completa del tipster
renderMyStats(tipsterId)                   // Tab de estadísticas usuario
renderFollowComparison(tipsterId)          // Comparación tipster vs follows
renderTipsterFollows(tipsterId)            // Tabla de picks seguidas

// Sistema de tabs:
// 1. Stats: estadísticas generales del tipster
// 2. My Stats: comparación tipster vs usuario
// 3. Follows: historial de picks seguidas

// Componentes tab Stats:
// - 7 stat-cards con métricas clave
// - 4 gráficos Chart.js:
//   * Distribución de cuotas (bar chart)
//   * Distribución de stakes (bar chart)
//   * Distribución de deportes (doughnut chart)
//   * Distribución de tipos de pick (doughnut chart)
// - Tabla de historial de picks
// - Botón "Resetear Tipster"

// Componentes tab My Stats:
// - Comparison grid (tipster vs usuario)
// - Muestra diferencias en yield, winrate, profit

// Componentes tab Follows:
// - Tabla de picks seguidas
// - Indicador de match/diverge
```

#### **charts.js** - Gráficos con Chart.js
```javascript
// Funciones principales:
createOddsChart(tipsterId)                 // Gráfico distribución odds
createStakeChart(tipsterId)                // Gráfico distribución stakes
createSportChart(tipsterId)                // Gráfico distribución deportes
createPickTypeChart(tipsterId)             // Gráfico distribución tipos

// Configuración:
// - Usa chartColors de constants.js
// - Responsive: true
// - maintainAspectRatio: true
// - Tooltips personalizados
// - Legends según tipo de gráfico

// Gestión de instancias:
// - state.charts almacena instancias
// - Destruye charts anteriores antes de crear nuevos
// - Evita memory leaks
```

---

### 📁 modals/ - Modals de la aplicación

#### **tipster-modal.js** - Modal de tipster
```javascript
// Funciones principales:
showAddTipsterModal()                      // Abre modal vacío
setupTipsterModalListeners()               // Configura event listeners
addTipster(event)                          // Submit handler

// Campos:
// - Nombre (required)
// - Canal (select)

// Validación:
// - Nombre no vacío
// - Canal seleccionado

// Flujo:
// 1. Usuario completa form
// 2. addTipster() previene default
// 3. Valida campos
// 4. Llama addTipsterToFirestore()
// 5. Cierra modal
// 6. Listener actualiza UI automáticamente
```

#### **pick-modal.js** - Modal de pick
```javascript
// Funciones principales:
showAddPickModal()                         // Modal vacío para nueva pick
showEditPickModal(pickId)                  // Modal pre-rellenado para editar
setupPickModalListeners()                  // Event listeners
addPickToFirestore(pickData)               // Submit para nueva pick
editPick(pickId)                           // Submit para editar pick

// Campos principales:
// - Tipster (select)
// - Deporte (select)
// - Match
// - Tipo de apuesta
// - Cuota (number)
// - Stake (number 1-10)
// - Tipo de pick (Pre/Live/Combinado)
// - Fecha y hora
// - Bookmaker
// - Resultado (Ganada/Perdida/Void)
// - Checkbox "Resuelta"
// - Comentarios

// Sección follow (opcional):
// - Checkbox "Marcar como seguida"
// - Si activa: campos de follow (userOdds, userStake, userResult)

// Validación:
// - Campos required
// - Stake entre 1-10
// - Odds > 1.0
// - Fecha válida

// Modo edición:
// - Pre-rellena todos los campos
// - Muestra datos de follow si existe
// - Actualiza pick y follow simultáneamente
```

#### **follow-modal.js** - Modal de seguimiento
```javascript
// Funciones principales:
showFollowPickModal(pickId)                // Abre modal para seguir pick
addFollow(event)                           // Submit handler

// Campos:
// - Muestra info de la pick original (read-only)
// - Cuota usuario (editable)
// - Stake usuario (editable)
// - Resultado usuario (select)
// - Checkbox "Resuelta"

// Validación:
// - Pick no seguida previamente
// - userOdds > 1.0
// - userStake entre 1-10

// Flujo:
// 1. Usuario edita datos de su apuesta
// 2. addFollow() valida
// 3. Crea documento en userFollows
// 4. Listener actualiza vistas
```

---

## Flujo de Datos

### 1. Inicialización de la App
```
Usuario carga index.html
    ↓
Se cargan scripts Firebase (CDN)
    ↓
Se carga app.js (type="module")
    ↓
import init.js → Inicializa Firebase
    ↓
import auth.js → setupAuthListeners()
    ↓
onAuthStateChanged ejecuta:
    - Si usuario → initApp()
    - Si no → muestra authScreen
```

### 2. Flujo de Autenticación
```
Usuario envía login form
    ↓
handleLogin(event)
    ↓
firebase.auth().signInWithEmailAndPassword()
    ↓
onAuthStateChanged detecta cambio
    ↓
state.currentUser = user
    ↓
initApp() ejecuta:
    - setupTipstersListener()
    - setupPicksListener()
    - setupFollowsListener()
    - initializeFilters()
    ↓
Listeners onSnapshot activos
    ↓
Datos sincronizados en state
    ↓
renderDashboard()
```

### 3. Flujo CRUD de Picks
```
Usuario click "Añadir Pick"
    ↓
showAddPickModal()
    ↓
Usuario completa form
    ↓
addPickToFirestore(pickData)
    ↓
db.collection('picks').add({ uid, ...pickData })
    ↓
Firestore guarda documento
    ↓
onSnapshot detecta cambio
    ↓
setupPicksListener actualiza state.picks
    ↓
Renderiza vistas afectadas:
    - renderAllPicks() si está en allPicks view
    - renderTipsterDetail() si está en detalle
    - renderDashboard() para stats globales
```

### 4. Flujo de Filtrado
```
Usuario cambia filtro (ej: selecciona deporte)
    ↓
toggleFilterOption(event, 'sport', 'Fútbol')
    ↓
toggleFilterCheckboxUI(event) - feedback visual
    ↓
state.dashboardFilters.sports.push('Fútbol')
    ↓
applyFilters()
    ↓
filterTipsters(state.tipsters, state.dashboardFilters)
    ↓
Retorna array filtrado
    ↓
renderDashboard() con tipsters filtrados
```

### 5. Flujo de Seguimiento de Pick
```
Usuario click "Seguir" en pick
    ↓
showFollowPickModal(pickId)
    ↓
Modal muestra info pick + campos usuario
    ↓
Usuario edita userOdds, userStake, userResult
    ↓
addFollow(event)
    ↓
addFollowToFirestore({ pickId, userOdds, userStake, ... })
    ↓
db.collection('userFollows').add(...)
    ↓
setupFollowsListener detecta cambio
    ↓
state.userFollows actualizado
    ↓
Renderiza:
    - renderMyPicks() si está en myPicks view
    - renderTipsterDetail() si está en detalle
    - renderDashboardPersonalStats() para stats globales
```

---

## Interfaz de Usuario

### Estructura HTML (index.html)

#### 🔐 Auth Screen
```html
<div id="authScreen" class="auth-screen">
  <!-- Tabs: Login / Signup -->
  <!-- Forms con validación HTML5 -->
  <!-- Toggle password visibility -->
  <!-- Link "Olvidaste contraseña" -->
  <!-- Modal forgot password -->
</div>
```

#### 🏠 Main App
```html
<div id="mainApp" class="main-app">
  <!-- Navbar: logo, user email, botones añadir, logout -->
  
  <!-- Vista Dashboard -->
  <div id="dashboardView" class="view active">
    <!-- Personal stats grid (8 cards) -->
    <!-- Filtros: sports, channels, yield, lastPick, sort, search -->
    <!-- Grid de tipster cards -->
  </div>
  
  <!-- Vista All Picks -->
  <div id="allPicksView" class="view">
    <!-- Filtros: tipster, sport, status, channel, bookmaker, result -->
    <!-- Tabla de picks con acciones -->
  </div>
  
  <!-- Vista My Picks -->
  <div id="myPicksView" class="view">
    <!-- Stats de seguibilidad (4 cards) -->
    <!-- Filtros: tipster, result, match/diverge -->
    <!-- Tabla comparativa tipster vs usuario -->
  </div>
  
  <!-- Vista Tipster Detail -->
  <div id="tipsterDetailView" class="view">
    <!-- Header con nombre y botón volver -->
    <!-- Tabs: Stats, My Stats, Follows -->
    
    <!-- Tab Stats -->
    <div id="statsTab" class="tab-content active">
      <!-- 7 stat-cards -->
      <!-- 4 gráficos Chart.js -->
      <!-- Tabla historial picks -->
      <!-- Botón resetear -->
    </div>
    
    <!-- Tab My Stats -->
    <div id="myStatsTab" class="tab-content">
      <!-- Comparison grid -->
    </div>
    
    <!-- Tab Follows -->
    <div id="followsTab" class="tab-content">
      <!-- Tabla follows -->
    </div>
  </div>
</div>
```

#### 🗂️ Modals
```html
<!-- Modal Añadir Tipster -->
<div id="addTipsterModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Añadir Tipster</h2>
      <button onclick="closeModal('addTipsterModal')">×</button>
    </div>
    <form id="addTipsterForm">
      <!-- Campos: nombre, canal -->
    </form>
  </div>
</div>

<!-- Modal Añadir/Editar Pick -->
<div id="addPickModal" class="modal">
  <!-- Form completo con sección follow opcional -->
</div>

<!-- Modal Seguir Pick -->
<div id="followPickModal" class="modal">
  <!-- Info pick + campos usuario -->
</div>

<!-- Modal Forgot Password -->
<div id="forgotPasswordModal" class="modal">
  <!-- Input email + botón enviar -->
</div>
```

### Elementos Interactivos

#### Navegación
- **Navbar tabs**: Click cambia vista activa (dashboard, allPicks, myPicks)
- **Tipster card**: Click muestra detalle del tipster
- **Botón volver**: Regresa al dashboard desde detalle

#### Filtros
- **Custom dropdowns**: Multi-select con checkboxes
- **Input numérico**: Debounce de 500ms para yield mínimo
- **Select simple**: Cambio inmediato
- **Search bar**: Filtrado en tiempo real

#### Tablas
- **Botón Editar**: Abre modal pre-rellenado
- **Botón Eliminar**: Confirmación → elimina de Firestore
- **Botón Seguir**: Abre modal follow con info de pick
- **Checkbox Resuelta**: Toggle estado resolved

#### Modals
- **Overlay oscuro**: Click fuera cierra modal
- **Botón ×**: Cierra modal
- **Submit form**: Guarda y cierra
- **Cancel button**: Solo cierra sin guardar

---

## Sistema de Estilos

### Variables CSS (Root)
```css
:root {
  /* Colores */
  --color-primary: #3B82F6;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text: #E0E0E0;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #6B7280;
  
  /* Tipografía */
  --font-family: 'FKGroteskNeue', 'Geist', 'Inter', sans-serif;
  --font-mono: 'Berkeley Mono', monospace;
  --font-size-xs: 11px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 20px;
  --font-size-3xl: 24px;
  --font-size-4xl: 30px;
  
  /* Spacing */
  --space-1: 1px;
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-base: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Animaciones */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 400ms;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Componentes Principales

#### Botones
```css
.btn {
  /* Base styles */
}

.btn--primary    /* Azul - acciones principales */
.btn--secondary  /* Gris - acciones secundarias */
.btn--outline    /* Borde - acciones terciarias */
.btn--danger     /* Rojo - acciones destructivas */

.btn--sm         /* Pequeño */
.btn--lg         /* Grande */
.btn--full-width /* Ancho completo */
.btn--icon-only  /* Solo icono, cuadrado */
```

#### Forms
```css
.form-control    /* Input, textarea, select estilizados */
.form-group      /* Wrapper con spacing */
.form-label      /* Label estilizado */
```

#### Cards
```css
.card            /* Contenedor con background surface */
.card__header    /* Header del card */
.card__body      /* Body principal */
.card__footer    /* Footer del card */

.tipster-card    /* Card específico para tipsters */
.stat-card       /* Card para estadísticas */
```

#### Status Badges
```css
.status               /* Badge base */
.status--success      /* Verde - Ganada */
.status--error        /* Rojo - Perdida */
.status--warning      /* Naranja - Void */
.status--info         /* Gris - Pendiente */
```

#### Tables
```css
.picks-table     /* Tabla estilizada */
thead            /* Header con background azul */
tbody tr:hover   /* Hover effect */
```

#### Modals
```css
.modal           /* Overlay full screen */
.modal.active    /* Modal visible */
.modal-content   /* Contenedor centrado */
.modal-header    /* Header con título y close */
.modal-body      /* Body con contenido */
.modal-footer    /* Footer con botones */
```

#### Custom Dropdowns
```css
.custom-dropdown     /* Wrapper */
.dropdown-toggle     /* Botón toggle */
.dropdown-menu       /* Menu desplegable */
.dropdown-menu.active /* Menu visible */
.dropdown-item       /* Item del menu */
```

### Responsive Design
```css
@media (max-width: 768px) {
  /* Navbar: flex-direction column */
  /* Grids: 1 columna */
  /* Tables: font-size reducido */
  /* Filters: full width stacked */
  /* Tabs: scroll horizontal */
}
```

### Utility Classes
```css
/* Display */
.block, .hidden, .flex, .flex-col

/* Alignment */
.items-center, .justify-center, .justify-between

/* Spacing */
.m-0, .mt-8, .px-16, .gap-8

/* Text */
.text-center, .text-sm, .font-bold

/* Colors */
.positive, .negative

/* States */
.active, .visible
```

---

## Convenciones de Código

### Naming Conventions

#### JavaScript
```javascript
// Variables y funciones: camelCase
const currentUser = auth.currentUser;
const tipsters = [];
function renderDashboard() {}
function calculateStats() {}

// Constantes: camelCase (no UPPER_CASE)
const allSports = ['Fútbol', 'Baloncesto'];
const sportIcons = { 'Fútbol': '⚽' };

// Event handlers: camelCase con prefijo handle
function handleLogin(e) {}
function handleSignup(e) {}

// Classes (si se usan): PascalCase
class TipsterManager {}
```

#### HTML/CSS
```css
/* IDs: camelCase */
#dashboardView
#allPicksBody
#addTipsterModal

/* Classes: kebab-case */
.tipster-card
.stat-item
.form-control
.custom-dropdown

/* Archivos: kebab-case */
tipster-modal.js
all-picks.js
style.css
```

### Arquitectura Modular

#### Exports
```javascript
// Cada módulo exporta sus funciones y variables
// state.js
export { state }

// calculations.js
export { calculateYield, calculateWinrate, calculateStats }

// dashboard.js
export { renderDashboard, setupDashboardListeners }
```

#### Imports
```javascript
// app.js orquesta todos los módulos
import { db, auth } from './core/init.js';
import { state } from './core/state.js';
import { setupAuthListeners } from './core/auth.js';
import { allSports, sportIcons } from './data/constants.js';
import { calculateStats } from './utils/calculations.js';
import { renderDashboard } from './views/dashboard.js';
import { showAddPickModal } from './modals/pick-modal.js';
```

### Patrones de Código

#### Firestore Queries
```javascript
// Siempre filtrar por uid del usuario
db.collection('tipsters')
  .where('uid', '==', currentUser.uid)
  .onSnapshot(snapshot => {
    // Procesar docs
  });
```

#### Error Handling
```javascript
try {
  showLoading(true);
  await db.collection('picks').add(pickData);
  closeModal('addPickModal');
} catch (error) {
  console.error('Error:', error);
  alert('Error al guardar: ' + error.message);
} finally {
  showLoading(false);
}
```

#### Estado Visual
```javascript
// Loading overlay
showLoading(true);
// ... operación asíncrona
showLoading(false);

// Mostrar/ocultar elementos
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('visible');

// Confirmaciones
if (confirm('¿Estás seguro?')) {
  // Acción destructiva
}
```

#### Renderizado Dinámico
```javascript
function renderTipsters(tipsters) {
  const container = document.getElementById('tipstersGrid');
  
  if (tipsters.length === 0) {
    container.innerHTML = '<div class="empty-state">Sin tipsters</div>';
    return;
  }
  
  container.innerHTML = tipsters.map(tipster => `
    <div class="tipster-card" onclick="showTipsterDetail('${tipster.id}')">
      <h3>${tipster.name}</h3>
      <p>${tipster.channel}</p>
    </div>
  `).join('');
  
  // Reinicializar icons después de modificar DOM
  lucide.createIcons();
}
```

#### Filtrado con Debounce
```javascript
function onYieldFilterChange(value) {
  clearTimeout(state.yieldDebounceTimer);
  state.yieldDebounceTimer = setTimeout(() => {
    state.dashboardFilters.yieldMin = parseFloat(value);
    applyFilters();
  }, 500);
}
```

### Documentación en Código
```javascript
/**
 * Calcula las estadísticas completas de un tipster
 * @param {string} tipsterId - ID del tipster
 * @returns {object} Objeto con todas las estadísticas
 */
function calculateStats(tipsterId) {
  // ...
}
```

---

## Comandos y Desarrollo

### Desarrollo Local

#### Iniciar servidor de desarrollo
```bash
firebase serve
# Sirve la app en http://localhost:5000
# Solo hosting, no inicia emuladores
```

#### Iniciar emuladores completos
```bash
firebase emulators:start
# Inicia:
# - Firestore emulator: localhost:8080
# - Auth emulator: localhost:9099
# - Hosting: localhost:5000
# - Emulator UI: localhost:4000
```

#### Importar datos de emulador
```bash
firebase emulators:start --import=./emulator-data
# Carga datos guardados previamente
```

#### Exportar datos de emulador
```bash
firebase emulators:export ./emulator-data
# Guarda estado actual del emulador
```

### Deploy

#### Deploy completo
```bash
firebase deploy
# Despliega:
# - Hosting
# - Firestore rules
# - Firestore indexes
```

#### Deploy solo hosting
```bash
firebase deploy --only hosting
# Solo actualiza archivos en public/
```

#### Deploy solo rules
```bash
firebase deploy --only firestore:rules
# Solo actualiza firestore.rules
```

### Git y GitHub

#### Flujo de trabajo
```bash
# Hacer cambios
git add .
git commit -m "descripción del cambio"
git push origin main

# GitHub Actions automáticamente:
# 1. Detecta push a main
# 2. Ejecuta workflow firebase-hosting-main.yml
# 3. Hace build si es necesario
# 4. Despliega a Firebase Hosting
```

### Firebase CLI

#### Login
```bash
firebase login
# Autentica con cuenta de Google
```

#### Seleccionar proyecto
```bash
firebase use <project-id>
# Cambia proyecto activo
```

#### Ver proyectos
```bash
firebase projects:list
# Lista todos tus proyectos
```

### NPM Scripts (si existen en package.json)
```bash
npm install          # Instala dependencias
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run deploy       # Deploy a Firebase
```

---

## Problemas Conocidos y Mejoras

### 🐛 Bugs Conocidos

1. **Charts - Tamaños y colores**
   - Los gráficos pueden tener inconsistencias visuales
   - Mejorar paleta de colores para mejor contraste
   - Ajustar tamaños responsive

2. **Follows - Especificidad de stakes**
   - Stakes actuales son ranges genéricos (1-10)
   - Considerar stakes específicos (ej: 0.5, 1.5, 2.3)

3. **Historial unificado**
   - Historial de follows y estadísticas están separados
   - Unificar en una vista cronológica completa


### ✨ Mejoras Planificadas

#### Funcionalidades Faltantes y Estado Fase 8.5

- **Subida de imágenes**: 
  - Upload de screenshots de picks
  - OCR para extraer datos automáticamente
  - Firebase Storage para almacenamiento

- **Gestión de Bookmakers**:
  - CRUD completo de bookmakers
  - Añadir nuevos bookmakers desde la app

- **Eliminación de entidades**:
  - Funcionalidad "Remove Tipster" completa
  - Eliminación en cascada de picks asociadas
  - Funcionalidad "Remove Pick" con confirmación

- **Exportar a Excel**: ✅ COMPLETADO (template, dashboards, fórmulas, estilos, dropdowns)
- **Importar desde Excel**: ⏸️ POSPUESTO (NO se implementa en esta fase, queda documentado para futuro)

#### Tareas pendientes Fase 8.5

**Completadas (6/11):**
1. ✅ Ordenación por columnas en tablas (picks, follows)
2. ✅ Sistema de notificaciones toast (Sonner) - 0 window.confirm/alert restantes
3. ✅ ConfirmDialog reutilizable
4. ✅ Reset Tipster con doble confirmación
5. ✅ Filtros de fecha en picks
6. ✅ Exportación a Excel completa

**Pendientes (5/11):**
7. ⏳ Optimización de estados de carga (skeleton loaders, overlays)
8. ⏳ Error boundaries
9. ⏳ Mejora de búsqueda en tablas
10. ⏳ Mejoras responsive (mobile/tablet)
11. ⏳ Optimización de rendimiento
   - React.memo para componentes pesados
   - Lazy loading de componentes y rutas
   - Virtualización de tablas largas (react-virtual/react-window)
   - Code splitting por rutas
   - **Optimización de carga en redes lentas (3G/4G)**
     - Detectado en testing con throttling de red
     - Bundle size analysis: Chart.js (~200KB), Firebase SDK (~100KB), Lucide (~50KB)
     - Tree shaking de iconos (importar solo los necesarios)
     - Lazy loading de charts (mayor impacto)
     - Compresión gzip/brotli
     - Drop console.logs en producción
   - Métricas objetivo: FCP < 3s (3G), LCP < 5s (3G), TTI < 7s (3G)
   - Bundle objetivo: < 200KB inicial (gzipped), < 500KB total

**Decisión:** La importación de Excel se pospone y no bloquea el avance ni el deploy. El exportador está finalizado y validado.

#### Mejoras de UX
- **Notificaciones**:
  - Toast notifications en lugar de alerts
  - Feedback visual mejorado

- **Búsqueda avanzada**:
  - Búsqueda por match, betType
  - Filtros por rangos de fechas
  - Búsqueda full-text

- **Dashboard personalizable**:
  - Widgets arrastrables
  - Configuración de métricas visibles
  - Gráficos personalizables

#### Mejoras Técnicas
- **Testing**:
  - Unit tests con Jest
  - Integration tests con Cypress
  - Tests de Firestore rules

- **Performance**:
  - Paginación de tablas grandes
  - Lazy loading de gráficos
  - Service Worker para offline

- **Seguridad**:
  - Rate limiting en autenticación
  - Validación más estricta en Firestore rules
  - Sanitización de inputs

- **Refactoring**:
  - Migrar a TypeScript
  - Component-based architecture
  - State management con Redux/Zustand

### 📝 Notas para el Agente de IA

#### Prioridades al Modificar el Código
1. **Seguridad**: No exponer credenciales Firebase
2. **Consistencia**: Mantener convenciones de naming
3. **Modularidad**: No romper imports/exports existentes
4. **UX**: Mantener feedback visual (loading, confirmaciones)
5. **Firestore Rules**: No romper reglas de seguridad

#### Al Añadir Nuevas Funcionalidades
1. Crear módulo en carpeta apropiada (services, utils, views, modals)
2. Exportar funciones necesarias
3. Importar en app.js si es necesario para inicialización
4. Actualizar listeners si afecta a datos en tiempo real
5. Añadir estilos en style.css siguiendo variables CSS
6. Documentar en AGENTS.md

#### Al Modificar Firestore
1. Actualizar firestore.rules si es necesario
2. Añadir índices en firestore.indexes.json si se requieren queries compuestas
3. Verificar que listeners se actualicen correctamente
4. Mantener uid del usuario en todos los documentos

#### Al Modificar CSS
1. Usar variables CSS existentes
2. Mantener dark theme
3. Verificar responsive (max-width: 768px)
4. No usar !important salvo necesidad extrema

#### Al Depurar
1. Revisar console.log en navegador
2. Verificar Firebase Console para datos
3. Usar Firebase Emulators para testing local
4. Verificar Network tab para llamadas Firebase

---

## Glosario

- **Pick**: Pronóstico o apuesta recomendada por un tipster
- **Follow**: Seguimiento de una pick por el usuario
- **Tipster**: Persona que recomienda picks
- **Stake**: Unidades apostadas (1-10 scale)
- **Odds**: Cuota de la apuesta
- **Yield**: Rentabilidad porcentual sobre total apostado
- **Winrate**: Porcentaje de aciertos
- **Profit**: Ganancia/pérdida neta en unidades
- **Seguibilidad**: Porcentaje de picks seguidas desde primer follow
- **Match**: Resultado del usuario coincide con el tipster
- **Diverge**: Resultado del usuario difiere del tipster
- **Resolved**: Pick con resultado definido (Ganada/Perdida/Void)
- **SPA**: Single Page Application
- **BaaS**: Backend as a Service (Firebase)
- **CRUD**: Create, Read, Update, Delete

---

**Última actualización**: 13 de Noviembre de 2025  
**Versión del proyecto**: 1.0.0  
**Firebase SDK**: 10.7.1  
**Chart.js**: Latest (CDN)  
**Lucide Icons**: Latest (CDN)

- **public/index.html**: 
  - SPA con 2 pantallas (auth + main app) y 4 vistas principales
  - 4 modals para CRUD operations
  - Usa Lucide Icons (CDN) + Chart.js + Firebase SDK 10.7.1
  - Sistema de tabs y dropdowns personalizados
  
- **public/js/app.js**: 
  - **Punto de entrada modular** que importa todos los módulos
  - Coordina la inicialización de la aplicación
  - Importa y ejecuta funciones de inicialización de cada módulo
  
- **public/assets/css/style.css**: 
  - Design system completo con CSS variables
  - Dark theme único con palette azul/slate
  - Componentes: buttons, forms, cards, modals, tables, badges
  - Custom dropdowns multi-select
  - Sistema responsive con breakpoint 768px
  - Custom font: FKGroteskNeue (cargada desde CDN Perplexity)

  
- **public/js/config/firebase.config.js**: 
  - Configuración de Firebase (credentials) - en .gitignore
  
- **firestore.rules**: 
  - Reglas de seguridad - solo el usuario propietario puede modificar sus datos
  
- **.github/workflows/firebase-hosting-main.yml**: 
  - Deploy automático al hacer push a main



### Módulos core/

- **core/init.js**:
  - Inicialización de Firebase (app, auth, db)
  - Configuración de emuladores para localhost
  - Exporta instancias de Firebase para uso global

- **core/auth.js**:
  - Auth listeners con `onAuthStateChanged`
  - Funciones de login, signup, logout, reset password
  - Control de visibilidad de pantallas auth/main

- **core/state.js**:
  - Variables de estado global: `currentUser`, `currentView`, `currentTipsterId`
  - Arrays de datos: `tipsters[]`, `picks[]`, `userFollows[]`
  - Objetos de estado: `dashboardFilters`, `charts`

### Módulos data/

- **data/constants.js**:
  - Arrays constantes: `allSports`, `allBookmakers`, `allChannels`
  - Mapeo de iconos: `sportIcons` (objeto con emojis/símbolos)
  - Paleta de colores: `chartColors` (array hex)

- **data/listeners.js**:
  - Listeners de Firestore con `onSnapshot`
  - Funciones: `setupTipstersListener()`, `setupPicksListener()`, `setupFollowsListener()`
  - Sincronización en tiempo real con Firebase
  - Variables de unsubscribe: `unsubscribeTipsters`, `unsubscribePicks`, `unsubscribeFollows`

### Módulos services/

- **services/tipster.service.js**:
  - CRUD de tipsters en Firestore
  - Funciones: `addTipsterToFirestore()`, `updateTipsterInFirestore()`, `deleteTipsterFromFirestore()`
  - Queries filtradas por `uid` del usuario

- **services/pick.service.js**:
  - CRUD de picks en Firestore
  - Funciones: `addPickToFirestore()`, `updatePickInFirestore()`, `deletePickFromFirestore()`
  - Manejo de timestamps y formato ISO

- **services/follow.service.js**:
  - CRUD de follows en Firestore
  - Funciones: `addFollowToFirestore()`, `updateFollowInFirestore()`, `deleteFollowFromFirestore()`
  - Relación entre picks y follows del usuario

### Módulos utils/

- **utils/calculations.js**:
  - Cálculos de estadísticas: `calculateYield()`, `calculateWinrate()`, `calculateProfit()`
  - Lógica de seguibilidad: `calculateTraceability()`
  - Fórmulas: 
    - Yield: `(profit / totalStaked) * 100`
    - Winrate: `(wonPicks / totalPicks) * 100`
    - Profit: `(odds - 1) * stake` (ganada) o `-stake` (perdida)

- **utils/filters.js**:
  - Lógica de filtrado para dashboard y picks
  - Funciones: `applyDashboardFilters()`, `applyPicksFilters()`, `applyMyPicksFilters()`
  - Búsqueda, ordenación y filtrado multi-criterio

- **utils/ui-helpers.js**:
  - Helpers de UI: `showLoading()`, `closeModal()`, `confirm()`
  - Manejo de estados visuales y overlays
  - Inicialización de Lucide icons

- **utils/date-utils.js**:
  - Formateo de fechas ISO
  - Funciones: `formatDate()`, `formatTime()`, `formatDateTime()`
  - Parsing y validación de fechas

### Módulos views/

- **views/dashboard.js**:
  - Función `renderDashboard()`: grid de tipsters con estadísticas
  - Funciones de filtros: `applyDashboardFilters()`, `searchTipsters()`
  - Renderizado de personal stats y tipster cards

- **views/all-picks.js**:
  - Función `renderAllPicks()`: tabla completa de picks
  - Filtros avanzados por tipster, sport, status, channel, bookmaker
  - Acciones: editar, eliminar, seguir

- **views/my-picks.js**:
  - Función `renderMyPicks()`: tabla de picks seguidas
  - Estadísticas de seguibilidad
  - Comparación tipster vs usuario (match/diverge)

- **views/tipster-detail.js**:
  - Función `renderTipsterDetail()`: vista detallada de tipster
  - Sistema de tabs: Stats, My Stats, Follows
  - Renderizado de charts con Chart.js (4 gráficos)
  - Historial de picks del tipster

### Módulos modals/

- **modals/tipster-modal.js**:
  - `showAddTipsterModal()`: abre modal de añadir tipster
  - `handleAddTipster()`: guarda nuevo tipster en Firestore
  - Validación de campos

- **modals/pick-modal.js**:
  - `showAddPickModal()`: modal de añadir pick (con sección follow opcional)
  - `showEditPickModal()`: modal de editar pick existente
  - `handleAddPick()`, `handleEditPick()`: CRUD operations
  - Gestión de formulario complejo con follow integrado

- **modals/follow-modal.js**:
  - `showFollowPickModal()`: modal para seguir pick existente
  - `handleFollow()`: guarda follow en Firestore
  - Validación de stake y odds del usuario

- **public/assets/css/style.css**: 
  - Design system completo con CSS variables
  - Dark theme único con palette azul/slate
  - Componentes: buttons, forms, cards, modals, tables, badges
  - Custom dropdowns multi-select
  - Sistema responsive con breakpoint 768px
  - Custom font: FKGroteskNeue (cargada desde CDN Perplexity)

- **public/js/config/firebase.config.js**: 
  - Configuración de Firebase (credentials) - en .gitignore
  
- **firestore.rules**: 
  - Reglas de seguridad - solo el usuario propietario puede modificar sus datos
  
- **.github/workflows/firebase-hosting-main.yml**: 
  - Deploy automático al hacer push a main

## Convenciones de código

**Arquitectura modular:**
- Separación de responsabilidades por carpetas
- **Exports/Imports**: todos los módulos exportan funciones y variables necesarias
- **app.js** como orquestador central que importa e inicializa todo
- Cada módulo es independiente y reutilizable

**Naming:**
- Variables globales: camelCase (ej: `currentUser`, `tipsters`, `picks`)
- Funciones: camelCase descriptivo (ej: `renderDashboard()`, `calculateStats()`, `showTipsterDetail()`)
- Constantes: camelCase para arrays (ej: `allSports`, `sportIcons`)
- Event handlers: camelCase con prefijo `handle` (ej: `handleLogin`, `handleSignup`)
- IDs de elementos DOM: camelCase (ej: `#dashboardView`, `#allPicksBody`)
- Clases CSS: kebab-case (ej: `.tipster-card`, `.stat-item`)
- Archivos: kebab-case (ej: `app-bulk.js`, `style.css`)

**Estructura del código modular:**
- SVG logos personalizados + Lucide Icons (CDN)
- Inicialización Firebase en `core/init.js` con manejo de emuladores para localhost
- Estado global exportado desde `core/state.js`
- Listeners exportados desde `data/listeners.js`
- Servicios Firestore en `services/*.service.js`
- Utils reutilizables en `utils/*.js`
- Renders de vistas en `views/*.js`
- Modals en `modals/*.js`

**Patrones de importación:**
// En app.js
import { auth, db } from './core/init.js';
import { setupAuthListeners } from './core/auth.js';
import { tipsters, picks } from './core/state.js';
import { allSports, sportIcons } from './data/constants.js';
import { calculateYield } from './utils/calculations.js';
import { renderDashboard } from './views/dashboard.js';

**Patrones de datos:**
- Firestore: 3 colecciones principales: `tipsters`, `picks`, `userFollows`
- Todos los docs incluyen `uid` del usuario para queries por usuario
- IDs: strings generados por Firestore (no numéricos)
- Fechas: formato ISO string dividido en `date` (YYYY-MM-DD) y `time` (HH:MM)
- DateTime completo: formato ISO combinado para ordenación

**UI/UX:**
- Loading overlay global con `showLoading(true/false)`
- Confirmaciones con `confirm()` para acciones destructivas
- Errores mostrados con elementos `.classList.add('visible')`
- Filtros con debounce (500ms para inputs numéricos)
- Charts con Chart.js (stored in global `charts` object)
- Estados visuales: `.active`, `.visible` classes

**Firebase patterns:**
- Listeners globales: `unsubscribeTipsters`, `unsubscribePicks`, `unsubscribeFollows`
- Auth state: `onAuthStateChanged` controla visibilidad de pantallas
- Queries: `.where('uid', '==', currentUser.uid)` para filtrar por usuario
- Error handling: try/catch con `showLoading(false)` + alert

**Cálculos:**
- Yield: `(profit / totalStaked) * 100`
- Winrate: `(wonPicks / totalPicks) * 100`
- Seguibilidad: `(followedCount / totalPicksSinceFirstFollow) * 100`
- Profit: `(odds - 1) * stake` para ganadas, `-stake` para perdidas

**Assets:**
- Iconos deportivos: objeto `sportIcons` con emojis/símbolos
- Colores chart: array `chartColors` con paleta hex personalizada
- Bookmakers y deportes: arrays constantes `allBookmakers`, `allSports`, `allChannels`

## Arquitectura de la App

**Pantallas principales:**
1. **Dashboard** (`#dashboardView`): Grid de tipsters con estadísticas y filtros
2. **All Picks** (`#allPicksView`): Tabla de todas las picks con filtros avanzados
3. **Mis Picks** (`#myPicksView`): Picks seguidas por el usuario
4. **Tipster Detail** (`#tipsterDetailView`): Detalle con 3 tabs (Stats, My Stats, Follows)

**Flujo de datos:**
- Firebase Firestore (realtime) → listeners `onSnapshot` → arrays globales → render functions
- Cambios en datos → automáticamente re-renderizan vistas afectadas
- Modificaciones → funciones async Firebase → listeners actualizan UI

**Estado global:**
- `currentUser`: usuario autenticado
- `tipsters[]`: array de tipsters del usuario
- `picks[]`: array de picks de todos los tipsters
- `userFollows[]`: array de picks seguidas por el usuario
- `currentView`: vista activa ('dashboard', 'allPicks', 'myPicks', 'tipsterDetail')
- `currentTipsterId`: ID del tipster en vista detalle
- `dashboardFilters`: objeto con filtros activos
- `charts`: objeto con instancias de Chart.js

## Estructura HTML (index.html)

**Arquitectura:**
- Single Page Application (SPA) con múltiples vistas ocultas/visibles
- 2 pantallas principales: `#authScreen` y `#mainApp`
- 4 vistas principales dentro de `#mainApp`: dashboard, allPicks, myPicks, tipsterDetail

**Secciones principales:**

1. **Auth Screen** (`#authScreen`):
   - Tabs: Login / Signup
   - Forms: `#loginForm`, `#signupForm`
   - Modal: `#forgotPasswordModal`
   - Toggle password visibility en inputs
   - Validación: emails, passwords min 6 chars

2. **Main App** (`#mainApp`):
   - Navbar con: logo, user email, botones "Añadir Tipster", "Añadir Pick", "Cerrar Sesión"
   - View system: `.view` elements con clase `.active` para mostrar

3. **Dashboard View** (`#dashboardView`):
   - Panel de estadísticas personales (8 stat-cards)
   - Filtros avanzados: sports dropdown, channel dropdown, yield min, last pick, sort
   - Search bar para buscar tipsters
   - Grid de tipster cards (`#tipstersGrid`)

4. **All Picks View** (`#allPicksView`):
   - Filtros: tipster, sport, status, channel, bookmaker, result
   - Tabla con todas las picks (`#allPicksTable`)
   - Acciones: editar, eliminar, seguir

5. **Mis Picks View** (`#myPicksView`):
   - Stats de seguibilidad (4 stat-cards)
   - Filtros: tipster, resultado, match/diverge
   - Tabla comparativa con resultado tipster vs usuario

6. **Tipster Detail View** (`#tipsterDetailView`):
   - 3 tabs: Stats, My Stats, Follows
   - Stats overview (7 stat-cards)
   - 4 charts: odds distribution, stake distribution, sports, pick types
   - Comparación tipster vs follows
   - Tabla de historial de picks
   - Botón "Resetear Tipster"

**Modals:**
- `#addTipsterModal`: nombre + canal
- `#addPickModal`: form completo con sección de follow opcional
- `#editPickModal`: edición de pick + follow data
- `#followPickModal`: form para seguir un pick existente
- `#forgotPasswordModal`: recuperación de contraseña

**Componentes reutilizables:**
- `.stat-card`: tarjetas de estadísticas
- `.custom-dropdown`: dropdowns multi-select personalizados
- `.modal`: sistema de modals con `.modal-content`, `.modal-header`, `.modal-footer`
- `.loading-overlay`: spinner global
- `.empty-state`: mensajes cuando no hay datos

**Librerías externas (CDN):**
- Chart.js: para gráficos
- Lucide Icons: iconos SVG (inicializados con `lucide.createIcons()`)
- Firebase 10.7.1: app-compat, auth-compat, firestore-compat

**IDs importantes:**
- Todas las views: `#dashboardView`, `#allPicksView`, `#myPicksView`, `#tipsterDetailView`
- Todos los forms: `#loginForm`, `#signupForm`, `#addTipsterForm`, `#addPickForm`, etc.
- Todos los modals: `#addTipsterModal`, `#addPickModal`, `#editPickModal`, `#followPickModal`
- Elementos dinámicos: `#tipstersGrid`, `#allPicksBody`, `#followedPicksBody`, `#detailPicksBody`

**Patrones:**
- Forms usan `onsubmit="functionName(event)"` con `event.preventDefault()`
- Botones usan `onclick="functionName()"`
- Inputs usan `oninput="functionName()"` para live updates
- Checkboxes usan `onchange="toggleFunction()"`
- Modals se abren con `show*Modal()` y cierran con `closeModal(modalId)`

**Validación HTML:**
- `required` en campos obligatorios
- `min`, `max`, `step` en inputs numéricos
- `minlength` en passwords (6 chars)
- `type="email"` para validación de emails
- `type="date"` y `type="time"` para fechas/horas

## Sistema de Estilos (style.css)

**Arquitectura CSS:**
- Design system basado en CSS Custom Properties (variables)
- Dark theme único (no hay light theme)
- Sistema de componentes reutilizables
- Mobile-first con breakpoint a 768px

**CSS Variables (root):**

**Colores:**
- Primary: `#3B82F6` (azul)
- Background: `#0F172A` (dark navy)
- Surface/Cards: `#1E293B` (slate)
- Text: `#E0E0E0` (light gray)
- Success: `#10B981` (verde)
- Error: `#EF4444` (rojo)
- Warning: `#F59E0B` (naranja)
- Info: `#6B7280` (gris)

**Tipografía:**
- Font family: `FKGroteskNeue, Geist, Inter` (custom font + fallbacks)
- Mono: `Berkeley Mono` + system monospace
- Sizes: 11px (xs) → 30px (4xl)
- Weights: 400, 500, 550, 600

**Spacing:**
- Sistema de 1-32px con incrementos predefinidos
- Variables: `--space-4`, `--space-8`, `--space-16`, etc.

**Border radius:**
- `--radius-sm: 4px`
- `--radius-base: 6px`
- `--radius-md: 8px`
- `--radius-lg: 10px`
- `--radius-full: 9999px` (pills)

**Shadows:**
- 4 niveles: xs, sm, md, lg
- Inset shadow para efectos internos
- Todas con rgba negro con opacidad

**Animaciones:**
- Fast: 150ms
- Normal: 250ms
- Slow: 400ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

**Componentes principales:**

**Botones** (`.btn`):
- Variantes: `--primary`, `--secondary`, `--outline`, `--danger`
- Tamaños: `--sm`, base, `--lg`
- Estados: hover, active, disabled, focus-visible
- Icon-only con `--icon-only` (aspect-ratio 1:1)

**Forms** (`.form-control`):
- Input, textarea, select estilizados
- Custom select arrow con SVG data-uri
- Focus states con ring azul
- `.form-group` para espaciado consistente

**Cards** (`.card`):
- Background surface con border
- Hover effect con shadow
- `.card__body`, `.card__header`, `.card__footer`

**Status badges** (`.status`):
- 4 variantes: success, error, warning, info
- Background translúcido con border
- Pills con border-radius full

**Tables** (`.picks-table`):
- Zebra striping en hover
- Thead con background azul translúcido
- Border collapse
- Responsive text size

**Modals** (`.modal`):
- Fixed overlay con backdrop blur
- `.active` class para mostrar
- `.modal-content` centrado con max-width 600px
- Scroll interno si supera 90vh

**Custom dropdowns** (`.custom-dropdown`):
- Multi-select con checkboxes
- `.dropdown-menu` con scroll
- Arrow rotation en estado activo
- Click outside para cerrar (manejado en JS)

**Grids específicos:**
- `.tipster-grid`: auto-fill 320px min
- `.personal-stats-grid`: auto-fit 100px min
- `.charts-container`: auto-fit 300px min
- `.comparison-grid`: auto-fit 250px min

**Secciones especiales:**
- `.auth-screen`: full viewport con gradient background
- `.navbar`: sticky top con shadow
- `.filters-panel`: panel con header y controles
- `.comparison-section`: background verde translúcido
- `.follow-pick-info`: background amarillo translúcido

**Estados visuales:**
- `.active`: para elementos seleccionados
- `.visible`: para mostrar elementos hidden por defecto
- `.positive` / `.negative`: para profit coloreado

**Utility classes:**
- Flex utilities: `.flex`, `.flex-col`, `.items-center`, etc.
- Spacing: `.m-0`, `.mt-8`, `.px-16`, etc.
- Display: `.block`, `.hidden`
- Accessibility: `.sr-only`

**Responsive (max-width: 768px):**
- Navbar: flex-direction column
- Grids: colapsan a 1 columna
- Tables: font-size reducido
- Filters: full width stacked
- Tabs: scroll horizontal

**Patrones de uso:**
- Status colors con rgba y opacity variables para backgrounds translúcidos
- Focus states con box-shadow ring en primary color
- Transitions en `all` para efectos suaves
- Transform para hover effects (translateY, rotate)

## Comandos importantes

**Desarrollo local:**
- Servidor local con Firebase : firebase serve

- Emuladores de Firebase : firebase emulators:start

**Deploy:**
- Deploy manual :
firebase deploy

- Deploy automático:
git push origin main


## Dependencias externas

- **Firebase SDK**: v9+ (modular)
- **SVG Icons**: Lucide
- **Charts**: Chart.js

## Configuración Firebase

- **Hosting**: configurado en firebase.json
- **Firestore**: reglas en firestore.rules
- **Índices**: definidos en firestore.indexes.json
- **Proyecto**: alias configurado en .firebaserc

## Seguridad

- `firebase.config.js` está en .gitignore
- Se usa `firebase.config.example.js` como template
- Reglas de Firestore: restricción por usuario propietario

## Problemas conocidos

**Bugs pendientes:**
- Ajustar tamaños y colores de charts

**Mejoras planificadas:**
- Unificar historial follows y estadísticas follow
- Falta especificidad en los stakes de follow, están en ranges
- Subida de imágenes y OCR
- Añadir Bookie
- Remove tipster y pick
- Import y export de Excel

## Notas para el agente

- **Prioridad**: mantener seguridad de Firebase, optimización y UX
- **Evitar**: exponer credenciales, romper reglas de Firestore
- **Al modificar CSS**: mantener consistencia visual
- **Al modificar JS**: respetar la estructura modular y las dependencias entre módulos
- **Imports/Exports**: asegurarse de que cada módulo exporte correctamente sus funciones y variables
- **app.js**: es el orquestador, debe importar e inicializar todos los módulos necesarios
- **Deploy**: está automatizado vía GitHub Actions, los cambios en main se despliegan automáticamente
- **Iconos**: usar Lucide Icons cuando sea posible, los logos son SVG personalizados
- **Modularización**: cada archivo tiene una responsabilidad única y clara
- **Estado compartido**: usar `core/state.js` para variables globales compartidas entre módulos

---

## 🚀 Migración a React - Instrucciones de Trabajo

### Estructura del Repositorio

A partir del 14/11/2025, el repositorio contiene **DOS proyectos**:

```
tipster-tracker/
├── public/              # ← Proyecto ORIGINAL (vanilla JS)
│   ├── index.html
│   ├── assets/
│   └── js/
├── react-app/           # ← Proyecto REACT (migración en progreso) ✨
│   ├── src/
│   │   ├── features/
│   │   ├── shared/
│   │   ├── core/
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── AGENTS.md            # Documentación proyecto original
├── MIGRATION-GUIDE.md   # Guía detallada de migración
└── firebase.json        # Configuración Firebase compartida
```

### Trabajar con el Proyecto React desde Otra Máquina

#### 1. Clonar el repositorio

```bash
# Clonar el repo
git clone git@github.com:Panigc93/tipster-tracker.git
cd tipster-tracker

# Cambiar a la rama de migración
git checkout migration/phase-0-setup
```

#### 2. Configurar el proyecto React

```bash
# Entrar al directorio del proyecto React
cd react-app/

# Instalar dependencias
npm install
```

#### 3. Configurar variables de entorno

```bash
# Copiar template de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Firebase
# Usar el mismo firebaseConfig que está en public/js/config/firebase.config.js
nano .env  # o el editor que prefieras
```

El archivo `.env` debe contener:
```env
VITE_FIREBASE_API_KEY=AIzaSyAyab7F6Y82stOiNX_wlDwWxljWi4MXD6o
VITE_FIREBASE_AUTH_DOMAIN=tipstertracker-b5e3c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tipstertracker-b5e3c
VITE_FIREBASE_STORAGE_BUCKET=tipstertracker-b5e3c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=389145799541
VITE_FIREBASE_APP_ID=1:389145799541:web:ac0e151c694ca9ad41c13c
VITE_FIREBASE_MEASUREMENT_ID=G-NWLSKMMLP5
```

⚠️ **IMPORTANTE**: El archivo `.env` **NO** debe subirse a Git. Ya está en `.gitignore`.

#### 4. Ejecutar el proyecto React

```bash
# Desde react-app/
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

#### 5. Comandos útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (http://localhost:5173)

# Linting y formateo
npm run lint             # Verificar código con ESLint
npm run lint:fix         # Auto-fix de errores de ESLint
npm run format           # Formatear código con Prettier
npm run format:check     # Verificar formato sin modificar

# Build
npm run build            # Build para producción
npm run preview          # Preview del build

# Testing (cuando se implemente)
npm run test             # Ejecutar tests
```

#### 6. Ejecutar proyecto original (vanilla JS) en paralelo

Si necesitas comparar o probar ambas versiones:

```bash
# En otra terminal, desde la raíz del proyecto
cd tipster-tracker/
firebase emulators:start --import=./emulator-data --export-on-exit
```

- **Proyecto vanilla JS**: http://localhost:5000
- **Proyecto React**: http://localhost:5173
- **Firebase Emulator UI**: http://localhost:4000

### Stack Tecnológico del Proyecto React

- **React 19** - Framework UI
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool ultrarrápido
- **Tailwind CSS 3** - Sistema de diseño
- **Firebase SDK 12.6** - Backend (Auth + Firestore)
- **React Router 7.9** - Routing
- **Chart.js 4.5** - Gráficos
- **Lucide React 0.553** - Iconografía
- **ESLint 9 + Prettier 3.6** - Linting y formateo
- **Husky 9 + lint-staged 16** - Git hooks

### Arquitectura Feature-Based

El proyecto React sigue una arquitectura basada en features con principios SOLID:

```
react-app/src/
├── features/           # Módulos por funcionalidad
│   ├── auth/          # Autenticación
│   ├── tipsters/      # Gestión de tipsters
│   ├── picks/         # Gestión de picks
│   ├── follows/       # Seguimiento de picks
│   └── dashboard/     # Dashboard y estadísticas
├── shared/            # Código compartido
│   ├── components/    # Componentes UI reutilizables
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios base
│   ├── types/         # TypeScript types globales
│   └── utils/         # Utilidades
├── core/              # Configuración
│   ├── config/        # Firebase, env vars
│   ├── providers/     # Context providers
│   └── routing/       # React Router
└── assets/            # Imágenes, fonts
```

### Estado de la Migración

- ✅ **Fase 0**: Setup inicial completado (14/11/2025)
  - Proyecto React con TypeScript configurado
  - Tailwind CSS con design system
  - ESLint + Prettier + Husky
  - Estructura de carpetas feature-based
  - Firebase configurado
  - Path aliases de TypeScript

- ✅ **Fases 1-5**: Completadas (100%)
  - Tipos TypeScript y Repository Pattern
  - Features: Auth, Tipsters, Picks
  - Todas las funcionalidades base migradas

- ✅ **Fase 6**: Feature Follows (100% completada)
  - ✅ CRUD completo de follows
  - ✅ MyPicksPage con estadísticas y filtros
  - ✅ Integración en TipsterDetailPage
  - ✅ Botón "Seguir" en PickTableRow
  - ✅ Sección follow en AddPickModal
  - ✅ Sistema de comparación Match/Diverge

- 🔄 **Fase 8.5**: Tareas Adicionales (en progreso - 5/11)
  - ✅ Task 1: Reset Tipster (commit 9007614)
  - ✅ Task 2: Date Range Filters (commit 31a8575)
  - ✅ Task 3: Documentation (commit 7591b0d)
  - ✅ Task 4: Column Sorting (commits 1ec71f8, 2720629, 06b84fe)
  - ✅ **Task 5A: Excel Export Template (commits 44c5340, 1f2a0ae - 19/11/2025) - COMPLETADA 100%**
    * ✅ 6 sheets: Realizadas, Lanzadas Tipster, Mis_Picks_Dashboard, Tipster_Picks_Dashboard, Base datos, 📖 INSTRUCCIONES
    * ✅ Dashboard sports expanded: 7→16 columns (N-AC) matching Base datos
    * ✅ Sports synchronized: Badminton, Baloncesto, Balonmano, Beisbol, Boxeo, Ciclismo, Esports, Fútbol, Fútbol Americano, Golf, Hockey, MMA, Tenis, Tenis Mesa, Voleibol
    * ✅ Arial font applied globally to all sheets
    * ✅ All formulas: Row 2 stats, data rows, dashboard SUMIF/COUNTIFS (rows 3-100)
    * ✅ Complete styling: Colors, fonts, borders, conditional formatting
    * ✅ 7 working dropdowns per data sheet (showDropDown=False for LibreOffice compatibility)
    * ✅ Dynamic TIPSTER dropdowns synced with dashboards
    * ✅ Dashboard-first workflow documented in Instructions sheet
    * ✅ **Technical Implementation**:
      - TypeScript (excelExport.ts): Structure generation with xlsx library
      - Python (add-excel-styles.py): Post-processing with openpyxl for styles/formulas/dropdowns
      - 29 columns per dashboard (A-AC): 13 stats + 16 sports
      - Formula pattern: `=IFERROR(((COUNTIFS(sheet!$B$,tipster,sheet!$E$,"W",sheet!$DEPORTE$,sport))/$H),0)`
      - Merged cells: N1:AC1 "% Aciertos Segun deporte"
      - Column widths optimized for each sport name length
      - Conditional formatting: Red (<0), Green (>0) for profit columns
    * ✅ **Files Generated**:
      - `EXCEL-TEMPLATE-16-SPORTS-ARIAL.xlsx` (50KB, final version)
      - `EXCEL-FINAL-CON-ARIAL.xlsx` (46KB, previous 7-sports version)
      - Backup files with `.backup.xlsx` extension
    * ⏳ **Pending UI Integration**:
      - Add single "Export to Excel" button in navbar/header (global access)
      - Button will export ALL data: picks from all tipsters + user follows
      - Uses `generateEmptyTemplate()` + Python post-processing
      - Downloads file with current date: `tipster-tracker-export-YYYY-MM-DD.xlsx`
      - No filters applied - exports complete dataset for external analysis
  - ⏳ Task 5B: Import from Excel (0%)
  - ⏳ Tasks 6-11: Not started

### Decisiones de Diseño UX - Fase 6

#### Tab "Mis Estadísticas" en TipsterDetailPage

**Decisión (18/11/2025)**: Refactor del layout para centrar el foco en las estadísticas del usuario.

**Problema identificado**:
- El diseño original mostraba comparación lado a lado (Tipster vs Usuario)
- Enfoque en diferencias, no en el rendimiento propio
- Stats del tipster ya están disponibles en el tab "Estadísticas"
- El usuario quiere saber: "¿Cómo me está yendo siguiendo a este tipster?"

**Solución implementada**:
```
┌─────────────────────────────────────────────┐
│  Sección 1: Seguibilidad (3 stat-cards)     │
│  • Total Picks del Tipster                  │
│  • Picks Seguidos por Ti                    │
│  • Tasa de Seguibilidad (%)                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Sección 2: Tus Stats de Seguimiento        │
│  Grid de 7 stat-cards:                      │
│  • Total Follows                            │
│  • Ganados                                  │
│  • Perdidos                                 │
│  • Winrate (%)                              │
│  • Yield (%)                                │
│  • Profit Total (unidades)                  │
│  • Match Rate vs Tipster (%)                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Sección 3: Resumen Comparativo (1 card)    │
│  Badge visual con mensaje:                  │
│  🟢 "Superando al tipster en +2.5% yield"   │
│  🔴 "Por debajo del tipster en -1.2% yield" │
│  ⚪ "Mismo rendimiento que el tipster"       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Sección 4: Historial (tabla completa)      │
│  Tabla comparativa de todos los follows     │
│  con acciones: Editar, Eliminar             │
└─────────────────────────────────────────────┘
```

**Ventajas**:
- ✅ Foco en las estadísticas del usuario (user-centric)
- ✅ Información del tipster disponible en otro tab
- ✅ Comparación como resumen breve y visual
- ✅ Layout más claro y organizado
- ✅ Toda la información relevante accesible

#### Expansión de Deportes en Dashboards - Task 5A (19/11/2025)

**Contexto**: El usuario solicitó sincronizar las columnas de deportes entre Base datos (16 deportes) y los dashboards (7 deportes).

**Problema identificado**:
- Base datos tenía 16 deportes: Badminton, Baloncesto, Balonmano, Beisbol, Boxeo, Ciclismo, Esports, Fútbol, Fútbol Americano, Golf, Hockey, MMA, Tenis, Tenis Mesa, Voleibol
- Dashboards solo tenían 7 deportes fijos: TENIS, BALONCESTO, TENIS MESA, FUTBOL, UFC, NFL, CABALLOS
- Nombres inconsistentes: UFC vs MMA, NFL vs Fútbol Americano
- Si usuario añadía pick de "Golf" → no aparecía en dashboard

**Decisión de diseño**:
- Mantener estructura de columnas A-M (13 stats) sin cambios
- Expandir columnas N-AC (16 deportes) sincronizadas con Base datos
- Actualizar nombres: UFC→MMA, NFL→Fútbol Americano
- Eliminar: CABALLOS (no está en Base datos)
- Añadir 9 deportes nuevos: Badminton, Balonmano, Beisbol, Boxeo, Ciclismo, Esports, Golf, Hockey, Voleibol

**Implementación técnica**:

1. **excelExport.ts** (TypeScript):
   ```typescript
   // Mis_Picks_Dashboard y Tipster_Picks_Dashboard
   // Headers: 16 deportes en columnas N-AC
   const sportHeaders = ['Badminton', 'Baloncesto', 'Balonmano', 'Beisbol', 
                        'Boxeo', 'Ciclismo', 'Esports', 'Fútbol', 
                        'Fútbol Americano', 'Golf', 'Hockey', 'MMA', 
                        'Tenis', 'Tenis Mesa', 'Voleibol'];
   
   // Fórmulas N3-AC3: Porcentaje de aciertos por deporte
   ws.N3 = { 
     t: 'n', 
     f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,N$2))/$H3),0)', 
     v: 0 
   };
   // ... hasta AC3
   
   // Column widths: Optimizados por longitud de nombre
   ws['!cols'] = [
     // ... A-M sin cambios
     { wch: 10 }, // N: Badminton
     { wch: 12 }, // O: Baloncesto
     { wch: 12 }, // P: Balonmano
     { wch: 10 }, // Q: Beisbol
     { wch: 8 },  // R: Boxeo
     { wch: 10 }, // S: Ciclismo
     { wch: 10 }, // T: Esports
     { wch: 10 }, // U: Fútbol
     { wch: 14 }, // V: Fútbol Americano
     { wch: 8 },  // W: Golf
     { wch: 10 }, // X: Hockey
     { wch: 8 },  // Y: MMA
     { wch: 10 }, // Z: Tenis
     { wch: 12 }, // AA: Tenis Mesa
     { wch: 10 }, // AB: Voleibol
   ];
   ```

2. **add-excel-styles.py** (Python - openpyxl):
   ```python
   # Merged cell actualizada para 16 deportes
   ws.merge_cells('N1:AC1')  # Antes: N1:W1
   ws['N1'].value = '% Aciertos Segun deporte'
   ws['N1'].fill = black_fill
   ws['N1'].font = white_font
   
   # Aplicar estilos a todas las columnas N-AC
   for col_letter in ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 
                      'X', 'Y', 'Z', 'AA', 'AB', 'AC']:
       # Headers (fila 2): amarillo
       ws[f'{col_letter}2'].fill = yellow_fill
       ws[f'{col_letter}2'].font = small_font
       ws[f'{col_letter}2'].alignment = center_alignment
       ws[f'{col_letter}2'].border = thin_border
       
       # Data cells (filas 3-100): bordes negros
       for row in range(3, 101):
           ws[f'{col_letter}{row}'].border = thin_border
           ws[f'{col_letter}{row}'].font = small_font
           ws[f'{col_letter}{row}'].alignment = center_alignment
   ```

3. **Fórmulas dinámicas**:
   - Fila 3: Template con referencia relativa a header ($2)
   - Filas 4-100: Copiadas automáticamente por Python
   - Función `copy_dashboard_formulas()` extiende formulas N3-AC3 → N4:AC100
   - Resultado: Al añadir tipster en fila 4, todas las 29 columnas se calculan

**Testing realizado**:
- ✅ Generación exitosa de Excel con 29 columnas
- ✅ Fórmulas correctas en ambos dashboards
- ✅ Merge cell N1:AC1 correcto
- ✅ Estilos aplicados (yellow headers, borders)
- ✅ Arial font en todas las celdas
- ✅ Column widths optimizados
- ✅ Archivo final: `EXCEL-TEMPLATE-16-SPORTS-ARIAL.xlsx` (50KB)

**Resultado**:
- Dashboards ahora soportan 16 deportes sincronizados con Base datos
- Usuario puede añadir pick de cualquier deporte → aparece en dashboard
- Fórmulas automáticas calculan winrate por deporte para cada tipster
- Template extensible: si Base datos añade deporte 17, solo modificar arrays

**Trabajo Pendiente - UI Integration**:

1. **Botón "Export to Excel" (Único en toda la app)**:
   - **Ubicación**: Navbar superior (acceso global desde cualquier vista)
   - **Funcionalidad**: Exporta TODOS los datos del usuario
     * Todas las picks de todos los tipsters → Sheet "Lanzadas Tipster"
     * Todos los follows del usuario → Sheet "Realizadas"
     * Dashboards con tipsters únicos y sus estadísticas calculadas
   - **Comportamiento**:
     * Click → Genera Excel en memoria
     * Aplica Python post-processing (estilos + fórmulas + dropdowns)
     * Descarga archivo: `tipster-tracker-export-YYYY-MM-DD.xlsx`
   - **Sin filtros**: Exporta dataset completo para análisis externo en Excel
   - **Implementación**: Usar función `exportPicksToExcel(picks, follows)` en `excelExport.ts`

2. **Flujo técnico**:
   ```typescript
   // En Navbar.tsx o Header.tsx
   const handleExportToExcel = async () => {
     const picks = await pickRepository.findAll();
     const follows = await followRepository.findAll();
     exportPicksToExcel(picks, follows); // Genera y descarga
   };
   ```

3. **Ventajas de un único botón**:
   - UX simple y clara (no múltiples opciones que confundan)
   - Export completo permite análisis personalizado en Excel
   - Usuario puede filtrar/ordenar en Excel según necesite
   - Botón siempre accesible desde cualquier página

### Documentación Adicional

- **MIGRATION-GUIDE.md**: Guía completa de todas las fases de migración
- **react-app/README.md**: Documentación específica del proyecto React
- **AGENTS.md**: Este documento (proyecto original + migración)
