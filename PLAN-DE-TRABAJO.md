# 📋 Plan de Trabajo - Migración React Tipster Tracker

**Fecha actualización**: 17 de Noviembre de 2025  
**Estrategia**: Opción B - Crear Design System mínimo primero, luego continuar con Fase 3

---

## 🎯 Decisión Estratégica

### Opción Elegida: B - Design System Primero

**Razonamiento**:
- Los componentes Button, Input, Card y Alert se reutilizarán en TODAS las features
- Crearlos ahora evita duplicación de esfuerzo
- Garantiza consistencia visual desde el inicio
- Tiempo estimado: ~40 minutos
- Ahorro de tiempo en el largo plazo: varias horas

### Alternativa Descartada: A - HTML Native Temporal
- Requeriría crear forms con HTML native
- Luego refactorizar TODO cuando se cree el Design System
- Duplica el esfuerzo
- Inconsistencia temporal

---

## 📊 Estado Actual

### ✅ Completado

**Phase 1**: Fundamentos y Abstracciones (100%)
- 7 tareas completadas
- 6,516 líneas de código
- 42 archivos nuevos
- 11 commits (fa34e3b → f3218da)
- 8/8 tests de verificación pasando

**Phase 3 - Auth Foundation** (Tasks 1-5, 55%)
- ✅ Task 1: Estructura de carpetas auth
- ✅ Task 2: Tipos TypeScript (User, LoginCredentials, SignupData, AuthState, AuthErrorCode)
- ✅ Task 3: Auth Service (IAuthService interface + FirebaseAuthService)
- ✅ Task 4: AuthContext y AuthProvider con gestión de estado
- ✅ Task 5: useAuth custom hook
- **Commit**: 6c02cf1 (10 files, 466 lines)
- **ESLint**: 0 errors

---

## 🚀 Plan de Ejecución

### MINI-FASE 2: Design System Mínimo (~40 minutos)

**Objetivo**: Crear 4 componentes UI esenciales que desbloquean el desarrollo de Auth

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

#### Tarea 5: Barrel Exports y Documentación (~5 min)
```
📁 src/shared/components/ui/
└── index.ts           # Export all components

README con:
- Ejemplos de uso
- Props disponibles
- Variantes visuales
```

**Total estimado**: 45 minutos

---

### CONTINUAR FASE 3: Auth UI (Tasks 6-10)

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

## 📅 Timeline Completo

| Fase | Tareas | Tiempo | Estado |
|------|--------|--------|--------|
| Phase 1 | Fundamentos (7 tasks) | - | ✅ Completado |
| Phase 3 (Auth) | Tasks 1-5 (Foundation) | - | ✅ Completado |
| **MINI-FASE 2** | **4 componentes UI** | **~40 min** | **⏳ PRÓXIMO** |
| Phase 3 (Auth) | Tasks 6-10 (UI) | ~85 min | 🔜 Después |
| Phase 2 (Full) | Design System completo | TBD | ⏸️ Pendiente |
| Phase 4 | Feature Tipsters | TBD | 📋 Por hacer |
| Phase 5 | Feature Picks | TBD | 📋 Por hacer |
| Phase 6 | Feature Follows | TBD | 📋 Por hacer |
| Phase 7 | Dashboard | TBD | 📋 Por hacer |

---

## 🎯 Próximos Pasos Inmediatos

### Paso 1: MINI-FASE 2 - Button Component
1. Crear estructura `src/shared/components/ui/Button/`
2. Implementar `Button.tsx` con variantes y estados
3. Crear `Button.types.ts` con interface ButtonProps
4. Crear barrel export `index.ts`
5. Verificar con ESLint

### Paso 2: MINI-FASE 2 - Input Component
1. Crear estructura `src/shared/components/ui/Input/`
2. Implementar `Input.tsx` con tipos y validación
3. Crear `Input.types.ts` con interface InputProps
4. Implementar toggle de password visibility
5. Crear barrel export `index.ts`
6. Verificar con ESLint

### Paso 3: MINI-FASE 2 - Card Component
1. Crear estructura `src/shared/components/ui/Card/`
2. Implementar `Card.tsx` simple
3. Crear `Card.types.ts`
4. Crear barrel export
5. Verificar con ESLint

### Paso 4: MINI-FASE 2 - Alert Component
1. Crear estructura `src/shared/components/ui/Alert/`
2. Implementar `Alert.tsx` con variantes
3. Crear `Alert.types.ts`
4. Añadir iconos con Lucide React
5. Implementar dismiss functionality
6. Crear barrel export
7. Verificar con ESLint

### Paso 5: MINI-FASE 2 - Integración
1. Crear `src/shared/components/ui/index.ts` (barrel)
2. Actualizar path aliases si es necesario
3. Crear README.md con ejemplos
4. **Commit**: `feat(mini-phase-2): implement base UI components`

### Paso 6: Continuar Phase 3
1. Implementar LoginForm usando Button, Input, Alert
2. Implementar SignupForm
3. Implementar ForgotPasswordForm
4. ... (Tasks 7-10)

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

3. **Consistencia Visual**:
   - Usar variables de Tailwind CSS existentes
   - Mantener dark theme del proyecto original
   - Seguir convenciones de naming

### 🔧 Configuración Técnica

- **TypeScript**: Strict mode, interfaces para props
- **Tailwind CSS**: Ya configurado, usar utility classes
- **Lucide React**: Ya instalado, usar para iconos
- **ESLint**: 0 errors required antes de commit
- **Git**: Commits descriptivos con file counts

---

## 🎨 Referencias de Diseño

### Paleta de Colores (del proyecto original)
```css
Primary: #3B82F6 (azul)
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
