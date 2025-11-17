# 📋 Plan de Trabajo - Migración React Tipster Tracker

**Fecha actualización**: 17 de Noviembre de 2025  
**Estrategia**: Design System completo antes de features adicionales

---

## ⚠️ IMPORTANTE: Orden Real de Fases

### Cambio de Estrategia Ejecutado:

Originalmente: Phase 1 → Phase 2 → Phase 3 → Phase 4...

**Decisión tomada**: Saltamos a Phase 3 (Auth) primero, pero necesitábamos componentes UI.

**Solución**: Crear MINI-Phase 2 con 4 componentes esenciales para desbloquear Auth.

### Orden REAL de Ejecución:

1. ✅ **Phase 1** - Fundamentos y Abstracciones
2. ✅ **MINI-Phase 2** - 4 componentes UI básicos (Button, Input, Card, Alert)
3. ✅ **Phase 3** - Feature Authentication (completa)
4. 🔄 **Phase 2 COMPLETA** - Terminar Design System (EN CURSO)
5. 📋 **Phase 4** - Feature Tipsters
6. 📋 **Phase 5** - Feature Picks  
7. 📋 **Phase 6** - Feature Follows
8. 📋 **Phase 7** - Dashboard

---

## 🎯 Decisión Estratégica Original

### Opción Elegida: B - Design System Primero (Mínimo)

**Razonamiento para MINI-Phase 2**:
- Solo 4 componentes esenciales: Button, Input, Card, Alert
- Desbloquear Phase 3 (Auth) inmediatamente
- Tiempo: ~40 minutos
- **NO es el Design System completo**

### Ahora: Completar Phase 2

**Razonamiento**:
- Terminar todos los componentes antes de continuar con features
- Evitar crear componentes "sobre la marcha" en Phases 4-7
- Mantener consistencia y calidad del código

---

## 📊 Estado Actual

### ✅ COMPLETADO

**Phase 1**: Fundamentos y Abstracciones (100%)
- 7 tareas completadas
- 6,516 líneas de código
- 42 archivos nuevos
- 11 commits (fa34e3b → f3218da)
- 8/8 tests de verificación pasando
- **Commit final**: f3218da

**MINI-Phase 2**: Design System Básico (100%)
- 4 componentes UI: Button, Input, Card, Alert
- 14 archivos (13 TS/TSX + 1 README)
- 567 líneas de código
- 0 errores ESLint
- **Commit**: 5a135a6

**Phase 3**: Feature Authentication (100%)
- Auth foundation (types, service, provider, hook)
- Auth forms (LoginForm, SignupForm, ForgotPasswordForm)
- Auth pages (LoginPage, SignupPage)
- PrivateRoute component
- React Router v7 integration
- 32 archivos TypeScript/TSX
- ~1,370 líneas de código
- **Commits**: 6c02cf1 (foundation) + e11b734 (complete)

### 🔄 EN CURSO

**Phase 2 COMPLETA**: Design System Full
- Completar componentes restantes
- Modal, Dropdown, Table, Badge, Spinner, Toast
- Layout components
- **PRIORIDAD ACTUAL**

---

## 🚀 Plan de Ejecución - PHASE 2 COMPLETA

### ✅ MINI-FASE 2 Completada: Design System Básico

**Componentes creados** (Commit 5a135a6):
- ✅ Button component
- ✅ Input component  
- ✅ Card component
- ✅ Alert component

---

### 🔄 PHASE 2 COMPLETA: Componentes Restantes (~3-4 horas)

**Objetivo**: Completar el Design System con todos los componentes necesarios para Phases 4-7

#### Tarea 1: Button Component (~10 min)
```
📁 src/shared/components/ui/Button/
├── Button.tsx          # Componente principal
├── Button.types.ts     # Props interface
└── index.ts           # Barrel export

Variantes:
- primary (azul)
- secondary (gris)
- outline (borde)
- danger (rojo)

Tamaños:
- sm, md, lg

Estados:
- disabled
- loading (con spinner)
```

#### Tarea 2: Input Component (~15 min)
```
📁 src/shared/components/ui/Input/
├── Input.tsx
├── Input.types.ts
└── index.ts

Tipos:
- text
- email
- password (con toggle visibility)

Estados:
- normal
- error (borde rojo + mensaje)
- disabled

Features:
- Label integrado
- Error message
- Password visibility toggle
```

#### Tarea 3: Card Component (~5 min)
```
📁 src/shared/components/ui/Card/
├── Card.tsx
├── Card.types.ts
└── index.ts

Variantes:
- default (con padding, border, shadow)
- Con header opcional
- Con footer opcional
```

#### Tarea 4: Alert Component (~10 min)
```
📁 src/shared/components/ui/Alert/
├── Alert.tsx
├── Alert.types.ts
└── index.ts

Variantes:
- error (rojo)
- success (verde)
- warning (naranja)
- info (azul)

Features:
- Dismissible (X button)
- Icon según tipo
```

---

### 📋 PHASE 2 COMPLETA - Lista de Componentes Pendientes

#### 1. Modal Component (~30 min)
```
📁 src/shared/components/ui/Modal/
├── Modal.tsx
├── Modal.types.ts
└── index.ts

Features:
- Overlay con backdrop blur
- Close button (X)
- Header, Body, Footer sections
- Tamaños: sm, md, lg, xl, full
- Dismissible (click outside / ESC key)
- Animaciones de entrada/salida
- Portal rendering
```

#### 2. Dropdown/Select Component (~30 min)
```
📁 src/shared/components/ui/Dropdown/
├── Dropdown.tsx
├── Dropdown.types.ts
└── index.ts

Features:
- Single select
- Multi-select (checkboxes)
- Search/filter
- Custom trigger button
- Positioning (top, bottom, left, right)
- Max height con scroll
- Keyboard navigation
```

#### 3. Table Component (~40 min)
```
📁 src/shared/components/ui/Table/
├── Table.tsx
├── Table.types.ts
└── index.ts

Features:
- Header con sort
- Zebra striping / hover
- Responsive (scroll horizontal)
- Empty state
- Loading state
- Pagination (opcional)
- Row actions
```

#### 4. Badge Component (~15 min)
```
📁 src/shared/components/ui/Badge/
├── Badge.tsx
├── Badge.types.ts
└── index.ts

Features:
- Variantes: default, success, error, warning, info
- Tamaños: sm, md, lg
- Dots/icons
- Dismissible (X)
- Pill style
```

#### 5. Spinner/Loading Component (~15 min)
```
📁 src/shared/components/ui/Spinner/
├── Spinner.tsx
├── Spinner.types.ts
└── index.ts

Features:
- Variantes: circular, dots, bars
- Tamaños: sm, md, lg, xl
- Colors customizables
- Text label opcional
- Full page overlay variant
```

#### 6. Toast/Notification Component (~30 min)
```
📁 src/shared/components/ui/Toast/
├── Toast.tsx
├── Toast.types.ts
├── ToastContainer.tsx
├── useToast.ts (hook)
└── index.ts

Features:
- Variantes: success, error, warning, info
- Posiciones: top-left, top-center, top-right, bottom-*
- Auto-dismiss con timer
- Progress bar
- Stack múltiples toasts
- Dismissible
- Custom hook para trigger
```

#### 7. Tabs Component (~25 min)
```
📁 src/shared/components/ui/Tabs/
├── Tabs.tsx
├── Tab.tsx
├── TabPanel.tsx
├── Tabs.types.ts
└── index.ts

Features:
- Horizontal / vertical
- Underline / pills / boxed styles
- Active state
- Disabled tabs
- Icon + text
- Keyboard navigation
```

#### 8. Checkbox Component (~15 min)
```
📁 src/shared/components/ui/Checkbox/
├── Checkbox.tsx
├── Checkbox.types.ts
└── index.ts

Features:
- Checked / unchecked / indeterminate
- Label integrado
- Disabled state
- Error state
- Tamaños: sm, md, lg
```

#### 9. Radio Component (~15 min)
```
📁 src/shared/components/ui/Radio/
├── Radio.tsx
├── RadioGroup.tsx
├── Radio.types.ts
└── index.ts

Features:
- RadioGroup con value control
- Label integrado
- Disabled state
- Error state
- Horizontal / vertical layout
```

#### 10. Switch/Toggle Component (~15 min)
```
📁 src/shared/components/ui/Switch/
├── Switch.tsx
├── Switch.types.ts
└── index.ts

Features:
- On/off state
- Label integrado
- Disabled state
- Tamaños: sm, md, lg
- Loading state
```

#### 11. Textarea Component (~15 min)
```
📁 src/shared/components/ui/Textarea/
├── Textarea.tsx
├── Textarea.types.ts
└── index.ts

Features:
- Auto-resize opcional
- Character counter
- Max length
- Error state
- Disabled state
- Resize: none, vertical, horizontal, both
```

#### 12. Divider Component (~10 min)
```
📁 src/shared/components/ui/Divider/
├── Divider.tsx
├── Divider.types.ts
└── index.ts

Features:
- Horizontal / vertical
- Con texto en medio
- Estilos: solid, dashed, dotted
- Margins customizables
```

**Total Phase 2 Completa**: ~3-4 horas (12 componentes)

---

### ✅ FASE 3 COMPLETADA: Auth UI

**Una vez completada la Mini-Fase 2, continuar donde nos quedamos:**

#### Task 6: Form Components (~30 min)
```
📁 src/features/auth/components/
├── LoginForm/
│   ├── LoginForm.tsx          # Usando Button, Input, Alert
│   └── index.ts
├── SignupForm/
│   ├── SignupForm.tsx         # Usando Button, Input, Alert
│   └── index.ts
└── ForgotPasswordForm/
    ├── ForgotPasswordForm.tsx # Usando Button, Input, Alert
    └── index.ts

Características:
- Validación de formularios
- Manejo de errores con Alert
- Estados de loading
- useAuth hook integrado
```

#### Task 7: Pages (~20 min)
```
📁 src/features/auth/pages/
├── LoginPage/
│   ├── LoginPage.tsx          # Usando Card, LoginForm
│   └── index.ts
└── SignupPage/
    ├── SignupPage.tsx         # Usando Card, SignupForm
    └── index.ts

Layout:
- Centrado vertical y horizontal
- Logo de la app
- Links de navegación (login ↔ signup)
- ForgotPassword modal/link
```

#### Task 8: PrivateRoute (~15 min)
```
📁 src/features/auth/components/PrivateRoute/
├── PrivateRoute.tsx
└── index.ts

Lógica:
- Usar useAuth hook
- Si no hay user → redirect to /login
- Si loading → mostrar spinner
- Si hay user → render children
```

#### Task 9: React Router Integration (~20 min)
```
📁 src/core/routing/
├── routes.tsx             # Definición de rutas
└── AppRouter.tsx          # Router component

Rutas:
- /login → LoginPage
- /signup → SignupPage
- / → Dashboard (PrivateRoute)
- /tipsters → Tipsters (PrivateRoute)
- etc.

Integrar en App.tsx:
<AuthProvider>
  <AppRouter />
</AuthProvider>
```

**Total Phase 3 restante**: ~85 minutos

---

## 📅 Timeline Completo - ORDEN REAL

| Fase | Tareas | Tiempo | Estado |
|------|--------|--------|--------|
| Phase 1 | Fundamentos (7 tasks) | - | ✅ Completado (f3218da) |
| MINI-Phase 2 | 4 componentes UI básicos | ~40 min | ✅ Completado (5a135a6) |
| Phase 3 | Auth completa (Foundation + UI) | ~2h | ✅ Completado (6c02cf1 + e11b734) |
| **Phase 2 COMPLETA** | **12 componentes restantes** | **~3-4h** | **🔄 EN CURSO** |
| Phase 4 | Feature Tipsters | TBD | 📋 Siguiente |
| Phase 5 | Feature Picks | TBD | 📋 Por hacer |
| Phase 6 | Feature Follows | TBD | 📋 Por hacer |
| Phase 7 | Dashboard | TBD | 📋 Por hacer |

### ⚠️ RECORDATORIO IMPORTANTE

**ANTES de Phase 4**, debemos completar **Phase 2 COMPLETA**:
- Modal, Dropdown, Table, Badge, Spinner, Toast
- Tabs, Checkbox, Radio, Switch, Textarea, Divider
- **Total**: 12 componentes adicionales (~3-4 horas)

**Razón**: Evitar crear componentes "sobre la marcha" en Phases 4-7

---

## 🎯 Próximos Pasos Inmediatos - PHASE 2 COMPLETA

### Paso 1: Modal Component (~30 min)
1. Crear estructura `src/shared/components/ui/Modal/`
2. Implementar `Modal.tsx` con Portal
3. Implementar backdrop con blur
4. Implementar close handlers (X, outside click, ESC)
5. Crear animaciones enter/exit
6. Crear `Modal.types.ts`
7. Crear barrel export
8. Verificar con ESLint

### Paso 2: Dropdown Component (~30 min)
1. Crear estructura `src/shared/components/ui/Dropdown/`
2. Implementar `Dropdown.tsx`
3. Single select y multi-select modes
4. Search/filter functionality
5. Keyboard navigation
6. Crear `Dropdown.types.ts`
7. Crear barrel export
8. Verificar con ESLint

### Paso 3: Table Component (~40 min)
1. Crear estructura `src/shared/components/ui/Table/`
2. Implementar `Table.tsx` con composición (Table, Thead, Tbody, Tr, Th, Td)
3. Sort functionality en headers
4. Responsive scroll
5. Empty state y loading state
6. Crear `Table.types.ts`
7. Crear barrel export
8. Verificar con ESLint

### Paso 4: Badge Component (~15 min)
1. Crear estructura `src/shared/components/ui/Badge/`
2. Implementar `Badge.tsx` con variantes
3. Tamaños y estilos
4. Crear `Badge.types.ts`
5. Crear barrel export
6. Verificar con ESLint

### Paso 5: Spinner Component (~15 min)
1. Crear estructura `src/shared/components/ui/Spinner/`
2. Implementar `Spinner.tsx` con variantes
3. Animaciones CSS
4. Crear `Spinner.types.ts`
5. Crear barrel export
6. Verificar con ESLint

### Paso 6: Toast Component (~30 min)
1. Crear estructura `src/shared/components/ui/Toast/`
2. Implementar `Toast.tsx` y `ToastContainer.tsx`
3. Implementar `useToast` hook
4. Auto-dismiss timer
5. Stack múltiples toasts
6. Crear `Toast.types.ts`
7. Crear barrel export
8. Verificar con ESLint

### Paso 7: Tabs Component (~25 min)
1. Crear estructura `src/shared/components/ui/Tabs/`
2. Implementar composición (Tabs, Tab, TabPanel)
3. Active state management
4. Keyboard navigation
5. Crear `Tabs.types.ts`
6. Crear barrel export
7. Verificar con ESLint

### Paso 8-12: Form Components (~1 hora)
1. Checkbox
2. Radio + RadioGroup
3. Switch
4. Textarea
5. Divider

### Paso 13: Integración Final
1. Actualizar `src/shared/components/ui/index.ts` con todos los exports
2. Actualizar README.md con documentación completa
3. Verificar ESLint en todo ui/
4. **Commit**: `feat(phase-2): complete design system`
5. **Listo para Phase 4**

---

## 📝 Notas Importantes

### ⚠️ Recordatorios

1. **Phase 2 Completa Pendiente**: 
   - Este es solo un subconjunto MÍNIMO del Design System
   - La Phase 2 completa incluye: Modal, Dropdown, Table, Badge, Spinner, Toast, etc.
   - Se hará después de completar Phase 3

2. **Componentes Reutilizables**:
   - Button: Auth, Tipsters CRUD, Picks CRUD, Dashboard, Settings
   - Input: TODAS las features con formularios
   - Card: Dashboard stats, Tipster cards, Pick cards
   - Alert: Feedback en TODAS las features

### ✅ Criterios de Éxito

### ✅ MINI-FASE 2 Completada
- ✅ 4 componentes creados (Button, Input, Card, Alert)
- ✅ Todos los componentes tienen tipos TypeScript
- ✅ ESLint 0 errors
- ✅ Barrel exports configurados
- ✅ README con ejemplos
- ✅ Commit realizado (5a135a6)

### ✅ Phase 3 Completada
- ✅ Auth foundation (types, service, provider, hook)
- ✅ Auth forms (Login, Signup, ForgotPassword)
- ✅ Auth pages (LoginPage, SignupPage)
- ✅ PrivateRoute component
- ✅ React Router integrado
- ✅ ESLint 0 errors
- ✅ Commits realizados (6c02cf1 + e11b734)

### 🔄 Phase 2 COMPLETA - En Progreso

Criterios de completitud:
- [ ] 12 componentes adicionales creados
- [ ] Todos los componentes con tipos TypeScript
- [ ] ESLint 0 errors en todos
- [ ] Barrel exports actualizados
- [ ] README actualizado con documentación completa
- [ ] Tests básicos (opcional)
- [ ] Commit realizado
- [ ] **BLOQUEANTE**: No continuar a Phase 4 sin completar esto
Success: #10B981 (verde)
Error: #EF4444 (rojo)
Warning: #F59E0B (naranja)
Background: #0F172A (dark navy)
Surface: #1E293B (slate)
Text: #E0E0E0 (light gray)
```

### Tipografía
```css
Font: FKGroteskNeue, Geist, Inter, sans-serif
Sizes: 11px (xs) → 30px (4xl)
```

---

## ✅ Criterios de Éxito

### MINI-FASE 2 Completada Cuando:
- [ ] 4 componentes creados (Button, Input, Card, Alert)
- [ ] Todos los componentes tienen tipos TypeScript
- [ ] ESLint 0 errors
- [ ] Barrel exports configurados
- [ ] README con ejemplos
- [ ] Commit realizado
- [ ] Tiempo real ≈ 40-50 minutos

### Phase 3 Completada Cuando:
- [ ] 10 tareas completadas
- [ ] Login y Signup funcionales
- [ ] Rutas protegidas implementadas
- [ ] React Router integrado
- [ ] Usuario puede autenticarse end-to-end
- [ ] ESLint 0 errors
- [ ] Commits descriptivos
- [ ] Verificación manual exitosa

---

**Última actualización**: 17/11/2025 - 14:30  
**Autor**: GitHub Copilot  
**Estado**: Plan aprobado, listo para ejecutar
