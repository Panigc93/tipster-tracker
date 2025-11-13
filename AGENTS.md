# AGENTS.md

## Resumen del proyecto
Aplicación web con Firebase para seguibilidad de tipsters

**Stack principal:**
- Frontend: HTML5, CSS3, JavaScript vanilla
- Backend/BaaS: Firebase (Firestore, Hosting, Authentication)
- Iconos: SVG personalizados + Lucide
- Deploy: Firebase Hosting
- Control de versiones: GitHub con GitHub Actions

## Estructura de archivos

```python
├── .firebase/ # Configuración local de Firebase
├── .github/
│ └── workflows/
│ └── firebase-hosting-main.yml # CI/CD automático
├── emulator-data/ # Datos del emulador de Firebase
├── firebase/ # Archivos de configuración Firebase
├── public/ # Directorio servido por Firebase Hosting
│ ├── assets/
│ │ ├── css/
│ │ │ └── style.css # Estilos principales
│ │ └── img/
│ │ ├── icon.svg # Icono de la app
│ │ ├── logo-filled-text.svg
│ │ └── logo-filled.svg
│ ├── js/
│ │ ├── config/
│ │ │ ├── firebase.config.js # Config real (en .gitignore)
│ │ │ └── firebase.config.example.js # Template de configuración
│ │ ├── core/
│ │ │ ├── init.js # Inicialización Firebase y variables globales
│ │ │ ├── auth.js # Auth listeners y funciones de autenticación
│ │ │ └── state.js # Estado global de la app
│ │ ├── data/
│ │ │ ├── constants.js # Arrays: allSports, allBookmakers, sportIcons, chartColors
│ │ │ └── listeners.js # onSnapshot listeners (tipsters, picks, follows)
│ │ ├── services/
│ │ │ ├── tipster.service.js # CRUD Firestore de tipsters
│ │ │ ├── pick.service.js # CRUD Firestore de picks
│ │ │ └── follow.service.js # CRUD Firestore de follows
│ │ ├── utils/
│ │ │ ├── calculations.js # Yield, winrate, profit, seguibilidad
│ │ │ ├── filters.js # Lógica de filtrado (dashboard, picks)
│ │ │ ├── ui-helpers.js # showLoading, confirm, closeModal
│ │ │ └── date-utils.js # Formateo de fechas ISO
│ │ ├── views/
│ │ │ ├── dashboard.js # renderDashboard + filtros dashboard
│ │ │ ├── all-picks.js # renderAllPicks + filtros all picks
│ │ │ ├── my-picks.js # renderMyPicks + filtros mis picks
│ │ │ └── tipster-detail.js # renderTipsterDetail + tabs + charts
│ │ ├── modals/
│ │ │ ├── tipster-modal.js # showAddTipsterModal, handleAddTipster
│ │ │ ├── pick-modal.js # showAddPickModal, handleAddPick, showEditPickModal
│ │ │ └── follow-modal.js # showFollowPickModal, handleFollow
│ │ └── app.js # Punto de entrada (imports + init)
│ ├── index.html # Punto de entrada principal
│ ├── .firebaserc # Alias de proyectos Firebase
│ └── firebase.json # Configuración de hosting
├── .gitignore # Excluye firebase.config.js y otros
├── firebase-debug.log # Logs de desarrollo
├── firestore-debug.log # Logs de Firestore
├── firestore.indexes.json # Índices de Firestore
├── firestore.rules # Reglas de seguridad de Firestore
├── package.json # Dependencias del proyecto
└── AGENTS.md # Este archivo (documentación para IA)
```


## Archivos clave

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
- `--radius-sm: 6px`
- `--radius-base: 8px`
- `--radius-md: 10px`
- `--radius-lg: 12px`
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
