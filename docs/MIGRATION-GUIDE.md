# MIGRATION GUIDE - Tipster Tracker
## Migración a React + SOLID + Feature-Based Architecture

---

## ⚠️ IMPORTANTE - COMANDOS DE DESARROLLO

**SIEMPRE trabajar en la carpeta `react-app/`:**

```bash
# ✅ CORRECTO - Proyecto React
cd /home/cgarciap/Escritorio/tipster-tracker/react-app
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # Build producción
npm run lint             # ESLint

# ❌ INCORRECTO - Raíz del proyecto
cd /home/cgarciap/Escritorio/tipster-tracker
npm run dev              # ⚠️ Esto levanta Firebase Emulators (puerto 5000)
```

---

## 📋 Índice
1. [Visión General de la Migración](#visión-general-de-la-migración)
2. [Objetivos de la Migración](#objetivos-de-la-migración)
3. [Principios Arquitectónicos](#principios-arquitectónicos)
4. [Roadmap de Fases](#roadmap-de-fases)

---

## Visión General de la Migración

### Estado Actual
- **Framework**: Vanilla JavaScript (ES6+ modules)
- **Arquitectura**: Modular por tipo de componente (services, views, modals, utils)
- **Estado**: Global mutable compartido
- **UI**: Manipulación directa del DOM
- **Estilos**: CSS vanilla con variables CSS

### Estado Objetivo
- **Framework**: React 18+ con TypeScript
- **Arquitectura**: Feature-based con principios SOLID
- **Estado**: Context API + Custom Hooks (preparado para Zustand/Redux si es necesario)
- **UI**: Componentes React funcionales
- **Estilos**: Tailwind CSS (manteniendo design system)
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library

---

## Objetivos de la Migración

### Técnicos
- ✅ Aplicar principios SOLID en toda la arquitectura
- ✅ Implementar arquitectura basada en features
- ✅ Mejorar type-safety con TypeScript
- ✅ Facilitar testing unitario e integración
- ✅ Reducir acoplamiento entre módulos
- ✅ Mejorar mantenibilidad y escalabilidad

### Funcionales
- ✅ Mantener todas las funcionalidades existentes
- ✅ Mejorar experiencia de usuario
- ✅ Optimizar rendimiento
- ✅ Facilitar futuras extensiones

### De Negocio
- ✅ Zero downtime durante migración
- ✅ Compatibilidad con Firebase existente
- ✅ Mantener CI/CD actual
- ✅ Reducir deuda técnica

---

## Principios Arquitectónicos

### SOLID Principles

#### Single Responsibility Principle (SRP)
- Cada componente/hook/servicio tiene una única razón para cambiar
- Separación clara entre lógica de negocio y presentación

#### Open/Closed Principle (OCP)
- Componentes abiertos a extensión, cerrados a modificación
- Uso de composición sobre herencia

#### Liskov Substitution Principle (LSP)
- Interfaces consistentes en servicios y hooks
- Contratos claros entre capas

#### Interface Segregation Principle (ISP)
- Interfaces específicas por feature
- Evitar dependencias innecesarias

#### Dependency Inversion Principle (DIP)
- Abstracciones para servicios externos (Firebase)
- Inyección de dependencias mediante hooks y context

### Feature-Based Architecture

```
src/
├── features/              # Funcionalidades del dominio
│   ├── auth/             # Feature: Autenticación
│   ├── tipsters/         # Feature: Gestión de tipsters
│   ├── picks/            # Feature: Gestión de picks
│   ├── follows/          # Feature: Seguimiento de picks
│   └── dashboard/        # Feature: Dashboard y estadísticas
├── shared/               # Código compartido entre features
│   ├── components/       # Componentes UI reutilizables
│   ├── hooks/            # Custom hooks compartidos
│   ├── services/         # Servicios base y abstracciones
│   ├── types/            # TypeScript types/interfaces globales
│   └── utils/            # Utilidades puras
└── core/                 # Configuración y setup de la app
    ├── config/           # Configuración Firebase, etc.
    ├── providers/        # Context providers globales
    └── routing/          # Configuración de rutas
```

Cada feature contiene:
```
feature/
├── components/          # Componentes específicos del feature
├── hooks/              # Hooks específicos del feature
├── services/           # Lógica de negocio del feature
├── types/              # Types específicos del feature
├── utils/              # Utilidades específicas del feature
└── index.ts            # Public API del feature
```

---

## Roadmap de Fases

### **✅ FASE 0: Preparación y Setup - COMPLETADA**
**Estado**: ✅ Completada el 14/11/2025  
**Commit**: `254f8ab`

- ✅ Análisis detallado del código actual
- ✅ Setup del proyecto React + TypeScript
- ✅ Configuración de herramientas (ESLint, Prettier, Husky)
- ✅ Creación de estructura de carpetas base
- ✅ Documentación de decisiones arquitectónicas

#### [📖 Ver detalle completo de Fase 0](#fase-0-preparación-y-setup-detallado)

### **FASE 1: Fundamentos y Abstracciones**
- Creación de tipos TypeScript para el modelo de datos
- Implementación de abstracciones para Firebase (Repository Pattern)
- Setup de Context API para estado global
- Implementación de custom hooks base
- Migración del sistema de constantes y configuración
- Implementación de utilidades compartidas (date-utils, calculations)

#### [📖 Ver detalle completo de Fase 1](#fase-1-fundamentos-y-abstracciones-detallado)

### **FASE 2: Shared Components y Design System**
  - Migración del design system CSS a Tailwind CSS
  - Creación de componentes UI base (Button, Input, Card, Modal, etc.)
  - Implementación de sistema de iconos (Lucide React)
  - Creación de layout components (Header, Sidebar, etc.)
  - Implementación de componentes de feedback (Loading, Toast, Alert)
  - Setup de Storybook para documentación de componentes

#### [📖 Ver detalle completo de Fase 2](#fase-2-shared-components-y-design-system-detallado)

### **FASE 3: Feature - Authentication**
- Implementación de auth service con abstracción Firebase
- Creación de AuthContext y useAuth hook
- Migración de pantallas de login/signup
- Implementación de recuperación de contraseña
- Protección de rutas (PrivateRoute component)
- Testing de autenticación

#### [📖 Ver detalle completo de Fase 3](#fase-3-feature---authentication-detallado)

### **FASE 4: Feature - Tipsters**
- Implementación de tipster service
- Creación de hooks: useTipsters, useTipster
- Migración de componentes: TipsterCard, TipsterList
- Implementación de modal de añadir/editar tipster
- Migración de funcionalidades CRUD
- Testing del feature

#### [📖 Ver detalle completo de Fase 4](#fase-4-feature---tipsters-detallado)

### **FASE 5: Feature - Picks**
- Implementación de pick service
- Creación de hooks: usePicks, usePick
- Migración de componentes: PickTable, PickRow, PickForm
- Implementación de modal de añadir/editar pick
- Sistema de filtrado avanzado
- Testing del feature

#### [📖 Ver detalle completo de Fase 5](#fase-5-feature---picks-detallado)

### **FASE 6: Feature - Follows** ✅ **COMPLETADA**
- ✅ Implementación de follow service (FollowRepository)
- ✅ Creación de hooks: useFollows, useFollow, useFollowsByTipster
- ✅ Migración de componentes: FollowTableRow, MyPicksPage
- ✅ Implementación de modals: AddFollowModal, EditFollowModal
- ✅ Integración de "Seguir" en AddPickModal y PickTableRow
- ✅ Sistema de comparación tipster vs usuario (Match/Diverge)
- ✅ Estadísticas de seguibilidad y traceability
- ✅ TipsterDetailPage con tabs (Estadísticas, Mis Estadísticas, Follows)
- ✅ Testing completo (10 secciones: CRUD, Stats, Filters, Real-time, Edge cases, UX)
- ✅ 11 commits, 15+ bugs fixed, 6 UX improvements

#### [📖 Ver detalle completo de Fase 6](#fase-6-feature---follows-detallado)

### **FASE 7: Feature - Dashboard**
- Implementación de hooks de estadísticas globales
- Personal Stats Panel (8 stat cards)
- Sistema de filtros avanzado (multi-select, search, sort)
- Grid de TipsterCards con navegación
- Empty states y loading states
- Testing del feature
- **Nota**: Charts se implementan en Fase 8

### **FASE 8: Feature - Charts & Visualizations**
- Integración de Chart.js con React (react-chartjs-2)
- Charts en TipsterDetailPage - Tab "Estadísticas":
  * Distribución de odds (bar chart)
  * Distribución de stakes (bar chart)
  * Distribución de deportes (doughnut chart)
  * Distribución de tipos de pick (doughnut chart)
- Charts en TipsterDetailPage - Tab "Mis Estadísticas":
  * Mismos charts pero para follows del usuario de ese tipster
- Charts en MyPicksPage:
  * Charts globales de todos los follows del usuario
- Responsive charts y configuración de Chart.js
- Testing de visualizaciones

### **FASE 9: Migración de Datos y Deploy**
- Script de migración de datos si es necesario
- Configuración de Firebase Hosting para React
- Actualización de CI/CD pipeline
- Testing en staging environment
- Deploy gradual a producción
- Monitoreo post-deploy

### **FASE 10: Optimización y Performance**
- Implementación de code-splitting por rutas
- Optimización de re-renders (React.memo, useMemo, useCallback)
- Lazy loading de componentes pesados
- Optimización de queries a Firestore
- Implementación de caching inteligente
- Análisis de bundle size
- **Nota**: Esta fase se ejecuta DESPUÉS del deploy para optimizar basándose en métricas reales de producción

### **FASE 11: Refinamiento y Mejoras Post-Migración**
- Recolección de feedback de usuarios
- Optimizaciones basadas en métricas reales
- Implementación de mejoras UX identificadas
- Documentación técnica actualizada
- Refactoring de código legacy identificado
- Plan de mantenimiento continuo

---

## Estrategia de Migración

### Enfoque Incremental
- Migración por features completos (no por capas)
- Cada fase es deployable y testeable
- Rollback fácil si es necesario
- Feedback temprano y continuo

### Coexistencia Temporal
- Posibilidad de mantener ambas versiones temporalmente
- Feature flags para activar/desactivar features migrados
- Redirecciones inteligentes según estado de migración

### Criterios de Éxito por Fase
- Tests pasando al 100%
- Code review aprobado
- Documentación actualizada
- Performance igual o mejor que versión anterior
- Zero regresiones funcionales

---

## Próximos Pasos

1. Revisión y aprobación de este documento
2. Estimación detallada de cada fase
3. Priorización de features según valor de negocio
4. Inicio de Fase 0: Preparación y Setup

---

## FASE 0: Preparación y Setup (Detallado)

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo)

### Objetivos de la Fase
1. Establecer las bases técnicas del nuevo proyecto React
2. Configurar herramientas de desarrollo y calidad de código
3. Definir estructura de carpetas y convenciones
4. Documentar decisiones arquitectónicas clave
5. Preparar ambiente de desarrollo óptimo

**Nota**: La configuración de testing ha sido omitida de esta guía de migración. Se puede implementar posteriormente cuando el proyecto esté estabilizado.

---

### 1. Análisis Detallado del Código Actual

#### 1.1 Auditoría de Dependencias Actuales
**Tareas:**
- Inventariar todas las dependencias externas
- Identificar versiones y compatibilidad con React
- Buscar equivalentes React-friendly

**Dependencias Actuales:**
```json
{
  "Firebase": "10.7.1 (compat)",
  "Chart.js": "latest (CDN)",
  "Lucide Icons": "latest (CDN)"
}
```

**Nuevas Dependencias React:**
```json
{
  "firebase": "^10.7.1",
  "react-chartjs-2": "^5.2.0",
  "chart.js": "^4.4.0",
  "lucide-react": "^0.292.0",
  "react-router-dom": "^6.20.0"
}
```

#### 1.2 Mapeo de Funcionalidades
**Crear matriz de trazabilidad:**

| Funcionalidad Actual | Módulo Vanilla | Complejidad | Feature React | Prioridad |
|----------------------|----------------|-------------|---------------|-----------|
| Autenticación | core/auth.js | Media | auth/ | Alta |
| CRUD Tipsters | services/tipster.service.js | Baja | tipsters/ | Alta |
| CRUD Picks | services/pick.service.js | Media | picks/ | Alta |
| CRUD Follows | services/follow.service.js | Media | follows/ | Media |
| Dashboard Stats | views/dashboard.js | Alta | dashboard/ | Alta |
| Filtros | utils/filters.js | Media | shared/hooks | Media |
| Cálculos | utils/calculations.js | Baja | shared/services | Baja |
| Gráficos | views/charts.js | Media | shared/components | Media |
| Modals | modals/*.js | Baja | shared/components | Baja |

#### 1.3 Identificación de Riesgos
**Documento de riesgos:**

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de funcionalidad | Baja | Alto | Testing exhaustivo por feature |
| Regresión en performance | Media | Medio | Benchmarking continuo |
| Incompatibilidad Firebase | Baja | Alto | POC temprano en Fase 1 |
| Curva de aprendizaje TypeScript | Media | Medio | Migración gradual, documentación |
| Cambios en diseño visual | Baja | Bajo | Mantener design system |

---

### 2. Setup del Proyecto React + TypeScript

#### 2.1 Inicialización del Proyecto
**Opción 1: Vite (Recomendado)**
```powershell
# Crear proyecto en carpeta separada
npm create vite@latest tipster-tracker-react -- --template react-ts

# Navegar al proyecto
cd tipster-tracker-react

# Instalar dependencias
npm install
```

**Ventajas de Vite:**
- Build ultra-rápido con HMR
- Configuración mínima
- Soporte nativo para TypeScript
- Tree-shaking optimizado

**Opción 2: Create React App**
```powershell
npx create-react-app tipster-tracker-react --template typescript
cd tipster-tracker-react
```

#### 2.2 Instalación de Dependencias Principales
```powershell
# Firebase
npm install firebase

# Routing
npm install react-router-dom
npm install -D @types/react-router-dom

# Gráficos
npm install chart.js react-chartjs-2

# Iconos
npm install lucide-react

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utilidades para Tailwind
npm install clsx tailwind-merge

# Forms (opcional, recomendado)
npm install react-hook-form
npm install zod  # validación

# Estado global (si es necesario más adelante)
# npm install zustand
# npm install @tanstack/react-query
```

#### 2.3 Estructura de Carpetas Base
```powershell
# Crear estructura desde PowerShell
$folders = @(
    "src/features",
    "src/features/auth/components",
    "src/features/auth/hooks",
    "src/features/auth/services",
    "src/features/auth/types",
    "src/features/tipsters/components",
    "src/features/tipsters/hooks",
    "src/features/tipsters/services",
    "src/features/tipsters/types",
    "src/features/picks/components",
    "src/features/picks/hooks",
    "src/features/picks/services",
    "src/features/picks/types",
    "src/features/follows/components",
    "src/features/follows/hooks",
    "src/features/follows/services",
    "src/features/follows/types",
    "src/features/dashboard/components",
    "src/features/dashboard/hooks",
    "src/features/dashboard/services",
    "src/shared/components/ui",
    "src/shared/components/layout",
    "src/shared/components/feedback",
    "src/shared/hooks",
    "src/shared/services",
    "src/shared/types",
    "src/shared/utils",
    "src/shared/constants",
    "src/core/config",
    "src/core/providers",
    "src/core/routing",
    "src/assets/images",
    "src/styles"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}
```

**Resultado visual:**
```
tipster-tracker-react/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── features/              # Funcionalidades por dominio
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── tipsters/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── picks/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── follows/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── dashboard/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── index.ts
│   │
│   ├── shared/               # Código compartido
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Card, etc.
│   │   │   ├── layout/      # Header, Sidebar, etc.
│   │   │   └── feedback/    # Loading, Toast, Modal, etc.
│   │   ├── hooks/           # Custom hooks reutilizables
│   │   ├── services/        # Servicios base
│   │   ├── types/           # Types compartidos
│   │   ├── utils/           # Utilidades puras
│   │   └── constants/       # Constantes globales
│   │
│   ├── core/                # Configuración central
│   │   ├── config/
│   │   │   ├── firebase.config.ts
│   │   │   └── app.config.ts
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── FirebaseProvider.tsx
│   │   └── routing/
│   │       ├── AppRouter.tsx
│   │       ├── PrivateRoute.tsx
│   │       └── routes.config.ts
│   │
│   ├── assets/              # Recursos estáticos
│   │   └── images/
│   │       ├── logo.svg
│   │       └── icon.svg
│   │
│   ├── styles/              # Estilos globales
│   │   ├── variables.css    # Variables CSS del design system
│   │   ├── global.css       # Estilos globales
│   │   └── reset.css        # CSS reset
│   │
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite types
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

#### 2.4 Configuración TypeScript
**Archivo `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@core/*": ["src/core/*"],
      "@assets/*": ["src/assets/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Archivo `tsconfig.node.json`:**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### 2.5 Configuración de Vite
**Archivo `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@core': path.resolve(__dirname, './src/core'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

---

### 3. Configuración de Herramientas de Desarrollo

#### 3.1 ESLint
**Instalar dependencias:**
```powershell
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D eslint-plugin-jsx-a11y eslint-plugin-import
```

**Archivo `.eslintrc.cjs`:**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
}
```

#### 3.2 Prettier
**Instalar dependencias:**
```powershell
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

**Archivo `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Archivo `.prettierignore`:**
```
dist
node_modules
.firebase
coverage
```

#### 3.3 Husky + lint-staged
**Instalar dependencias:**
```powershell
npm install -D husky lint-staged
npx husky init
```

**Configurar pre-commit hook:**
```powershell
# Crear hook
echo "npx lint-staged" > .husky/pre-commit
```

**Actualizar `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "preview": "vite preview",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md,json}": [
      "prettier --write"
    ]
  }
}
```

#### 3.4 EditorConfig
**Archivo `.editorconfig`:**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

---

### 4. Configuración de Tailwind CSS

#### 4.1 Configuración de tailwind.config.js
**Archivo `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#E0E0E0',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#6B7280',
      },
      fontFamily: {
        sans: ['FKGroteskNeue', 'Geist', 'Inter', 'sans-serif'],
        mono: ['Berkeley Mono', 'monospace'],
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
      },
      spacing: {
        '1': '1px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'base': '6px',
        'md': '8px',
        'lg': '10px',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
```

#### 4.2 Configuración de PostCSS
**Archivo `postcss.config.js` (generado automáticamente):**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 4.3 Archivo de Estilos Principal
**Crear `src/styles/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos base personalizados */
@layer base {
  body {
    @apply bg-background text-text font-sans antialiased;
  }

  /* Scrollbar personalizado */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-surface;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-primary/50 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-primary;
  }
}

/* Componentes reutilizables con @layer */
@layer components {
  .btn {
    @apply px-24 py-12 rounded-base font-medium transition-all duration-normal;
    @apply hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-primary text-white;
  }

  .btn-secondary {
    @apply btn bg-surface text-text border border-primary/20;
  }

  .btn-outline {
    @apply btn bg-transparent text-primary border border-primary hover:bg-primary hover:text-white;
  }

  .btn-danger {
    @apply btn bg-error text-white;
  }

  .card {
    @apply bg-surface rounded-lg border border-primary/10 p-16 shadow-sm;
    @apply hover:shadow-md transition-shadow duration-normal;
  }

  .input {
    @apply w-full px-12 py-8 bg-surface text-text rounded-base;
    @apply border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20;
    @apply outline-none transition-all duration-fast;
  }

  .label {
    @apply block text-sm font-medium text-text/80 mb-4;
  }

  .status-badge {
    @apply inline-flex items-center px-8 py-4 rounded-full text-xs font-medium;
  }

  .status-success {
    @apply status-badge bg-success/10 text-success border border-success/20;
  }

  .status-error {
    @apply status-badge bg-error/10 text-error border border-error/20;
  }

  .status-warning {
    @apply status-badge bg-warning/10 text-warning border border-warning/20;
  }

  .status-info {
    @apply status-badge bg-info/10 text-info border border-info/20;
  }
}

/* Utilidades personalizadas */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

#### 4.4 Utilidad cn() para Combinar Clases
**Crear `src/shared/utils/cn.ts`:**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind resolviendo conflictos
 * Usa clsx para condicionales y twMerge para resolver conflictos
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-primary', { 'text-white': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Ejemplo de uso:**
```typescript
import { cn } from '@shared/utils/cn';

export const Button = ({ variant = 'primary', className, children }) => (
  <button
    className={cn(
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'btn-secondary',
      className
    )}
  >
    {children}
  </button>
);
```

#### 4.5 Configurar IntelliSense para Tailwind
**Archivo `.vscode/settings.json`:**
```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ],
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.validate": false,
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

### 5. Configuración de Git y Versionado

#### 5.1 Estrategia de Branching
**Modelo GitFlow adaptado:**
```
main (producción actual vanilla JS)
  └── develop-react (desarrollo React)
       ├── feature/setup-phase0
       ├── feature/auth-phase3
       ├── feature/tipsters-phase4
       └── ...
```

**Comandos iniciales:**
```powershell
# En el proyecto actual
git checkout -b develop-react
git push -u origin develop-react

# Para cada fase
git checkout develop-react
git checkout -b feature/setup-phase0
```

#### 5.2 Actualizar .gitignore
```gitignore
# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/dist
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Emulators
emulator-data/

# Config sensible
src/core/config/firebase.config.ts
```

#### 5.3 Conventional Commits
**Instalar commitlint:**
```powershell
npm install -D @commitlint/cli @commitlint/config-conventional
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

**Actualizar hook:**
```powershell
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

**Formato de commits:**
```
feat: agregar componente Button
fix: corregir bug en auth service
docs: actualizar MIGRATION-GUIDE.md
style: formatear código con prettier
refactor: reorganizar estructura de carpetas
test: agregar tests para useTipsters hook
chore: actualizar dependencias
```

---

### 6. Documentación de Decisiones Arquitectónicas

#### 6.1 ADR (Architecture Decision Records)
**Crear carpeta de ADRs:**
```powershell
New-Item -ItemType Directory -Force -Path "docs/adr"
```

**Template ADR (`docs/adr/000-template.md`):**
```markdown
# [número]. [título]

Fecha: YYYY-MM-DD

## Estado
[Propuesto | Aceptado | Rechazado | Deprecado | Reemplazado por ADR-XXX]

## Contexto
[Describir el problema y el contexto que motivó la decisión]

## Decisión
[Describir la decisión tomada]

## Consecuencias
### Positivas
- [Beneficio 1]
- [Beneficio 2]

### Negativas
- [Trade-off 1]
- [Trade-off 2]

### Riesgos
- [Riesgo 1]

## Alternativas Consideradas
1. [Alternativa 1]
   - Pros: ...
   - Contras: ...
   
2. [Alternativa 2]
   - Pros: ...
   - Contras: ...
```

#### 6.2 ADRs Iniciales a Crear

**ADR-001: Elección de Vite sobre CRA**
```markdown
# 1. Uso de Vite como bundler en lugar de Create React App

Fecha: 2025-11-13

## Estado
Aceptado

## Contexto
Necesitamos elegir una herramienta de build para el proyecto React. Las opciones principales son Create React App (CRA) y Vite.

## Decisión
Usar Vite como bundler y dev server.

## Consecuencias
### Positivas
- Build y HMR significativamente más rápidos
- Configuración más simple y flexible
- Mejor soporte para TypeScript out-of-the-box
- Bundle size más pequeño con tree-shaking optimizado
- Comunidad activa y en crecimiento

### Negativas
- Menos ejemplos y tutoriales que CRA
- Algunos plugins pueden no estar disponibles

## Alternativas Consideradas
1. Create React App
   - Pros: Más maduro, más recursos, más familiar
   - Contras: Builds lentos, menos flexible, proyecto en mantenimiento
```

**ADR-002: Tailwind CSS como Solución de Estilos**
```markdown
# 2. Uso de Tailwind CSS para simplificar desarrollo

Fecha: 2025-11-13

## Estado
Aceptado

## Contexto
El proyecto actual usa CSS vanilla con variables CSS. Necesitamos decidir cómo manejar estilos en React de manera que simplifique el desarrollo y mantenga el design system.

## Decisión
Usar Tailwind CSS con configuración personalizada que preserva todo el design system actual.

## Consecuencias
### Positivas
- Desarrollo más rápido con utility classes
- No necesidad de crear archivos CSS separados
- Design system completo configurado en tailwind.config.js
- Purge automático de CSS no utilizado
- Excelente DX con IntelliSense
- Responsive design simplificado
- Sin runtime overhead (CSS estático)
- Comunidad muy activa y documentación excelente

### Negativas
- Clases largas en algunos componentes (se mitiga con cn() utility)
- Curva de aprendizaje inicial para el equipo
- Requiere configuración para mantener design system actual

### Riesgos
- HTML con muchas clases puede ser menos legible (mitigado con componentes reutilizables)

## Alternativas Consideradas
1. CSS Modules
   - Pros: Scope local, migración directa del CSS existente
   - Contras: Archivos separados, menos productivo, más código

2. Styled Components
   - Pros: CSS-in-JS, props dinámicos, popular
   - Contras: Runtime overhead, bundle size mayor, complejidad adicional

3. Vanilla CSS
   - Pros: Familiar, sin dependencias
   - Contras: No escalable, difícil mantenimiento, scope global

## Implementación
Se preserva el design system actual mediante configuración personalizada:
- Colores: primary, background, surface, text, success, error, warning, info
- Typography: FKGroteskNeue, tamaños personalizados
- Spacing: 1px, 4px, 8px, 12px, 16px, 20px, 24px, 32px
- Border radius: sm, base, md, lg, full
- Shadows: xs, sm, md, lg
- Transitions: fast, normal, slow

Se utiliza utility cn() (clsx + tailwind-merge) para combinar clases sin conflictos.
```

**ADR-003: Feature-Based Architecture**
```markdown
# 3. Arquitectura basada en Features

Fecha: 2025-11-13

## Estado
Aceptado

## Contexto
Necesitamos organizar el código de manera escalable y mantenible.

## Decisión
Usar arquitectura feature-based donde cada funcionalidad de negocio tiene su propia carpeta con todos sus archivos relacionados.

## Consecuencias
### Positivas
- Alta cohesión dentro de cada feature
- Bajo acoplamiento entre features
- Fácil de entender el scope de cada feature
- Facilita code-splitting por feature
- Escalable para equipos

### Negativas
- Puede haber código duplicado entre features inicialmente
- Requiere disciplina para no crear dependencias entre features

## Alternativas Consideradas
1. Arquitectura por tipo (components/, hooks/, services/)
   - Pros: Más tradicional, más simple al inicio
   - Contras: Difícil de escalar, bajo cohesión
```

#### 6.3 Crear README del Proyecto React
**Archivo `README.md` en raíz del proyecto React:**
```markdown
# Tipster Tracker - React Migration

Aplicación web para seguimiento y análisis de pronósticos deportivos (picks) de tipsters.

## Stack Tecnológico

- **React** 18+ con TypeScript
- **Vite** como bundler
- **React Router** v6 para routing
- **Firebase** para backend (Firestore + Auth)
- **Chart.js** + react-chartjs-2 para gráficos
- **Lucide React** para iconos
- **Vitest** + React Testing Library para testing

## Estructura del Proyecto

```
src/
├── features/          # Funcionalidades por dominio (auth, tipsters, picks, etc.)
├── shared/            # Código compartido (components, hooks, utils)
├── core/              # Configuración y providers globales
├── assets/            # Recursos estáticos
└── styles/            # Estilos globales
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Testing
npm run test
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
```

## Convenciones

- **Commits**: Conventional Commits
- **Naming**: PascalCase para componentes, camelCase para funciones/variables
- **Testing**: Vitest + React Testing Library
- **Estilos**: Tailwind CSS con configuración personalizada

## Migración

Este proyecto es una migración del proyecto original en Vanilla JS.  
Ver [MIGRATION-GUIDE.md](../MIGRATION-GUIDE.md) para detalles del plan de migración.
```

---

### 7. Configuración de Firebase

#### 7.1 Mantener Proyecto Firebase Actual
**No crear nuevo proyecto**, usar el existente.

#### 7.2 Configurar Firebase para React
**Archivo `src/core/config/firebase.config.example.ts`:**
```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const useEmulators = process.env.NODE_ENV === 'development';

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9099,
  },
  firestore: {
    host: 'localhost',
    port: 8080,
  },
};
```

**Archivo `src/core/config/firebase.config.ts` (no commitear):**
```typescript
// Copiar del firebase.config.js actual
export const firebaseConfig = {
  // Credenciales reales
};

export const useEmulators = window.location.hostname === 'localhost';

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9099,
  },
  firestore: {
    host: 'localhost',
    port: 8080,
  },
};
```

#### 7.3 Actualizar firebase.json para Servir React App
**Archivo `firebase.json` (en raíz del proyecto original):**
```json
{
  "hosting": {
    "public": "tipster-tracker-react/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|svg|ico|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

---

### 8. Primeros Archivos Base

#### 8.1 Archivo `src/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Tailwind CSS
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### 8.2 Archivo `src/App.tsx`
```typescript
import { FC } from 'react'

const App: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Tipster Tracker - React Migration
        </h1>
        <p className="text-lg text-text">Phase 0: Setup Complete ✅</p>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
        </div>
      </div>
    </div>
  )
}

export default App
```

#### 8.3 Crear archivos `.gitkeep` en carpetas vacías
```powershell
$folders = Get-ChildItem -Path "src" -Recurse -Directory
foreach ($folder in $folders) {
    if ((Get-ChildItem $folder.FullName).Count -eq 0) {
        New-Item -Path "$($folder.FullName)/.gitkeep" -ItemType File -Force
    }
}
```

---

### 9. Checklist de Verificación de Fase 0

#### ✅ Setup Proyecto
- [ ] Proyecto Vite + React + TypeScript creado
- [ ] Todas las dependencias instaladas correctamente
- [ ] Estructura de carpetas creada
- [ ] Path aliases configurados y funcionando
- [ ] Build exitoso (`npm run build`)
- [ ] Dev server funcionando (`npm run dev`)

#### ✅ Calidad de Código
- [ ] ESLint configurado y sin errores
- [ ] Prettier configurado
- [ ] Husky + lint-staged funcionando
- [ ] Pre-commit hooks ejecutándose
- [ ] Conventional commits configurado

#### ✅ Documentación
- [ ] README.md actualizado
- [ ] ADRs principales creados (al menos 3)
- [ ] MIGRATION-GUIDE.md actualizado
- [ ] Comentarios en archivos de configuración

#### ✅ Git
- [ ] Branch `develop-react` creado
- [ ] Branch `feature/setup-phase0` creado
- [ ] .gitignore actualizado
- [ ] Primer commit realizado

#### ✅ Firebase
- [ ] firebase.config.example.ts creado
- [ ] firebase.config.ts creado y en .gitignore
- [ ] firebase.json actualizado para servir React app
- [ ] Verificado que emuladores funcionan

#### ✅ Tailwind CSS
- [ ] Tailwind CSS y PostCSS instalados
- [ ] tailwind.config.js configurado con design system completo
- [ ] postcss.config.js creado
- [ ] src/styles/index.css con @tailwind directives y custom @layer
- [ ] Utility cn() creada en src/shared/utils/cn.ts
- [ ] IntelliSense de Tailwind funcionando en VS Code
- [ ] Clases de Tailwind aplicándose correctamente
- [ ] Custom components en @layer funcionando

---

### 10. Comandos de Verificación Final

```powershell
# 1. Verificar instalación
npm list --depth=0

# 2. Verificar linting
npm run lint

# 3. Verificar formateo
npm run format

# 4. Verificar build
npm run build

# 5. Verificar que dev server funciona y Tailwind está aplicando estilos
npm run dev
# Abrir http://localhost:3000 y verificar:
# - "Phase 0: Setup Complete ✅" visible
# - Botones con estilos de Tailwind (azul primary, gris secondary)
# - Background oscuro (#0F172A)
# - Texto en color claro (#E0E0E0)
# - Hover en botones funciona
# - Inspeccionar elemento y ver clases de Tailwind aplicadas

# 6. Verificar Git hooks
git add .
git commit -m "feat: complete phase 0 setup with tailwind css"
# Verificar que lint-staged se ejecuta

# 7. Verificar Firebase emulators
cd .. # Ir a raíz del proyecto original
firebase emulators:start
# Verificar que Auth (9099) y Firestore (8080) inician correctamente
```

---

### 11. Siguientes Pasos

Una vez completada la Fase 0:

1. **Code Review**: Revisar todo el setup con el equipo
2. **Documentar Issues**: Anotar cualquier problema encontrado
3. **Actualizar Estimaciones**: Ajustar tiempos de fases siguientes si es necesario
4. **Merge a develop-react**: 
   ```powershell
   git checkout develop-react
   git merge feature/setup-phase0
   git push origin develop-react
   ```
5. **Iniciar Fase 1**: Crear branch `feature/fundamentals-phase1`

---

### 12. Recursos y Referencias

#### Documentación Oficial
- [React 18 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v6](https://reactrouter.com/en/main)

#### Guías de Estilo
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

#### SOLID en React
- [SOLID Principles in React](https://konstantinlebedev.com/solid-in-react/)
- [Clean Code React](https://github.com/ryanmcdermott/clean-code-javascript)

#### Feature-Based Architecture
- [Feature Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

#### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [cn() utility pattern](https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper)

---

### 13. Resumen de Fase 0

**✅ Completado:**
- Proyecto React + TypeScript + Vite configurado
- **Tailwind CSS** instalado y configurado con design system completo
- ESLint, Prettier, Husky configurados
- Estructura de carpetas feature-based creada
- Path aliases configurados
- Firebase configurado con emuladores
- ADRs documentados (incluyendo decisión de Tailwind CSS)
- README.md y documentación inicial

**🎨 Decisión Clave: Tailwind CSS**
- Migración de CSS Modules a Tailwind CSS para simplificar desarrollo
- Design system actual preservado en `tailwind.config.js`
- Utility `cn()` creada para combinar clases sin conflictos
- IntelliSense configurado para desarrollo eficiente

**📦 Archivos Clave Creados:**
- `tailwind.config.js` - Configuración completa del design system
- `postcss.config.js` - Configuración de PostCSS
- `src/styles/index.css` - Tailwind directives + custom components
- `src/shared/utils/cn.ts` - Utility para combinar clases
- `src/core/config/firebase.config.ts` - Configuración Firebase

**⏱️ Duración Real:** 8-12 horas

**➡️ Próxima Fase:** Fase 1 - Fundamentos y Abstracciones

---

## ✅ Criterios de Éxito de Fase 0

La Fase 0 se considera **completada** cuando:

1. ✅ Todos los ítems del checklist están marcados
2. ✅ Todos los comandos de verificación ejecutan sin errores
3. ✅ Tailwind CSS funcionando correctamente con IntelliSense
4. ✅ El equipo ha revisado y aprobado el setup
5. ✅ La documentación está completa y actualizada
6. ✅ El branch está mergeado a `develop-react`

---

## FASE 1: Fundamentos y Abstracciones (Detallado)

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo)

### Objetivos de la Fase
1. Definir el modelo de datos completo con TypeScript
2. Crear abstracciones SOLID para acceso a Firebase
3. Implementar sistema de estado global con Context API
4. Desarrollar custom hooks base reutilizables
5. Migrar constantes y utilidades del proyecto actual
6. Establecer las bases para aplicar principios SOLID

**Nota**: Esta fase NO incluye componentes visuales, solo la capa de lógica y datos.

---

### 1. Tipos TypeScript del Modelo de Datos

#### 1.1 Tipos Base del Dominio
**Archivo `src/shared/types/domain.types.ts`:**
```typescript
/**
 * Resultado posible de una pick o follow
 */
export type PickResult = 'Ganada' | 'Perdida' | 'Void';

/**
 * Tipo de pick según timing
 */
export type PickType = 'Pre' | 'Live' | 'Combinado';

/**
 * Estado de resolución
 */
export type ResolutionStatus = 'Resuelta' | 'Pendiente';

/**
 * Deportes disponibles
 */
export type Sport = 
  | 'Fútbol' 
  | 'Baloncesto' 
  | 'Tenis' 
  | 'Balonmano' 
  | 'Voleibol' 
  | 'Hockey' 
  | 'Béisbol' 
  | 'Fútbol Americano' 
  | 'Rugby' 
  | 'MMA/Boxeo' 
  | 'Esports' 
  | 'Otros';

/**
 * Canales de tipsters
 */
export type Channel = 
  | 'Telegram' 
  | 'BlogaBet' 
  | 'Twitter/X' 
  | 'Discord' 
  | 'Instagram' 
  | 'YouTube' 
  | 'Podcast' 
  | 'Web propia' 
  | 'Otro';

/**
 * Casas de apuestas
 */
export type Bookmaker = 
  | 'Bet365' 
  | 'Codere' 
  | 'Bwin' 
  | 'Betway' 
  | '888sport' 
  | 'William Hill' 
  | 'Betsson' 
  | 'LeoVegas' 
  | 'Otra';
```

#### 1.2 Entidades de Firestore
**Archivo `src/shared/types/entities.types.ts`:**
```typescript
/**
 * Entidad Tipster en Firestore
 */
export interface TipsterEntity {
  id: string;
  uid: string;
  name: string;
  channel: string;
  createdDate: string; // ISO format YYYY-MM-DD
  lastPickDate: string; // ISO format YYYY-MM-DD
}

/**
 * DTO para crear un Tipster
 */
export interface CreateTipsterDTO {
  name: string;
  channel: string;
}

/**
 * DTO para actualizar un Tipster
 */
export interface UpdateTipsterDTO {
  name?: string;
  channel?: string;
  lastPickDate?: string;
}

/**
 * Entidad Pick en Firestore
 */
export interface PickEntity {
  id: string;
  uid: string;
  tipsterId: string;
  sport: string;
  odds: number;
  stake: number; // 1-10
  pickType: string;
  betType: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  dateTime: string; // ISO full para ordenación
  result: string;
  isResolved: boolean;
  match: string;
  bookmaker: string;
  comments: string;
}

/**
 * DTO para crear un Pick
 */
export interface CreatePickDTO {
  tipsterId: string;
  sport: string;
  odds: number;
  stake: number;
  pickType: string;
  betType: string;
  date: string;
  time: string;
  result?: string;
  isResolved?: boolean;
  match: string;
  bookmaker: string;
  comments?: string;
}

/**
 * DTO para actualizar un Pick
 */
export interface UpdatePickDTO {
  sport?: string;
  odds?: number;
  stake?: number;
  pickType?: string;
  betType?: string;
  date?: string;
  time?: string;
  result?: string;
  isResolved?: boolean;
  match?: string;
  bookmaker?: string;
  comments?: string;
}

/**
 * Entidad Follow en Firestore
 */
export interface FollowEntity {
  id: string;
  uid: string;
  pickId: string;
  tipsterId: string;
  userOdds: number;
  userStake: number;
  userResult: string;
  userIsResolved: boolean;
  followDate: string; // ISO full
}

/**
 * DTO para crear un Follow
 */
export interface CreateFollowDTO {
  pickId: string;
  tipsterId: string;
  userOdds: number;
  userStake: number;
  userResult?: string;
  userIsResolved?: boolean;
}

/**
 * DTO para actualizar un Follow
 */
export interface UpdateFollowDTO {
  userOdds?: number;
  userStake?: number;
  userResult?: string;
  userIsResolved?: boolean;
}
```

#### 1.3 Tipos de Estadísticas
**Archivo `src/shared/types/stats.types.ts`:**
```typescript
/**
 * Distribución de odds
 */
export interface OddsDistribution {
  '1.00-1.50': number;
  '1.51-2.00': number;
  '2.01-3.00': number;
  '3.01-5.00': number;
  '5.01+': number;
}

/**
 * Distribución de stakes
 */
export interface StakeDistribution {
  '1-2': number;
  '3-4': number;
  '5-6': number;
  '7-8': number;
  '9-10': number;
}

/**
 * Distribución por deporte
 */
export type SportDistribution = Record<string, number>;

/**
 * Distribución por tipo de pick
 */
export type PickTypeDistribution = Record<string, number>;

/**
 * Estadísticas completas de un tipster
 */
export interface TipsterStats {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  lostPicks: number;
  voidPicks: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
  oddsDistribution: OddsDistribution;
  stakeDistribution: StakeDistribution;
  sportDistribution: SportDistribution;
  pickTypeDistribution: PickTypeDistribution;
}

/**
 * Estadísticas de follows de un usuario
 */
export interface FollowStats {
  totalFollows: number;
  resolvedFollows: number;
  wonFollows: number;
  lostFollows: number;
  voidFollows: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
}

/**
 * Estadísticas personales globales del usuario
 */
export interface PersonalStats extends TipsterStats {
  // Hereda todas las propiedades de TipsterStats
}
```

#### 1.4 Tipos de Filtros
**Archivo `src/shared/types/filters.types.ts`:**
```typescript
/**
 * Opciones de ordenación
 */
export type SortOption = 'yield' | 'winrate' | 'totalPicks' | 'name';

/**
 * Opciones de días de última pick
 */
export type LastPickDaysOption = 'all' | '7' | '30' | '90';

/**
 * Filtros del dashboard
 */
export interface DashboardFilters {
  sports: string[];
  channels: string[];
  yieldMin: number;
  lastPickDays: LastPickDaysOption;
  sortBy: SortOption;
  searchQuery: string;
}

/**
 * Filtros de All Picks
 */
export interface PicksFilters {
  tipsterId: string | null;
  sport: string | null;
  status: 'all' | 'resolved' | 'pending';
  channel: string | null;
  bookmaker: string | null;
  result: string | null;
}

/**
 * Filtros de My Picks
 */
export interface MyPicksFilters {
  tipsterId: string | null;
  result: string | null;
  matchDiverge: 'all' | 'match' | 'diverge';
}
```

#### 1.5 Archivo Índice de Tipos
**Archivo `src/shared/types/index.ts`:**
```typescript
// Domain types
export type {
  PickResult,
  PickType,
  ResolutionStatus,
  Sport,
  Channel,
  Bookmaker,
} from './domain.types';

// Entity types
export type {
  TipsterEntity,
  CreateTipsterDTO,
  UpdateTipsterDTO,
  PickEntity,
  CreatePickDTO,
  UpdatePickDTO,
  FollowEntity,
  CreateFollowDTO,
  UpdateFollowDTO,
} from './entities.types';

// Stats types
export type {
  OddsDistribution,
  StakeDistribution,
  SportDistribution,
  PickTypeDistribution,
  TipsterStats,
  FollowStats,
  PersonalStats,
} from './stats.types';

// Filter types
export type {
  SortOption,
  LastPickDaysOption,
  DashboardFilters,
  PicksFilters,
  MyPicksFilters,
} from './filters.types';
```

---

### 2. Abstracciones de Firebase (Repository Pattern)

#### 2.1 Interfaces Base (DIP - Dependency Inversion Principle)
**Archivo `src/shared/services/base/repository.interface.ts`:**
```typescript
/**
 * Interface genérica para repositorios
 * Aplica DIP: dependemos de abstracciones, no de implementaciones concretas
 */
export interface IRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Obtener todos los documentos del usuario actual
   */
  getAll(): Promise<T[]>;

  /**
   * Obtener un documento por ID
   */
  getById(id: string): Promise<T | null>;

  /**
   * Crear un nuevo documento
   */
  create(data: CreateDTO): Promise<T>;

  /**
   * Actualizar un documento existente
   */
  update(id: string, data: UpdateDTO): Promise<void>;

  /**
   * Eliminar un documento
   */
  delete(id: string): Promise<void>;

  /**
   * Suscribirse a cambios en tiempo real
   */
  subscribe(callback: (data: T[]) => void): () => void;
}
```

#### 2.2 Clase Base Repository (SRP - Single Responsibility)
**Archivo `src/shared/services/base/firestore-repository.base.ts`:**
```typescript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { IRepository } from './repository.interface';

/**
 * Clase base abstracta para repositorios de Firestore
 * Aplica SRP: solo se encarga de operaciones CRUD en Firestore
 */
export abstract class FirestoreRepositoryBase<T, CreateDTO, UpdateDTO>
  implements IRepository<T, CreateDTO, UpdateDTO>
{
  protected collectionName: string;
  protected db: Firestore;
  protected userId: string;

  constructor(collectionName: string, db: Firestore, userId: string) {
    this.collectionName = collectionName;
    this.db = db;
    this.userId = userId;
  }

  /**
   * Transforma un documento de Firestore a la entidad del dominio
   */
  protected abstract mapDocToEntity(doc: any): T;

  /**
   * Transforma un DTO de creación a datos de Firestore
   */
  protected abstract mapCreateDTOToDoc(dto: CreateDTO): any;

  /**
   * Transforma un DTO de actualización a datos de Firestore
   */
  protected abstract mapUpdateDTOToDoc(dto: UpdateDTO): any;

  async getAll(): Promise<T[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where('uid', '==', this.userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      this.mapDocToEntity({ id: doc.id, ...doc.data() })
    );
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    if (data.uid !== this.userId) {
      return null; // Security: solo el propietario puede ver
    }

    return this.mapDocToEntity({ id: docSnap.id, ...data });
  }

  async create(data: CreateDTO): Promise<T> {
    const docData = {
      ...this.mapCreateDTOToDoc(data),
      uid: this.userId,
    };

    const docRef = await addDoc(
      collection(this.db, this.collectionName),
      docData
    );

    return this.mapDocToEntity({ id: docRef.id, ...docData });
  }

  async update(id: string, data: UpdateDTO): Promise<void> {
    const docRef = doc(this.db, this.collectionName, id);
    const updateData = this.mapUpdateDTOToDoc(data);

    await updateDoc(docRef, updateData);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  subscribe(callback: (data: T[]) => void): Unsubscribe {
    const q = query(
      collection(this.db, this.collectionName),
      where('uid', '==', this.userId)
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) =>
        this.mapDocToEntity({ id: doc.id, ...doc.data() })
      );
      callback(data);
    });
  }
}
```

#### 2.3 Repositorio de Tipsters
**Archivo `src/features/tipsters/services/tipster.repository.ts`:**
```typescript
import { Firestore } from 'firebase/firestore';
import { FirestoreRepositoryBase } from '@shared/services/base/firestore-repository.base';
import {
  TipsterEntity,
  CreateTipsterDTO,
  UpdateTipsterDTO,
} from '@shared/types';

/**
 * Repositorio específico para Tipsters
 * Aplica SRP: solo maneja persistencia de Tipsters
 */
export class TipsterRepository extends FirestoreRepositoryBase<
  TipsterEntity,
  CreateTipsterDTO,
  UpdateTipsterDTO
> {
  constructor(db: Firestore, userId: string) {
    super('tipsters', db, userId);
  }

  protected mapDocToEntity(doc: any): TipsterEntity {
    return {
      id: doc.id,
      uid: doc.uid,
      name: doc.name,
      channel: doc.channel,
      createdDate: doc.createdDate,
      lastPickDate: doc.lastPickDate || doc.createdDate,
    };
  }

  protected mapCreateDTOToDoc(dto: CreateTipsterDTO): any {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return {
      name: dto.name,
      channel: dto.channel,
      createdDate: now,
      lastPickDate: now,
    };
  }

  protected mapUpdateDTOToDoc(dto: UpdateTipsterDTO): any {
    const updates: any = {};
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.channel !== undefined) updates.channel = dto.channel;
    if (dto.lastPickDate !== undefined) updates.lastPickDate = dto.lastPickDate;
    return updates;
  }
}
```

#### 2.4 Repositorio de Picks
**Archivo `src/features/picks/services/pick.repository.ts`:**
```typescript
import { Firestore } from 'firebase/firestore';
import { FirestoreRepositoryBase } from '@shared/services/base/firestore-repository.base';
import {
  PickEntity,
  CreatePickDTO,
  UpdatePickDTO,
} from '@shared/types';

/**
 * Repositorio específico para Picks
 */
export class PickRepository extends FirestoreRepositoryBase<
  PickEntity,
  CreatePickDTO,
  UpdatePickDTO
> {
  constructor(db: Firestore, userId: string) {
    super('picks', db, userId);
  }

  protected mapDocToEntity(doc: any): PickEntity {
    return {
      id: doc.id,
      uid: doc.uid,
      tipsterId: doc.tipsterId,
      sport: doc.sport,
      odds: doc.odds,
      stake: doc.stake,
      pickType: doc.pickType,
      betType: doc.betType,
      date: doc.date,
      time: doc.time,
      dateTime: doc.dateTime,
      result: doc.result || 'Pendiente',
      isResolved: doc.isResolved || false,
      match: doc.match,
      bookmaker: doc.bookmaker,
      comments: doc.comments || '',
    };
  }

  protected mapCreateDTOToDoc(dto: CreatePickDTO): any {
    // Combinar date + time en formato ISO
    const dateTime = `${dto.date}T${dto.time}:00.000Z`;

    return {
      tipsterId: dto.tipsterId,
      sport: dto.sport,
      odds: dto.odds,
      stake: dto.stake,
      pickType: dto.pickType,
      betType: dto.betType,
      date: dto.date,
      time: dto.time,
      dateTime: dateTime,
      result: dto.result || 'Pendiente',
      isResolved: dto.isResolved || false,
      match: dto.match,
      bookmaker: dto.bookmaker,
      comments: dto.comments || '',
    };
  }

  protected mapUpdateDTOToDoc(dto: UpdatePickDTO): any {
    const updates: any = {};

    if (dto.sport !== undefined) updates.sport = dto.sport;
    if (dto.odds !== undefined) updates.odds = dto.odds;
    if (dto.stake !== undefined) updates.stake = dto.stake;
    if (dto.pickType !== undefined) updates.pickType = dto.pickType;
    if (dto.betType !== undefined) updates.betType = dto.betType;
    if (dto.match !== undefined) updates.match = dto.match;
    if (dto.bookmaker !== undefined) updates.bookmaker = dto.bookmaker;
    if (dto.comments !== undefined) updates.comments = dto.comments;
    if (dto.result !== undefined) updates.result = dto.result;
    if (dto.isResolved !== undefined) updates.isResolved = dto.isResolved;

    // Si cambia date o time, recalcular dateTime
    if (dto.date !== undefined || dto.time !== undefined) {
      // Necesitamos obtener el documento actual para tener date/time completos
      // Esto se puede mejorar pasando ambos valores siempre
      updates.dateTime = `${dto.date}T${dto.time}:00.000Z`;
    }

    return updates;
  }
}
```

#### 2.5 Repositorio de Follows
**Archivo `src/features/follows/services/follow.repository.ts`:**
```typescript
import { Firestore } from 'firebase/firestore';
import { FirestoreRepositoryBase } from '@shared/services/base/firestore-repository.base';
import {
  FollowEntity,
  CreateFollowDTO,
  UpdateFollowDTO,
} from '@shared/types';

/**
 * Repositorio específico para Follows
 */
export class FollowRepository extends FirestoreRepositoryBase<
  FollowEntity,
  CreateFollowDTO,
  UpdateFollowDTO
> {
  constructor(db: Firestore, userId: string) {
    super('userFollows', db, userId);
  }

  protected mapDocToEntity(doc: any): FollowEntity {
    return {
      id: doc.id,
      uid: doc.uid,
      pickId: doc.pickId,
      tipsterId: doc.tipsterId,
      userOdds: doc.userOdds,
      userStake: doc.userStake,
      userResult: doc.userResult || 'Pendiente',
      userIsResolved: doc.userIsResolved || false,
      followDate: doc.followDate,
    };
  }

  protected mapCreateDTOToDoc(dto: CreateFollowDTO): any {
    return {
      pickId: dto.pickId,
      tipsterId: dto.tipsterId,
      userOdds: dto.userOdds,
      userStake: dto.userStake,
      userResult: dto.userResult || 'Pendiente',
      userIsResolved: dto.userIsResolved || false,
      followDate: new Date().toISOString(),
    };
  }

  protected mapUpdateDTOToDoc(dto: UpdateFollowDTO): any {
    const updates: any = {};
    if (dto.userOdds !== undefined) updates.userOdds = dto.userOdds;
    if (dto.userStake !== undefined) updates.userStake = dto.userStake;
    if (dto.userResult !== undefined) updates.userResult = dto.userResult;
    if (dto.userIsResolved !== undefined)
      updates.userIsResolved = dto.userIsResolved;
    return updates;
  }
}
```

---

### 3. Context API para Estado Global

#### 3.1 Firebase Context
**Archivo `src/core/providers/FirebaseProvider.tsx`:**
```typescript
import { createContext, useContext, ReactNode } from 'react';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { auth, db } from '@core/config/firebase.config';

interface FirebaseContextType {
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

interface FirebaseProviderProps {
  children: ReactNode;
}

/**
 * Provider para instancias de Firebase
 * Aplica DIP: componentes dependen de este contexto, no de Firebase directamente
 */
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const value: FirebaseContextType = {
    auth,
    db,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook para acceder a Firebase
 */
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};
```

**Archivo `src/core/config/firebase.config.ts` (implementación):**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Importar configuración (debe existir, copiar de firebase.config.example.ts)
import { firebaseConfig, useEmulators, emulatorConfig } from './firebase.config';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Conectar a emuladores si estamos en localhost
if (useEmulators) {
  try {
    connectAuthEmulator(
      auth,
      `http://${emulatorConfig.auth.host}:${emulatorConfig.auth.port}`,
      { disableWarnings: true }
    );
    connectFirestoreEmulator(
      db,
      emulatorConfig.firestore.host,
      emulatorConfig.firestore.port
    );
    console.log('🔥 Firebase Emulators connected');
  } catch (error) {
    console.warn('Emulators already connected or error:', error);
  }
}
```

#### 3.2 Auth Context
**Archivo `src/features/auth/hooks/useAuth.tsx`:**
```typescript
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useFirebase } from '@core/providers/FirebaseProvider';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticación
 * Aplica SRP: solo maneja el estado de autenticación
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acceder al contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 3.3 App Providers (Composición)
**Archivo `src/core/providers/AppProviders.tsx`:**
```typescript
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './FirebaseProvider';
import { AuthProvider } from '@features/auth/hooks/useAuth';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composición de todos los providers de la app
 * Aplica OCP: abierto a extensión (nuevos providers), cerrado a modificación
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
};
```

---

### 4. Custom Hooks Base

#### 4.1 useRepository Hook
**Archivo `src/shared/hooks/useRepository.ts`:**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { IRepository } from '@shared/services/base/repository.interface';

/**
 * Hook genérico para trabajar con repositorios
 * Aplica DIP: depende de la interfaz, no de implementación concreta
 */
export function useRepository<T, CreateDTO, UpdateDTO>(
  repository: IRepository<T, CreateDTO, UpdateDTO>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    setLoading(true);
    const unsubscribe = repository.subscribe((newData) => {
      setData(newData);
      setLoading(false);
    });

    return unsubscribe;
  }, [repository]);

  // Operaciones CRUD
  const create = useCallback(
    async (dto: CreateDTO): Promise<T> => {
      try {
        const newItem = await repository.create(dto);
        return newItem;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [repository]
  );

  const update = useCallback(
    async (id: string, dto: UpdateDTO): Promise<void> => {
      try {
        await repository.update(id, dto);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [repository]
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      try {
        await repository.delete(id);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [repository]
  );

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      try {
        return await repository.getById(id);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [repository]
  );

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    getById,
  };
}
```

#### 4.2 useAsync Hook
**Archivo `src/shared/hooks/useAsync.ts`:**
```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para manejar operaciones asíncronas
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [asyncFunction]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { ...state, refetch: execute };
}
```

#### 4.3 useDebounce Hook
**Archivo `src/shared/hooks/useDebounce.ts`:**
```typescript
import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Útil para búsquedas y filtros
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### 4.4 useLocalStorage Hook
**Archivo `src/shared/hooks/useLocalStorage.ts`:**
```typescript
import { useState, useEffect } from 'react';

/**
 * Hook para sincronizar estado con localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Estado inicial desde localStorage o valor por defecto
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Guardar en localStorage cuando cambia el valor
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

---

### 5. Migración de Constantes

#### 5.1 Constantes de Dominio
**Archivo `src/shared/constants/domain.constants.ts`:**
```typescript
import { Sport, Channel, Bookmaker } from '@shared/types';

/**
 * Deportes disponibles
 */
export const ALL_SPORTS: Sport[] = [
  'Fútbol',
  'Baloncesto',
  'Tenis',
  'Balonmano',
  'Voleibol',
  'Hockey',
  'Béisbol',
  'Fútbol Americano',
  'Rugby',
  'MMA/Boxeo',
  'Esports',
  'Otros',
];

/**
 * Canales de tipsters
 */
export const ALL_CHANNELS: Channel[] = [
  'Telegram',
  'BlogaBet',
  'Twitter/X',
  'Discord',
  'Instagram',
  'YouTube',
  'Podcast',
  'Web propia',
  'Otro',
];

/**
 * Casas de apuestas
 */
export const ALL_BOOKMAKERS: Bookmaker[] = [
  'Bet365',
  'Codere',
  'Bwin',
  'Betway',
  '888sport',
  'William Hill',
  'Betsson',
  'LeoVegas',
  'Otra',
];

/**
 * Iconos por deporte (emojis)
 */
export const SPORT_ICONS: Record<Sport, string> = {
  Fútbol: '⚽',
  Baloncesto: '🏀',
  Tenis: '🎾',
  Balonmano: '🤾',
  Voleibol: '🏐',
  Hockey: '🏒',
  Béisbol: '⚾',
  'Fútbol Americano': '🏈',
  Rugby: '🏉',
  'MMA/Boxeo': '🥊',
  Esports: '🎮',
  Otros: '🏆',
};

/**
 * Resultados posibles
 */
export const PICK_RESULTS = ['Ganada', 'Perdida', 'Void', 'Pendiente'];

/**
 * Tipos de pick
 */
export const PICK_TYPES = ['Pre', 'Live', 'Combinado'];
```

#### 5.2 Constantes de UI
**Archivo `src/shared/constants/ui.constants.ts`:**
```typescript
/**
 * Colores para gráficos (Chart.js)
 */
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Deep Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

/**
 * Opciones de ordenación del dashboard
 */
export const SORT_OPTIONS = [
  { value: 'yield', label: 'Yield' },
  { value: 'winrate', label: 'Winrate' },
  { value: 'totalPicks', label: 'Total Picks' },
  { value: 'name', label: 'Nombre' },
];

/**
 * Opciones de días para última pick
 */
export const LAST_PICK_DAYS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 90 días' },
];
```

#### 5.3 Archivo Índice de Constantes
**Archivo `src/shared/constants/index.ts`:**
```typescript
export {
  ALL_SPORTS,
  ALL_CHANNELS,
  ALL_BOOKMAKERS,
  SPORT_ICONS,
  PICK_RESULTS,
  PICK_TYPES,
} from './domain.constants';

export {
  CHART_COLORS,
  SORT_OPTIONS,
  LAST_PICK_DAYS_OPTIONS,
} from './ui.constants';
```

---

### 6. Utilidades Compartidas

#### 6.1 Date Utils
**Archivo `src/shared/utils/date.utils.ts`:**
```typescript
/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una hora HH:MM
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // Asegurar HH:MM
};

/**
 * Combina fecha y hora en formato ISO completo
 */
export const formatDateTime = (date: string, time: string): string => {
  return `${date}T${time}:00.000Z`;
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Obtiene la hora actual en formato HH:MM
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Calcula días desde una fecha
 */
export const daysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
```

#### 6.2 Calculation Utils
**Archivo `src/shared/utils/calculation.utils.ts`:**
```typescript
import type { PickEntity, FollowEntity } from '@shared/types';

/**
 * Calcula el profit de una pick
 */
export const calculatePickProfit = (pick: PickEntity): number => {
  if (!pick.isResolved) return 0;

  switch (pick.result) {
    case 'Ganada':
      return (pick.odds - 1) * pick.stake;
    case 'Perdida':
      return -pick.stake;
    case 'Void':
      return 0;
    default:
      return 0;
  }
};

/**
 * Calcula el profit de un follow
 */
export const calculateFollowProfit = (follow: FollowEntity): number => {
  if (!follow.userIsResolved) return 0;

  switch (follow.userResult) {
    case 'Ganada':
      return (follow.userOdds - 1) * follow.userStake;
    case 'Perdida':
      return -follow.userStake;
    case 'Void':
      return 0;
    default:
      return 0;
  }
};

/**
 * Calcula el yield dado profit y stake total
 */
export const calculateYield = (profit: number, totalStaked: number): number => {
  if (totalStaked === 0) return 0;
  return (profit / totalStaked) * 100;
};

/**
 * Calcula el winrate dados picks ganadas y totales
 */
export const calculateWinrate = (won: number, total: number): number => {
  if (total === 0) return 0;
  return (won / total) * 100;
};

/**
 * Calcula el promedio de un array de números
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum / numbers.length;
};

/**
 * Redondea un número a N decimales
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${roundTo(value, decimals)}%`;
};

/**
 * Formatea un número como unidades con signo
 */
export const formatUnits = (value: number, decimals: number = 2): string => {
  const rounded = roundTo(value, decimals);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}u`;
};
```

#### 6.3 Validation Utils
**Archivo `src/shared/utils/validation.utils.ts`:**
```typescript
/**
 * Valida que un stake esté entre 1 y 10
 */
export const isValidStake = (stake: number): boolean => {
  return stake >= 1 && stake <= 10;
};

/**
 * Valida que odds sean mayores a 1.0
 */
export const isValidOdds = (odds: number): boolean => {
  return odds > 1.0;
};

/**
 * Valida que un string no esté vacío
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida que una contraseña tenga al menos 6 caracteres
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
```

#### 6.4 Archivo Índice de Utils
**Archivo `src/shared/utils/index.ts`:**
```typescript
export * from './date.utils';
export * from './calculation.utils';
export * from './validation.utils';
```

---

### 7. Actualizar App.tsx con Providers

**Archivo `src/App.tsx`:**
```typescript
import { FC } from 'react';
import { AppProviders } from '@core/providers/AppProviders';

const App: FC = () => {
  return (
    <AppProviders>
      <div className="app">
        <h1>Tipster Tracker - React Migration</h1>
        <p>Phase 0: Setup Complete ✅</p>
        <p>Phase 1: Fundamentos y Abstracciones ✅</p>
        <ul>
          <li>✅ Tipos TypeScript definidos</li>
          <li>✅ Repositorios con Repository Pattern</li>
          <li>✅ Context API configurado</li>
          <li>✅ Custom hooks base</li>
          <li>✅ Constantes migradas</li>
          <li>✅ Utilidades implementadas</li>
        </ul>
      </div>
    </AppProviders>
  );
};

export default App;
```

---

### 8. Checklist de Verificación de Fase 1

#### ✅ Tipos TypeScript
- [ ] Tipos de dominio definidos
- [ ] Entidades y DTOs creados
- [ ] Tipos de estadísticas definidos
- [ ] Tipos de filtros definidos
- [ ] Archivo index de tipos exportando todo

#### ✅ Abstracciones Firebase
- [ ] Interface IRepository creada
- [ ] Clase base FirestoreRepositoryBase implementada
- [ ] TipsterRepository funcionando
- [ ] PickRepository funcionando
- [ ] FollowRepository funcionando

#### ✅ Context API
- [ ] FirebaseProvider implementado
- [ ] AuthProvider implementado
- [ ] AppProviders composición creada
- [ ] Hooks useFirebase y useAuth funcionando

#### ✅ Custom Hooks
- [ ] useRepository implementado y testeado
- [ ] useAsync implementado
- [ ] useDebounce implementado
- [ ] useLocalStorage implementado

#### ✅ Constantes
- [ ] ALL_SPORTS, ALL_CHANNELS, ALL_BOOKMAKERS definidos
- [ ] SPORT_ICONS mapeado
- [ ] CHART_COLORS definido
- [ ] Constantes de UI definidas

#### ✅ Utilidades
- [ ] date.utils con todas las funciones
- [ ] calculation.utils con fórmulas
- [ ] validation.utils con validaciones
- [ ] Todos los utils exportados en index

#### ✅ Integración
- [ ] App.tsx usando AppProviders
- [ ] No hay errores de TypeScript
- [ ] Compilación exitosa

---

### 9. Comandos de Verificación Final

```powershell
# 1. Verificar que no hay errores de TypeScript
npx tsc --noEmit

# 2. Verificar linting
npm run lint

# 3. Verificar build
npm run build

# 4. Verificar dev server
npm run dev
# Debe mostrar la app con el checklist de Fase 1

# 5. Probar conexión a Firebase Emulators
# En otra terminal, desde la raíz del proyecto original:
cd ..
firebase emulators:start

# Verificar en consola del navegador que se conecta a emulators
```

---

### 10. Testing Manual de Abstracciones

**Crear archivo temporal `src/test-phase1.ts`:**
```typescript
import { db } from '@core/config/firebase.config';
import { TipsterRepository } from '@features/tipsters/services/tipster.repository';

// Función de prueba (ejecutar desde consola del navegador)
export async function testPhase1() {
  const userId = 'test-user-id';
  const tipsterRepo = new TipsterRepository(db, userId);

  try {
    // Test: Crear tipster
    console.log('Creating tipster...');
    const newTipster = await tipsterRepo.create({
      name: 'Test Tipster',
      channel: 'Telegram',
    });
    console.log('✅ Tipster created:', newTipster);

    // Test: Obtener todos
    console.log('Getting all tipsters...');
    const allTipsters = await tipsterRepo.getAll();
    console.log('✅ All tipsters:', allTipsters);

    // Test: Actualizar
    console.log('Updating tipster...');
    await tipsterRepo.update(newTipster.id, { name: 'Updated Tipster' });
    console.log('✅ Tipster updated');

    // Test: Eliminar
    console.log('Deleting tipster...');
    await tipsterRepo.delete(newTipster.id);
    console.log('✅ Tipster deleted');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Exponer en window para testing manual
if (typeof window !== 'undefined') {
  (window as any).testPhase1 = testPhase1;
}
```

**Para probar:**
1. Abrir navegador en `http://localhost:3000`
2. Abrir consola del navegador
3. Ejecutar: `window.testPhase1()`
4. Verificar logs de éxito

---

### 11. Siguientes Pasos

Una vez completada la Fase 1:

1. **Code Review**: Revisar toda la capa de abstracciones
2. **Documentar Decisiones**: Crear ADR para Repository Pattern
3. **Merge a develop-react**:
   ```powershell
   git checkout develop-react
   git merge feature/fundamentals-phase1
   git push origin develop-react
   ```
4. **Iniciar Fase 2**: Crear branch `feature/design-system-phase2`

---

### 12. Recursos y Referencias

#### Principios SOLID en TypeScript
- [SOLID Principles in TypeScript](https://khalilstemmler.com/articles/solid-principles/solid-typescript/)
- [Clean Architecture in TypeScript](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

#### Repository Pattern
- [Repository Pattern in TypeScript](https://javascript.plainenglish.io/repository-pattern-in-typescript-b98fb1c006e0)
- [Generic Repository Pattern](https://www.codeproject.com/Articles/1160586/Generic-Repository-Pattern-in-TypeScript)

#### React Context API
- [React Context API](https://react.dev/reference/react/useContext)
- [Context Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

---

## ✅ Criterios de Éxito de Fase 1

La Fase 1 se considera **completada** cuando:

1. ✅ Todos los tipos TypeScript están definidos y exportados correctamente
2. ✅ Los 3 repositorios (Tipster, Pick, Follow) están implementados y funcionan
3. ✅ Context API está configurado y los providers funcionan
4. ✅ Los 4 custom hooks base están implementados
5. ✅ Constantes y utilidades migradas y testeadas
6. ✅ No hay errores de TypeScript ni ESLint
7. ✅ Build exitoso
8. ✅ Tests manuales de repositorios pasando
9. ✅ Code review aprobado
10. ✅ Branch mergeado a develop-react

**Importante**: Esta fase establece las bases arquitectónicas. Todo el código debe seguir principios SOLID antes de pasar a la siguiente fase.

---

## FASE 2: Shared Components y Design System (Detallado)

### Duración Estimada
**3-4 semanas** (60-80 horas de trabajo)

### Objetivos de la Fase
1. Migrar el design system CSS actual a CSS Modules
2. Crear biblioteca de componentes UI reutilizables
3. Implementar sistema de iconos con Lucide React
4. Desarrollar componentes de layout
5. Implementar componentes de feedback y utilidad
6. (Opcional) Configurar Storybook para documentación

**Nota**: Esta fase se centra exclusivamente en componentes visuales sin lógica de negocio. Todos los componentes deben ser "tontos" (presentational components).

**Importante**: Todos los componentes usarán **Tailwind CSS** con utility classes. No se crearán archivos `.module.css`. Se utilizará la función `cn()` para combinar clases.

---

### 1. Componentes con Tailwind CSS

#### 1.1 Patrón de Componentes
Todos los componentes seguirán este patrón:
- Usar utility classes de Tailwind directamente
- Utilizar la función `cn()` para combinar clases condicionales
- Aprovechar las clases custom del `@layer components` cuando sea necesario
- Mantener componentes pequeños y reutilizables

#### 1.2 Ejemplo de uso de cn()
**Recordatorio de la función `cn()` (ya creada en Fase 0):**
```typescript
import { cn } from '@shared/utils/cn';

// Ejemplo 1: Clases condicionales
<button
  className={cn(
    'btn btn-primary',
    isLoading && 'opacity-50 cursor-not-allowed',
    fullWidth && 'w-full'
  )}
>
  Click me
</button>

// Ejemplo 2: Variantes
<div
  className={cn(
    'px-4 py-2 rounded',
    variant === 'primary' && 'bg-primary text-white',
    variant === 'secondary' && 'bg-surface text-text'
  )}
/>
```

---

### 2. Componentes UI Base con Tailwind CSS

#### 2.1 Button Component
**Archivo `src/shared/components/ui/Button/Button.tsx`:**
```typescript
import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'base' | 'lg';
  fullWidth?: boolean;
  iconOnly?: boolean;
  children: ReactNode;
}

/**
 * Componente Button reutilizable con Tailwind CSS
 * Aplica SRP: solo renderiza un botón con estilos
 */
export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'base',
  fullWidth = false,
  iconOnly = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Estilos base
        'inline-flex items-center justify-center gap-2',
        'rounded-base font-medium whitespace-nowrap select-none',
        'transition-all duration-normal',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        
        // Variantes
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'outline' && 'btn-outline',
        variant === 'danger' && 'btn-danger',
        
        // Tamaños
        size === 'sm' && 'px-16 py-8 text-sm',
        size === 'base' && 'px-24 py-12 text-base',
        size === 'lg' && 'px-32 py-16 text-lg',
        
        // Modificadores
        fullWidth && 'w-full',
        iconOnly && 'p-12 aspect-square',
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Archivo `src/shared/components/ui/Button/index.ts`:**
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

#### 2.2 Input Component
**Archivo `src/shared/components/ui/Input/Input.tsx`:**
```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}

.label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.required::after {
  content: ' *';
  color: var(--color-error);
}

.inputContainer {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  background-color: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal) var(--ease);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--color-info);
}

.withIcon {
  padding-left: var(--space-32);
}

.icon {
  position: absolute;
  left: var(--space-12);
  color: var(--color-info);
  pointer-events: none;
}

.error {
  border-color: var(--color-error);
}

.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.errorMessage {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.helperText {
  font-size: var(--font-size-xs);
  color: var(--color-info);
}
```

**Archivo `src/shared/components/ui/Input/Input.tsx`:**
```typescript
import { FC, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

/**
 * Componente Input reutilizable con Tailwind CSS
 */
export const Input: FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  required,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-text">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-12 text-info pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'input',
            icon && 'pl-32',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-info">{helperText}</span>
      )}
    </div>
  );
};
```

**Archivo `src/shared/components/ui/Input/index.ts`:**
```typescript
export { Input } from './Input';
export type { InputProps } from './Input';
```

#### 2.3 Card Component
**Archivo `src/shared/components/ui/Card/Card.tsx`:**
```typescript
import { FC, ReactNode, HTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  clickable?: boolean;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Componente Card principal con Tailwind CSS
 */
export const Card: FC<CardProps> = ({
  children,
  clickable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'card',
        clickable && 'cursor-pointer hover:border-white/10 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header
 */
export const CardHeader: FC<CardSectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-24 py-20 border-b border-white/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Body
 */
export const CardBody: FC<CardSectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('p-24', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Footer
 */
export const CardFooter: FC<CardSectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-24 py-16 border-t border-white/5 bg-black/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

**Archivo `src/shared/components/ui/Card/index.ts`:**
```typescript
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardSectionProps } from './Card';
```

#### 2.4 Modal Component
**Archivo `src/shared/components/ui/Modal/Modal.tsx`:**
```typescript
import { FC, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Componente Modal reutilizable con Tailwind CSS
 * Se renderiza en un portal para evitar problemas de z-index
 */
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-16 animate-in fade-in duration-normal"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg shadow-lg max-w-[600px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-normal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-24 py-20 border-b border-white/5">
            <h2 className="text-xl font-semibold text-text">{title}</h2>
            <button
              className="flex items-center justify-center w-8 h-8 border-0 bg-transparent text-info rounded-base cursor-pointer transition-all duration-fast hover:bg-white/10 hover:text-text"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-24 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="flex gap-3 justify-end px-24 py-16 border-t border-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
```

**Archivo `src/shared/components/ui/Modal/index.ts`:**
```typescript
export { Modal } from './Modal';
export type { ModalProps } from './Modal';
```

#### 2.5 Select Component
**Archivo `src/shared/components/ui/Select/Select.tsx`:**
```typescript
import { FC, SelectHTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Componente Select reutilizable con Tailwind CSS
 */
export const Select: FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  required,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-text">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full px-16 py-12 bg-surface border border-white/10 rounded-base',
          'text-text text-base cursor-pointer transition-all duration-normal',
          'appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%236B7280\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3E%3Cpolyline points=\\'6 9 12 15 18 9\\'%3E%3C/polyline%3E%3C/svg%3E\")]',
          'bg-no-repeat bg-[right_12px_center] pr-32',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      >\n        {placeholder && (\n          <option value=\"\" disabled>\n            {placeholder}\n          </option>\n        )}\n        {options.map((option) => (\n          <option key={option.value} value={option.value}>\n            {option.label}\n          </option>\n        ))}\n      </select>\n      {error && <span className=\"text-xs text-error\">{error}</span>}\n    </div>\n  );\n};
```

**Archivo `src/shared/components/ui/Select/index.ts`:**
```typescript
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';
```

#### 2.6 Badge Component
**Archivo `src/shared/components/ui/Badge/Badge.tsx`:**
```typescript
import { FC, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

export interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'primary';
  children: ReactNode;
  className?: string;
}

/**
 * Componente Badge para estados y etiquetas con Tailwind CSS
 */
export const Badge: FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        'status-badge',
        variant === 'success' && 'status-success',
        variant === 'error' && 'status-error',
        variant === 'warning' && 'status-warning',
        variant === 'info' && 'status-info',
        variant === 'primary' && 'bg-primary/10 text-primary border border-primary/20',
        className
      )}
    >
      {children}
    </span>
  );
};
```

**Archivo `src/shared/components/ui/Badge/index.ts`:**
```typescript
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
```

#### 2.7 Archivo Índice de UI Components
**Archivo `src/shared/components/ui/index.ts`:**
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardSectionProps } from './Card';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
```

---

### 3. Componentes de Feedback

#### 3.1 Loading Component
**Archivo `src/shared/components/feedback/Loading/Loading.tsx`:**
```typescript
import { FC } from 'react';
import { createPortal } from 'react-dom';

export interface LoadingProps {
  text?: string;
}

/**
 * Componente Loading overlay con Tailwind CSS
 */
export const Loading: FC<LoadingProps> = ({ text = 'Cargando...' }) => {
  const content = (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
        {text && <p className="text-text text-base">{text}</p>}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
```

**Archivo `src/shared/components/feedback/Loading/index.ts`:**
```typescript
export { Loading } from './Loading';
export type { LoadingProps } from './Loading';
```

#### 3.2 EmptyState Component
**Archivo `src/shared/components/feedback/EmptyState/EmptyState.tsx`:**
```typescript
import { FC, ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Componente para mostrar estado vacío con Tailwind CSS
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-32 text-center text-info">
      {icon && <div className="mb-4 text-info opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {description && <p className="text-base text-info mb-6 max-w-[400px]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
```

**Archivo `src/shared/components/feedback/EmptyState/index.ts`:**
```typescript
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
```

#### 3.3 Archivo Índice de Feedback Components
**Archivo `src/shared/components/feedback/index.ts`:**
```typescript
export { Loading } from './Loading';
export type { LoadingProps } from './Loading';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
```

---

### 4. Componentes de Layout

#### 4.1 Header Component
**Archivo `src/shared/components/layout/Header/Header.module.css`:**
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: var(--shadow-sm);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) var(--space-24);
  max-width: 1440px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
}

.logoIcon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.navLink {
  padding: var(--space-8) var(--space-16);
  border-radius: var(--radius-base);
  color: var(--color-info);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast) var(--ease);
}

.navLink:hover {
  color: var(--color-text);
  background-color: rgba(255, 255, 255, 0.05);
}

.navLink.active {
  color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.userSection {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.userEmail {
  font-size: var(--font-size-sm);
  color: var(--color-info);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: var(--space-16);
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .userSection {
    width: 100%;
    justify-content: space-between;
  }
}
```

**Archivo `src/shared/components/layout/Header/Header.tsx`:**
```typescript
import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export interface HeaderProps {
  logo?: ReactNode;
  userEmail?: string;
  onLogout?: () => void;
  children?: ReactNode;
}

/**
 * Componente Header de la aplicación
 */
export const Header: FC<HeaderProps> = ({
  logo,
  userEmail,
  onLogout,
  children,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          {logo}
        </NavLink>

        {children && <nav className={styles.nav}>{children}</nav>}

        <div className={styles.userSection}>
          {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
          {onLogout && (
            <button onClick={onLogout} className="btn btn--outline btn--sm">
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * Componente NavLink del Header
 */
export const HeaderNavLink: FC<{
  to: string;
  children: ReactNode;
}> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.active : ''}`
      }
    >
      {children}
    </NavLink>
  );
};
```

**Archivo `src/shared/components/layout/Header/index.ts`:**
```typescript
export { Header, HeaderNavLink } from './Header';
export type { HeaderProps } from './Header';
```

#### 4.2 Container Component
**Archivo `src/shared/components/layout/Container/Container.tsx`:**
```typescript
import { FC, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

export interface ContainerProps {
  children: ReactNode;
  size?: 'narrow' | 'default' | 'wide';
  className?: string;
}

/**
 * Componente Container para limitar ancho de contenido con Tailwind CSS
 */
export const Container: FC<ContainerProps> = ({
  children,
  size = 'default',
  className = '',
}) => {
  return (
    <div
      className={cn(
        'w-full mx-auto px-6 md:px-4',
        size === 'narrow' && 'max-w-[960px]',
        size === 'default' && 'max-w-[1440px]',
        size === 'wide' && 'max-w-[1920px]',
        className
      )}
    >
      {children}
    </div>
  );
};
```

**Archivo `src/shared/components/layout/Container/index.ts`:**
```typescript
export { Container } from './Container';
export type { ContainerProps } from './Container';
```

#### 4.3 Archivo Índice de Layout Components
**Archivo `src/shared/components/layout/index.ts`:**
```typescript
export { Header, HeaderNavLink } from './Header';
export type { HeaderProps } from './Header';

export { Container } from './Container';
export type { ContainerProps } from './Container';
```

---

### 5. Archivo Índice Global de Componentes

**Archivo `src/shared/components/index.ts`:**
```typescript
// UI Components
export * from './ui';

// Feedback Components
export * from './feedback';

// Layout Components
export * from './layout';
```

---

### 6. Implementar Lucide React Icons

**Ya instalado en Fase 0**, solo crear helper para uso consistente:

**Archivo `src/shared/components/ui/Icon/Icon.tsx`:**
```typescript
import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Wrapper para iconos de Lucide React
 * Proporciona props consistentes
 */
export const Icon: FC<IconProps> = ({
  icon: IconComponent,
  size = 20,
  className = '',
  color,
}) => {
  return (
    <IconComponent size={size} className={className} color={color} />
  );
};
```

**Uso de iconos:**
```typescript
import { Home, User, Settings } from 'lucide-react';

<Icon icon={Home} size={24} />
<Home size={20} /> // Uso directo también válido
```

---

### 7. Actualizar App.tsx para Mostrar Componentes

**Archivo `src/App.tsx`:**
```typescript
import { FC, useState } from 'react';
import { AppProviders } from '@core/providers/AppProviders';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardBody,
  Modal,
  Badge,
  Loading,
  EmptyState,
} from '@shared/components';
import { Home, Search, Package } from 'lucide-react';

const App: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  return (
    <AppProviders>
      <div style={{ padding: '2rem' }}>
        <h1>Tipster Tracker - React Migration</h1>
        <p>✅ Phase 0: Setup Complete</p>
        <p>✅ Phase 1: Fundamentos y Abstracciones</p>
        <p>✅ Phase 2: Shared Components y Design System</p>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Buttons */}
          <section>
            <h2>Buttons</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2>Inputs</h2>
            <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Email" type="email" placeholder="tu@email.com" />
              <Input 
                label="Contraseña" 
                type="password" 
                required 
                icon={<Home size={16} />}
              />
              <Input 
                label="Con error" 
                error="Este campo es requerido" 
              />
              <Select
                label="Deporte"
                options={[
                  { value: 'futbol', label: 'Fútbol' },
                  { value: 'baloncesto', label: 'Baloncesto' },
                  { value: 'tenis', label: 'Tenis' },
                ]}
                placeholder="Selecciona un deporte"
              />
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2>Badges</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Badge variant="success">Ganada</Badge>
              <Badge variant="error">Perdida</Badge>
              <Badge variant="warning">Void</Badge>
              <Badge variant="info">Pendiente</Badge>
              <Badge variant="primary">Premium</Badge>
            </div>
          </section>

          {/* Card */}
          <section>
            <h2>Card</h2>
            <Card style={{ maxWidth: '400px' }}>
              <CardHeader>
                <h3>Tipster Card</h3>
              </CardHeader>
              <CardBody>
                <p>Este es el contenido de la card</p>
              </CardBody>
            </Card>
          </section>

          {/* Modal */}
          <section>
            <h2>Modal</h2>
            <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Modal de Ejemplo"
              footer={
                <>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>
                    Aceptar
                  </Button>
                </>
              }
            >
              <p>Este es el contenido del modal</p>
            </Modal>
          </section>

          {/* Loading */}
          <section>
            <h2>Loading</h2>
            <Button onClick={() => {
              setShowLoading(true);
              setTimeout(() => setShowLoading(false), 2000);
            }}>
              Mostrar Loading (2s)
            </Button>
            {showLoading && <Loading text="Cargando datos..." />}
          </section>

          {/* Empty State */}
          <section>
            <h2>Empty State</h2>
            <EmptyState
              icon={<Package size={48} />}
              title="No hay picks"
              description="Aún no has creado ninguna pick. Comienza añadiendo tu primera pick."
              action={<Button>Añadir Pick</Button>}
            />
          </section>
        </div>
      </div>
    </AppProviders>
  );
};

export default App;
```

---

### 8. Checklist de Verificación de Fase 2

#### ✅ Estilos Globales
- [ ] reset.css implementado
- [ ] variables.css (ya de Fase 0)
- [ ] global.css con utility classes
- [ ] Estilos aplicados correctamente en toda la app

#### ✅ Componentes UI
- [ ] Button con todas las variantes
- [ ] Input con label, error, icon
- [ ] Select con opciones
- [ ] Card con Header, Body, Footer
- [ ] Modal con portal y animaciones
- [ ] Badge con variantes de estado

#### ✅ Componentes Feedback
- [ ] Loading overlay funcional
- [ ] EmptyState con icon, title, description, action

#### ✅ Componentes Layout
- [ ] Header con logo, nav, user section
- [ ] Container con tamaños (narrow, default, wide)
- [ ] Responsive correctamente

#### ✅ Iconos
- [ ] Lucide React funcionando
- [ ] Iconos usados en componentes

#### ✅ Integración
- [ ] Todos los componentes exportados en index.ts
- [ ] App.tsx mostrando todos los componentes
- [ ] No hay errores de TypeScript
- [ ] Estilos aplicados correctamente

---

### 9. Comandos de Verificación Final

```powershell
# 1. Verificar TypeScript
npx tsc --noEmit

# 2. Verificar linting
npm run lint

# 3. Verificar build
npm run build

# 4. Verificar dev server
npm run dev
# Abrir http://localhost:3000 y verificar que todos los componentes se ven bien

# 5. Verificar responsive
# Abrir DevTools y probar diferentes tamaños de pantalla
```

---

### 10. Storybook (Opcional)

**Si decides implementar Storybook:**

```powershell
# Instalar Storybook
npx storybook@latest init

# Crear stories para cada componente
# Ejemplo: src/shared/components/ui/Button/Button.stories.tsx
```

**Ejemplo de Story:**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};
```

---

### 11. Siguientes Pasos

Una vez completada la Fase 2:

1. **Documentar Componentes**: Crear ADR sobre decisiones de diseño
2. **Testing Visual**: Probar todos los componentes manualmente
3. **Merge a develop-react**:
   ```powershell
   git checkout develop-react
   git merge feature/design-system-phase2
   git push origin develop-react
   ```
4. **Iniciar Fase 3**: Crear branch `feature/auth-phase3`

---

### 12. Recursos y Referencias

#### CSS Modules
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [CSS Modules with Vite](https://vitejs.dev/guide/features.html#css-modules)

#### Lucide React
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Icon Search](https://lucide.dev/icons/)

#### Component Design
- [Component-Driven Development](https://www.componentdriven.org/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

#### Accessibility
- [WAI-ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [React Accessibility](https://react.dev/learn/accessibility)

---

## ✅ Criterios de Éxito de Fase 2

La Fase 2 se considera **completada** cuando:

1. ✅ Todos los componentes UI base están implementados
2. ✅ CSS Modules funcionando correctamente
3. ✅ Design system migrado y aplicado
4. ✅ Componentes responsive en mobile y desktop
5. ✅ Lucide Icons integrado
6. ✅ Loading y EmptyState funcionando
7. ✅ Layout components implementados
8. ✅ App.tsx mostrando galería de componentes
9. ✅ No hay errores de TypeScript ni ESLint
10. ✅ Build exitoso
11. ✅ Code review aprobado
12. ✅ Branch mergeado a develop-react

**Importante**: Esta fase proporciona la base visual. Todos los componentes deben ser reutilizables y seguir el design system establecido.

---

## FASE 3: Feature - Authentication (Detallado)

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo)

### Objetivos de la Fase
1. Implementar servicio de autenticación abstrayendo Firebase
2. Crear AuthContext y hook useAuth para gestión de sesión
3. Migrar pantallas de login y signup a React
4. Implementar recuperación de contraseña (forgot password)
5. Crear sistema de rutas protegidas (PrivateRoute)
6. Implementar persistencia de sesión
7. Manejo de estados de carga y errores

**Nota**: Esta es la primera feature completa. Aplica arquitectura feature-based: todo el código de autenticación vive en `src/features/auth/`.

---

### 1. Estructura del Feature Auth

```
src/features/auth/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.module.css
│   │   └── index.ts
│   ├── SignupForm/
│   │   ├── SignupForm.tsx
│   │   ├── SignupForm.module.css
│   │   └── index.ts
│   ├── ForgotPasswordForm/
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ForgotPasswordForm.module.css
│   │   └── index.ts
│   └── PrivateRoute/
│       ├── PrivateRoute.tsx
│       └── index.ts
├── hooks/
│   ├── useAuth.ts
│   └── index.ts
├── pages/
│   ├── LoginPage/
│   │   ├── LoginPage.tsx
│   │   ├── LoginPage.module.css
│   │   └── index.ts
│   ├── SignupPage/
│   │   ├── SignupPage.tsx
│   │   ├── SignupPage.module.css
│   │   └── index.ts
│   └── index.ts
├── providers/
│   ├── AuthProvider.tsx
│   └── index.ts
├── services/
│   ├── auth.service.interface.ts
│   ├── firebase-auth.service.ts
│   └── index.ts
├── types/
│   ├── auth.types.ts
│   └── index.ts
└── index.ts
```

---

### 2. Types de Autenticación

**Archivo `src/features/auth/types/auth.types.ts`:**
```typescript
/**
 * Usuario autenticado
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Errores de autenticación de Firebase
 */
export enum AuthErrorCode {
  INVALID_EMAIL = 'auth/invalid-email',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
}

/**
 * Mapeo de errores a mensajes en español
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCode.INVALID_EMAIL]: 'El email no es válido',
  [AuthErrorCode.USER_DISABLED]: 'Esta cuenta ha sido deshabilitada',
  [AuthErrorCode.USER_NOT_FOUND]: 'No existe una cuenta con este email',
  [AuthErrorCode.WRONG_PASSWORD]: 'Contraseña incorrecta',
  [AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'Este email ya está registrado',
  [AuthErrorCode.WEAK_PASSWORD]: 'La contraseña debe tener al menos 6 caracteres',
  [AuthErrorCode.TOO_MANY_REQUESTS]: 'Demasiados intentos. Inténtalo más tarde',
  [AuthErrorCode.NETWORK_REQUEST_FAILED]: 'Error de conexión. Verifica tu internet',
};
```

**Archivo `src/features/auth/types/index.ts`:**
```typescript
export type {
  User,
  LoginCredentials,
  SignupData,
  AuthState,
} from './auth.types';
export { AuthErrorCode, AUTH_ERROR_MESSAGES } from './auth.types';
```

---

### 3. Auth Service (Interface y Implementación)

**Archivo `src/features/auth/services/auth.service.interface.ts`:**
```typescript
import { User, LoginCredentials, SignupData } from '../types';

/**
 * Interface del servicio de autenticación
 * Aplica DIP: componentes dependen de esta abstracción, no de Firebase
 */
export interface IAuthService {
  /**
   * Login con email y password
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Registro de nuevo usuario
   */
  signup(data: SignupData): Promise<User>;

  /**
   * Cerrar sesión
   */
  logout(): Promise<void>;

  /**
   * Enviar email de recuperación de contraseña
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null;

  /**
   * Observar cambios en autenticación
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
```

**Archivo `src/features/auth/services/firebase-auth.service.ts`:**
```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@core/config/firebase.config';
import { IAuthService } from './auth.service.interface';
import { User, LoginCredentials, SignupData } from '../types';

/**
 * Implementación del servicio de autenticación con Firebase
 * Aplica SRP: solo se encarga de autenticación
 * Aplica DIP: implementa IAuthService
 */
export class FirebaseAuthService implements IAuthService {
  /**
   * Convierte FirebaseUser a nuestro tipo User
   */
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  /**
   * Login con email y password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(error.code || 'Error al iniciar sesión');
    }
  }

  /**
   * Registro de nuevo usuario
   */
  async signup(data: SignupData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(error.code || 'Error al registrar usuario');
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.code || 'Error al cerrar sesión');
    }
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordReset(auth, email);
    } catch (error: any) {
      throw new Error(error.code || 'Error al enviar email de recuperación');
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * Observar cambios en autenticación
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }
}

// Instancia singleton del servicio
export const authService = new FirebaseAuthService();
```

**Archivo `src/features/auth/services/index.ts`:**
```typescript
export type { IAuthService } from './auth.service.interface';
export { FirebaseAuthService, authService } from './firebase-auth.service';
```

---

### 4. AuthProvider y useAuth Hook

**Archivo `src/features/auth/providers/AuthProvider.tsx`:**
```typescript
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authService } from '../services';
import { User, LoginCredentials, SignupData, AuthState } from '../types';
import { AUTH_ERROR_MESSAGES } from '../types/auth.types';

/**
 * Contexto de autenticación
 */
export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticación
 * Gestiona el estado global de autenticación
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Listener de cambios en autenticación
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  /**
   * Obtener mensaje de error en español
   */
  const getErrorMessage = (error: any): string => {
    const errorCode = error.message || '';
    return AUTH_ERROR_MESSAGES[errorCode] || 'Error desconocido';
  };

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authService.login(credentials);
      // El usuario se actualizará automáticamente por onAuthStateChanged
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  }, []);

  /**
   * Signup
   */
  const signup = useCallback(async (data: SignupData) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authService.signup(data);
      // El usuario se actualizará automáticamente por onAuthStateChanged
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authService.logout();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  }, []);

  /**
   * Enviar email de recuperación
   */
  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMsg }));
      throw error;
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    sendPasswordResetEmail,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Archivo `src/features/auth/hooks/useAuth.ts`:**
```typescript
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

/**
 * Hook para acceder al contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
```

**Archivo `src/features/auth/hooks/index.ts`:**
```typescript
export { useAuth } from './useAuth';
```

---

### 5. Login Form Component

**Archivo `src/features/auth/components/LoginForm/LoginForm.tsx`:**
```typescript
import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button, Input } from '@shared/components';
import { Mail, Lock } from 'lucide-react';

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { login, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      // Error manejado por el provider
      console.error('Login error:', error);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-[400px]" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-text mb-2 text-center">
        Iniciar Sesión
      </h2>

      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={16} />}
        required
        autoComplete="email"
      />

      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock size={16} />}
        required
        autoComplete="current-password"
      />

      <div className="text-right -mt-2">
        <Link
          to="/forgot-password"
          className="text-primary text-sm no-underline transition-colors duration-150 ease-out hover:text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <p className="text-center mt-4 text-sm text-info">
        ¿No tienes cuenta?{' '}
        <Link
          to="/signup"
          className="text-primary no-underline font-medium transition-colors duration-150 ease-out hover:text-blue-600 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
};
```

**Archivo `src/features/auth/components/LoginForm/index.ts`:**
```typescript
export { LoginForm } from './LoginForm';
```

---

### 6. Signup Form Component

**Archivo `src/features/auth/components/SignupForm/SignupForm.tsx`:**
```typescript
import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button, Input } from '@shared/components';
import { Mail, Lock } from 'lucide-react';
import { isValidEmail, isValidPassword } from '@shared/utils/validation.utils';

export const SignupForm: FC = () => {
  const navigate = useNavigate();
  const { signup, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!isValidEmail(email)) {
      errors.email = 'Email no válido';
    }

    if (!isValidPassword(password)) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    try {
      await signup({ email, password });
      navigate('/');
    } catch (error) {
      // Error manejado por el provider
      console.error('Signup error:', error);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-[400px]" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-text mb-2 text-center">
        Crear Cuenta
      </h2>

      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationErrors((prev) => ({ ...prev, email: '' }));
        }}
        icon={<Mail size={16} />}
        error={validationErrors.email}
        required
        autoComplete="email"
      />

      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setValidationErrors((prev) => ({ ...prev, password: '' }));
        }}
        icon={<Lock size={16} />}
        error={validationErrors.password}
        required
        autoComplete="new-password"
      />

      <Input
        type="password"
        label="Confirmar Contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }}
        icon={<Lock size={16} />}
        error={validationErrors.confirmPassword}
        required
        autoComplete="new-password"
      />

      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-info">
        <strong>Requisitos de contraseña:</strong>
        <ul className="mt-1 ml-4 p-0">
          <li>Mínimo 6 caracteres</li>
          <li>Recomendado: incluir números y símbolos</li>
        </ul>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      <p className="text-center mt-4 text-sm text-info">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="text-primary no-underline font-medium transition-colors duration-150 ease-out hover:text-blue-600 hover:underline"
        >
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
};
```

**Archivo `src/features/auth/components/SignupForm/index.ts`:**
```typescript
export { SignupForm } from './SignupForm';
```

---

### 7. Forgot Password Form Component

**Archivo `src/features/auth/components/ForgotPasswordForm/ForgotPasswordForm.module.css`:**
```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-8);
  text-align: center;
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-info);
  text-align: center;
  margin-bottom: var(--space-8);
}

.error {
  padding: var(--space-12);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-base);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  text-align: center;
}

.success {
  padding: var(--space-12);
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-base);
  color: var(--color-success);
  font-size: var(--font-size-sm);
  text-align: center;
}

.footer {
  text-align: center;
  margin-top: var(--space-16);
  font-size: var(--font-size-sm);
  color: var(--color-info);
}

.backLink {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast) var(--ease);
}

.backLink:hover {
  color: #2563EB;
  text-decoration: underline;
}
```

**Archivo `src/features/auth/components/ForgotPasswordForm/ForgotPasswordForm.tsx`:**
```typescript
import { FC, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button, Input } from '@shared/components';
import { Mail } from 'lucide-react';
import { isValidEmail } from '@shared/utils/validation.utils';
import styles from './ForgotPasswordForm.module.css';

export const ForgotPasswordForm: FC = () => {
  const { sendPasswordResetEmail, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);
    setValidationError('');

    if (!isValidEmail(email)) {
      setValidationError('Email no válido');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      // Error manejado por el provider
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Recuperar Contraseña</h2>
      <p className={styles.description}>
        Ingresa tu email y te enviaremos un enlace para restablecer tu
        contraseña.
      </p>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>
          ✓ Email enviado. Revisa tu bandeja de entrada.
        </div>
      )}

      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationError('');
        }}
        icon={<Mail size={16} />}
        error={validationError}
        required
        autoComplete="email"
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
      </Button>

      <p className={styles.footer}>
        <Link to="/login" className={styles.backLink}>
          ← Volver al login
        </Link>
      </p>
    </form>
  );
};
```

**Archivo `src/features/auth/components/ForgotPasswordForm/index.ts`:**
```typescript
export { ForgotPasswordForm } from './ForgotPasswordForm';
```

---

### 8. Private Route Component

**Archivo `src/features/auth/components/PrivateRoute/PrivateRoute.tsx`:**
```typescript
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Loading } from '@shared/components';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rutas privadas
 * Redirige a /login si el usuario no está autenticado
 */
export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading text="Verificando sesión..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

**Archivo `src/features/auth/components/PrivateRoute/index.ts`:**
```typescript
export { PrivateRoute } from './PrivateRoute';
```

---

### 9. Auth Pages

**Archivo `src/features/auth/pages/LoginPage/LoginPage.tsx`:**
```typescript
import { FC } from 'react';
import { LoginForm } from '../../components/LoginForm';
import { TrendingUp } from 'lucide-react';

export const LoginPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <TrendingUp size={80} className="w-20 h-20 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-semibold text-text">Tipster Tracker</h1>
        </div>
        <div className="bg-surface rounded-xl p-8 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/auth/pages/LoginPage/index.ts`:**
```typescript
export { LoginPage } from './LoginPage';
```

**Archivo `src/features/auth/pages/SignupPage/SignupPage.tsx`:**
```typescript
import { FC } from 'react';
import { SignupForm } from '../../components/SignupForm';
import { TrendingUp } from 'lucide-react';

export const SignupPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <TrendingUp size={80} className="w-20 h-20 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-semibold text-text">Tipster Tracker</h1>
        </div>
        <div className="bg-surface rounded-xl p-8 shadow-lg">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/auth/pages/SignupPage/index.ts`:**
```typescript
export { SignupPage } from './SignupPage';
```

---

### 10. Configurar Rutas con React Router

**Actualizar `src/App.tsx`:**
```typescript
import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from '@core/providers/AppProviders';
import { AuthProvider } from '@features/auth/providers/AuthProvider';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { SignupPage } from '@features/auth/pages/SignupPage';
import { PrivateRoute } from '@features/auth/components/PrivateRoute';

// Página placeholder para dashboard (temporal)
const DashboardPage: FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>✅ Estás autenticado!</p>
    </div>
  );
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Rutas privadas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Redirect por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
```

---

### 11. Actualizar AppProviders

**Archivo `src/core/providers/AppProviders.tsx`:**
```typescript
import { FC, ReactNode } from 'react';
import { FirebaseProvider } from './FirebaseProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composición de todos los providers globales
 * AuthProvider se añade en App.tsx dentro de BrowserRouter
 */
export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return <FirebaseProvider>{children}</FirebaseProvider>;
};
```

---

### 12. Exports del Feature Auth

**Archivo `src/features/auth/index.ts`:**
```typescript
// Components
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { PrivateRoute } from './components/PrivateRoute';

// Pages
export { LoginPage } from './pages/LoginPage';
export { SignupPage } from './pages/SignupPage';

// Hooks
export { useAuth } from './hooks';

// Providers
export { AuthProvider } from './providers/AuthProvider';

// Types
export type { User, LoginCredentials, SignupData, AuthState } from './types';

// Services
export type { IAuthService } from './services';
export { authService } from './services';
```

---

### 13. Checklist de Verificación de Fase 3

#### ✅ Tipos y Servicios
- [ ] auth.types.ts implementado con User, LoginCredentials, SignupData
- [ ] IAuthService interface creada
- [ ] FirebaseAuthService implementado con todos los métodos
- [ ] Mapeo de errores de Firebase a español

#### ✅ Provider y Hooks
- [ ] AuthProvider implementado con estado global
- [ ] onAuthStateChanged listener configurado
- [ ] useAuth hook creado y funcionando
- [ ] Manejo de errores y loading states

#### ✅ Componentes de Formularios
- [ ] LoginForm con validación
- [ ] SignupForm con confirmación de password
- [ ] ForgotPasswordForm funcional
- [ ] Estilos CSS Modules aplicados

#### ✅ Rutas
- [ ] PrivateRoute component creado
- [ ] React Router configurado en App.tsx
- [ ] Rutas públicas: /login, /signup
- [ ] Rutas privadas protegidas
- [ ] Redirect a /login si no autenticado

#### ✅ Páginas
- [ ] LoginPage con logo y form
- [ ] SignupPage con logo y form
- [ ] Estilos responsivos

#### ✅ Integración
- [ ] AuthProvider en App.tsx
- [ ] Login → Dashboard funciona
- [ ] Signup → Dashboard funciona
- [ ] Logout funciona
- [ ] Persistencia de sesión funciona (refresh page)
- [ ] Password reset email se envía

#### ✅ Testing Manual
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas (error)
- [ ] Signup con email nuevo
- [ ] Signup con email existente (error)
- [ ] Logout y redirect a /login
- [ ] Protected route bloquea acceso sin auth
- [ ] Forgot password envía email
- [ ] Refresh page mantiene sesión

---

### 14. Comandos de Verificación Final

```powershell
# 1. Verificar TypeScript
npx tsc --noEmit

# 2. Verificar linting
npm run lint

# 3. Verificar build
npm run build

# 4. Ejecutar app en dev
npm run dev

# 5. Testing manual
# - Abrir http://localhost:3000
# - Debe redirigir a /login
# - Crear cuenta nueva
# - Cerrar sesión
# - Login con credenciales
# - Verificar que dashboard es accesible
# - Refresh page (debe mantener sesión)
# - Logout y verificar redirect
```

---

### 15. Testing con Firebase Emulators (Opcional)

```powershell
# Iniciar emulators
firebase emulators:start

# Modificar src/core/config/firebase.config.ts para usar emulators:
# if (window.location.hostname === 'localhost') {
#   connectAuthEmulator(auth, 'http://localhost:9099');
# }
```

---

### 16. Siguientes Pasos

Una vez completada la Fase 3:

1. **Commit y Push**:
   ```powershell
   git add .
   git commit -m "feat(auth): implement authentication feature (Phase 3)"
   git push origin feature/auth-phase3
   ```

2. **Merge a develop-react**:
   ```powershell
   git checkout develop-react
   git merge feature/auth-phase3
   git push origin develop-react
   ```

3. **Iniciar Fase 4**:
   ```powershell
   git checkout -b feature/tipsters-phase4
   ```

---

### 17. Recursos y Referencias

#### Firebase Auth
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Manage Users](https://firebase.google.com/docs/auth/web/manage-users)
- [Password Authentication](https://firebase.google.com/docs/auth/web/password-auth)

#### React Router v6
- [React Router Documentation](https://reactrouter.com/en/main)
- [Protected Routes](https://reactrouter.com/en/main/start/tutorial#protected-routes)

#### Context API
- [React Context Documentation](https://react.dev/learn/passing-data-deeply-with-context)
- [useContext Hook](https://react.dev/reference/react/useContext)

#### Form Validation
- [Form Validation Best Practices](https://web.dev/sign-in-form-best-practices/)
- [Accessible Forms](https://www.w3.org/WAI/tutorials/forms/)

---

## ✅ Criterios de Éxito de Fase 3

La Fase 3 se considera **completada** cuando:

1. ✅ Sistema de login/signup funcional
2. ✅ Password reset enviando emails
3. ✅ Protected routes bloqueando acceso no autenticado
4. ✅ Persistencia de sesión funcionando
5. ✅ Manejo de errores en español
6. ✅ Loading states en todos los formularios
7. ✅ Responsive en mobile y desktop
8. ✅ AuthProvider proporcionando contexto global
9. ✅ useAuth hook funcionando en componentes
10. ✅ No hay errores de TypeScript ni ESLint
11. ✅ Build exitoso
12. ✅ Testing manual completo
13. ✅ Code review aprobado
14. ✅ Branch mergeado a develop-react

**Importante**: Esta fase establece el patrón de feature-based architecture. Todas las siguientes features (Tipsters, Picks, Follows, Dashboard) seguirán esta misma estructura.

---

## FASE 4: Feature - Tipsters (Detallado)

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo)

### Objetivos de la Fase
1. Implementar CRUD completo de tipsters usando Repository Pattern
2. Crear hooks personalizados: useTipsters, useTipster, useTipsterStats
3. Migrar componentes: TipsterCard, TipsterList, TipsterForm
4. Implementar modal de añadir/editar tipster
5. Integrar con sistema de estadísticas
6. Implementar filtrado y búsqueda
7. Testing manual del feature

**Nota**: Esta feature utiliza el TipsterRepository creado en Fase 1 y los componentes UI de Fase 2.

---

### 1. Estructura del Feature Tipsters

```
src/features/tipsters/
├── components/
│   ├── TipsterCard/
│   │   ├── TipsterCard.tsx
│   │   ├── TipsterCard.module.css
│   │   └── index.ts
│   ├── TipsterList/
│   │   ├── TipsterList.tsx
│   │   ├── TipsterList.module.css
│   │   └── index.ts
│   ├── TipsterForm/
│   │   ├── TipsterForm.tsx
│   │   ├── TipsterForm.module.css
│   │   └── index.ts
│   ├── TipsterModal/
│   │   ├── TipsterModal.tsx
│   │   └── index.ts
│   ├── TipsterStats/
│   │   ├── TipsterStats.tsx
│   │   ├── TipsterStats.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useTipsters.ts
│   ├── useTipster.ts
│   ├── useTipsterStats.ts
│   ├── useTipsterModal.ts
│   └── index.ts
├── pages/
│   ├── TipstersPage/
│   │   ├── TipstersPage.tsx
│   │   ├── TipstersPage.module.css
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

---

### 2. Hooks Personalizados

#### 2.1 useTipsters Hook
**Archivo `src/features/tipsters/hooks/useTipsters.ts`:**
```typescript
import { useRepository } from '@core/hooks/useRepository';
import { tipsterRepository } from '@core/repositories';
import { TipsterEntity } from '@shared/types/entities.types';
import { useAuth } from '@features/auth';

/**
 * Hook para gestionar la lista de tipsters
 * Usa el repository pattern y se suscribe a cambios en tiempo real
 */
export const useTipsters = () => {
  const { user } = useAuth();

  const {
    data: tipsters,
    loading,
    error,
    refresh,
  } = useRepository<TipsterEntity>({
    repository: tipsterRepository,
    enabled: !!user,
    realtime: true,
  });

  return {
    tipsters: tipsters || [],
    loading,
    error,
    refresh,
  };
};
```

#### 2.2 useTipster Hook
**Archivo `src/features/tipsters/hooks/useTipster.ts`:**
```typescript
import { useState, useEffect } from 'react';
import { tipsterRepository } from '@core/repositories';
import { TipsterEntity } from '@shared/types/entities.types';

/**
 * Hook para obtener un tipster específico por ID
 */
export const useTipster = (tipsterId: string | null) => {
  const [tipster, setTipster] = useState<TipsterEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tipsterId) {
      setTipster(null);
      return;
    }

    let cancelled = false;

    const fetchTipster = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await tipsterRepository.getById(tipsterId);
        if (!cancelled) {
          setTipster(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar tipster');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTipster();

    return () => {
      cancelled = true;
    };
  }, [tipsterId]);

  return { tipster, loading, error };
};
```

#### 2.3 useTipsterStats Hook
**Archivo `src/features/tipsters/hooks/useTipsterStats.ts`:**
```typescript
import { useMemo } from 'react';
import { useTipsters } from './useTipsters';
import { calculateStats } from '@shared/utils/calculation.utils';
import { TipsterStats } from '@shared/types/stats.types';

/**
 * Hook para calcular estadísticas de un tipster específico
 * Necesita picks del tipster (se integra en Fase 5)
 */
export const useTipsterStats = (
  tipsterId: string,
  picks: any[] = [] // TODO: Tipar correctamente en Fase 5
): TipsterStats | null => {
  return useMemo(() => {
    if (!picks.length) {
      return null;
    }

    // Filtrar picks del tipster
    const tipsterPicks = picks.filter((pick) => pick.tipsterId === tipsterId);

    if (!tipsterPicks.length) {
      return null;
    }

    // Calcular estadísticas (función de Fase 1)
    return calculateStats(tipsterPicks) as TipsterStats;
  }, [tipsterId, picks]);
};
```

#### 2.4 useTipsterModal Hook
**Archivo `src/features/tipsters/hooks/useTipsterModal.ts`:**
```typescript
import { useState, useCallback } from 'react';
import { TipsterEntity, CreateTipsterDTO } from '@shared/types/entities.types';
import { tipsterRepository } from '@core/repositories';
import { useAsync } from '@core/hooks/useAsync';

interface UseTipsterModalReturn {
  isOpen: boolean;
  editingTipster: TipsterEntity | null;
  openCreateModal: () => void;
  openEditModal: (tipster: TipsterEntity) => void;
  closeModal: () => void;
  createTipster: (data: CreateTipsterDTO) => Promise<void>;
  updateTipster: (id: string, data: Partial<CreateTipsterDTO>) => Promise<void>;
  deleteTipster: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para gestionar el modal de tipster (crear/editar)
 */
export const useTipsterModal = (): UseTipsterModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTipster, setEditingTipster] = useState<TipsterEntity | null>(
    null
  );

  const { execute: executeCreate, loading: createLoading, error: createError } = useAsync(
    (data: CreateTipsterDTO) => tipsterRepository.create(data)
  );

  const { execute: executeUpdate, loading: updateLoading, error: updateError } = useAsync(
    (id: string, data: Partial<CreateTipsterDTO>) =>
      tipsterRepository.update(id, data)
  );

  const { execute: executeDelete, loading: deleteLoading, error: deleteError } = useAsync(
    (id: string) => tipsterRepository.delete(id)
  );

  const openCreateModal = useCallback(() => {
    setEditingTipster(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((tipster: TipsterEntity) => {
    setEditingTipster(tipster);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTipster(null);
  }, []);

  const createTipster = useCallback(
    async (data: CreateTipsterDTO) => {
      await executeCreate(data);
      closeModal();
    },
    [executeCreate, closeModal]
  );

  const updateTipster = useCallback(
    async (id: string, data: Partial<CreateTipsterDTO>) => {
      await executeUpdate(id, data);
      closeModal();
    },
    [executeUpdate, closeModal]
  );

  const deleteTipster = useCallback(
    async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar este tipster?')) {
        await executeDelete(id);
      }
    },
    [executeDelete]
  );

  return {
    isOpen,
    editingTipster,
    openCreateModal,
    openEditModal,
    closeModal,
    createTipster,
    updateTipster,
    deleteTipster,
    loading: createLoading || updateLoading || deleteLoading,
    error: createError || updateError || deleteError,
  };
};
```

**Archivo `src/features/tipsters/hooks/index.ts`:**
```typescript
export { useTipsters } from './useTipsters';
export { useTipster } from './useTipster';
export { useTipsterStats } from './useTipsterStats';
export { useTipsterModal } from './useTipsterModal';
```

---

### 3. TipsterCard Component

**Archivo `src/features/tipsters/components/TipsterCard/TipsterCard.tsx`:**
```typescript
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { TipsterEntity } from '@shared/types/entities.types';
import { Card, CardBody, Badge } from '@shared/components';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface TipsterCardProps {
  tipster: TipsterEntity;
  stats?: {
    totalPicks: number;
    winrate: number;
    yield: number;
    totalProfit: number;
  } | null;
  onEdit: (tipster: TipsterEntity) => void;
  onDelete: (tipsterId: string) => void;
}

/**
 * Tarjeta de tipster con estadísticas y acciones
 */
export const TipsterCard: FC<TipsterCardProps> = ({
  tipster,
  stats,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tipsters/${tipster.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(tipster);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(tipster.id);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text mb-1">{tipster.name}</h3>
            <Badge variant="info">{tipster.channel}</Badge>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg text-info hover:text-text hover:bg-white/5 transition-colors"
              aria-label="Editar tipster"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-error hover:text-red-600 hover:bg-error/10 transition-colors"
              aria-label="Eliminar tipster"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs text-info mb-1">Total Picks</p>
              <p className="text-base font-semibold text-text">{stats.totalPicks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-info mb-1">Winrate</p>
              <p className="text-base font-semibold text-text">
                {stats.winrate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-info mb-1">Yield</p>
              <p
                className={cn(
                  'text-base font-semibold flex items-center justify-center gap-1',
                  stats.yield >= 0 ? 'text-success' : 'text-error'
                )}
              >
                {stats.yield >= 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {stats.yield.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-info mb-1">Profit</p>
              <p
                className={cn(
                  'text-base font-semibold',
                  stats.totalProfit >= 0 ? 'text-success' : 'text-error'
                )}
              >
                {stats.totalProfit >= 0 ? '+' : ''}
                {stats.totalProfit.toFixed(2)}u
              </p>
            </div>
          </div>
        )}

        {!stats && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-sm text-info text-center">Sin picks registradas</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
```

**Archivo `src/features/tipsters/components/TipsterCard/index.ts`:**
```typescript
export { TipsterCard } from './TipsterCard';
export type { TipsterCardProps } from './TipsterCard';
```

---

### 4. TipsterList Component

**Archivo `src/features/tipsters/components/TipsterList/TipsterList.tsx`:**
```typescript
import { FC } from 'react';
import { TipsterEntity } from '@shared/types/entities.types';
import { TipsterCard } from '../TipsterCard';
import { EmptyState, Input } from '@shared/components';
import { Search, Package } from 'lucide-react';

interface TipsterListProps {
  tipsters: TipsterEntity[];
  statsMap?: Map<string, any>;
  onEdit: (tipster: TipsterEntity) => void;
  onDelete: (tipsterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * Lista de tipsters con búsqueda
 */
export const TipsterList: FC<TipsterListProps> = ({
  tipsters,
  statsMap,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange,
}) => {
  const filteredTipsters = tipsters.filter((tipster) =>
    tipster.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Buscar tipsters..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {filteredTipsters.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No se encontraron tipsters"
          description={
            searchQuery
              ? 'Intenta con otro término de búsqueda'
              : 'Comienza añadiendo tu primer tipster'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTipsters.map((tipster) => (
            <TipsterCard
              key={tipster.id}
              tipster={tipster}
              stats={statsMap?.get(tipster.id) || null}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

**Archivo `src/features/tipsters/components/TipsterList/index.ts`:**
```typescript
export { TipsterList } from './TipsterList';
export type { TipsterListProps } from './TipsterList';
```

---

### 5. TipsterForm Component

**Archivo `src/features/tipsters/components/TipsterForm/TipsterForm.tsx`:**
```typescript
import { FC, FormEvent, useState, useEffect } from 'react';
import { CreateTipsterDTO, TipsterEntity } from '@shared/types/entities.types';
import { Button, Input, Select } from '@shared/components';
import { ALL_CHANNELS } from '@shared/constants/domain.constants';
import { isNotEmpty } from '@shared/utils/validation.utils';

interface TipsterFormProps {
  tipster?: TipsterEntity | null;
  onSubmit: (data: CreateTipsterDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Formulario para crear/editar tipster
 */
export const TipsterForm: FC<TipsterFormProps> = ({
  tipster,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    channel?: string;
  }>({});

  useEffect(() => {
    if (tipster) {
      setName(tipster.name);
      setChannel(tipster.channel);
    }
  }, [tipster]);

  const validate = () => {
    const errors: { name?: string; channel?: string } = {};

    if (!isNotEmpty(name)) {
      errors.name = 'El nombre es requerido';
    }

    if (!isNotEmpty(channel)) {
      errors.channel = 'El canal es requerido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      channel,
    });
  };

  const channelOptions = ALL_CHANNELS.map((c) => ({ value: c, label: c }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      <Input
        label="Nombre del Tipster"
        type="text"
        placeholder="Ej: John Doe"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setValidationErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={validationErrors.name}
        required
        autoFocus
      />

      <Select
        label="Canal"
        options={channelOptions}
        value={channel}
        onChange={(e) => {
          setChannel(e.target.value);
          setValidationErrors((prev) => ({ ...prev, channel: undefined }));
        }}
        placeholder="Selecciona un canal"
        error={validationErrors.channel}
        required
      />

      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : tipster ? 'Actualizar' : 'Crear Tipster'}
        </Button>
      </div>
    </form>
  );
};
```

**Archivo `src/features/tipsters/components/TipsterForm/index.ts`:**
```typescript
export { TipsterForm } from './TipsterForm';
export type { TipsterFormProps } from './TipsterForm';
```

---

### 6. TipsterModal Component

**Archivo `src/features/tipsters/components/TipsterModal/TipsterModal.tsx`:**
```typescript
import { FC } from 'react';
import { Modal } from '@shared/components';
import { TipsterForm } from '../TipsterForm';
import { TipsterEntity, CreateTipsterDTO } from '@shared/types/entities.types';

interface TipsterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipster?: TipsterEntity | null;
  onSubmit: (data: CreateTipsterDTO) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

/**
 * Modal para crear/editar tipster
 */
export const TipsterModal: FC<TipsterModalProps> = ({
  isOpen,
  onClose,
  tipster,
  onSubmit,
  loading,
  error,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tipster ? 'Editar Tipster' : 'Nuevo Tipster'}
    >
      <TipsterForm
        tipster={tipster}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
        error={error}
      />
    </Modal>
  );
};
```

**Archivo `src/features/tipsters/components/TipsterModal/index.ts`:**
```typescript
export { TipsterModal } from './TipsterModal';
export type { TipsterModalProps } from './TipsterModal';
```

---

### 7. TipstersPage Component

**Archivo `src/features/tipsters/pages/TipstersPage/TipstersPage.tsx`:**
```typescript
import { FC, useState } from 'react';
import { Container, Header, Button, Loading } from '@shared/components';
import { TipsterList } from '../../components/TipsterList';
import { TipsterModal } from '../../components/TipsterModal';
import { useTipsters, useTipsterModal } from '../../hooks';
import { Plus } from 'lucide-react';
import { useAuth } from '@features/auth';

/**
 * Página principal de Tipsters
 */
export const TipstersPage: FC = () => {
  const { user } = useAuth();
  const { tipsters, loading } = useTipsters();
  const {
    isOpen,
    editingTipster,
    openCreateModal,
    openEditModal,
    closeModal,
    createTipster,
    updateTipster,
    deleteTipster,
    loading: modalLoading,
    error: modalError,
  } = useTipsterModal();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (data: any) => {
    if (editingTipster) {
      await updateTipster(editingTipster.id, data);
    } else {
      await createTipster(data);
    }
  };

  if (loading) {
    return <Loading text="Cargando tipsters..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        logo={<span className="text-xl font-semibold text-primary">TT</span>}
        userEmail={user?.email || undefined}
      />

      <Container className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Tipsters</h1>
            <p className="text-info">
              Gestiona tus tipsters y visualiza sus estadísticas
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={20} className="mr-2" />
            Nuevo Tipster
          </Button>
        </div>

        <TipsterList
          tipsters={tipsters}
          onEdit={openEditModal}
          onDelete={deleteTipster}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </Container>

      <TipsterModal
        isOpen={isOpen}
        onClose={closeModal}
        tipster={editingTipster}
        onSubmit={handleSubmit}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};
```

**Archivo `src/features/tipsters/pages/TipstersPage/index.ts`:**
```typescript
export { TipstersPage } from './TipstersPage';
```

---

### 8. Feature Exports

**Archivo `src/features/tipsters/index.ts`:**
```typescript
// Components
export { TipsterCard } from './components/TipsterCard';
export { TipsterList } from './components/TipsterList';
export { TipsterForm } from './components/TipsterForm';
export { TipsterModal } from './components/TipsterModal';

// Pages
export { TipstersPage } from './pages/TipstersPage';

// Hooks
export { useTipsters, useTipster, useTipsterStats, useTipsterModal } from './hooks';

// Types
export type { TipsterCardProps } from './components/TipsterCard';
export type { TipsterListProps } from './components/TipsterList';
export type { TipsterFormProps } from './components/TipsterForm';
export type { TipsterModalProps } from './components/TipsterModal';
```

---

### 4. Checklist de Verificación de Fase 4

#### ✅ Hooks
- [ ] useTipsters implementado con real-time sync
- [ ] useTipster implementado para obtener tipster individual
- [ ] useTipsterStats implementado (básico, se completa en Fase 5)
- [ ] useTipsterModal implementado con CRUD completo

#### ✅ Componentes
- [ ] TipsterCard con estadísticas y acciones
- [ ] TipsterList con búsqueda y grid responsive
- [ ] TipsterForm con validación
- [ ] TipsterModal funcionando para crear/editar

#### ✅ Página
- [ ] TipstersPage renderizando lista completa
- [ ] Navegación a detalle de tipster preparada
- [ ] Modal de crear/editar integrado

#### ✅ Integración
- [ ] Repository Pattern funcionando con Firestore
- [ ] Real-time updates funcionando
- [ ] CRUD completo: Create, Read, Update, Delete
- [ ] Confirmación antes de eliminar

#### ✅ UI/UX
- [ ] Búsqueda de tipsters funcionando
- [ ] EmptyState cuando no hay tipsters
- [ ] Loading states correctos
- [ ] Error handling con mensajes
- [ ] Responsive en mobile y desktop

#### ✅ Rutas
- [ ] Ruta /tipsters añadida a App.tsx
- [ ] Header con navegación funcionando
- [ ] PrivateLayout aplicado

#### ✅ Testing Manual
- [ ] Crear tipster nuevo
- [ ] Editar tipster existente
- [ ] Eliminar tipster con confirmación
- [ ] Búsqueda por nombre y canal
- [ ] Click en card navega a detalle (preparado)
- [ ] Real-time sync: abrir en 2 tabs y verificar
- [ ] Responsive: probar en mobile

---

### 5. Comandos de Verificación Final

```powershell
# 1. Verificar TypeScript
npx tsc --noEmit

# 2. Verificar linting
npm run lint

# 3. Verificar build
npm run build

# 4. Ejecutar app en dev
npm run dev

# 5. Testing manual
# - Login y navegar a /tipsters
# - Crear nuevo tipster
# - Editar tipster
# - Eliminar tipster
# - Buscar tipsters
# - Verificar responsive
# - Probar real-time: abrir en 2 tabs, crear en una, ver actualización en otra
```

---

### 6. Integración con Picks (Preparación para Fase 5)

En esta fase, los tipsters están completamente funcionales pero **sin estadísticas reales** porque aún no tenemos picks. Cuando implementemos la Fase 5 (Picks):

1. **useTipsterStats** recibirá picks reales
2. **TipsterCard** mostrará winrate, yield, profit calculados
3. **statsMap** en TipstersPage se poblará con datos reales
4. **TipsterDetail page** se implementará con historial de picks

**Placeholder actual**: stats están preparadas pero muestran valores dummy o undefined.

---

### 7. Siguientes Pasos

Una vez completada la Fase 4:

1. **Commit y Push**:
   ```powershell
   git add .
   git commit -m "feat(tipsters): implement tipsters feature with CRUD (Phase 4)"
   git push origin feature/tipsters-phase4
   ```

2. **Merge a develop-react**:
   ```powershell
   git checkout develop-react
   git merge feature/tipsters-phase4
   git push origin develop-react
   ```

3. **Iniciar Fase 5**:
   ```powershell
   git checkout -b feature/picks-phase5
   ```

---

## ✅ Criterios de Éxito de Fase 4

La Fase 4 se considera **completada** cuando:

1. ✅ CRUD completo de tipsters funcionando
2. ✅ Real-time sync con Firestore activo
3. ✅ TipsterCard, TipsterList, TipsterForm implementados
4. ✅ Modal de crear/editar funcionando
5. ✅ Búsqueda de tipsters operativa
6. ✅ Confirmación antes de eliminar
7. ✅ EmptyState cuando no hay datos
8. ✅ Loading y error states correctos
9. ✅ Responsive en todos los componentes
10. ✅ Ruta /tipsters integrada en App.tsx
11. ✅ Header con navegación funcionando
12. ✅ No hay errores de TypeScript ni ESLint
13. ✅ Build exitoso
14. ✅ Testing manual completo
15. ✅ Code review aprobado
16. ✅ Branch mergeado a develop-react

**Importante**: Esta fase establece el patrón CRUD completo que se replicará en Picks (Fase 5) y Follows (Fase 6).

---

## FASE 5: Feature - Picks ✅ COMPLETADA

### Estado: ✅ COMPLETADA (17 Nov 2025)

### Duración Real
**5 días** (Nov 13-17, 2025)

### Objetivos Cumplidos
✅ Implementar CRUD completo de picks con Repository Pattern y real-time listeners
✅ Crear hooks personalizados: usePicks (CRUD + onSnapshot), usePicksByTipster (filtered + onSnapshot)
✅ Componente PickTableRow reutilizable (11 columnas)
✅ Modal AddPickModal complejo (12 campos, create/edit modes, initialTipsterId)
✅ Sistema de filtrado multi-criterio (tipster, sport, result, búsqueda)
✅ Integración con tipsters en Layout, TipsterDetailPage y PicksListPage
✅ Cálculo de estadísticas y profit con utilidad calculateTipsterStats
✅ Testing exhaustivo con checklist de 10 secciones - 100% aprobado
✅ Fix de 5 bugs descubiertos durante testing

**Resumen**: Feature Picks completa con CRUD, filtros, stats, real-time updates, y navegación integrada.

---

### 1. Estructura Real Implementada

```
src/features/picks/
├── components/
│   ├── PickTableRow/
│   │   ├── PickTableRow.tsx          # 165 líneas - Fila reutilizable 11 columnas
│   │   ├── PickTableRow.types.ts     # Props interface
│   │   └── index.ts
│   ├── AddPickModal/
│   │   ├── AddPickModal.tsx          # 480 líneas - Modal complejo create/edit
│   │   ├── AddPickModal.types.ts     # Props + interfaces
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── usePicks.ts                   # 183 líneas - CRUD + onSnapshot
│   ├── usePicksByTipster.ts          # 95 líneas - Filtered + onSnapshot
│   └── index.ts
├── pages/
│   ├── PicksListPage/
│   │   ├── PicksListPage.tsx         # 406 líneas - Lista principal + filtros
│   │   ├── PicksListPage.types.ts    # Interfaces
│   │   └── index.ts
│   └── index.ts
├── utils/
│   ├── sport-icons.ts                # 25 líneas - Emoji mapping
│   └── index.ts
└── index.ts

// Archivos adicionales modificados/creados:
features/tipsters/
├── utils/
│   └── calculate-stats.ts            # 95 líneas - Estadísticas de tipster
shared/components/layout/
└── Layout.tsx                         # 115 líneas - Navbar persistente
core/routing/
└── routes.tsx                         # Actualizado con /picks route
```

---

### 2. Pick Validation Utils

**Archivo `src/features/picks/utils/pick-validation.utils.ts`:**
```typescript
import { CreatePickDTO } from '@shared/types/entities.types';
import { isValidOdds, isValidStake, isNotEmpty } from '@shared/utils/validation.utils';
import { isValidDate, isValidTime } from '@shared/utils/date.utils';

export interface PickValidationErrors {
  tipsterId?: string;
  sport?: string;
  match?: string;
  betType?: string;
  odds?: string;
  stake?: string;
  pickType?: string;
  date?: string;
  time?: string;
  bookmaker?: string;
}

/**
 * Valida los datos de un pick
 * Retorna objeto con errores o vacío si todo está bien
 */
export const validatePick = (
  data: Partial<CreatePickDTO>
): PickValidationErrors => {
  const errors: PickValidationErrors = {};

  // Tipster requerido
  if (!data.tipsterId || !isNotEmpty(data.tipsterId)) {
    errors.tipsterId = 'Debes seleccionar un tipster';
  }

  // Sport requerido
  if (!data.sport || !isNotEmpty(data.sport)) {
    errors.sport = 'El deporte es requerido';
  }

  // Match requerido
  if (!data.match || !isNotEmpty(data.match)) {
    errors.match = 'El partido es requerido';
  }

  // BetType requerido
  if (!data.betType || !isNotEmpty(data.betType)) {
    errors.betType = 'El tipo de apuesta es requerido';
  }

  // Odds validación
  if (data.odds === undefined || data.odds === null) {
    errors.odds = 'La cuota es requerida';
  } else if (!isValidOdds(data.odds)) {
    errors.odds = 'La cuota debe ser mayor a 1.0';
  }

  // Stake validación
  if (data.stake === undefined || data.stake === null) {
    errors.stake = 'El stake es requerido';
  } else if (!isValidStake(data.stake)) {
    errors.stake = 'El stake debe estar entre 1 y 10';
  }

  // PickType requerido
  if (!data.pickType || !isNotEmpty(data.pickType)) {
    errors.pickType = 'El tipo de pick es requerido';
  }

  // Date validación
  if (!data.date || !isNotEmpty(data.date)) {
    errors.date = 'La fecha es requerida';
  } else if (!isValidDate(data.date)) {
    errors.date = 'Fecha no válida';
  }

  // Time validación
  if (!data.time || !isNotEmpty(data.time)) {
    errors.time = 'La hora es requerida';
  } else if (!isValidTime(data.time)) {
    errors.time = 'Hora no válida';
  }

  // Bookmaker requerido
  if (!data.bookmaker || !isNotEmpty(data.bookmaker)) {
    errors.bookmaker = 'La casa de apuestas es requerida';
  }

  return errors;
};

/**
 * Verifica si hay errores de validación
 */
export const hasValidationErrors = (
  errors: PickValidationErrors
): boolean => {
  return Object.keys(errors).length > 0;
};
```

**Archivo `src/features/picks/utils/index.ts`:**
```typescript
export { validatePick, hasValidationErrors } from './pick-validation.utils';
export type { PickValidationErrors } from './pick-validation.utils';
```

---

### 3. Hooks Personalizados

#### 3.1 usePicks Hook
**Archivo `src/features/picks/hooks/usePicks.ts`:**
```typescript
import { useRepository } from '@core/hooks/useRepository';
import { pickRepository } from '@core/repositories';
import { PickEntity } from '@shared/types/entities.types';
import { useAuth } from '@features/auth';

/**
 * Hook para gestionar la lista de picks
 * Usa el repository pattern y se suscribe a cambios en tiempo real
 */
export const usePicks = () => {
  const { user } = useAuth();

  const {
    data: picks,
    loading,
    error,
    refresh,
  } = useRepository<PickEntity>({
    repository: pickRepository,
    enabled: !!user,
    realtime: true,
  });

  return {
    picks: picks || [],
    loading,
    error,
    refresh,
  };
};
```

#### 3.2 usePick Hook
**Archivo `src/features/picks/hooks/usePick.ts`:**
```typescript
import { useState, useEffect } from 'react';
import { pickRepository } from '@core/repositories';
import { PickEntity } from '@shared/types/entities.types';

/**
 * Hook para obtener un pick específico por ID
 */
export const usePick = (pickId: string | null) => {
  const [pick, setPick] = useState<PickEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pickId) {
      setPick(null);
      return;
    }

    let cancelled = false;

    const fetchPick = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await pickRepository.getById(pickId);
        if (!cancelled) {
          setPick(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar pick');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPick();

    return () => {
      cancelled = true;
    };
  }, [pickId]);

  return { pick, loading, error };
};
```

#### 3.3 usePickModal Hook
**Archivo `src/features/picks/hooks/usePickModal.ts`:**
```typescript
import { useState, useCallback } from 'react';
import { PickEntity, CreatePickDTO } from '@shared/types/entities.types';
import { pickRepository } from '@core/repositories';
import { useAsync } from '@core/hooks/useAsync';

interface UsePickModalReturn {
  isOpen: boolean;
  editingPick: PickEntity | null;
  openCreateModal: () => void;
  openEditModal: (pick: PickEntity) => void;
  closeModal: () => void;
  createPick: (data: CreatePickDTO) => Promise<void>;
  updatePick: (id: string, data: Partial<CreatePickDTO>) => Promise<void>;
  deletePick: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para gestionar el modal de pick (crear/editar)
 */
export const usePickModal = (): UsePickModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPick, setEditingPick] = useState<PickEntity | null>(null);

  const { execute: executeCreate, loading: createLoading, error: createError } = useAsync(
    (data: CreatePickDTO) => pickRepository.create(data)
  );

  const { execute: executeUpdate, loading: updateLoading, error: updateError } = useAsync(
    (id: string, data: Partial<CreatePickDTO>) =>
      pickRepository.update(id, data)
  );

  const { execute: executeDelete, loading: deleteLoading, error: deleteError } = useAsync(
    (id: string) => pickRepository.delete(id)
  );

  const openCreateModal = useCallback(() => {
    setEditingPick(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((pick: PickEntity) => {
    setEditingPick(pick);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingPick(null);
  }, []);

  const createPick = useCallback(
    async (data: CreatePickDTO) => {
      await executeCreate(data);
      closeModal();
    },
    [executeCreate, closeModal]
  );

  const updatePick = useCallback(
    async (id: string, data: Partial<CreatePickDTO>) => {
      await executeUpdate(id, data);
      closeModal();
    },
    [executeUpdate, closeModal]
  );

  const deletePick = useCallback(
    async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar esta pick?')) {
        await executeDelete(id);
      }
    },
    [executeDelete]
  );

  return {
    isOpen,
    editingPick,
    openCreateModal,
    openEditModal,
    closeModal,
    createPick,
    updatePick,
    deletePick,
    loading: createLoading || updateLoading || deleteLoading,
    error: createError || updateError || deleteError,
  };
};
```

#### 3.4 usePickFilters Hook
**Archivo `src/features/picks/hooks/usePickFilters.ts`:**
```typescript
import { useState, useMemo, useCallback } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import { PickResult } from '@shared/types/domain.types';

export interface PickFiltersState {
  tipsterId: string;
  sport: string;
  channel: string;
  bookmaker: string;
  result: PickResult | 'all';
  isResolved: 'all' | 'resolved' | 'pending';
  searchQuery: string;
}

const initialFilters: PickFiltersState = {
  tipsterId: 'all',
  sport: 'all',
  channel: 'all',
  bookmaker: 'all',
  result: 'all',
  isResolved: 'all',
  searchQuery: '',
};

/**
 * Hook para gestionar filtros de picks
 */
export const usePickFilters = (picks: PickEntity[]) => {
  const [filters, setFilters] = useState<PickFiltersState>(initialFilters);

  // Actualizar filtro individual
  const updateFilter = useCallback(
    <K extends keyof PickFiltersState>(key: K, value: PickFiltersState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Resetear todos los filtros
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Aplicar filtros
  const filteredPicks = useMemo(() => {
    return picks.filter((pick) => {
      // Filtro por tipster
      if (filters.tipsterId !== 'all' && pick.tipsterId !== filters.tipsterId) {
        return false;
      }

      // Filtro por deporte
      if (filters.sport !== 'all' && pick.sport !== filters.sport) {
        return false;
      }

      // Filtro por bookmaker
      if (filters.bookmaker !== 'all' && pick.bookmaker !== filters.bookmaker) {
        return false;
      }

      // Filtro por resultado
      if (filters.result !== 'all' && pick.result !== filters.result) {
        return false;
      }

      // Filtro por estado resuelto
      if (filters.isResolved === 'resolved' && !pick.isResolved) {
        return false;
      }
      if (filters.isResolved === 'pending' && pick.isResolved) {
        return false;
      }

      // Filtro por búsqueda (match o betType)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchInMatch = pick.match.toLowerCase().includes(query);
        const matchInBetType = pick.betType.toLowerCase().includes(query);
        if (!matchInMatch && !matchInBetType) {
          return false;
        }
      }

      return true;
    });
  }, [picks, filters]);

  // Contar picks activos por filtro
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.tipsterId !== 'all') count++;
    if (filters.sport !== 'all') count++;
    if (filters.bookmaker !== 'all') count++;
    if (filters.result !== 'all') count++;
    if (filters.isResolved !== 'all') count++;
    if (filters.searchQuery.trim()) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredPicks,
    activeFiltersCount,
  };
};
```

**Archivo `src/features/picks/hooks/index.ts`:**
```typescript
export { usePicks } from './usePicks';
export { usePick } from './usePick';
export { usePickModal } from './usePickModal';
export { usePickFilters } from './usePickFilters';
export type { PickFiltersState } from './usePickFilters';
```

---

### 4. PickForm Component (Complejo)

**Archivo `src/features/picks/components/PickForm/PickForm.tsx`:**
```typescript
import { FC, FormEvent, useState, useEffect } from 'react';
import { CreatePickDTO, PickEntity } from '@shared/types/entities.types';
import { Button, Input, Select } from '@shared/components';
import {
  ALL_SPORTS,
  ALL_BOOKMAKERS,
  PICK_TYPES,
  PICK_RESULTS,
} from '@shared/constants/domain.constants';
import { getTodayDate, getCurrentTime, formatDateTime } from '@shared/utils/date.utils';
import { validatePick, hasValidationErrors } from '../../utils';
import type { PickValidationErrors } from '../../utils';

interface PickFormProps {
  pick?: PickEntity | null;
  tipsters: Array<{ id: string; name: string }>;
  onSubmit: (data: CreatePickDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Formulario complejo de pick (crear/editar)
 */
export const PickForm: FC<PickFormProps> = ({
  pick,
  tipsters,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  // Form state
  const [tipsterId, setTipsterId] = useState('');
  const [sport, setSport] = useState('');
  const [match, setMatch] = useState('');
  const [betType, setBetType] = useState('');
  const [odds, setOdds] = useState<number | ''>('');
  const [stake, setStake] = useState<number | ''>('');
  const [pickType, setPickType] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState(getCurrentTime());
  const [bookmaker, setBookmaker] = useState('');
  const [result, setResult] = useState<string>('');
  const [isResolved, setIsResolved] = useState(false);
  const [comments, setComments] = useState('');

  const [validationErrors, setValidationErrors] = useState<PickValidationErrors>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (pick) {
      setTipsterId(pick.tipsterId);
      setSport(pick.sport);
      setMatch(pick.match);
      setBetType(pick.betType);
      setOdds(pick.odds);
      setStake(pick.stake);
      setPickType(pick.pickType);
      setDate(pick.date);
      setTime(pick.time);
      setBookmaker(pick.bookmaker);
      setResult(pick.result || '');
      setIsResolved(pick.isResolved);
      setComments(pick.comments || '');
    }
  }, [pick]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Preparar datos
    const data: CreatePickDTO = {
      tipsterId,
      sport,
      match: match.trim(),
      betType: betType.trim(),
      odds: Number(odds),
      stake: Number(stake),
      pickType,
      date,
      time,
      dateTime: formatDateTime(date, time),
      bookmaker,
      result: result || 'Pendiente',
      isResolved,
      comments: comments.trim(),
    };

    // Validar
    const errors = validatePick(data);
    setValidationErrors(errors);

    if (hasValidationErrors(errors)) {
      return;
    }

    await onSubmit(data);
  };

  const clearFieldError = (field: keyof PickValidationErrors) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Options para selects
  const tipsterOptions = tipsters.map((t) => ({ value: t.id, label: t.name }));
  const sportOptions = ALL_SPORTS.map((s) => ({ value: s, label: s }));
  const bookmakerOptions = ALL_BOOKMAKERS.map((b) => ({ value: b, label: b }));
  const pickTypeOptions = PICK_TYPES.map((p) => ({ value: p, label: p }));
  const resultOptions = PICK_RESULTS.map((r) => ({ value: r, label: r }));

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      {/* Sección: Información Básica */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Información Básica
        </h3>

        <Select
          label="Tipster"
          options={tipsterOptions}
          value={tipsterId}
          onChange={(e) => {
            setTipsterId(e.target.value);
            clearFieldError('tipsterId');
          }}
          placeholder="Selecciona un tipster"
          error={validationErrors.tipsterId}
          required
        />

        <Select
          label="Deporte"
          options={sportOptions}
          value={sport}
          onChange={(e) => {
            setSport(e.target.value);
            clearFieldError('sport');
          }}
          placeholder="Selecciona un deporte"
          error={validationErrors.sport}
          required
        />

        <Input
          label="Partido"
          type="text"
          placeholder="Ej: Real Madrid vs Barcelona"
          value={match}
          onChange={(e) => {
            setMatch(e.target.value);
            clearFieldError('match');
          }}
          error={validationErrors.match}
          required
        />

        <Input
          label="Tipo de Apuesta"
          type="text"
          placeholder="Ej: Over 2.5 goles"
          value={betType}
          onChange={(e) => {
            setBetType(e.target.value);
            clearFieldError('betType');
          }}
          error={validationErrors.betType}
          required
        />
      </div>

      {/* Sección: Detalles de Apuesta */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Detalles de Apuesta
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <Input
            label="Cuota"
            type="number"
            step="0.01"
            min="1.01"
            placeholder="Ej: 1.85"
            value={odds}
            onChange={(e) => {
              setOdds(e.target.value ? parseFloat(e.target.value) : '');
              clearFieldError('odds');
            }}
            error={validationErrors.odds}
            required
          />

          <Input
            label="Stake (Unidades)"
            type="number"
            step="0.5"
            min="1"
            max="10"
            placeholder="Ej: 2"
            value={stake}
            onChange={(e) => {
              setStake(e.target.value ? parseFloat(e.target.value) : '');
              clearFieldError('stake');
            }}
            error={validationErrors.stake}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <Select
            label="Tipo de Pick"
            options={pickTypeOptions}
            value={pickType}
            onChange={(e) => {
              setPickType(e.target.value);
              clearFieldError('pickType');
            }}
            placeholder="Selecciona tipo"
            error={validationErrors.pickType}
            required
          />

          <Select
            label="Casa de Apuestas"
            options={bookmakerOptions}
            value={bookmaker}
            onChange={(e) => {
              setBookmaker(e.target.value);
              clearFieldError('bookmaker');
            }}
            placeholder="Selecciona bookmaker"
            error={validationErrors.bookmaker}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              clearFieldError('date');
            }}
            error={validationErrors.date}
            required
          />

          <Input
            label="Hora"
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              clearFieldError('time');
            }}
            error={validationErrors.time}
            required
          />
        </div>
      </div>

      {/* Sección: Resultado */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Resultado
        </h3>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-lg">
            <input
              type="checkbox"
              id="isResolved"
              checked={isResolved}
              onChange={(e) => setIsResolved(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="isResolved" className="text-sm text-text cursor-pointer select-none">
              Marcar como resuelta
            </label>
          </div>

          {isResolved && (
            <div className="mt-3">
              <Select
                label="Resultado"
                options={resultOptions}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Selecciona resultado"
                required={isResolved}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sección: Comentarios */}
      <div className="flex flex-col gap-4">
        <Input
          label="Comentarios (Opcional)"
          type="text"
          placeholder="Notas adicionales..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-3 justify-end mt-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : pick ? 'Actualizar' : 'Crear Pick'}
        </Button>
      </div>
    </form>
  );
};
```

**Archivo `src/features/picks/components/PickForm/index.ts`:**
```typescript
export { PickForm } from './PickForm';
```

---

### 5. PickFilters Component

**Archivo `src/features/picks/components/PickFilters/PickFilters.tsx`:**
```typescript
import { FC } from 'react';
import { Button, Input, Select } from '@shared/components';
import { Search, X } from 'lucide-react';
import {
  ALL_SPORTS,
  ALL_BOOKMAKERS,
  PICK_RESULTS,
} from '@shared/constants/domain.constants';
import type { PickFiltersState } from '../../hooks/usePickFilters';

interface PickFiltersProps {
  filters: PickFiltersState;
  onFilterChange: <K extends keyof PickFiltersState>(
    key: K,
    value: PickFiltersState[K]
  ) => void;
  onReset: () => void;
  activeFiltersCount: number;
  tipsters: Array<{ id: string; name: string }>;
}

/**
 * Componente de filtros avanzados para picks
 */
export const PickFilters: FC<PickFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  activeFiltersCount,
  tipsters,
}) => {
  const tipsterOptions = [
    { value: 'all', label: 'Todos los tipsters' },
    ...tipsters.map((t) => ({ value: t.id, label: t.name })),
  ];

  const sportOptions = [
    { value: 'all', label: 'Todos los deportes' },
    ...ALL_SPORTS.map((s) => ({ value: s, label: s })),
  ];

  const bookmakerOptions = [
    { value: 'all', label: 'Todas las casas' },
    ...ALL_BOOKMAKERS.map((b) => ({ value: b, label: b })),
  ];

  const resultOptions = [
    { value: 'all', label: 'Todos los resultados' },
    ...PICK_RESULTS.map((r) => ({ value: r, label: r })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'resolved', label: 'Resueltas' },
    { value: 'pending', label: 'Pendientes' },
  ];

  return (
    <div className="flex flex-col gap-4 p-5 bg-surface rounded-xl border border-white/5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-text">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary text-white rounded-full text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X size={16} />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 md:grid-cols-1">
        <div className="col-span-full">
          <Input
            type="text"
            placeholder="Buscar por partido o tipo de apuesta..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <Select
          options={tipsterOptions}
          value={filters.tipsterId}
          onChange={(e) => onFilterChange('tipsterId', e.target.value)}
        />

        <Select
          options={sportOptions}
          value={filters.sport}
          onChange={(e) => onFilterChange('sport', e.target.value)}
        />

        <Select
          options={bookmakerOptions}
          value={filters.bookmaker}
          onChange={(e) => onFilterChange('bookmaker', e.target.value)}
        />

        <Select
          options={resultOptions}
          value={filters.result}
          onChange={(e) => onFilterChange('result', e.target.value as any)}
        />

        <Select
          options={statusOptions}
          value={filters.isResolved}
          onChange={(e) => onFilterChange('isResolved', e.target.value as any)}
        />
      </div>
    </div>
  );
};
```

**Archivo `src/features/picks/components/PickFilters/index.ts`:**
```typescript
export { PickFilters } from './PickFilters';
```

---

### 6. PickRow Component

**Archivo `src/features/picks/components/PickRow/PickRow.tsx`:**
```typescript
import { FC } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import { Badge } from '@shared/components';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '@shared/utils/date.utils';
import { calculatePickProfit } from '@shared/utils/calculation.utils';
import { cn } from '@shared/utils/cn';

interface PickRowProps {
  pick: PickEntity;
  tipsterName?: string;
  onEdit?: (pick: PickEntity) => void;
  onDelete?: (pickId: string) => void;
}

/**
 * Fila de tabla para un pick
 */
export const PickRow: FC<PickRowProps> = ({
  pick,
  tipsterName = 'Desconocido',
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit?.(pick);
  };

  const handleDelete = () => {
    onDelete?.(pick.id);
  };

  // Calcular profit si está resuelta
  const profit = pick.isResolved
    ? calculatePickProfit(pick.odds, pick.stake, pick.result)
    : null;

  // Variante del badge según resultado
  const resultVariant =
    pick.result === 'Ganada'
      ? 'success'
      : pick.result === 'Perdida'
      ? 'error'
      : pick.result === 'Void'
      ? 'warning'
      : 'info';

  return (
    <tr className="transition-colors hover:bg-white/[0.02]">
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="text-xs text-info">{formatDate(pick.date)}</div>
        <div className="text-xs text-info">{formatTime(pick.time)}</div>
      </td>
      <td className="px-3 py-3 text-sm text-text align-middle font-medium md:px-2 md:py-2 md:text-xs">{tipsterName}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.sport}</td>
      <td className="px-3 py-3 text-sm text-text align-middle font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap md:px-2 md:py-2 md:text-xs md:max-w-[150px]" title={pick.match}>
        {pick.match}
      </td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.betType}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.odds.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.stake}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <Badge variant={resultVariant}>{pick.result}</Badge>
      </td>
      {profit !== null && (
        <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
          <span className={profit >= 0 ? 'positive' : 'negative'}>
            {profit >= 0 ? '+' : ''}
            {profit.toFixed(2)}u
          </span>
        </td>
      )}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.pickType}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.bookmaker}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex gap-1 justify-end">
          {onEdit && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-info hover:bg-white/10 hover:text-text transition-all"
              onClick={handleEdit}
              title="Editar pick"
              aria-label="Editar pick"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-info hover:bg-white/10 hover:text-text transition-all"
              onClick={handleDelete}
              title="Eliminar pick"
              aria-label="Eliminar pick"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
```

**Archivo `src/features/picks/components/PickRow/index.ts`:**
```typescript
export { PickRow } from './PickRow';
```

---

### 7. PickTable Component

**Archivo `src/features/picks/components/PickTable/PickTable.module.css`:**
```css
.container {
  width: 100%;
  overflow-x: auto;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.thead {
  background-color: rgba(59, 130, 246, 0.1);
  border-bottom: 2px solid rgba(59, 130, 246, 0.3);
}

.th {
  padding: var(--space-12);
  text-align: left;
  font-weight: 600;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  white-space: nowrap;
}

.thRight {
  text-align: right;
}

.tbody tr:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.emptyState {
  padding: var(--space-32) var(--space-16);
  text-align: center;
  color: var(--color-info);
}

@media (max-width: 768px) {
  .table {
    font-size: var(--font-size-xs);
  }

  .th {
    padding: var(--space-8);
    font-size: 10px;
  }
}
```

**Archivo `src/features/picks/components/PickTable/PickTable.tsx`:**
```typescript
import { FC } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import { EmptyState } from '@shared/components';
import { PickRow } from '../PickRow';

interface PickTableProps {
  picks: PickEntity[];
  tipsters: Array<{ id: string; name: string }>;
  onEdit?: (pick: PickEntity) => void;
  onDelete?: (pickId: string) => void;
}

/**
 * Tabla de picks con todas las columnas
 */
export const PickTable: FC<PickTableProps> = ({
  picks,
  tipsters,
  onEdit,
  onDelete,
}) => {
  // Map de tipsters por ID
  const tipstersMap = tipsters.reduce((acc, t) => {
    acc[t.id] = t.name;
    return acc;
  }, {} as Record<string, string>);

  if (picks.length === 0) {
    return (
      <div className="w-full overflow-x-auto bg-surface rounded-lg border border-white/5">
        <div className="py-8 px-4 text-center text-info">
          <EmptyState message="No hay picks registradas" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-surface rounded-lg border border-white/5">
      <table className="w-full border-collapse text-sm md:text-xs">
        <thead className="bg-primary/10 border-b-2 border-primary/30">
          <tr>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Fecha/Hora</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Tipster</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Deporte</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Partido</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Tipo Apuesta</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Cuota</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Stake</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Resultado</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Profit</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Tipo</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Bookmaker</th>
            <th className="px-3 py-3 text-right font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((pick) => (
            <PickRow
              key={pick.id}
              pick={pick}
              tipsterName={tipstersMap[pick.tipsterId]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

**Archivo `src/features/picks/components/PickTable/index.ts`:**
```typescript
export { PickTable } from './PickTable';
```

---

### 8. PickModal Component

**Archivo `src/features/picks/components/PickModal/PickModal.tsx`:**
```typescript
import { FC } from 'react';
import { Modal } from '@shared/components';
import { PickForm } from '../PickForm';
import { PickEntity, CreatePickDTO } from '@shared/types/entities.types';

interface PickModalProps {
  isOpen: boolean;
  pick: PickEntity | null;
  tipsters: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (data: CreatePickDTO) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

/**
 * Modal para crear/editar pick
 */
export const PickModal: FC<PickModalProps> = ({
  isOpen,
  pick,
  tipsters,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pick ? 'Editar Pick' : 'Añadir Nueva Pick'}
      size="large"
    >
      <PickForm
        pick={pick}
        tipsters={tipsters}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
        error={error}
      />
    </Modal>
  );
};
```

**Archivo `src/features/picks/components/PickModal/index.ts`:**
```typescript
export { PickModal } from './PickModal';
```

**Archivo `src/features/picks/components/index.ts`:**
```typescript
export { PickTable } from './PickTable';
export { PickRow } from './PickRow';
export { PickForm } from './PickForm';
export { PickModal } from './PickModal';
export { PickFilters } from './PickFilters';
```

---

### 9. AllPicksPage

**Archivo `src/features/picks/pages/AllPicksPage/AllPicksPage.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Loading } from '@shared/components';
import { usePicks, usePickModal, usePickFilters } from '../../hooks';
import { PickTable, PickFilters, PickModal } from '../../components';
import { useTipsters } from '@features/tipsters';

/**
 * Página principal de picks (All Picks)
 */
export const AllPicksPage: FC = () => {
  const { picks, loading: picksLoading, error: picksError } = usePicks();
  const { tipsters, loading: tipstersLoading } = useTipsters();

  const {
    isOpen,
    editingPick,
    openCreateModal,
    openEditModal,
    closeModal,
    createPick,
    updatePick,
    deletePick,
    loading: modalLoading,
    error: modalError,
  } = usePickModal();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredPicks,
    activeFiltersCount,
  } = usePickFilters(picks);

  // Preparar lista de tipsters para el form
  const tipstersList = useMemo(
    () => tipsters.map((t) => ({ id: t.id, name: t.name })),
    [tipsters]
  );

  // Ordenar picks por fecha descendente
  const sortedPicks = useMemo(() => {
    return [...filteredPicks].sort((a, b) => {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });
  }, [filteredPicks]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const resolved = picks.filter((p) => p.isResolved).length;
    const pending = picks.length - resolved;
    const won = picks.filter((p) => p.result === 'Ganada').length;
    const winrate = resolved > 0 ? ((won / resolved) * 100).toFixed(1) : '0.0';

    return {
      total: picks.length,
      resolved,
      pending,
      winrate,
    };
  }, [picks]);

  const handleSubmit = async (data: any) => {
    if (editingPick) {
      await updatePick(editingPick.id, data);
    } else {
      await createPick(data);
    }
  };

  if (picksLoading || tipstersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-4 md:gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-start">
        <div>
          <h1 className="text-3xl font-semibold text-text mb-2 md:text-2xl">Todas las Picks</h1>
          <div className="flex gap-4 text-sm text-info md:flex-col md:gap-2">
            <div className="flex items-center gap-2">
              <span>Total:</span>
              <span className="font-semibold text-text">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Resueltas:</span>
              <span className="font-semibold text-text">{stats.resolved}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Pendientes:</span>
              <span className="font-semibold text-text">{stats.pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Winrate:</span>
              <span className="font-semibold text-text">{stats.winrate}%</span>
            </div>
          </div>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Añadir Pick
        </Button>
      </div>

      {/* Errores */}
      {picksError && (
        <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-center">
          {picksError}
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col gap-4">
        {/* Filtros */}
        <PickFilters
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          activeFiltersCount={activeFiltersCount}
          tipsters={tipstersList}
        />

        {/* Tabla */}
        <PickTable
          picks={sortedPicks}
          tipsters={tipstersList}
          onEdit={openEditModal}
          onDelete={deletePick}
        />
      </div>

      {/* Modal */}
      <PickModal
        isOpen={isOpen}
        pick={editingPick}
        tipsters={tipstersList}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};
```

**Archivo `src/features/picks/pages/AllPicksPage/index.ts`:**
```typescript
export { AllPicksPage } from './AllPicksPage';
```

**Archivo `src/features/picks/pages/index.ts`:**
```typescript
export { AllPicksPage } from './AllPicksPage';
```

---

### 10. Feature Index

**Archivo `src/features/picks/index.ts`:**
```typescript
// Hooks
export { usePicks, usePick, usePickModal, usePickFilters } from './hooks';
export type { PickFiltersState } from './hooks';

// Components
export { PickTable, PickRow, PickForm, PickModal, PickFilters } from './components';

// Pages
export { AllPicksPage } from './pages';

// Utils
export { validatePick, hasValidationErrors } from './utils';
export type { PickValidationErrors } from './utils';
```

---

### 11. Integración en App.tsx

**Modificar `src/App.tsx` para añadir ruta de picks:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import { PrivateRoute } from './features/auth';
import { LoginPage, SignupPage } from './features/auth/pages';
import { TipstersPage } from './features/tipsters/pages';
import { AllPicksPage } from './features/picks/pages';
import { PrivateLayout } from './layouts/PrivateLayout';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/tipsters" replace />} />
            
            {/* Tipsters */}
            <Route path="tipsters" element={<TipstersPage />} />
            
            {/* Picks - NUEVO */}
            <Route path="picks" element={<AllPicksPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
```

---

### 12. Actualizar Header con Navegación

**Modificar `src/shared/components/Layout/Header/Header.tsx`:**
```typescript
import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../../UI/Button';
import { useAuth } from '@features/auth';
import styles from './Header.module.css';

export const Header: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.logo}>Tipster Tracker</h1>
        </div>

        {/* Navegación - NUEVO */}
        <nav className={styles.nav}>
          <button
            className={`${styles.navLink} ${isActive('/tipsters') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/tipsters')}
          >
            Tipsters
          </button>
          <button
            className={`${styles.navLink} ${isActive('/picks') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/picks')}
          >
            Picks
          </button>
        </nav>

        <div className={styles.actions}>
          {user && (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                Salir
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
```

**Actualizar `src/shared/components/Layout/Header/Header.module.css`:**
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: var(--shadow-md);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-24);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-24);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.logo {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

/* Navegación - NUEVO */
.nav {
  display: flex;
  gap: var(--space-8);
  flex: 1;
  margin-left: var(--space-32);
}

.navLink {
  padding: var(--space-8) var(--space-16);
  border: none;
  background: transparent;
  color: var(--color-info);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--transition-fast) var(--ease);
}

.navLink:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
}

.navLinkActive {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.userEmail {
  font-size: var(--font-size-sm);
  color: var(--color-info);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: var(--space-16);
    padding: var(--space-12) var(--space-16);
  }

  .nav {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .actions {
    flex-direction: column;
    width: 100%;
    gap: var(--space-8);
  }

  .userEmail {
    font-size: var(--font-size-xs);
  }
}
```

---

### 13. Añadir Utilidades de Cálculo de Profit

**Actualizar `src/shared/utils/calculation.utils.ts`:**
```typescript
import { PickResult } from '../types/domain.types';

// ... código existente ...

/**
 * Calcula el profit de un pick individual
 */
export const calculatePickProfit = (
  odds: number,
  stake: number,
  result: PickResult
): number => {
  if (result === 'Ganada') {
    return (odds - 1) * stake;
  }
  if (result === 'Perdida') {
    return -stake;
  }
  // Void = 0
  return 0;
};

/**
 * Calcula estadísticas de un conjunto de picks
 */
export interface PicksStats {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  lostPicks: number;
  voidPicks: number;
  winrate: number;
  totalProfit: number;
  totalStaked: number;
  yield: number;
  avgOdds: number;
  avgStake: number;
}

export const calculatePicksStats = (
  picks: Array<{
    odds: number;
    stake: number;
    result: PickResult;
    isResolved: boolean;
  }>
): PicksStats => {
  const totalPicks = picks.length;
  const resolvedPicks = picks.filter((p) => p.isResolved).length;
  const wonPicks = picks.filter((p) => p.result === 'Ganada').length;
  const lostPicks = picks.filter((p) => p.result === 'Perdida').length;
  const voidPicks = picks.filter((p) => p.result === 'Void').length;

  const winrate = resolvedPicks > 0 ? (wonPicks / resolvedPicks) * 100 : 0;

  const totalProfit = picks.reduce((sum, pick) => {
    if (!pick.isResolved) return sum;
    return sum + calculatePickProfit(pick.odds, pick.stake, pick.result);
  }, 0);

  const totalStaked = picks
    .filter((p) => p.isResolved && p.result !== 'Void')
    .reduce((sum, pick) => sum + pick.stake, 0);

  const yieldValue = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

  const avgOdds =
    totalPicks > 0
      ? picks.reduce((sum, p) => sum + p.odds, 0) / totalPicks
      : 0;

  const avgStake =
    totalPicks > 0
      ? picks.reduce((sum, p) => sum + p.stake, 0) / totalPicks
      : 0;

  return {
    totalPicks,
    resolvedPicks,
    wonPicks,
    lostPicks,
    voidPicks,
    winrate,
    totalProfit,
    totalStaked,
    yield: yieldValue,
    avgOdds,
    avgStake,
  };
};
```

---

### 14. Checklist de Verificación

#### Setup y Estructura
- [ ] Crear carpeta `src/features/picks/` con subcarpetas
- [ ] Crear `utils/pick-validation.utils.ts`
- [ ] Verificar export en `utils/index.ts`

#### Hooks
- [ ] Implementar `hooks/usePicks.ts` con real-time
- [ ] Implementar `hooks/usePick.ts` para pick individual
- [ ] Implementar `hooks/usePickModal.ts` con CRUD completo
- [ ] Implementar `hooks/usePickFilters.ts` con multi-criterio
- [ ] Verificar exports en `hooks/index.ts`
- [ ] Verificar que hooks usan `pickRepository` correctamente

#### Componentes
- [ ] Implementar `PickForm` con validación completa (10+ campos)
- [ ] Implementar `PickFilters` con 6 filtros + búsqueda
- [ ] Implementar `PickRow` con profit calculado
- [ ] Implementar `PickTable` con EmptyState
- [ ] Implementar `PickModal` con size large
- [ ] Verificar estilos CSS Modules en cada componente
- [ ] Verificar exports en `components/index.ts`

#### Página
- [ ] Implementar `AllPicksPage` con header y stats
- [ ] Integrar tabla, filtros y modal
- [ ] Mostrar estadísticas rápidas (total, resueltas, pendientes, winrate)
- [ ] Ordenar picks por fecha descendente
- [ ] Verificar export en `pages/index.ts`

#### Integración
- [ ] Añadir ruta `/picks` en `App.tsx`
- [ ] Actualizar `Header.tsx` con navegación
- [ ] Actualizar estilos de navegación en `Header.module.css`
- [ ] Verificar navegación entre /tipsters y /picks
- [ ] Verificar que Header muestra ruta activa

#### Utilidades
- [ ] Añadir `calculatePickProfit()` a `calculation.utils.ts`
- [ ] Añadir `calculatePicksStats()` a `calculation.utils.ts`
- [ ] Verificar que PickRow usa `calculatePickProfit`

#### Testing Manual
- [ ] Crear nuevo pick con todos los campos
- [ ] Editar pick existente
- [ ] Eliminar pick con confirmación
- [ ] Aplicar filtros (tipster, sport, bookmaker, result, status)
- [ ] Buscar por partido o tipo de apuesta
- [ ] Resetear filtros
- [ ] Verificar que tabla muestra profit calculado
- [ ] Verificar ordenación por fecha descendente
- [ ] Verificar estadísticas en header
- [ ] Verificar navegación entre páginas

#### Real-time
- [ ] Verificar que `usePicks` se suscribe a Firestore
- [ ] Crear pick y verificar aparición en tabla sin refresh
- [ ] Editar pick y verificar actualización en tabla
- [ ] Eliminar pick y verificar desaparición de tabla
- [ ] Verificar que filtros funcionan con datos en tiempo real

#### Validación
- [ ] Validar campos requeridos
- [ ] Validar odds >= 1.01
- [ ] Validar stake 1-10
- [ ] Validar formato de fecha
- [ ] Validar formato de hora
- [ ] Mostrar errores específicos por campo
- [ ] Limpiar errores al corregir campo

#### UI/UX
- [ ] Loading overlay durante operaciones
- [ ] Mensajes de error informativos
- [ ] Confirmación antes de eliminar
- [ ] EmptyState cuando no hay picks
- [ ] Badges con colores según resultado
- [ ] Profit con colores positivo/negativo
- [ ] Responsive en mobile
- [ ] Navegación funcional en Header

#### Integración con Tipsters
- [ ] Select de tipsters carga desde `useTipsters`
- [ ] Nombre de tipster se muestra en tabla
- [ ] Filtro por tipster funciona correctamente
- [ ] Verificar que picks se relacionan con tipsters

---

### 15. Comandos de Verificación

```bash
# Verificar estructura de archivos
Get-ChildItem -Recurse -Path src/features/picks | Select-Object FullName

# Build del proyecto
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Preview build
npm run preview

# Ejecutar emuladores Firebase
firebase emulators:start
```

---

### 16. Testing Manual - Checklist Detallado

#### Crear Pick
1. Click en "Añadir Pick"
2. Seleccionar tipster
3. Seleccionar deporte
4. Completar partido: "Real Madrid vs Barcelona"
5. Completar tipo apuesta: "Over 2.5 goles"
6. Cuota: 1.85
7. Stake: 2
8. Tipo pick: "Pre"
9. Bookmaker: "Bet365"
10. Fecha y hora actuales
11. Marcar como resuelta
12. Resultado: "Ganada"
13. Submit
14. Verificar aparición en tabla
15. Verificar profit calculado: +1.70u

#### Editar Pick
1. Click en icono editar
2. Cambiar resultado a "Perdida"
3. Submit
4. Verificar actualización en tabla
5. Verificar profit: -2.00u

#### Filtros
1. Filtrar por deporte: "Fútbol"
2. Verificar que solo aparecen picks de fútbol
3. Añadir filtro por tipster específico
4. Verificar combinación de filtros
5. Buscar por nombre de partido
6. Click en "Limpiar" y verificar reset

#### Navegación
1. Click en "Tipsters" en navbar
2. Verificar navegación a /tipsters
3. Click en "Picks" en navbar
4. Verificar navegación a /picks
5. Verificar highlight en link activo

---

### 17. Mejoras Futuras (Post Fase 5)

**Funcionalidades adicionales para considerar:**
- Paginación de tabla (100+ picks)
- Ordenación por columna (click en header)
- Export a CSV/Excel
- Vista de calendario
- Estadísticas avanzadas por deporte
- Gráficos de rendimiento temporal
- Notificaciones de picks pendientes
- Comparación entre tipsters

**Optimizaciones:**
- Virtualización de tabla para grandes datasets
- Memoización de cálculos estadísticos
- Lazy loading de modals
- Debounce en búsqueda

---

### Commits de la Fase 5

**Implementación Principal (6 commits):**
1. `e7dc5c6` - feat(phase-5): add Pick hooks usePicks and usePicksByTipster
2. `b116c1f` - feat(phase-5): add AddPickModal with full pick form
3. `1e55a54` - feat(phase-5): add PicksListPage with filters and stats
4. `fe5dd6b` - feat(phase-5): integrate real picks data in TipsterDetailPage
5. `fcd4a53` - feat(phase-5): add router configuration and navigation layout

**Fixes Descubiertos Durante Testing (4 commits):**
6. `c56c8df` - fix(phase-5): implement real-time updates with onSnapshot in usePicks
7. `324dac5` - fix(phase-5): fix TipsterDetailPage table and modal issues
8. `71159e5` - fix(phase-5): implement real-time updates in usePicksByTipster
9. `68043ea` - fix: enable edit/delete actions in TipsterDetailPage pick history

**Total: 9 commits**

---

### Bugs Encontrados y Arreglados Durante Testing

**Bug #1 - Picks no aparecían después de crear:**
- **Problema**: Crear pick → guardar → no aparece en lista hasta refresh
- **Causa**: usePicks usaba manual fetch sin listener real-time
- **Solución**: Implementar onSnapshot en useEffect de usePicks
- **Commit**: `c56c8df`

**Bug #2 - Falta columna Tipster en TipsterDetailPage:**
- **Problema**: Tabla con 11 columnas pero solo 10 headers
- **Causa**: Missing `<th>Tipster</th>` en tabla de TipsterDetailPage
- **Solución**: Agregar header de columna Tipster
- **Commit**: `324dac5`

**Bug #3 - Tipster no pre-seleccionado en modal:**
- **Problema**: Abrir modal desde tipster detail → dropdown vacío
- **Causa**: No había prop para pasar tipster inicial
- **Solución**: Agregar prop `initialTipsterId` a AddPickModal
- **Commit**: `324dac5`

**Bug #4 - TipsterDetailPage no se actualiza al crear pick:**
- **Problema**: Crear pick desde detalle → stats y lista no actualizan
- **Causa**: usePicksByTipster usaba manual fetch sin listener
- **Solución**: Implementar onSnapshot en usePicksByTipster
- **Commit**: `71159e5`

**Bug #5 - No se puede editar/borrar desde TipsterDetailPage:**
- **Problema**: Botones edit/delete no visibles en tabla de tipster
- **Causa**: `showActions={false}` en PickTableRow, faltaba lógica
- **Solución**: Import usePicks, agregar handlers, cambiar a `showActions={true}`
- **Commit**: `68043ea`

---

### Testing Exhaustivo Completado

**10 Secciones del Checklist - 100% Aprobadas:**
1. ✅ Login y Navegación
2. ✅ Gestión de Picks - CRUD desde PicksListPage
3. ✅ Filtros (tipster, sport, result, búsqueda)
4. ✅ Estadísticas (5 cards con datos reales)
5. ✅ TipsterDetailPage (10 stats, tabla, add/edit/delete picks)
6. ✅ Cálculos de Profit (Ganada: (odds-1)×stake, Perdida: -stake)
7. ✅ Real-time Updates (onSnapshot en ambos hooks)
8. ✅ Validaciones (odds > 1, stake 1-10, campos required)
9. ✅ UI/UX (badges, colores, iconos, spinners, modals)
10. ✅ Edge Cases (sin picks, división por cero, datos incorrectos)

---

### Resumen de la Fase 5

**Completado:**
✅ CRUD completo con Repository Pattern (PickRepository pre-existente, 299 líneas)
✅ 2 Hooks con real-time: usePicks (183 líneas), usePicksByTipster (95 líneas)
✅ PickTableRow reutilizable (165 líneas, 11 columnas, cálculo de profit)
✅ AddPickModal complejo (480 líneas, 12 campos, create/edit modes)
✅ PicksListPage con filtros y stats (406 líneas, 5 stat cards)
✅ TipsterDetailPage integration (stats, tabla, CRUD completo)
✅ Layout con navbar persistente (115 líneas, Dashboard/Tipsters/Picks)
✅ Utilidad calculateTipsterStats (95 líneas, 10 métricas)
✅ Sistema de filtrado multi-criterio con búsqueda en tiempo real
✅ Real-time sync con Firestore via onSnapshot listeners
✅ Testing exhaustivo: 10 secciones, 5 bugs encontrados y arreglados

**Duración real**: 5 días (13-17 Nov 2025)

**Archivos creados/modificados**: 13 archivos
**Líneas de código**: ~1,650 líneas

**Patrón establecido**: CRUD con real-time updates, filtrado avanzado, estadísticas calculadas, y tablas complejas reutilizables - base para Follows (Fase 6).

---

## FASE 6: Feature - Follows (Detallado)

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo)

### Objetivos de la Fase
1. Implementar sistema de seguimiento de picks del usuario
2. Crear hooks: useFollows, useFollow, useFollowModal
3. Migrar componentes: FollowTable, FollowRow, FollowForm
4. Implementar comparación tipster vs usuario
5. Cálculo de seguibilidad (traceability)
6. Sistema de match/diverge de resultados
7. Página MyPicksPage con estadísticas comparativas
8. Testing manual del feature

**Nota**: Los follows permiten al usuario registrar qué picks siguió, con sus propios odds/stake/resultado, para comparar con el tipster.

---

### 1. Estructura del Feature Follows

```
src/features/follows/
├── components/
│   ├── FollowTable/
│   │   ├── FollowTable.tsx
│   │   ├── FollowTable.module.css
│   │   └── index.ts
│   ├── FollowRow/
│   │   ├── FollowRow.tsx
│   │   ├── FollowRow.module.css
│   │   └── index.ts
│   ├── FollowForm/
│   │   ├── FollowForm.tsx
│   │   ├── FollowForm.module.css
│   │   └── index.ts
│   ├── FollowModal/
│   │   ├── FollowModal.tsx
│   │   └── index.ts
│   ├── ComparisonStats/
│   │   ├── ComparisonStats.tsx
│   │   ├── ComparisonStats.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useFollows.ts
│   ├── useFollow.ts
│   ├── useFollowModal.ts
│   ├── useFollowStats.ts
│   └── index.ts
├── pages/
│   ├── MyPicksPage/
│   │   ├── MyPicksPage.tsx
│   │   ├── MyPicksPage.module.css
│   │   └── index.ts
│   └── index.ts
├── utils/
│   ├── follow-validation.utils.ts
│   ├── comparison.utils.ts
│   └── index.ts
└── index.ts
```

---

### 2. Follow Validation Utils

**Archivo `src/features/follows/utils/follow-validation.utils.ts`:**
```typescript
import { CreateFollowDTO } from '@shared/types/entities.types';
import { isValidOdds, isValidStake } from '@shared/utils/validation.utils';

export interface FollowValidationErrors {
  pickId?: string;
  userOdds?: string;
  userStake?: string;
  userResult?: string;
}

/**
 * Valida los datos de un follow
 */
export const validateFollow = (
  data: Partial<CreateFollowDTO>
): FollowValidationErrors => {
  const errors: FollowValidationErrors = {};

  // PickId requerido
  if (!data.pickId) {
    errors.pickId = 'Pick ID es requerido';
  }

  // UserOdds validación
  if (data.userOdds === undefined || data.userOdds === null) {
    errors.userOdds = 'La cuota es requerida';
  } else if (!isValidOdds(data.userOdds)) {
    errors.userOdds = 'La cuota debe ser mayor a 1.0';
  }

  // UserStake validación
  if (data.userStake === undefined || data.userStake === null) {
    errors.userStake = 'El stake es requerido';
  } else if (!isValidStake(data.userStake)) {
    errors.userStake = 'El stake debe estar entre 1 y 10';
  }

  // Si está resuelta, resultado es requerido
  if (data.userIsResolved && !data.userResult) {
    errors.userResult = 'El resultado es requerido cuando está resuelta';
  }

  return errors;
};

/**
 * Verifica si hay errores de validación
 */
export const hasValidationErrors = (
  errors: FollowValidationErrors
): boolean => {
  return Object.keys(errors).length > 0;
};
```

**Archivo `src/features/follows/utils/comparison.utils.ts`:**
```typescript
import { FollowEntity, PickEntity } from '@shared/types/entities.types';
import { calculatePickProfit } from '@shared/utils/calculation.utils';

/**
 * Determina si los resultados coinciden (match) o divergen
 */
export const compareResults = (
  tipsterResult: string,
  userResult: string
): 'match' | 'diverge' | 'pending' => {
  // Si alguno no está resuelto, pending
  if (tipsterResult === 'Pendiente' || userResult === 'Pendiente') {
    return 'pending';
  }

  // Comparar resultados
  return tipsterResult === userResult ? 'match' : 'diverge';
};

/**
 * Calcula la diferencia de profit entre tipster y usuario
 */
export const calculateProfitDifference = (
  pick: PickEntity,
  follow: FollowEntity
): number | null => {
  if (!pick.isResolved || !follow.userIsResolved) {
    return null;
  }

  const tipsterProfit = calculatePickProfit(pick.odds, pick.stake, pick.result);
  const userProfit = calculatePickProfit(
    follow.userOdds,
    follow.userStake,
    follow.userResult
  );

  return userProfit - tipsterProfit;
};

/**
 * Calcula estadísticas de seguibilidad de un tipster
 */
export interface TraceabilityStats {
  totalPicks: number;
  followedPicks: number;
  traceabilityPercentage: number;
  firstFollowDate: string | null;
}

export const calculateTraceability = (
  tipsterId: string,
  allPicks: PickEntity[],
  allFollows: FollowEntity[]
): TraceabilityStats => {
  // Picks del tipster
  const tipsterPicks = allPicks.filter((p) => p.tipsterId === tipsterId);

  // Follows del tipster
  const tipsterFollows = allFollows.filter((f) => f.tipsterId === tipsterId);

  // Primera fecha de follow
  const firstFollow = tipsterFollows
    .sort((a, b) => new Date(a.followDate).getTime() - new Date(b.followDate).getTime())[0];

  const firstFollowDate = firstFollow ? firstFollow.followDate : null;

  // Si no hay follows, traceability = 0
  if (!firstFollowDate) {
    return {
      totalPicks: tipsterPicks.length,
      followedPicks: 0,
      traceabilityPercentage: 0,
      firstFollowDate: null,
    };
  }

  // Picks desde el primer follow
  const picksAfterFirstFollow = tipsterPicks.filter(
    (p) => new Date(p.dateTime).getTime() >= new Date(firstFollowDate).getTime()
  );

  // Porcentaje de seguibilidad
  const traceabilityPercentage =
    picksAfterFirstFollow.length > 0
      ? (tipsterFollows.length / picksAfterFirstFollow.length) * 100
      : 0;

  return {
    totalPicks: picksAfterFirstFollow.length,
    followedPicks: tipsterFollows.length,
    traceabilityPercentage,
    firstFollowDate,
  };
};
```

**Archivo `src/features/follows/utils/index.ts`:**
```typescript
export { validateFollow, hasValidationErrors } from './follow-validation.utils';
export type { FollowValidationErrors } from './follow-validation.utils';

export {
  compareResults,
  calculateProfitDifference,
  calculateTraceability,
} from './comparison.utils';
export type { TraceabilityStats } from './comparison.utils';
```

---

### 3. Hooks Personalizados

#### 3.1 useFollows Hook
**Archivo `src/features/follows/hooks/useFollows.ts`:**
```typescript
import { useRepository } from '@core/hooks/useRepository';
import { followRepository } from '@core/repositories';
import { FollowEntity } from '@shared/types/entities.types';
import { useAuth } from '@features/auth';

/**
 * Hook para gestionar la lista de follows
 * Usa el repository pattern y se suscribe a cambios en tiempo real
 */
export const useFollows = () => {
  const { user } = useAuth();

  const {
    data: follows,
    loading,
    error,
    refresh,
  } = useRepository<FollowEntity>({
    repository: followRepository,
    enabled: !!user,
    realtime: true,
  });

  return {
    follows: follows || [],
    loading,
    error,
    refresh,
  };
};
```

#### 3.2 useFollow Hook
**Archivo `src/features/follows/hooks/useFollow.ts`:**
```typescript
import { useState, useEffect } from 'react';
import { followRepository } from '@core/repositories';
import { FollowEntity } from '@shared/types/entities.types';

/**
 * Hook para obtener un follow específico por ID
 */
export const useFollow = (followId: string | null) => {
  const [follow, setFollow] = useState<FollowEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!followId) {
      setFollow(null);
      return;
    }

    let cancelled = false;

    const fetchFollow = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await followRepository.getById(followId);
        if (!cancelled) {
          setFollow(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar follow');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFollow();

    return () => {
      cancelled = true;
    };
  }, [followId]);

  return { follow, loading, error };
};
```

#### 3.3 useFollowModal Hook
**Archivo `src/features/follows/hooks/useFollowModal.ts`:**
```typescript
import { useState, useCallback } from 'react';
import { FollowEntity, CreateFollowDTO } from '@shared/types/entities.types';
import { followRepository } from '@core/repositories';
import { useAsync } from '@core/hooks/useAsync';

interface UseFollowModalReturn {
  isOpen: boolean;
  editingFollow: FollowEntity | null;
  selectedPickId: string | null;
  openCreateModal: (pickId: string) => void;
  openEditModal: (follow: FollowEntity) => void;
  closeModal: () => void;
  createFollow: (data: CreateFollowDTO) => Promise<void>;
  updateFollow: (id: string, data: Partial<CreateFollowDTO>) => Promise<void>;
  deleteFollow: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para gestionar el modal de follow (crear/editar)
 */
export const useFollowModal = (): UseFollowModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingFollow, setEditingFollow] = useState<FollowEntity | null>(null);
  const [selectedPickId, setSelectedPickId] = useState<string | null>(null);

  const { execute: executeCreate, loading: createLoading, error: createError } = useAsync(
    (data: CreateFollowDTO) => followRepository.create(data)
  );

  const { execute: executeUpdate, loading: updateLoading, error: updateError } = useAsync(
    (id: string, data: Partial<CreateFollowDTO>) =>
      followRepository.update(id, data)
  );

  const { execute: executeDelete, loading: deleteLoading, error: deleteError } = useAsync(
    (id: string) => followRepository.delete(id)
  );

  const openCreateModal = useCallback((pickId: string) => {
    setSelectedPickId(pickId);
    setEditingFollow(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((follow: FollowEntity) => {
    setEditingFollow(follow);
    setSelectedPickId(follow.pickId);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingFollow(null);
    setSelectedPickId(null);
  }, []);

  const createFollow = useCallback(
    async (data: CreateFollowDTO) => {
      await executeCreate(data);
      closeModal();
    },
    [executeCreate, closeModal]
  );

  const updateFollow = useCallback(
    async (id: string, data: Partial<CreateFollowDTO>) => {
      await executeUpdate(id, data);
      closeModal();
    },
    [executeUpdate, closeModal]
  );

  const deleteFollow = useCallback(
    async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar este seguimiento?')) {
        await executeDelete(id);
      }
    },
    [executeDelete]
  );

  return {
    isOpen,
    editingFollow,
    selectedPickId,
    openCreateModal,
    openEditModal,
    closeModal,
    createFollow,
    updateFollow,
    deleteFollow,
    loading: createLoading || updateLoading || deleteLoading,
    error: createError || updateError || deleteError,
  };
};
```

#### 3.4 useFollowStats Hook
**Archivo `src/features/follows/hooks/useFollowStats.ts`:**
```typescript
import { useMemo } from 'react';
import { FollowEntity, PickEntity } from '@shared/types/entities.types';
import { calculatePickProfit, calculatePicksStats } from '@shared/utils/calculation.utils';

export interface FollowStats {
  totalFollows: number;
  resolvedFollows: number;
  wonFollows: number;
  lostFollows: number;
  winrate: number;
  totalProfit: number;
  totalStaked: number;
  yield: number;
  avgOdds: number;
  avgStake: number;
  matchCount: number;
  divergeCount: number;
  matchPercentage: number;
}

/**
 * Hook para calcular estadísticas de follows
 */
export const useFollowStats = (
  follows: FollowEntity[],
  picks: PickEntity[]
): FollowStats => {
  return useMemo(() => {
    const totalFollows = follows.length;
    const resolvedFollows = follows.filter((f) => f.userIsResolved).length;
    const wonFollows = follows.filter((f) => f.userResult === 'Ganada').length;
    const lostFollows = follows.filter((f) => f.userResult === 'Perdida').length;

    const winrate = resolvedFollows > 0 ? (wonFollows / resolvedFollows) * 100 : 0;

    const totalProfit = follows.reduce((sum, follow) => {
      if (!follow.userIsResolved) return sum;
      return sum + calculatePickProfit(
        follow.userOdds,
        follow.userStake,
        follow.userResult
      );
    }, 0);

    const totalStaked = follows
      .filter((f) => f.userIsResolved && f.userResult !== 'Void')
      .reduce((sum, follow) => sum + follow.userStake, 0);

    const yieldValue = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

    const avgOdds =
      totalFollows > 0
        ? follows.reduce((sum, f) => sum + f.userOdds, 0) / totalFollows
        : 0;

    const avgStake =
      totalFollows > 0
        ? follows.reduce((sum, f) => sum + f.userStake, 0) / totalFollows
        : 0;

    // Calcular match/diverge
    let matchCount = 0;
    let divergeCount = 0;

    follows.forEach((follow) => {
      const pick = picks.find((p) => p.id === follow.pickId);
      if (pick && pick.isResolved && follow.userIsResolved) {
        if (pick.result === follow.userResult) {
          matchCount++;
        } else {
          divergeCount++;
        }
      }
    });

    const totalResolved = matchCount + divergeCount;
    const matchPercentage = totalResolved > 0 ? (matchCount / totalResolved) * 100 : 0;

    return {
      totalFollows,
      resolvedFollows,
      wonFollows,
      lostFollows,
      winrate,
      totalProfit,
      totalStaked,
      yield: yieldValue,
      avgOdds,
      avgStake,
      matchCount,
      divergeCount,
      matchPercentage,
    };
  }, [follows, picks]);
};
```

**Archivo `src/features/follows/hooks/index.ts`:**
```typescript
export { useFollows } from './useFollows';
export { useFollow } from './useFollow';
export { useFollowModal } from './useFollowModal';
export { useFollowStats } from './useFollowStats';
export type { FollowStats } from './useFollowStats';
```

---

### 4. FollowForm Component

**Archivo `src/features/follows/components/FollowForm/FollowForm.tsx`:**
```typescript
import { FC, FormEvent, useState, useEffect } from 'react';
import { CreateFollowDTO, FollowEntity, PickEntity } from '@shared/types/entities.types';
import { Button, Input, Select } from '@shared/components';
import { PICK_RESULTS } from '@shared/constants/domain.constants';
import { validateFollow, hasValidationErrors } from '../../utils';
import type { FollowValidationErrors } from '../../utils';

interface FollowFormProps {
  follow?: FollowEntity | null;
  pick: PickEntity;
  tipsterName: string;
  onSubmit: (data: CreateFollowDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Formulario de follow (crear/editar)
 */
export const FollowForm: FC<FollowFormProps> = ({
  follow,
  pick,
  tipsterName,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  // Form state
  const [userOdds, setUserOdds] = useState<number | ''>(pick.odds);
  const [userStake, setUserStake] = useState<number | ''>(pick.stake);
  const [userResult, setUserResult] = useState<string>('Pendiente');
  const [userIsResolved, setUserIsResolved] = useState(false);

  const [validationErrors, setValidationErrors] = useState<FollowValidationErrors>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (follow) {
      setUserOdds(follow.userOdds);
      setUserStake(follow.userStake);
      setUserResult(follow.userResult);
      setUserIsResolved(follow.userIsResolved);
    }
  }, [follow]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Preparar datos
    const data: CreateFollowDTO = {
      pickId: pick.id,
      tipsterId: pick.tipsterId,
      userOdds: Number(userOdds),
      userStake: Number(userStake),
      userResult: userResult || 'Pendiente',
      userIsResolved,
      followDate: follow?.followDate || new Date().toISOString(),
    };

    // Validar
    const errors = validateFollow(data);
    setValidationErrors(errors);

    if (hasValidationErrors(errors)) {
      return;
    }

    await onSubmit(data);
  };

  const clearFieldError = (field: keyof FollowValidationErrors) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const resultOptions = PICK_RESULTS.map((r) => ({ value: r, label: r }));

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      {/* Información de la pick original */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Pick del Tipster
        </h3>
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Tipster:</span>
            <span className="text-text font-medium">{tipsterName}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Partido:</span>
            <span className="text-text font-medium">{pick.match}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Tipo de Apuesta:</span>
            <span className="text-text font-medium">{pick.betType}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Cuota Tipster:</span>
            <span className="text-text font-medium">{pick.odds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Stake Tipster:</span>
            <span className="text-text font-medium">{pick.stake}u</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-info">Resultado Tipster:</span>
            <span className="text-text font-medium">{pick.result}</span>
          </div>
        </div>
      </div>

      {/* Datos del usuario */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Tus Datos
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <Input
            label="Tu Cuota"
            type="number"
            step="0.01"
            min="1.01"
            placeholder="Ej: 1.85"
            value={userOdds}
            onChange={(e) => {
              setUserOdds(e.target.value ? parseFloat(e.target.value) : '');
              clearFieldError('userOdds');
            }}
            error={validationErrors.userOdds}
            required
          />

          <Input
            label="Tu Stake (Unidades)"
            type="number"
            step="0.5"
            min="1"
            max="10"
            placeholder="Ej: 2"
            value={userStake}
            onChange={(e) => {
              setUserStake(e.target.value ? parseFloat(e.target.value) : '');
              clearFieldError('userStake');
            }}
            error={validationErrors.userStake}
            required
          />
        </div>
      </div>

      {/* Resultado del usuario */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text pb-2 border-b border-white/5">
          Tu Resultado
        </h3>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-lg">
            <input
              type="checkbox"
              id="userIsResolved"
              checked={userIsResolved}
              onChange={(e) => setUserIsResolved(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="userIsResolved" className="text-sm text-text cursor-pointer select-none">
              Marcar como resuelta
            </label>
          </div>

          {userIsResolved && (
            <div className="mt-3">
              <Select
                label="Tu Resultado"
                options={resultOptions}
                value={userResult}
                onChange={(e) => {
                  setUserResult(e.target.value);
                  clearFieldError('userResult');
                }}
                placeholder="Selecciona resultado"
                error={validationErrors.userResult}
                required={userIsResolved}
              />
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 justify-end mt-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : follow ? 'Actualizar' : 'Seguir Pick'}
        </Button>
      </div>
    </form>
  );
};
```

**Archivo `src/features/follows/components/FollowForm/index.ts`:**
```typescript
export { FollowForm } from './FollowForm';
```

---

### 5. ComparisonStats Component

**Archivo `src/features/follows/components/ComparisonStats/ComparisonStats.tsx`:**
```typescript
import { FC } from 'react';
import type { FollowStats } from '../../hooks/useFollowStats';

interface ComparisonStatsProps {
  stats: FollowStats;
}

/**
 * Componente que muestra estadísticas comparativas
 */
export const ComparisonStats: FC<ComparisonStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 md:grid-cols-1">
      {/* Card: General */}
      <div className="p-5 bg-surface rounded-lg border border-white/5">
        <h3 className="text-sm font-medium text-info mb-3 uppercase tracking-wide">
          General
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Total Follows:</span>
            <span className="text-lg font-semibold text-text">{stats.totalFollows}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Resueltos:</span>
            <span className="text-lg font-semibold text-text">{stats.resolvedFollows}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Ganados:</span>
            <span className="text-lg font-semibold text-text">{stats.wonFollows}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Perdidos:</span>
            <span className="text-lg font-semibold text-text">{stats.lostFollows}</span>
          </div>
        </div>
      </div>

      {/* Card: Rendimiento */}
      <div className="p-5 bg-surface rounded-lg border border-white/5">
        <h3 className="text-sm font-medium text-info mb-3 uppercase tracking-wide">
          Rendimiento
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Winrate:</span>
            <span className="text-lg font-semibold text-text">{stats.winrate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/[0.02] rounded-lg">
            <span className="text-sm text-text">Yield:</span>
            <span className={`text-lg font-semibold ${
                stats.yield >= 0 ? 'text-success' : 'text-error'
              }`}
            >
              {stats.yield >= 0 ? '+' : ''}
              {stats.yield.toFixed(2)}%
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Profit:</span>
            <span
              className={`${styles.statValue} ${
                stats.totalProfit >= 0 ? styles.positive : styles.negative
              }`}
            >
              {stats.totalProfit >= 0 ? '+' : ''}
              {stats.totalProfit.toFixed(2)}u
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total Apostado:</span>
            <span className={styles.statValue}>{stats.totalStaked.toFixed(2)}u</span>
          </div>
        </div>
      </div>

      {/* Card: Promedios */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Promedios</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Cuota Media:</span>
            <span className={styles.statValue}>{stats.avgOdds.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Stake Medio:</span>
            <span className={styles.statValue}>{stats.avgStake.toFixed(2)}u</span>
          </div>
        </div>
      </div>

      {/* Card: Comparación */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Comparación con Tipsters</h3>
        <div className={styles.statsGrid}>
          <div className={`${styles.statRow} ${styles.match}`}>
            <span className={styles.statLabel}>Match:</span>
            <span className={styles.statValue}>{stats.matchCount}</span>
          </div>
          <div className={`${styles.statRow} ${styles.diverge}`}>
            <span className={styles.statLabel}>Diverge:</span>
            <span className={styles.statValue}>{stats.divergeCount}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Match %:</span>
            <span className={styles.statValue}>
              {stats.matchPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/follows/components/ComparisonStats/index.ts`:**
```typescript
export { ComparisonStats } from './ComparisonStats';
```

---

### 6. FollowRow Component

**Archivo `src/features/follows/components/FollowRow/FollowRow.tsx`:**
```typescript
import { FC } from 'react';
import { FollowEntity, PickEntity } from '@shared/types/entities.types';
import { Badge } from '@shared/components';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '@shared/utils/date.utils';
import { calculatePickProfit } from '@shared/utils/calculation.utils';
import { compareResults } from '../../utils/comparison.utils';

interface FollowRowProps {
  follow: FollowEntity;
  pick: PickEntity;
  tipsterName: string;
  onEdit?: (follow: FollowEntity) => void;
  onDelete?: (followId: string) => void;
}

/**
 * Fila de tabla comparativa para un follow
 */
export const FollowRow: FC<FollowRowProps> = ({
  follow,
  pick,
  tipsterName,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit?.(follow);
  };

  const handleDelete = () => {
    onDelete?.(follow.id);
  };

  // Calcular profits
  const tipsterProfit = pick.isResolved
    ? calculatePickProfit(pick.odds, pick.stake, pick.result)
    : null;

  const userProfit = follow.userIsResolved
    ? calculatePickProfit(follow.userOdds, follow.userStake, follow.userResult)
    : null;

  // Comparar resultados
  const comparison = compareResults(pick.result, follow.userResult);

  // Variante del badge según resultado
  const tipsterResultVariant =
    pick.result === 'Ganada'
      ? 'success'
      : pick.result === 'Perdida'
      ? 'error'
      : pick.result === 'Void'
      ? 'warning'
      : 'info';

  const userResultVariant =
    follow.userResult === 'Ganada'
      ? 'success'
      : follow.userResult === 'Perdida'
      ? 'error'
      : follow.userResult === 'Void'
      ? 'warning'
      : 'info';

  return (
    <tr className="transition-colors hover:bg-white/[0.02]">
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="text-xs text-info">{formatDate(pick.date)}</div>
        <div className="text-xs text-info">{formatTime(pick.time)}</div>
      </td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{tipsterName}</td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.sport}</td>
      <td className="px-3 py-3 text-sm text-text align-middle font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap md:px-2 md:py-2 md:text-xs md:max-w-[120px]" title={pick.match}>
        {pick.match}
      </td>
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">{pick.betType}</td>

      {/* Comparación Odds */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex flex-col gap-1 md:gap-0.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Tipster:</span>
            <span className="font-medium">{pick.odds.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Usuario:</span>
            <span className="font-medium">{follow.userOdds.toFixed(2)}</span>
          </div>
        </div>
      </td>

      {/* Comparación Stake */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex flex-col gap-1 md:gap-0.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Tipster:</span>
            <span className="font-medium">{pick.stake}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Usuario:</span>
            <span className="font-medium">{follow.userStake}</span>
          </div>
        </div>
      </td>

      {/* Comparación Resultado */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex flex-col gap-1 md:gap-0.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Tipster:</span>
            <Badge variant={tipsterResultVariant}>{pick.result}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-info min-w-[60px]">Usuario:</span>
            <Badge variant={userResultVariant}>{follow.userResult}</Badge>
          </div>
        </div>
      </td>

      {/* Comparación Profit */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex flex-col gap-1 md:gap-0.5">
          {tipsterProfit !== null && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-info min-w-[60px]">Tipster:</span>
              <span className={`font-medium ${tipsterProfit >= 0 ? 'positive' : 'negative'}`}>
                {tipsterProfit >= 0 ? '+' : ''}
                {tipsterProfit.toFixed(2)}u
              </span>
            </div>
          )}
          {userProfit !== null && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-info min-w-[60px]">Usuario:</span>
              <span className={`font-medium ${userProfit >= 0 ? 'positive' : 'negative'}`}>
                {userProfit >= 0 ? '+' : ''}
                {userProfit.toFixed(2)}u
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Match/Diverge */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold uppercase ${
          comparison === 'match' 
            ? 'bg-success/20 text-success' 
            : comparison === 'diverge' 
            ? 'bg-error/20 text-error' 
            : 'bg-info/20 text-info'
        }`}>
          {comparison === 'match' ? 'Match' : comparison === 'diverge' ? 'Diverge' : 'Pendiente'}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-3 py-3 text-sm text-text align-middle md:px-2 md:py-2 md:text-xs">
        <div className="flex gap-1 justify-end">
          {onEdit && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-info hover:bg-white/10 hover:text-text transition-all"
              onClick={handleEdit}
              title="Editar follow"
              aria-label="Editar follow"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-info hover:bg-white/10 hover:text-text transition-all"
              onClick={handleDelete}
              title="Eliminar follow"
              aria-label="Eliminar follow"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
```

**Archivo `src/features/follows/components/FollowRow/index.ts`:**
```typescript
export { FollowRow } from './FollowRow';
```

---

### 7. FollowTable Component

**Archivo `src/features/follows/components/FollowTable/FollowTable.tsx`:**
```typescript
import { FC } from 'react';
import { FollowEntity, PickEntity } from '@shared/types/entities.types';
import { EmptyState } from '@shared/components';
import { FollowRow } from '../FollowRow';

interface FollowTableProps {
  follows: FollowEntity[];
  picks: PickEntity[];
  tipsters: Array<{ id: string; name: string }>;
  onEdit?: (follow: FollowEntity) => void;
  onDelete?: (followId: string) => void;
}

/**
 * Tabla comparativa de follows
 */
export const FollowTable: FC<FollowTableProps> = ({
  follows,
  picks,
  tipsters,
  onEdit,
  onDelete,
}) => {
  // Map de tipsters y picks por ID
  const tipstersMap = tipsters.reduce((acc, t) => {
    acc[t.id] = t.name;
    return acc;
  }, {} as Record<string, string>);

  const picksMap = picks.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, PickEntity>);

  if (follows.length === 0) {
    return (
      <div className="w-full overflow-x-auto bg-surface rounded-lg border border-white/5">
        <div className="py-8 px-4 text-center text-info">
          <EmptyState message="No has seguido ninguna pick todavía" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-surface rounded-lg border border-white/5">
      <table className="w-full border-collapse text-sm md:text-xs">
        <thead className="bg-primary/10 border-b-2 border-primary/30">
          <tr>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Fecha/Hora</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Tipster</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Deporte</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Partido</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Tipo Apuesta</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Cuota</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Stake</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Resultado</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Profit</th>
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Match/Diverge</th>
            <th className="px-3 py-3 text-right font-semibold text-xs uppercase tracking-wide text-text whitespace-nowrap md:px-2 md:py-2 md:text-[10px]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {follows.map((follow) => {
            const pick = picksMap[follow.pickId];
            if (!pick) return null; // Skip si la pick fue eliminada

            return (
              <FollowRow
                key={follow.id}
                follow={follow}
                pick={pick}
                tipsterName={tipstersMap[follow.tipsterId] || 'Desconocido'}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

**Archivo `src/features/follows/components/FollowTable/index.ts`:**
```typescript
export { FollowTable } from './FollowTable';
```

---

### 8. FollowModal Component

**Archivo `src/features/follows/components/FollowModal/FollowModal.tsx`:**
```typescript
import { FC } from 'react';
import { Modal } from '@shared/components';
import { FollowForm } from '../FollowForm';
import { FollowEntity, PickEntity, CreateFollowDTO } from '@shared/types/entities.types';

interface FollowModalProps {
  isOpen: boolean;
  follow: FollowEntity | null;
  pick: PickEntity | null;
  tipsterName: string;
  onClose: () => void;
  onSubmit: (data: CreateFollowDTO) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

/**
 * Modal para crear/editar follow
 */
export const FollowModal: FC<FollowModalProps> = ({
  isOpen,
  follow,
  pick,
  tipsterName,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  if (!pick) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={follow ? 'Editar Seguimiento' : 'Seguir Pick'}
      size="medium"
    >
      <FollowForm
        follow={follow}
        pick={pick}
        tipsterName={tipsterName}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
        error={error}
      />
    </Modal>
  );
};
```

**Archivo `src/features/follows/components/FollowModal/index.ts`:**
```typescript
export { FollowModal } from './FollowModal';
```

**Archivo `src/features/follows/components/index.ts`:**
```typescript
export { FollowTable } from './FollowTable';
export { FollowRow } from './FollowRow';
export { FollowForm } from './FollowForm';
export { FollowModal } from './FollowModal';
export { ComparisonStats } from './ComparisonStats';
```

---

### 9. MyPicksPage

**Archivo `src/features/follows/pages/MyPicksPage/MyPicksPage.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import { Loading } from '@shared/components';
import { useFollows, useFollowModal, useFollowStats } from '../../hooks';
import { FollowTable, ComparisonStats, FollowModal } from '../../components';
import { useTipsters } from '@features/tipsters';
import { usePicks } from '@features/picks';

/**
 * Página de Mis Picks (follows del usuario)
 */
export const MyPicksPage: FC = () => {
  const { follows, loading: followsLoading, error: followsError } = useFollows();
  const { picks, loading: picksLoading } = usePicks();
  const { tipsters, loading: tipstersLoading } = useTipsters();

  const {
    isOpen,
    editingFollow,
    selectedPickId,
    openEditModal,
    closeModal,
    createFollow,
    updateFollow,
    deleteFollow,
    loading: modalLoading,
    error: modalError,
  } = useFollowModal();

  // Calcular estadísticas
  const stats = useFollowStats(follows, picks);

  // Preparar lista de tipsters
  const tipstersList = useMemo(
    () => tipsters.map((t) => ({ id: t.id, name: t.name })),
    [tipsters]
  );

  // Ordenar follows por fecha descendente
  const sortedFollows = useMemo(() => {
    return [...follows].sort((a, b) => {
      return new Date(b.followDate).getTime() - new Date(a.followDate).getTime();
    });
  }, [follows]);

  // Obtener pick seleccionada para el modal
  const selectedPick = useMemo(() => {
    if (!selectedPickId) return null;
    return picks.find((p) => p.id === selectedPickId) || null;
  }, [selectedPickId, picks]);

  // Obtener nombre del tipster para el modal
  const selectedTipsterName = useMemo(() => {
    if (!selectedPick) return '';
    const tipster = tipsters.find((t) => t.id === selectedPick.tipsterId);
    return tipster?.name || 'Desconocido';
  }, [selectedPick, tipsters]);

  const handleSubmit = async (data: any) => {
    if (editingFollow) {
      await updateFollow(editingFollow.id, data);
    } else {
      await createFollow(data);
    }
  };

  if (followsLoading || picksLoading || tipstersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-4 md:gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-start">
        <div>
          <h1 className="text-3xl font-semibold text-text md:text-2xl">Mis Picks</h1>
          <p className="text-sm text-info mt-1">
            Picks que has seguido y comparación con los resultados de los tipsters
          </p>
        </div>
      </div>

      {/* Errores */}
      {followsError && (
        <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-center">
          {followsError}
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col gap-5">
        {/* Estadísticas Comparativas */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text">Estadísticas</h2>
          <ComparisonStats stats={stats} />
        </div>

        {/* Tabla de Follows */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text">Historial de Seguimientos</h2>
          <FollowTable
            follows={sortedFollows}
            picks={picks}
            tipsters={tipstersList}
            onEdit={openEditModal}
            onDelete={deleteFollow}
          />
        </div>
      </div>

      {/* Modal */}
      <FollowModal
        isOpen={isOpen}
        follow={editingFollow}
        pick={selectedPick}
        tipsterName={selectedTipsterName}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};
```

**Archivo `src/features/follows/pages/MyPicksPage/index.ts`:**
```typescript
export { MyPicksPage } from './MyPicksPage';
```

**Archivo `src/features/follows/pages/index.ts`:**
```typescript
export { MyPicksPage } from './MyPicksPage';
```

---

### 10. Feature Index

**Archivo `src/features/follows/index.ts`:**
```typescript
// Hooks
export { useFollows, useFollow, useFollowModal, useFollowStats } from './hooks';
export type { FollowStats } from './hooks';

// Components
export {
  FollowTable,
  FollowRow,
  FollowForm,
  FollowModal,
  ComparisonStats,
} from './components';

// Pages
export { MyPicksPage } from './pages';

// Utils
export {
  validateFollow,
  hasValidationErrors,
  compareResults,
  calculateProfitDifference,
  calculateTraceability,
} from './utils';
export type { FollowValidationErrors, TraceabilityStats } from './utils';
```

---

### 11. Añadir Botón "Seguir" en AllPicksPage

**Modificar `src/features/picks/pages/AllPicksPage/AllPicksPage.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Loading } from '@shared/components';
import { usePicks, usePickModal, usePickFilters } from '../../hooks';
import { PickTable, PickFilters, PickModal } from '../../components';
import { useTipsters } from '@features/tipsters';
import { useFollowModal } from '@features/follows'; // NUEVO
import { FollowModal } from '@features/follows/components'; // NUEVO
import styles from './AllPicksPage.module.css';

export const AllPicksPage: FC = () => {
  const { picks, loading: picksLoading, error: picksError } = usePicks();
  const { tipsters, loading: tipstersLoading } = useTipsters();

  const {
    isOpen,
    editingPick,
    openCreateModal,
    openEditModal,
    closeModal,
    createPick,
    updatePick,
    deletePick,
    loading: modalLoading,
    error: modalError,
  } = usePickModal();

  // NUEVO: Modal de follows
  const {
    isOpen: isFollowModalOpen,
    selectedPickId,
    openCreateModal: openFollowModal,
    closeModal: closeFollowModal,
    createFollow,
    loading: followLoading,
    error: followError,
  } = useFollowModal();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredPicks,
    activeFiltersCount,
  } = usePickFilters(picks);

  const tipstersList = useMemo(
    () => tipsters.map((t) => ({ id: t.id, name: t.name })),
    [tipsters]
  );

  const sortedPicks = useMemo(() => {
    return [...filteredPicks].sort((a, b) => {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });
  }, [filteredPicks]);

  const stats = useMemo(() => {
    const resolved = picks.filter((p) => p.isResolved).length;
    const pending = picks.length - resolved;
    const won = picks.filter((p) => p.result === 'Ganada').length;
    const winrate = resolved > 0 ? ((won / resolved) * 100).toFixed(1) : '0.0';

    return {
      total: picks.length,
      resolved,
      pending,
      winrate,
    };
  }, [picks]);

  const handleSubmit = async (data: any) => {
    if (editingPick) {
      await updatePick(editingPick.id, data);
    } else {
      await createPick(data);
    }
  };

  // NUEVO: Obtener pick seleccionada para follow modal
  const selectedPick = useMemo(() => {
    if (!selectedPickId) return null;
    return picks.find((p) => p.id === selectedPickId) || null;
  }, [selectedPickId, picks]);

  const selectedTipsterName = useMemo(() => {
    if (!selectedPick) return '';
    const tipster = tipsters.find((t) => t.id === selectedPick.tipsterId);
    return tipster?.name || 'Desconocido';
  }, [selectedPick, tipsters]);

  if (picksLoading || tipstersLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Todas las Picks</h1>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>Total:</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statItem}>
              <span>Resueltas:</span>
              <span className={styles.statValue}>{stats.resolved}</span>
            </div>
            <div className={styles.statItem}>
              <span>Pendientes:</span>
              <span className={styles.statValue}>{stats.pending}</span>
            </div>
            <div className={styles.statItem}>
              <span>Winrate:</span>
              <span className={styles.statValue}>{stats.winrate}%</span>
            </div>
          </div>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Añadir Pick
        </Button>
      </div>

      {picksError && <div className={styles.error}>{picksError}</div>}

      <div className={styles.content}>
        <PickFilters
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          activeFiltersCount={activeFiltersCount}
          tipsters={tipstersList}
        />

        {/* MODIFICADO: Añadir onFollow */}
        <PickTable
          picks={sortedPicks}
          tipsters={tipstersList}
          onEdit={openEditModal}
          onDelete={deletePick}
          onFollow={openFollowModal} // NUEVO
        />
      </div>

      <PickModal
        isOpen={isOpen}
        pick={editingPick}
        tipsters={tipstersList}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={modalLoading}
        error={modalError}
      />

      {/* NUEVO: Follow Modal */}
      <FollowModal
        isOpen={isFollowModalOpen}
        follow={null}
        pick={selectedPick}
        tipsterName={selectedTipsterName}
        onClose={closeFollowModal}
        onSubmit={createFollow}
        loading={followLoading}
        error={followError}
      />
    </div>
  );
};
```

**Modificar `src/features/picks/components/PickTable/PickTable.tsx` para añadir prop `onFollow`:**
```typescript
import { FC } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import { EmptyState } from '@shared/components';
import { PickRow } from '../PickRow';
import styles from './PickTable.module.css';

interface PickTableProps {
  picks: PickEntity[];
  tipsters: Array<{ id: string; name: string }>;
  onEdit?: (pick: PickEntity) => void;
  onDelete?: (pickId: string) => void;
  onFollow?: (pickId: string) => void; // NUEVO
}

export const PickTable: FC<PickTableProps> = ({
  picks,
  tipsters,
  onEdit,
  onDelete,
  onFollow, // NUEVO
}) => {
  const tipstersMap = tipsters.reduce((acc, t) => {
    acc[t.id] = t.name;
    return acc;
  }, {} as Record<string, string>);

  if (picks.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <EmptyState message="No hay picks registradas" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Fecha/Hora</th>
            <th className={styles.th}>Tipster</th>
            <th className={styles.th}>Deporte</th>
            <th className={styles.th}>Partido</th>
            <th className={styles.th}>Tipo Apuesta</th>
            <th className={styles.th}>Cuota</th>
            <th className={styles.th}>Stake</th>
            <th className={styles.th}>Resultado</th>
            <th className={styles.th}>Profit</th>
            <th className={styles.th}>Tipo</th>
            <th className={styles.th}>Bookmaker</th>
            <th className={`${styles.th} ${styles.thRight}`}>Acciones</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {picks.map((pick) => (
            <PickRow
              key={pick.id}
              pick={pick}
              tipsterName={tipstersMap[pick.tipsterId]}
              onEdit={onEdit}
              onDelete={onDelete}
              onFollow={onFollow} // NUEVO
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

**Modificar `src/features/picks/components/PickRow/PickRow.tsx` para añadir botón seguir:**
```typescript
import { FC } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import { Badge } from '@shared/components';
import { Edit2, Trash2, UserPlus } from 'lucide-react'; // NUEVO: UserPlus
import { formatDate, formatTime } from '@shared/utils/date.utils';
import { calculatePickProfit } from '@shared/utils/calculation.utils';
import styles from './PickRow.module.css';

interface PickRowProps {
  pick: PickEntity;
  tipsterName?: string;
  onEdit?: (pick: PickEntity) => void;
  onDelete?: (pickId: string) => void;
  onFollow?: (pickId: string) => void; // NUEVO
}

export const PickRow: FC<PickRowProps> = ({
  pick,
  tipsterName = 'Desconocido',
  onEdit,
  onDelete,
  onFollow, // NUEVO
}) => {
  const handleEdit = () => {
    onEdit?.(pick);
  };

  const handleDelete = () => {
    onDelete?.(pick.id);
  };

  // NUEVO
  const handleFollow = () => {
    onFollow?.(pick.id);
  };

  const profit = pick.isResolved
    ? calculatePickProfit(pick.odds, pick.stake, pick.result)
    : null;

  const resultVariant =
    pick.result === 'Ganada'
      ? 'success'
      : pick.result === 'Perdida'
      ? 'error'
      : pick.result === 'Void'
      ? 'warning'
      : 'info';

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.cellSmall}>{formatDate(pick.date)}</div>
        <div className={styles.cellSmall}>{formatTime(pick.time)}</div>
      </td>
      <td className={`${styles.cell} ${styles.tipsterName}`}>{tipsterName}</td>
      <td className={styles.cell}>{pick.sport}</td>
      <td className={`${styles.cell} ${styles.match}`} title={pick.match}>
        {pick.match}
      </td>
      <td className={styles.cell}>{pick.betType}</td>
      <td className={styles.cell}>{pick.odds.toFixed(2)}</td>
      <td className={styles.cell}>{pick.stake}</td>
      <td className={styles.cell}>
        <Badge variant={resultVariant}>{pick.result}</Badge>
      </td>
      {profit !== null && (
        <td className={styles.cell}>
          <span className={profit >= 0 ? 'positive' : 'negative'}>
            {profit >= 0 ? '+' : ''}
            {profit.toFixed(2)}u
          </span>
        </td>
      )}
      <td className={styles.cell}>{pick.pickType}</td>
      <td className={styles.cell}>{pick.bookmaker}</td>
      <td className={styles.cell}>
        <div className={styles.actions}>
          {/* NUEVO: Botón seguir */}
          {onFollow && (
            <button
              className={styles.iconButton}
              onClick={handleFollow}
              title="Seguir pick"
              aria-label="Seguir pick"
            >
              <UserPlus size={16} />
            </button>
          )}
          {onEdit && (
            <button
              className={styles.iconButton}
              onClick={handleEdit}
              title="Editar pick"
              aria-label="Editar pick"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              className={styles.iconButton}
              onClick={handleDelete}
              title="Eliminar pick"
              aria-label="Eliminar pick"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
```

---

### 12. Integración en App.tsx

**Modificar `src/App.tsx` para añadir ruta de My Picks:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import { PrivateRoute } from './features/auth';
import { LoginPage, SignupPage } from './features/auth/pages';
import { TipstersPage } from './features/tipsters/pages';
import { AllPicksPage } from './features/picks/pages';
import { MyPicksPage } from './features/follows/pages'; // NUEVO
import { PrivateLayout } from './layouts/PrivateLayout';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/tipsters" replace />} />
            
            {/* Tipsters */}
            <Route path="tipsters" element={<TipstersPage />} />
            
            {/* Picks */}
            <Route path="picks" element={<AllPicksPage />} />
            
            {/* My Picks - NUEVO */}
            <Route path="my-picks" element={<MyPicksPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
```

---

### 13. Actualizar Header con Navegación

**Modificar `src/shared/components/Layout/Header/Header.tsx`:**
```typescript
import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../../UI/Button';
import { useAuth } from '@features/auth';
import styles from './Header.module.css';

export const Header: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.logo}>Tipster Tracker</h1>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navLink} ${isActive('/tipsters') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/tipsters')}
          >
            Tipsters
          </button>
          <button
            className={`${styles.navLink} ${isActive('/picks') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/picks')}
          >
            Picks
          </button>
          {/* NUEVO */}
          <button
            className={`${styles.navLink} ${isActive('/my-picks') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/my-picks')}
          >
            Mis Picks
          </button>
        </nav>

        <div className={styles.actions}>
          {user && (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                Salir
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
```

---

### 14. Checklist de Verificación

#### Setup y Estructura
- [ ] Crear carpeta `src/features/follows/` con subcarpetas
- [ ] Crear `utils/follow-validation.utils.ts`
- [ ] Crear `utils/comparison.utils.ts`
- [ ] Verificar exports en `utils/index.ts`

#### Hooks
- [ ] Implementar `hooks/useFollows.ts` con real-time
- [ ] Implementar `hooks/useFollow.ts` para follow individual
- [ ] Implementar `hooks/useFollowModal.ts` con CRUD completo
- [ ] Implementar `hooks/useFollowStats.ts` con cálculos comparativos
- [ ] Verificar exports en `hooks/index.ts`
- [ ] Verificar que hooks usan `followRepository` correctamente

#### Componentes
- [ ] Implementar `FollowForm` con info de pick + datos usuario
- [ ] Implementar `ComparisonStats` con 4 cards
- [ ] Implementar `FollowRow` con comparación tipster vs usuario
- [ ] Implementar `FollowTable` con columnas comparativas
- [ ] Implementar `FollowModal` con size medium
- [ ] Verificar estilos CSS Modules en cada componente
- [ ] Verificar exports en `components/index.ts`

#### Página
- [ ] Implementar `MyPicksPage` con estadísticas y tabla
- [ ] Integrar ComparisonStats
- [ ] Integrar FollowTable con ordenación
- [ ] Mostrar mensaje si no hay follows
- [ ] Verificar export en `pages/index.ts`

#### Integración con Picks
- [ ] Añadir botón "Seguir" en PickRow
- [ ] Añadir prop `onFollow` en PickTable
- [ ] Integrar FollowModal en AllPicksPage
- [ ] Verificar que modal muestra datos correctos de la pick
- [ ] Verificar que se crean follows correctamente

#### Integración General
- [ ] Añadir ruta `/my-picks` en `App.tsx`
- [ ] Actualizar `Header.tsx` con link "Mis Picks"
- [ ] Verificar navegación entre páginas
- [ ] Verificar que Header muestra ruta activa

#### Utilidades de Comparación
- [ ] Función `compareResults()` (match/diverge/pending)
- [ ] Función `calculateProfitDifference()`
- [ ] Función `calculateTraceability()` con porcentaje seguibilidad
- [ ] Verificar cálculos en FollowRow

#### Testing Manual - Crear Follow
- [ ] Ir a "Picks"
- [ ] Click en botón "Seguir" (icono UserPlus) de una pick
- [ ] Modal muestra info correcta de la pick
- [ ] Cambiar cuota usuario (ej: de 1.85 a 1.90)
- [ ] Cambiar stake usuario (ej: de 2 a 3)
- [ ] Marcar como resuelta
- [ ] Seleccionar resultado usuario
- [ ] Submit y verificar creación
- [ ] Ir a "Mis Picks" y verificar aparición

#### Testing Manual - Editar Follow
- [ ] En "Mis Picks", click en icono editar
- [ ] Modal muestra datos actuales
- [ ] Cambiar resultado usuario
- [ ] Submit y verificar actualización
- [ ] Verificar cambio en columna Match/Diverge

#### Testing Manual - Comparación
- [ ] Crear follow con mismo resultado que tipster → Verificar "Match"
- [ ] Crear follow con diferente resultado que tipster → Verificar "Diverge"
- [ ] Verificar colores en badge (verde match, rojo diverge)
- [ ] Verificar comparación de cuotas en tabla
- [ ] Verificar comparación de stakes en tabla
- [ ] Verificar comparación de profits en tabla

#### Testing Manual - Estadísticas
- [ ] Verificar "Total Follows" correcto
- [ ] Verificar "Resueltos" correcto
- [ ] Verificar "Ganados" y "Perdidos" correctos
- [ ] Verificar cálculo de Winrate
- [ ] Verificar cálculo de Yield
- [ ] Verificar cálculo de Profit total
- [ ] Verificar "Match Count" y "Diverge Count"
- [ ] Verificar "Match %" correcto

#### Real-time
- [ ] Verificar que `useFollows` se suscribe a Firestore
- [ ] Crear follow y verificar aparición sin refresh
- [ ] Editar follow y verificar actualización
- [ ] Eliminar follow y verificar desaparición
- [ ] Verificar sincronización con picks

#### Validación
- [ ] Validar cuota usuario >= 1.01
- [ ] Validar stake usuario 1-10
- [ ] Validar resultado requerido si está resuelta
- [ ] Mostrar errores específicos por campo
- [ ] Limpiar errores al corregir campo

#### UI/UX
- [ ] Loading overlay durante operaciones
- [ ] Mensajes de error informativos
- [ ] Confirmación antes de eliminar
- [ ] EmptyState cuando no hay follows
- [ ] Info de pick original destacada (fondo amarillo)
- [ ] Badges con colores match/diverge
- [ ] Profits con colores positivo/negativo
- [ ] Responsive en mobile
- [ ] Navegación funcional en Header

#### Integración entre Features
- [ ] Follows se relacionan con picks correctamente
- [ ] Follows se relacionan con tipsters correctamente
- [ ] Eliminar pick no rompe follows (se skipean)
- [ ] Estadísticas se calculan correctamente
- [ ] Real-time funciona entre picks y follows

---

### 15. Comandos de Verificación

```bash
# Verificar estructura de archivos
Get-ChildItem -Recurse -Path src/features/follows | Select-Object FullName

# Build del proyecto
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Preview build
npm run preview

# Ejecutar emuladores Firebase
firebase emulators:start
```

---

### 16. Testing Manual - Checklist Detallado

#### Escenario 1: Seguir Pick y Match Resultado
1. Navegar a "Picks"
2. Encontrar pick resuelta con resultado "Ganada"
3. Click en botón "Seguir" (UserPlus icon)
4. Modal muestra:
   - Info de pick (tipster, partido, tipo apuesta, cuota, stake, resultado)
   - Campos usuario pre-rellenados con datos del tipster
5. No cambiar nada (mismas cuota y stake)
6. Marcar como resuelta
7. Seleccionar resultado "Ganada"
8. Submit
9. Navegar a "Mis Picks"
10. Verificar aparición del follow
11. Verificar badge "Match" en verde
12. Verificar profits iguales en ambas columnas

#### Escenario 2: Seguir Pick con Divergencia
1. En "Picks", encontrar pick con resultado "Ganada"
2. Click en "Seguir"
3. Cambiar cuota usuario: 2.00
4. Cambiar stake usuario: 3
5. Marcar como resuelta
6. Seleccionar resultado "Perdida"
7. Submit
8. En "Mis Picks":
   - Verificar badge "Diverge" en rojo
   - Verificar comparación de cuotas (tipster vs usuario)
   - Verificar comparación de profits (diferentes)
   - Verificar estadísticas actualizadas

#### Escenario 3: Editar Follow
1. En "Mis Picks", seleccionar follow pendiente
2. Click en icono editar
3. Cambiar resultado a "Ganada"
4. Marcar como resuelta
5. Submit
6. Verificar actualización inmediata
7. Verificar cambio en estadísticas
8. Verificar cambio de badge si aplica

#### Escenario 4: Estadísticas Comparativas
1. Crear 5 follows con resultados variados
2. Verificar que "Total Follows" = 5
3. Resolver 3 follows
4. Verificar que "Resueltos" = 3
5. Ganar 2 de los 3 resueltos
6. Verificar Winrate = 66.7%
7. Verificar profit total calculado correctamente
8. Verificar yield calculado correctamente
9. Verificar contadores de match/diverge

#### Escenario 5: Eliminar Follow
1. Seleccionar follow
2. Click en icono eliminar (Trash2)
3. Confirmar en diálogo
4. Verificar desaparición de tabla
5. Verificar actualización de estadísticas
6. Verificar que pick original sigue existiendo

---

### 17. Cálculo de Seguibilidad (Traceability)

**Concepto**: La seguibilidad mide qué porcentaje de picks de un tipster ha seguido el usuario desde su primer follow.

**Fórmula**:
```
Seguibilidad = (Picks Seguidas / Total Picks Desde Primer Follow) * 100
```

**Ejemplo**:
- Tipster tiene 100 picks en total
- Usuario hace su primer follow en la pick #50
- Usuario ha seguido 30 picks después de la #50
- Total picks desde primer follow: 51 (picks #50 a #100)
- Seguibilidad: (30 / 51) * 100 = 58.8%

**Implementación en `calculateTraceability()`:**
1. Filtrar picks del tipster
2. Encontrar fecha del primer follow
3. Contar picks desde esa fecha
4. Contar follows del usuario
5. Calcular porcentaje

**Uso**: Esta métrica será usada en la Fase 7 (Dashboard) para mostrar la seguibilidad de cada tipster.

---

### 18. Diferencias entre Picks y Follows

| Aspecto | Picks | Follows |
|---------|-------|---------|
| **Propósito** | Registro del tipster | Registro del usuario |
| **Relación** | Independientes | Dependen de picks |
| **Odds/Stake** | Del tipster | Del usuario |
| **Resultado** | Del tipster | Del usuario |
| **Eliminación** | Elimina la pick | Solo elimina el follow |
| **Vista** | All Picks | My Picks |
| **Comparación** | No aplica | Match/Diverge vs tipster |

**Importante**: Un follow es una "copia" de una pick con los datos reales del usuario. Permite comparar el rendimiento del usuario vs el tipster.

---

### 19. Estructura de Datos Comparativa

**Pick Entity:**
```typescript
{
  id: string;
  tipsterId: string;
  match: string;
  betType: string;
  odds: 1.85;        // Cuota del tipster
  stake: 2;          // Stake del tipster
  result: 'Ganada';  // Resultado del tipster
  isResolved: true;
  // ... otros campos
}
```

**Follow Entity:**
```typescript
{
  id: string;
  pickId: string;    // Referencia a la pick
  tipsterId: string;
  userOdds: 1.90;        // Cuota que consiguió el usuario
  userStake: 3;          // Stake del usuario
  userResult: 'Perdida'; // Resultado del usuario
  userIsResolved: true;
  followDate: '2025-11-13T10:30:00Z';
}
```

**Comparación:**
- Odds: 1.85 (tipster) vs 1.90 (usuario) → Usuario consiguió mejor cuota
- Stake: 2u (tipster) vs 3u (usuario) → Usuario apostó más
- Resultado: Ganada vs Perdida → **DIVERGE**
- Profit tipster: +1.70u
- Profit usuario: -3.00u
- Diferencia: -4.70u

---

### 20. Mejoras Futuras (Post Fase 6)

**Funcionalidades adicionales:**
- Filtros en MyPicksPage (por tipster, por match/diverge, por fecha)
- Ordenación de tabla por columnas
- Gráfico de rendimiento usuario vs tipster
- Alertas cuando resultado diverge
- Estadísticas de seguibilidad por tipster
- Export de follows a CSV
- Importar follows desde Excel
- Notas personales en follows

**Optimizaciones:**
- Cache de comparaciones calculadas
- Memoización de estadísticas
- Virtualización de tabla para muchos follows
- Lazy loading de modals

---

### Resumen de la Fase 6 ✅ **COMPLETADA - 100%**

**Fecha de finalización**: 18 de noviembre de 2025

**Completado:**
✅ Repository Pattern: FollowRepository con CRUD completo
✅ Hooks personalizados: useFollows, useFollow, useFollowsByTipster
✅ Validación completa de follows (odds, stakes, resultados)
✅ AddFollowModal con info de pick + datos usuario
✅ EditFollowModal con pre-llenado de datos
✅ FollowTableRow con comparación tipster vs usuario
✅ MyPicksPage completa con estadísticas y filtros avanzados
✅ Botón "Seguir" integrado en PickTableRow
✅ Integración de follow en AddPickModal (checkbox + sección)
✅ TipsterDetailPage con 3 tabs (Estadísticas, Mis Estadísticas, Follows)
✅ Real-time sync con Firestore (listeners onSnapshot)
✅ Cálculos de match/diverge, traceability, comparación de yields
✅ Sistema de filtros: tipster, resultado, match/diverge
✅ Comentarios colapsables en modals
✅ Botones icon-only para acciones (diseño compacto)
✅ Testing exhaustivo (10 secciones completas)
✅ 11 commits realizados
✅ 15+ bugs corregidos
✅ 6 mejoras de UX implementadas

**Duración real**: ~8 horas de trabajo intensivo (18/11/2025)

**Archivos creados**: ~15 archivos
**Líneas de código**: ~1,800 líneas

**Archivos principales**:
- `src/features/follows/` - Feature completo con hooks, components, pages
- `src/shared/utils/calculations.ts` - Función calculateTraceability
- Integración en PickTableRow, AddPickModal, TipsterDetailPage

**Bugs corregidos durante testing**:
1. Filtro "Diverge" demasiado restrictivo
2. Badge de contador de filtros faltante
3. Match Rate siempre verde
4. Flechas de comparación faltantes
5. Botones Edit/Delete no funcionales
6. Stats "Resueltos" redundante
7. Edit follow creando duplicados
8. Texto "Seguida" vs "Seguido"
9. Badge "Seguido" no verde
10. Bookmaker innecesariamente required
11. Follow fields no sincronizando
12. Edit mode no pre-llenando follow fields
13. Actions en tabla colapsadas
14. Comentarios siempre visibles
15. Botones demasiado grandes

**Mejoras de UX implementadas**:
1. Sistema de badges para filters activos
2. Comparación visual con flechas y colores
3. Tab "Mis Estadísticas" user-centric (no side-by-side)
4. Comentarios colapsables (MessageSquare button)
5. Tabla de acciones consistente y alineada
6. Botones icon-only compactos (h-5 w-5, 20px)

**Importante**: Esta fase completa el sistema de seguimiento y comparación. Es fundamental para entender el rendimiento real del usuario vs los tipsters. La función `calculateTraceability()` será usada extensivamente en el Dashboard (Fase 7).

---

### Decisión de UX: Tab "Mis Estadísticas" en TipsterDetailPage

**Fecha**: 18 de noviembre de 2025  
**Contexto**: Durante el testing de Fase 6 (Sección 5 del checklist)

#### Problema Identificado

El diseño original del tab "Mis Estadísticas" mostraba una comparación lado a lado entre el tipster y el usuario (2 columnas con 8 stats cada una). Esto presentaba varios problemas:

1. **Falta de foco**: El usuario quiere saber "¿Cómo me está yendo siguiendo a este tipster?", no ver stats duplicadas
2. **Redundancia**: Las estadísticas del tipster ya están disponibles en el tab "Estadísticas"
3. **Comparación demasiado prominente**: La diferencia (diff) debería ser un resumen, no el foco principal
4. **Layout confuso**: Mucho espacio dedicado a información que no aporta valor en este contexto

#### Solución Implementada

**Nuevo layout centrado en el usuario (user-centric)**:

```
┌─────────────────────────────────────────────┐
│  Sección 1: Seguibilidad (3 stat-cards)     │
│  • Total Picks del Tipster                  │
│  • Picks Seguidos por Ti                    │
│  • Tasa de Seguibilidad (%)                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Sección 2: Tus Stats de Seguimiento        │
│  Grid de 7 stat-cards con TUS números:      │
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
│  Badge visual con mensaje contextual:       │
│  🟢 "Superando al tipster en +2.5% yield"   │
│  🔴 "Por debajo del tipster en -1.2% yield" │
│  ⚪ "Mismo rendimiento que el tipster"       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Sección 4: Historial (tabla completa)      │
│  Tabla comparativa de todos tus follows     │
│  con acciones: Editar, Eliminar             │
└─────────────────────────────────────────────┘
```

#### Ventajas del Nuevo Diseño

1. ✅ **User-centric**: El foco está en TUS estadísticas, no en las del tipster
2. ✅ **No redundante**: Info del tipster disponible en tab "Estadísticas"
3. ✅ **Comparación como resumen**: Un badge breve y visual en lugar de columnas completas
4. ✅ **Layout más claro**: Flujo de información lógico y organizado
5. ✅ **Toda la info accesible**: Nada se pierde, solo se reorganiza mejor
6. ✅ **Responde la pregunta clave**: "¿Cómo me está yendo con este tipster?"

#### Cambios en el Código

- **Archivo**: `src/features/tipsters/pages/TipsterDetailPage.tsx`
- **Componentes afectados**:
  - Sección de seguibilidad (ya existía)
  - Grid de stats del usuario (refactorizado desde comparación)
  - Nueva sección de resumen comparativo (badge con mensaje)
  - Tabla de historial (sin cambios)

#### Impacto

- **UX**: Mejora significativa, más intuitivo y útil
- **Código**: Refactor menor, principalmente layout y mensajes
- **Testing**: Re-test de Sección 5 del checklist después del refactor

---

## FASE 7: Feature - Dashboard (Detallado)

### ⚠️ DECISIÓN ARQUITECTÓNICA: Charts Separados en Fase 8

**Fecha**: 18 de noviembre de 2025  
**Contexto**: Inicio de Fase 7

**Decisión**: Los gráficos de Chart.js se implementarán en una **Fase 8 dedicada** en lugar de incluirlos en Fase 7.

**Razones**:
1. **Separación de responsabilidades**: Dashboard (Fase 7) se centra en filtrado, búsqueda y navegación. Charts (Fase 8) se centra en visualizaciones.
2. **Complejidad**: Integrar `react-chartjs-2` + configuración de charts añade complejidad que puede retrasar el dashboard funcional.
3. **Testing más claro**: Facilita testing independiente de lógica de filtros vs. rendering de charts.
4. **Priorización**: Dashboard funcional es más crítico que visualizaciones en este punto.

**Ubicación de Charts (Fase 8)**:
- **TipsterDetailPage - Tab "Estadísticas"**: Charts del tipster (4 gráficos)
  * Distribución de odds (bar chart)
  * Distribución de stakes (bar chart)
  * Distribución de deportes (doughnut chart)
  * Distribución de tipos de pick (doughnut chart)
- **TipsterDetailPage - Tab "Mis Estadísticas"**: Charts de follows del usuario para ese tipster (4 gráficos)
- **MyPicksPage**: Charts globales de todos los follows del usuario (4 gráficos)

---

### Duración Estimada
**2-3 semanas** (40-60 horas de trabajo) - **Reducido** al excluir charts

### Objetivos de la Fase 7
1. Implementar dashboard principal con estadísticas agregadas
2. Crear hooks: useDashboard, useDashboardFilters, useDashboardStats
3. Migrar componentes: TipsterGrid, TipsterCard, PersonalStatsPanel
4. Implementar sistema de filtrado avanzado (deportes, canales, yield, última pick)
5. Ordenación multi-criterio (yield, winrate, picks, nombre, traceability)
6. Búsqueda por nombre de tipster con debounce
7. Estadísticas personales globales (8 stat-cards)
8. Integración de seguibilidad (traceability) por tipster
9. Click en TipsterCard navega a TipsterDetailPage
10. Testing manual completo del feature

**Nota**: El dashboard es la vista principal de la aplicación ("/"). Muestra todos los tipsters con sus estadísticas y permite filtrarlos/ordenarlos. **No incluye gráficos** (ver Fase 8).

---

### 1. Estructura del Feature Dashboard

```
src/features/dashboard/
├── components/
│   ├── TipsterGrid/
│   │   ├── TipsterGrid.tsx
│   │   ├── TipsterGrid.module.css
│   │   └── index.ts
│   ├── TipsterCard/
│   │   ├── TipsterCard.tsx
│   │   ├── TipsterCard.module.css
│   │   └── index.ts
│   ├── PersonalStatsGrid/
│   │   ├── PersonalStatsGrid.tsx
│   │   ├── PersonalStatsGrid.module.css
│   │   └── index.ts
│   ├── DashboardFilters/
│   │   ├── DashboardFilters.tsx
│   │   ├── DashboardFilters.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useDashboard.ts
│   ├── useDashboardFilters.ts
│   ├── useDashboardStats.ts
│   └── index.ts
├── pages/
│   ├── DashboardPage/
│   │   ├── DashboardPage.tsx
│   │   ├── DashboardPage.module.css
│   │   └── index.ts
│   └── index.ts
├── utils/
│   ├── dashboard-filters.utils.ts
│   └── index.ts
└── index.ts
```

---

### 2. Dashboard Filters Utils

**Archivo `src/features/dashboard/utils/dashboard-filters.utils.ts`:**
```typescript
import { TipsterEntity, PickEntity, FollowEntity } from '@shared/types/entities.types';
import { calculatePicksStats } from '@shared/utils/calculation.utils';
import { calculateTraceability } from '@features/follows/utils';

export interface DashboardFiltersState {
  sports: string[];
  channels: string[];
  yieldMin: number;
  lastPickDays: 'all' | '7' | '30' | '90';
  sortBy: 'yield' | 'winrate' | 'totalPicks' | 'name' | 'traceability';
  searchQuery: string;
}

export const initialDashboardFilters: DashboardFiltersState = {
  sports: [],
  channels: [],
  yieldMin: -1000,
  lastPickDays: 'all',
  sortBy: 'yield',
  searchQuery: '',
};

export interface TipsterWithStats extends TipsterEntity {
  stats: {
    totalPicks: number;
    resolvedPicks: number;
    wonPicks: number;
    lostPicks: number;
    winrate: number;
    yield: number;
    totalProfit: number;
    totalStaked: number;
    avgOdds: number;
    avgStake: number;
    traceability: number;
    lastPickDate: string | null;
  };
}

/**
 * Calcula las estadísticas de un tipster
 */
export const calculateTipsterStats = (
  tipster: TipsterEntity,
  picks: PickEntity[],
  allPicks: PickEntity[],
  follows: FollowEntity[]
): TipsterWithStats => {
  const tipsterPicks = picks.filter((p) => p.tipsterId === tipster.id);

  // Stats básicas
  const pickStats = calculatePicksStats(tipsterPicks);

  // Última pick
  const sortedPicks = [...tipsterPicks].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
  const lastPickDate = sortedPicks[0]?.date || null;

  // Seguibilidad
  const traceabilityData = calculateTraceability(tipster.id, allPicks, follows);

  return {
    ...tipster,
    stats: {
      totalPicks: pickStats.totalPicks,
      resolvedPicks: pickStats.resolvedPicks,
      wonPicks: pickStats.wonPicks,
      lostPicks: pickStats.lostPicks,
      winrate: pickStats.winrate,
      yield: pickStats.yield,
      totalProfit: pickStats.totalProfit,
      totalStaked: pickStats.totalStaked,
      avgOdds: pickStats.avgOdds,
      avgStake: pickStats.avgStake,
      traceability: traceabilityData.traceabilityPercentage,
      lastPickDate,
    },
  };
};

/**
 * Filtra tipsters según criterios
 */
export const filterTipsters = (
  tipsters: TipsterWithStats[],
  filters: DashboardFiltersState,
  allPicks: PickEntity[]
): TipsterWithStats[] => {
  return tipsters.filter((tipster) => {
    // Filtro por búsqueda
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      if (!tipster.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Filtro por deportes
    if (filters.sports.length > 0) {
      const tipsterPicks = allPicks.filter((p) => p.tipsterId === tipster.id);
      const tipsterSports = new Set(tipsterPicks.map((p) => p.sport));
      const hasSport = filters.sports.some((sport) => tipsterSports.has(sport));
      if (!hasSport) {
        return false;
      }
    }

    // Filtro por canales
    if (filters.channels.length > 0) {
      if (!filters.channels.includes(tipster.channel)) {
        return false;
      }
    }

    // Filtro por yield mínimo
    if (filters.yieldMin > -1000) {
      if (tipster.stats.yield < filters.yieldMin) {
        return false;
      }
    }

    // Filtro por última pick
    if (filters.lastPickDays !== 'all') {
      if (!tipster.stats.lastPickDate) {
        return false;
      }

      const daysDiff = parseInt(filters.lastPickDays);
      const lastPickTime = new Date(tipster.stats.lastPickDate).getTime();
      const now = Date.now();
      const diffDays = (now - lastPickTime) / (1000 * 60 * 60 * 24);

      if (diffDays > daysDiff) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Ordena tipsters según criterio
 */
export const sortTipsters = (
  tipsters: TipsterWithStats[],
  sortBy: DashboardFiltersState['sortBy']
): TipsterWithStats[] => {
  const sorted = [...tipsters];

  switch (sortBy) {
    case 'yield':
      return sorted.sort((a, b) => b.stats.yield - a.stats.yield);

    case 'winrate':
      return sorted.sort((a, b) => b.stats.winrate - a.stats.winrate);

    case 'totalPicks':
      return sorted.sort((a, b) => b.stats.totalPicks - a.stats.totalPicks);

    case 'traceability':
      return sorted.sort((a, b) => b.stats.traceability - a.stats.traceability);

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sorted;
  }
};
```

**Archivo `src/features/dashboard/utils/index.ts`:**
```typescript
export {
  calculateTipsterStats,
  filterTipsters,
  sortTipsters,
  initialDashboardFilters,
} from './dashboard-filters.utils';
export type { DashboardFiltersState, TipsterWithStats } from './dashboard-filters.utils';
```

---

### 3. Hooks Personalizados

#### 3.1 useDashboardFilters Hook
**Archivo `src/features/dashboard/hooks/useDashboardFilters.ts`:**
```typescript
import { useState, useMemo, useCallback } from 'react';
import { PickEntity } from '@shared/types/entities.types';
import {
  DashboardFiltersState,
  TipsterWithStats,
  initialDashboardFilters,
  filterTipsters,
  sortTipsters,
} from '../utils';

/**
 * Hook para gestionar filtros del dashboard
 */
export const useDashboardFilters = (
  tipsters: TipsterWithStats[],
  allPicks: PickEntity[]
) => {
  const [filters, setFilters] = useState<DashboardFiltersState>(initialDashboardFilters);

  // Actualizar filtro individual
  const updateFilter = useCallback(
    <K extends keyof DashboardFiltersState>(
      key: K,
      value: DashboardFiltersState[K]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Toggle sport filter
  const toggleSport = useCallback((sport: string) => {
    setFilters((prev) => {
      const sports = prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport];
      return { ...prev, sports };
    });
  }, []);

  // Toggle channel filter
  const toggleChannel = useCallback((channel: string) => {
    setFilters((prev) => {
      const channels = prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
  }, []);

  // Resetear todos los filtros
  const resetFilters = useCallback(() => {
    setFilters(initialDashboardFilters);
  }, []);

  // Aplicar filtros
  const filteredTipsters = useMemo(() => {
    const filtered = filterTipsters(tipsters, filters, allPicks);
    return sortTipsters(filtered, filters.sortBy);
  }, [tipsters, filters, allPicks]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sports.length > 0) count += filters.sports.length;
    if (filters.channels.length > 0) count += filters.channels.length;
    if (filters.yieldMin > -1000) count++;
    if (filters.lastPickDays !== 'all') count++;
    if (filters.searchQuery.trim()) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleSport,
    toggleChannel,
    resetFilters,
    filteredTipsters,
    activeFiltersCount,
  };
};
```

#### 3.2 useDashboardStats Hook
**Archivo `src/features/dashboard/hooks/useDashboardStats.ts`:**
```typescript
import { useMemo } from 'react';
import { PickEntity, FollowEntity } from '@shared/types/entities.types';
import { calculatePicksStats } from '@shared/utils/calculation.utils';

export interface PersonalStats {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgStake: number;
  avgOdds: number;
  totalFollows: number;
  resolvedFollows: number;
  followsWinrate: number;
  followsYield: number;
  followsProfit: number;
}

/**
 * Hook para calcular estadísticas personales globales
 */
export const useDashboardStats = (
  picks: PickEntity[],
  follows: FollowEntity[]
): PersonalStats => {
  return useMemo(() => {
    // Stats de todas las picks
    const pickStats = calculatePicksStats(picks);

    // Stats de follows
    const totalFollows = follows.length;
    const resolvedFollows = follows.filter((f) => f.userIsResolved).length;
    const wonFollows = follows.filter((f) => f.userResult === 'Ganada').length;

    const followsWinrate = resolvedFollows > 0 ? (wonFollows / resolvedFollows) * 100 : 0;

    const followsProfit = follows.reduce((sum, follow) => {
      if (!follow.userIsResolved) return sum;
      if (follow.userResult === 'Ganada') {
        return sum + (follow.userOdds - 1) * follow.userStake;
      }
      if (follow.userResult === 'Perdida') {
        return sum - follow.userStake;
      }
      return sum; // Void
    }, 0);

    const followsStaked = follows
      .filter((f) => f.userIsResolved && f.userResult !== 'Void')
      .reduce((sum, f) => sum + f.userStake, 0);

    const followsYield = followsStaked > 0 ? (followsProfit / followsStaked) * 100 : 0;

    return {
      totalPicks: pickStats.totalPicks,
      resolvedPicks: pickStats.resolvedPicks,
      wonPicks: pickStats.wonPicks,
      winrate: pickStats.winrate,
      yield: pickStats.yield,
      totalProfit: pickStats.totalProfit,
      totalStaked: pickStats.totalStaked,
      avgStake: pickStats.avgStake,
      avgOdds: pickStats.avgOdds,
      totalFollows,
      resolvedFollows,
      followsWinrate,
      followsYield,
      followsProfit,
    };
  }, [picks, follows]);
};
```

#### 3.3 useDashboard Hook
**Archivo `src/features/dashboard/hooks/useDashboard.ts`:**
```typescript
import { useMemo } from 'react';
import { useTipsters } from '@features/tipsters';
import { usePicks } from '@features/picks';
import { useFollows } from '@features/follows';
import { calculateTipsterStats } from '../utils';
import type { TipsterWithStats } from '../utils';

/**
 * Hook principal del dashboard
 * Combina tipsters, picks y follows con sus estadísticas
 */
export const useDashboard = () => {
  const { tipsters, loading: tipstersLoading, error: tipstersError } = useTipsters();
  const { picks, loading: picksLoading, error: picksError } = usePicks();
  const { follows, loading: followsLoading, error: followsError } = useFollows();

  // Calcular estadísticas de cada tipster
  const tipstersWithStats: TipsterWithStats[] = useMemo(() => {
    return tipsters.map((tipster) => {
      const tipsterPicks = picks.filter((p) => p.tipsterId === tipster.id);
      return calculateTipsterStats(tipster, tipsterPicks, picks, follows);
    });
  }, [tipsters, picks, follows]);

  const loading = tipstersLoading || picksLoading || followsLoading;
  const error = tipstersError || picksError || followsError;

  return {
    tipstersWithStats,
    picks,
    follows,
    loading,
    error,
  };
};
```

**Archivo `src/features/dashboard/hooks/index.ts`:**
```typescript
export { useDashboard } from './useDashboard';
export { useDashboardFilters } from './useDashboardFilters';
export { useDashboardStats } from './useDashboardStats';
export type { PersonalStats } from './useDashboardStats';
```

---

### 4. PersonalStatsGrid Component

**Archivo `src/features/dashboard/components/PersonalStatsGrid/PersonalStatsGrid.tsx`:**
```typescript
import { FC } from 'react';
import type { PersonalStats } from '../../hooks/useDashboardStats';

interface PersonalStatsGridProps {
  stats: PersonalStats;
}

/**
 * Grid de estadísticas personales (8 cards)
 */
export const PersonalStatsGrid: FC<PersonalStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 md:grid-cols-2 md:gap-3">
      {/* Total Picks */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Total Picks</div>
        <div className="text-3xl font-semibold text-text md:text-2xl">{stats.totalPicks}</div>
        <div className="text-xs text-info mt-1">Registradas</div>
      </div>

      {/* Picks Resueltas */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Resueltas</div>
        <div className="text-3xl font-semibold text-text md:text-2xl">{stats.resolvedPicks}</div>
        <div className="text-xs text-info mt-1">
          {stats.totalPicks > 0
            ? `${((stats.resolvedPicks / stats.totalPicks) * 100).toFixed(0)}%`
            : '0%'}
        </div>
      </div>

      {/* Winrate */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Winrate</div>
        <div className="text-3xl font-semibold text-text md:text-2xl">{stats.winrate.toFixed(1)}%</div>
        <div className="text-xs text-info mt-1">{stats.wonPicks} ganadas</div>
      </div>

      {/* Yield */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Yield</div>
        <div className={`text-3xl font-semibold md:text-2xl ${
            stats.yield >= 0 ? 'text-success' : 'text-error'
          }`}
        >
          {stats.yield >= 0 ? '+' : ''}
          {stats.yield.toFixed(2)}%
        </div>
        <div className="text-xs text-info mt-1">Rentabilidad</div>
      </div>

      {/* Total Profit */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Profit</div>
        <div className={`text-3xl font-semibold md:text-2xl ${
            stats.totalProfit >= 0 ? 'text-success' : 'text-error'
          }`}
        >
          {stats.totalProfit >= 0 ? '+' : ''}
          {stats.totalProfit.toFixed(2)}u
        </div>
        <div className="text-xs text-info mt-1">
          {stats.totalStaked.toFixed(2)}u apostadas
        </div>
      </div>

      {/* Avg Odds */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Cuota Media</div>
        <div className="text-3xl font-semibold text-text md:text-2xl">{stats.avgOdds.toFixed(2)}</div>
        <div className="text-xs text-info mt-1">Promedio</div>
      </div>

      {/* Total Follows */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Follows</div>
        <div className="text-3xl font-semibold text-text md:text-2xl">{stats.totalFollows}</div>
        <div className="text-xs text-info mt-1">{stats.resolvedFollows} resueltos</div>
      </div>

      {/* Follows Yield */}
      <div className="p-5 bg-surface rounded-lg border border-white/5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md md:p-4">
        <div className="text-xs font-medium text-info uppercase tracking-wide mb-2">Yield Follows</div>
        <div className={`text-3xl font-semibold md:text-2xl ${
            stats.followsYield >= 0 ? 'text-success' : 'text-error'
          }`}
        >
          {stats.followsYield >= 0 ? '+' : ''}
          {stats.followsYield.toFixed(2)}%
        </div>
        <div className="text-xs text-info mt-1">
          {stats.followsProfit >= 0 ? '+' : ''}
          {stats.followsProfit.toFixed(2)}u
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/dashboard/components/PersonalStatsGrid/index.ts`:**
```typescript
export { PersonalStatsGrid } from './PersonalStatsGrid';
```

---

### 5. TipsterCard Component

**Archivo `src/features/dashboard/components/TipsterCard/TipsterCard.tsx`:**
```typescript
import { FC } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@shared/utils/date.utils';
import type { TipsterWithStats } from '../../utils';

interface TipsterCardProps {
  tipster: TipsterWithStats;
  onClick: (tipsterId: string) => void;
}

/**
 * Card de tipster con estadísticas resumidas
 */
export const TipsterCard: FC<TipsterCardProps> = ({ tipster, onClick }) => {
  const handleClick = () => {
    onClick(tipster.id);
  };

  return (
    <div 
      className="p-5 bg-surface rounded-lg border border-white/5 cursor-pointer transition-all hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg md:p-4"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text mb-1 overflow-hidden text-ellipsis whitespace-nowrap md:text-base">
            {tipster.name}
          </h3>
          <p className="text-sm text-info">{tipster.channel}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg text-xs font-semibold text-primary whitespace-nowrap">
          <TrendingUp size={12} />
          {tipster.stats.traceability.toFixed(0)}%
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-2">
        {/* Total Picks */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-info uppercase tracking-wide">Picks</span>
          <span className="text-xl font-semibold text-text md:text-lg">{tipster.stats.totalPicks}</span>
        </div>

        {/* Winrate */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-info uppercase tracking-wide">Winrate</span>
          <span className="text-xl font-semibold text-text md:text-lg">
            {tipster.stats.winrate.toFixed(1)}%
          </span>
        </div>

        {/* Yield */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-info uppercase tracking-wide">Yield</span>
          <span className={`text-xl font-semibold md:text-lg ${
              tipster.stats.yield >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {tipster.stats.yield >= 0 ? '+' : ''}
            {tipster.stats.yield.toFixed(2)}%
          </span>
        </div>

        {/* Profit */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-info uppercase tracking-wide">Profit</span>
          <span className={`text-xl font-semibold md:text-lg ${
              tipster.stats.totalProfit >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {tipster.stats.totalProfit >= 0 ? '+' : ''}
            {tipster.stats.totalProfit.toFixed(1)}u
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-info">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>
            {tipster.stats.lastPickDate
              ? formatDate(tipster.stats.lastPickDate)
              : 'Sin picks'}
          </span>
        </div>
        <span>{tipster.stats.resolvedPicks} resueltas</span>
      </div>
    </div>
  );
};
```

**Archivo `src/features/dashboard/components/TipsterCard/index.ts`:**
```typescript
export { TipsterCard } from './TipsterCard';
```

---

### 6. TipsterGrid Component

**Archivo `src/features/dashboard/components/TipsterGrid/TipsterGrid.tsx`:**
```typescript
import { FC } from 'react';
import { EmptyState } from '@shared/components';
import { TipsterCard } from '../TipsterCard';
import type { TipsterWithStats } from '../../utils';

interface TipsterGridProps {
  tipsters: TipsterWithStats[];
  onTipsterClick: (tipsterId: string) => void;
}

/**
 * Grid de cards de tipsters
 */
export const TipsterGrid: FC<TipsterGridProps> = ({ tipsters, onTipsterClick }) => {
  if (tipsters.length === 0) {
    return (
      <div className="col-span-full py-8 text-center">
        <EmptyState message="No se encontraron tipsters con estos filtros" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 md:grid-cols-1 md:gap-4">
      {tipsters.map((tipster) => (
        <TipsterCard key={tipster.id} tipster={tipster} onClick={onTipsterClick} />
      ))}
    </div>
  );
};
```

**Archivo `src/features/dashboard/components/TipsterGrid/index.ts`:**
```typescript
export { TipsterGrid } from './TipsterGrid';
```

---

### 7. DashboardFilters Component

**Archivo `src/features/dashboard/components/DashboardFilters/DashboardFilters.module.css`:**
```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-20);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
}

.title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--space-8);
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.filtersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-12);
}

.searchBar {
  grid-column: 1 / -1;
}

.filterGroup {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.filterLabel {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.checkboxGroup {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-8);
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-base);
}

.checkboxItem {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast) var(--ease);
}

.checkboxItem:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkboxLabel {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  cursor: pointer;
  user-select: none;
}

@media (max-width: 768px) {
  .filtersGrid {
    grid-template-columns: 1fr;
  }
}
```

**Archivo `src/features/dashboard/components/DashboardFilters/DashboardFilters.tsx`:**
```typescript
import { FC } from 'react';
import { Button, Input, Select } from '@shared/components';
import { Search, X } from 'lucide-react';
import { ALL_SPORTS } from '@shared/constants/domain.constants';
import type { DashboardFiltersState } from '../../utils';
import styles from './DashboardFilters.module.css';

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  availableChannels: string[];
  onFilterChange: <K extends keyof DashboardFiltersState>(
    key: K,
    value: DashboardFiltersState[K]
  ) => void;
  onToggleSport: (sport: string) => void;
  onToggleChannel: (channel: string) => void;
  onReset: () => void;
  activeFiltersCount: number;
}

/**
 * Componente de filtros avanzados del dashboard
 */
export const DashboardFilters: FC<DashboardFiltersProps> = ({
  filters,
  availableChannels,
  onFilterChange,
  onToggleSport,
  onToggleChannel,
  onReset,
  activeFiltersCount,
}) => {
  const lastPickOptions = [
    { value: 'all', label: 'Cualquier fecha' },
    { value: '7', label: 'Últimos 7 días' },
    { value: '30', label: 'Últimos 30 días' },
    { value: '90', label: 'Últimos 90 días' },
  ];

  const sortOptions = [
    { value: 'yield', label: 'Yield (mayor a menor)' },
    { value: 'winrate', label: 'Winrate (mayor a menor)' },
    { value: 'totalPicks', label: 'Total Picks (mayor a menor)' },
    { value: 'traceability', label: 'Seguibilidad (mayor a menor)' },
    { value: 'name', label: 'Nombre (A-Z)' },
  ];

  return (
    <div className="flex flex-col gap-4 p-5 bg-surface rounded-lg border border-white/5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-text">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary text-white rounded-full text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X size={16} />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 md:grid-cols-1">
        {/* Búsqueda */}
        <div className="col-span-full">
          <Input
            type="text"
            placeholder="Buscar tipster por nombre..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        {/* Deportes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text">Deportes</label>
          <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto p-2 bg-white/[0.02] rounded-lg">
            {ALL_SPORTS.map((sport) => (
              <div key={sport} className="flex items-center gap-2 p-1 rounded-sm transition-colors hover:bg-white/5">
                <input
                  type="checkbox"
                  id={`sport-${sport}`}
                  checked={filters.sports.includes(sport)}
                  onChange={() => onToggleSport(sport)}
                  className="w-[18px] h-[18px] cursor-pointer accent-primary"
                />
                <label htmlFor={`sport-${sport}`} className="text-sm text-text cursor-pointer select-none">
                  {sport}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Canales */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text">Canales</label>
          <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto p-2 bg-white/[0.02] rounded-lg">
            {availableChannels.map((channel) => (
              <div key={channel} className="flex items-center gap-2 p-1 rounded-sm transition-colors hover:bg-white/5">
                <input
                  type="checkbox"
                  id={`channel-${channel}`}
                  checked={filters.channels.includes(channel)}
                  onChange={() => onToggleChannel(channel)}
                  className="w-[18px] h-[18px] cursor-pointer accent-primary"
                />
                <label htmlFor={`channel-${channel}`} className="text-sm text-text cursor-pointer select-none">
                  {channel}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Mínimo */}
        <div className="flex flex-col gap-2">
          <Input
            label="Yield Mínimo (%)"
            type="number"
            step="0.1"
            placeholder="Ej: 5.0"
            value={filters.yieldMin > -1000 ? filters.yieldMin : ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : -1000;
              onFilterChange('yieldMin', value);
            }}
          />
        </div>

        {/* Última Pick */}
        <div className="flex flex-col gap-2">
          <Select
            label="Última Pick"
            options={lastPickOptions}
            value={filters.lastPickDays}
            onChange={(e) =>
              onFilterChange('lastPickDays', e.target.value as DashboardFiltersState['lastPickDays'])
            }
          />
        </div>

        {/* Ordenar Por */}
        <div className="flex flex-col gap-2">
          <Select
            label="Ordenar Por"
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange('sortBy', e.target.value as DashboardFiltersState['sortBy'])
            }
          />
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/dashboard/components/DashboardFilters/index.ts`:**
```typescript
export { DashboardFilters } from './DashboardFilters';
```

**Archivo `src/features/dashboard/components/index.ts`:**
```typescript
export { TipsterGrid } from './TipsterGrid';
export { TipsterCard } from './TipsterCard';
export { PersonalStatsGrid } from './PersonalStatsGrid';
export { DashboardFilters } from './DashboardFilters';
```

---

### 8. DashboardPage

**Archivo `src/features/dashboard/pages/DashboardPage/DashboardPage.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, Loading } from '@shared/components';
import {
  useDashboard,
  useDashboardFilters,
  useDashboardStats,
} from '../../hooks';
import {
  PersonalStatsGrid,
  DashboardFilters,
  TipsterGrid,
} from '../../components';
import { useTipsterModal } from '@features/tipsters';
import { TipsterModal } from '@features/tipsters/components';

/**
 * Página principal del dashboard
 */
export const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { tipstersWithStats, picks, follows, loading, error } = useDashboard();

  const {
    filters,
    updateFilter,
    toggleSport,
    toggleChannel,
    resetFilters,
    filteredTipsters,
    activeFiltersCount,
  } = useDashboardFilters(tipstersWithStats, picks);

  const personalStats = useDashboardStats(picks, follows);

  const {
    isOpen,
    editingTipster,
    openCreateModal,
    closeModal,
    createTipster,
    loading: modalLoading,
    error: modalError,
  } = useTipsterModal();

  // Obtener canales únicos de los tipsters
  const availableChannels = useMemo(() => {
    const channels = new Set(tipstersWithStats.map((t) => t.channel));
    return Array.from(channels).sort();
  }, [tipstersWithStats]);

  const handleTipsterClick = (tipsterId: string) => {
    navigate(`/tipsters/${tipsterId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-4 md:gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-text md:text-2xl">Dashboard</h1>
          <p className="text-sm text-info">
            Vista general de tus tipsters y estadísticas
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Añadir Tipster
        </Button>
      </div>

      {/* Errores */}
      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-center">
          {error}
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col gap-6 md:gap-4">
        {/* Estadísticas Personales */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text">Estadísticas Generales</h2>
          <PersonalStatsGrid stats={personalStats} />
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4">
          <DashboardFilters
            filters={filters}
            availableChannels={availableChannels}
            onFilterChange={updateFilter}
            onToggleSport={toggleSport}
            onToggleChannel={toggleChannel}
            onReset={resetFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        {/* Grid de Tipsters */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text">
            Tipsters ({filteredTipsters.length})
          </h2>
          <TipsterGrid
            tipsters={filteredTipsters}
            onTipsterClick={handleTipsterClick}
          />
        </div>
      </div>

      {/* Modal */}
      <TipsterModal
        isOpen={isOpen}
        tipster={editingTipster}
        onClose={closeModal}
        onSubmit={createTipster}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};
```

**Archivo `src/features/dashboard/pages/DashboardPage/index.ts`:**
```typescript
export { DashboardPage } from './DashboardPage';
```

**Archivo `src/features/dashboard/pages/index.ts`:**
```typescript
export { DashboardPage } from './DashboardPage';
```

---

### 9. Feature Index

**Archivo `src/features/dashboard/index.ts`:**
```typescript
// Hooks
export { useDashboard, useDashboardFilters, useDashboardStats } from './hooks';
export type { PersonalStats } from './hooks';

// Components
export {
  TipsterGrid,
  TipsterCard,
  PersonalStatsGrid,
  DashboardFilters,
} from './components';

// Pages
export { DashboardPage } from './pages';

// Utils
export {
  calculateTipsterStats,
  filterTipsters,
  sortTipsters,
  initialDashboardFilters,
} from './utils';
export type { DashboardFiltersState, TipsterWithStats } from './utils';
```

---

### 10. Integración en App.tsx

**Modificar `src/App.tsx` para cambiar la redirección por defecto a dashboard:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import { PrivateRoute } from './features/auth';
import { LoginPage, SignupPage } from './features/auth/pages';
import { TipstersPage } from './features/tipsters/pages';
import { AllPicksPage } from './features/picks/pages';
import { MyPicksPage } from './features/follows/pages';
import { DashboardPage } from './features/dashboard/pages'; // NUEVO
import { PrivateLayout } from './layouts/PrivateLayout';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            {/* Dashboard - NUEVO */}
            <Route index element={<DashboardPage />} />
            
            {/* Tipsters */}
            <Route path="tipsters" element={<TipstersPage />} />
            
            {/* Picks */}
            <Route path="picks" element={<AllPicksPage />} />
            
            {/* My Picks */}
            <Route path="my-picks" element={<MyPicksPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
```

---

### 11. Actualizar Header con Navegación

**Modificar `src/shared/components/Layout/Header/Header.tsx`:**
```typescript
import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../../UI/Button';
import { useAuth } from '@features/auth';
import styles from './Header.module.css';

export const Header: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.logo} onClick={() => navigate('/')}>
            Tipster Tracker
          </h1>
        </div>

        <nav className={styles.nav}>
          {/* NUEVO: Dashboard */}
          <button
            className={`${styles.navLink} ${isActive('/') && location.pathname === '/' ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/')}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navLink} ${isActive('/tipsters') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/tipsters')}
          >
            Tipsters
          </button>
          <button
            className={`${styles.navLink} ${isActive('/picks') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/picks')}
          >
            Picks
          </button>
          <button
            className={`${styles.navLink} ${isActive('/my-picks') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/my-picks')}
          >
            Mis Picks
          </button>
        </nav>

        <div className={styles.actions}>
          {user && (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                Salir
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
```

**Actualizar estilos para logo clickeable en `src/shared/components/Layout/Header/Header.module.css`:**
```css
/* ... código existente ... */

.logo {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  cursor: pointer; /* NUEVO */
  transition: opacity var(--transition-fast) var(--ease); /* NUEVO */
}

.logo:hover { /* NUEVO */
  opacity: 0.8;
}

/* ... resto del código ... */
```

---

### 12. Checklist de Verificación

#### Setup y Estructura
- [ ] Crear carpeta `src/features/dashboard/` con subcarpetas
- [ ] Crear `utils/dashboard-filters.utils.ts`
- [ ] Verificar exports en `utils/index.ts`

#### Hooks
- [ ] Implementar `hooks/useDashboard.ts` combinando datos
- [ ] Implementar `hooks/useDashboardFilters.ts` con multi-criterio
- [ ] Implementar `hooks/useDashboardStats.ts` con stats globales
- [ ] Verificar exports en `hooks/index.ts`
- [ ] Verificar que hooks combinan tipsters, picks y follows

#### Componentes
- [ ] Implementar `PersonalStatsGrid` con 8 stat-cards
- [ ] Implementar `TipsterCard` con stats y seguibilidad
- [ ] Implementar `TipsterGrid` con EmptyState
- [ ] Implementar `DashboardFilters` con 6 filtros
- [ ] Verificar estilos CSS Modules en cada componente
- [ ] Verificar exports en `components/index.ts`

#### Página
- [ ] Implementar `DashboardPage` completa
- [ ] Integrar PersonalStatsGrid
- [ ] Integrar DashboardFilters
- [ ] Integrar TipsterGrid
- [ ] Integrar TipsterModal para añadir tipsters
- [ ] Click en card navega a detalle (próxima fase)
- [ ] Verificar export en `pages/index.ts`

#### Integración General
- [ ] Cambiar ruta por defecto a Dashboard en `App.tsx`
- [ ] Actualizar `Header.tsx` con link "Dashboard"
- [ ] Logo clickeable navega a dashboard
- [ ] Verificar navegación entre páginas
- [ ] Verificar que Header muestra ruta activa

#### Filtros Avanzados
- [ ] Filtro por deportes (multi-select)
- [ ] Filtro por canales (multi-select)
- [ ] Filtro por yield mínimo (numérico)
- [ ] Filtro por última pick (7, 30, 90 días, all)
- [ ] Ordenación (yield, winrate, picks, traceability, name)
- [ ] Búsqueda por nombre
- [ ] Contador de filtros activos
- [ ] Botón "Limpiar" resetea todo

#### Cálculos y Estadísticas
- [ ] `calculateTipsterStats()` calcula todo correctamente
- [ ] Seguibilidad se calcula con `calculateTraceability()`
- [ ] Stats personales suman todas las picks
- [ ] Stats de follows calculados correctamente
- [ ] Yield, winrate, profit correctos

#### Testing Manual - Estadísticas Personales
- [ ] Verificar "Total Picks" correcto
- [ ] Verificar "Resueltas" correcto
- [ ] Verificar "Winrate" correcto
- [ ] Verificar "Yield" correcto con color
- [ ] Verificar "Profit" correcto con color
- [ ] Verificar "Cuota Media" correcta
- [ ] Verificar "Total Follows" correcto
- [ ] Verificar "Yield Follows" correcto

#### Testing Manual - Filtros
- [ ] Seleccionar deporte → solo tipsters con ese deporte
- [ ] Seleccionar múltiples deportes → tipsters con cualquiera
- [ ] Seleccionar canal → solo tipsters de ese canal
- [ ] Yield mínimo 5% → solo tipsters con yield >= 5%
- [ ] Última pick "7 días" → solo tipsters con pick última semana
- [ ] Ordenar por yield → de mayor a menor
- [ ] Ordenar por winrate → de mayor a menor
- [ ] Ordenar por seguibilidad → de mayor a menor
- [ ] Ordenar por nombre → alfabético
- [ ] Búsqueda por nombre → filtra en tiempo real
- [ ] Combinar múltiples filtros → AND lógico
- [ ] Click "Limpiar" → resetea todo

#### Testing Manual - TipsterCard
- [ ] Muestra nombre y canal
- [ ] Muestra % de seguibilidad
- [ ] Muestra total picks
- [ ] Muestra winrate
- [ ] Muestra yield con color
- [ ] Muestra profit con color
- [ ] Muestra última pick formateada
- [ ] Muestra picks resueltas
- [ ] Hover effect funcional
- [ ] Click navega a detalle (próxima fase)

#### Real-time
- [ ] Crear nuevo tipster → aparece en dashboard
- [ ] Añadir pick a tipster → stats se actualizan
- [ ] Resolver pick → winrate y yield cambian
- [ ] Seguir pick → stats de follows actualizan
- [ ] Todo sin refresh

#### UI/UX
- [ ] Loading overlay durante carga inicial
- [ ] Mensajes de error informativos
- [ ] EmptyState cuando no hay tipsters
- [ ] Badge con contador de filtros activos
- [ ] Grid responsive en mobile
- [ ] Filtros colapsables en mobile (considerar)
- [ ] Navegación funcional en Header

---

### 13. Comandos de Verificación

```bash
# Verificar estructura de archivos
Get-ChildItem -Recurse -Path src/features/dashboard | Select-Object FullName

# Build del proyecto
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Preview build
npm run preview

# Ejecutar emuladores Firebase
firebase emulators:start
```

---

### 14. Testing Manual - Checklist Detallado

#### Escenario 1: Vista Inicial del Dashboard
1. Login en la aplicación
2. Verificar redirección automática a "/"
3. Verificar que Header muestra "Dashboard" activo
4. Verificar grid de 8 stat-cards personales
5. Verificar que stats muestran datos correctos
6. Verificar grid de tipster cards
7. Verificar que cada card muestra:
   - Nombre, canal
   - % Seguibilidad
   - Total picks, winrate, yield, profit
   - Última pick formateada
   - Picks resueltas

#### Escenario 2: Filtrado por Deporte
1. En filtros, seleccionar "Fútbol"
2. Verificar que solo aparecen tipsters con picks de fútbol
3. Seleccionar también "Baloncesto"
4. Verificar que aparecen tipsters con fútbol OR baloncesto
5. Desseleccionar todo
6. Verificar que reaparecen todos

#### Escenario 3: Filtrado por Yield
1. Ingresar yield mínimo: 10
2. Verificar que solo aparecen tipsters con yield >= 10%
3. Cambiar a -5
4. Verificar que aparecen también los negativos >= -5%
5. Limpiar campo
6. Verificar que reaparecen todos

#### Escenario 4: Ordenación
1. Ordenar por "Yield"
2. Verificar orden descendente (mayor yield primero)
3. Ordenar por "Winrate"
4. Verificar cambio de orden
5. Ordenar por "Total Picks"
6. Verificar tipsters con más picks primero
7. Ordenar por "Seguibilidad"
8. Verificar orden por % traceability
9. Ordenar por "Nombre"
10. Verificar orden alfabético A-Z

#### Escenario 5: Búsqueda
1. Escribir nombre parcial en búsqueda
2. Verificar filtrado en tiempo real
3. Probar búsqueda case-insensitive
4. Limpiar búsqueda
5. Verificar que reaparecen todos

#### Escenario 6: Combinación de Filtros
1. Seleccionar deporte "Fútbol"
2. Yield mínimo 5%
3. Última pick "30 días"
4. Ordenar por "Yield"
5. Verificar que se aplican todos simultáneamente
6. Verificar contador de filtros activos = 3
7. Click "Limpiar"
8. Verificar que todo resetea

#### Escenario 7: Añadir Tipster desde Dashboard
1. Click en "Añadir Tipster"
2. Completar formulario
3. Guardar
4. Verificar aparición en grid
5. Verificar stats iniciales (0 picks)

#### Escenario 8: Navegación
1. Click en card de tipster
2. Verificar navegación a `/tipsters/{id}` (fase 8)
3. Click en logo "Tipster Tracker"
4. Verificar regreso a dashboard
5. Navegar a "Picks"
6. Click en "Dashboard" en navbar
7. Verificar regreso

---

### 15. Fórmulas y Cálculos Importantes

**Seguibilidad (Traceability):**
```
Traceability % = (Follows Count / Total Picks Desde Primer Follow) * 100
```

**Estadísticas Personales:**
```typescript
// Picks
Total Picks: picks.length
Resueltas: picks.filter(p => p.isResolved).length
Winrate: (wonPicks / resolvedPicks) * 100
Yield: (totalProfit / totalStaked) * 100

// Follows
Total Follows: follows.length
Resueltos: follows.filter(f => f.userIsResolved).length
Follows Winrate: (wonFollows / resolvedFollows) * 100
Follows Yield: (followsProfit / followsStaked) * 100
```

**Filtrado Multi-Criterio:**
```typescript
// Todos los filtros se aplican con AND lógico
// Ejemplo: deportes=Fútbol AND canal=Telegram AND yield>=5

// Deportes: OR dentro del array
sports.includes('Fútbol') OR sports.includes('Baloncesto')

// Múltiples filtros: AND
(sport match) AND (channel match) AND (yield >= min) AND (lastPick within days)
```

---

### 16. Mejoras Futuras (Post Fase 7)

**Funcionalidades adicionales:**
- Gráficos de rendimiento temporal en dashboard
- Comparación side-by-side de 2-3 tipsters
- Filtro por bookmakers
- Filtro por tipo de pick (Pre/Live/Combinado)
- Export dashboard a PDF
- Vista compacta vs expandida de cards
- Guardar filtros favoritos
- Alertas cuando tipster supera yield objetivo

**Optimizaciones:**
- Paginación del grid (50+ tipsters)
- Virtualización para grandes cantidades
- Cache de cálculos estadísticos
- Debounce en búsqueda (300ms)
- Memoización agresiva de filtros

---

### Resumen de la Fase 7 ✅ **COMPLETADA - 100%**

**Fecha de finalización**: 18 de noviembre de 2025

**Completado:**
✅ Estructura completa de features/dashboard/ con folders y barrel exports
✅ dashboard-filters.utils.ts: tipos, funciones de filtrado y ordenación
✅ useDashboardStats: cálculo de 8 estadísticas personales globales
✅ useDashboardFilters: gestión de filtros y tipsters filtrados/ordenados
✅ PersonalStatsPanel: 8 stat-cards responsivas con colores condicionales
✅ DashboardFilters: multi-select dropdowns colapsables con "Seleccionar Todos"
✅ TipsterCard: card clickable con navegación y 4 stats clave
✅ DashboardPage: composición completa con loading/empty states
✅ Integración en routes: reemplazo de DashboardPlaceholder
✅ Dropdowns mejorados: cierre al click fuera, contador de seleccionados, animación chevron
✅ Testing exhaustivo: 13 puntos de verificación manual
✅ 3 commits realizados
✅ Cero errores de compilación

**Duración real**: ~6 horas de trabajo (18/11/2025)

**Archivos creados**: 17 archivos
**Líneas de código**: ~900 líneas

**Archivos principales**:
- `src/features/dashboard/` - Feature completo con components, hooks, pages, utils
- `src/core/routing/routes.tsx` - Integración de DashboardPage
- Estructura modular con barrel exports en cada nivel

**Mejoras implementadas durante testing**:
1. **Dropdowns colapsables**: Reemplazo de listas siempre visibles por dropdowns desplegables
2. **Opción "Seleccionar Todos"**: Checkbox especial al inicio de cada dropdown
3. **Contador de selección**: Muestra "X seleccionado(s)" en botón del dropdown
4. **Click fuera cierra**: useEffect + refs para detectar clicks externos
5. **Animación chevron**: Rotación 180° cuando dropdown está abierto
6. **Estilo diferenciado**: Border y background especial para opción "Todos"

**Componentes clave**:
- **PersonalStatsPanel**: 8 cards (Picks Seguidos, Winrate, Yield, Cuota Media, Stake Medio, Casa Favorita, Mejor Casa, Beneficio Total)
- **DashboardFilters**: 6 filtros (Sports, Channels, Yield Min, Last Pick Days, Sort By, Search)
- **TipsterCard**: 4 stats (Total Picks, Winrate, Yield, Seguibilidad) + navegación
- **DashboardPage**: Layout completo con estados de carga y vacío

**Funcionalidades verificadas**:
✅ Cálculo correcto de estadísticas desde follows
✅ Bookmaker analysis (favorito por uso, mejor por profit)
✅ Filtrado multi-criterio con lógica AND
✅ Ordenación por 6 criterios diferentes
✅ Búsqueda con debounce (nombre de tipster)
✅ Badge de filtros activos
✅ Botón reset de filtros
✅ Navegación a detalle de tipster
✅ Grid responsive (1/2/3/4 columnas)
✅ Empty states contextuales
✅ Real-time sync con Firestore

**Importante**: Esta fase completa el dashboard como vista principal ("/"). Integra datos de tipsters, picks y follows para mostrar estadísticas globales y permitir filtrado/búsqueda avanzada. La seguibilidad (traceability) se calcula por tipster usando la función de Phase 6. Los charts se implementarán en Phase 8 dedicada.

---

## Fase 8: Feature - Tipster Detail (Vista Detallada) 📊

**Duración estimada**: 60-80 horas

### Objetivos de la Fase

En esta fase crearemos la vista de detalle completo de un tipster, accesible desde el dashboard al hacer click en una TipsterCard. Esta vista incluirá:

1. **Tabs de navegación**: Stats generales, My Stats (comparación), Historial de Picks, Historial de Follows
2. **Estadísticas detalladas**: 10+ métricas calculadas en tiempo real
3. **Gráficos Chart.js**: 4 gráficos interactivos (distribución de odds, stakes, deportes, tipos de pick)
4. **Tablas de historial**: Picks del tipster y follows del usuario
5. **Acciones**: Editar tipster, resetear tipster, añadir pick rápida
6. **Navegación**: Breadcrumbs, botón volver, navegación entre tipsters

**Estructura de archivos a crear:**
```
src/features/tipster-detail/
├── components/
│   ├── TipsterDetailHeader/
│   │   ├── TipsterDetailHeader.tsx
│   │   ├── TipsterDetailHeader.module.css
│   │   └── index.ts
│   ├── TipsterDetailTabs/
│   │   ├── TipsterDetailTabs.tsx
│   │   ├── TipsterDetailTabs.module.css
│   │   └── index.ts
│   ├── StatsTab/
│   │   ├── StatsTab.tsx
│   │   ├── StatsTab.module.css
│   │   └── index.ts
│   ├── MyStatsTab/
│   │   ├── MyStatsTab.tsx
│   │   ├── MyStatsTab.module.css
│   │   └── index.ts
│   ├── PicksHistoryTab/
│   │   ├── PicksHistoryTab.tsx
│   │   ├── PicksHistoryTab.module.css
│   │   └── index.ts
│   ├── FollowsHistoryTab/
│   │   ├── FollowsHistoryTab.tsx
│   │   ├── FollowsHistoryTab.module.css
│   │   └── index.ts
│   ├── TipsterCharts/
│   │   ├── TipsterCharts.tsx
│   │   ├── TipsterCharts.module.css
│   │   └── index.ts
│   ├── TipsterStatsGrid/
│   │   ├── TipsterStatsGrid.tsx
│   │   ├── TipsterStatsGrid.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useTipsterDetail.ts
│   ├── useTipsterCharts.ts
│   └── index.ts
├── pages/
│   ├── TipsterDetailPage/
│   │   ├── TipsterDetailPage.tsx
│   │   ├── TipsterDetailPage.module.css
│   │   └── index.ts
│   └── index.ts
├── utils/
│   ├── tipster-charts.utils.ts
│   └── index.ts
├── types/
│   ├── tipster-detail.types.ts
│   └── index.ts
└── index.ts
```

---

### 1. Types para Tipster Detail

**Archivo `src/features/tipster-detail/types/tipster-detail.types.ts`:**
```typescript
export type TipsterDetailTab = 'stats' | 'myStats' | 'picksHistory' | 'followsHistory';

export interface TipsterDetailStats {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  lostPicks: number;
  voidPicks: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
  traceability: number; // % de seguibilidad
}

export interface TipsterMyStats {
  tipsterStats: {
    resolvedPicks: number;
    wonPicks: number;
    winrate: number;
    yield: number;
    totalProfit: number;
  };
  userStats: {
    resolvedFollows: number;
    wonFollows: number;
    winrate: number;
    yield: number;
    totalProfit: number;
  };
  difference: {
    winrate: number; // diferencia en puntos porcentuales
    yield: number;
    profit: number;
  };
}

export interface ChartDataDistribution {
  labels: string[];
  values: number[];
}

export interface TipsterChartsData {
  oddsDistribution: ChartDataDistribution;
  stakeDistribution: ChartDataDistribution;
  sportDistribution: ChartDataDistribution;
  pickTypeDistribution: ChartDataDistribution;
}
```

**Archivo `src/features/tipster-detail/types/index.ts`:**
```typescript
export type { 
  TipsterDetailTab, 
  TipsterDetailStats, 
  TipsterMyStats,
  ChartDataDistribution,
  TipsterChartsData 
} from './tipster-detail.types';
```

---

### 2. Utils para Charts

**Archivo `src/features/tipster-detail/utils/tipster-charts.utils.ts`:**
```typescript
import type { PickEntity } from '@features/picks';
import type { TipsterChartsData, ChartDataDistribution } from '../types';

/**
 * Agrupa picks por rangos de cuotas
 */
function groupByOddsRange(picks: PickEntity[]): ChartDataDistribution {
  const ranges = {
    '1.00-1.49': 0,
    '1.50-1.99': 0,
    '2.00-2.49': 0,
    '2.50-2.99': 0,
    '3.00-3.99': 0,
    '4.00+': 0,
  };

  picks.forEach((pick) => {
    const odds = pick.odds;
    if (odds < 1.5) ranges['1.00-1.49']++;
    else if (odds < 2.0) ranges['1.50-1.99']++;
    else if (odds < 2.5) ranges['2.00-2.49']++;
    else if (odds < 3.0) ranges['2.50-2.99']++;
    else if (odds < 4.0) ranges['3.00-3.99']++;
    else ranges['4.00+']++;
  });

  return {
    labels: Object.keys(ranges),
    values: Object.values(ranges),
  };
}

/**
 * Agrupa picks por stakes
 */
function groupByStake(picks: PickEntity[]): ChartDataDistribution {
  const stakes: Record<number, number> = {};

  picks.forEach((pick) => {
    stakes[pick.stake] = (stakes[pick.stake] || 0) + 1;
  });

  // Ordenar por stake
  const sortedStakes = Object.entries(stakes).sort(([a], [b]) => Number(a) - Number(b));

  return {
    labels: sortedStakes.map(([stake]) => `${stake}u`),
    values: sortedStakes.map(([, count]) => count),
  };
}

/**
 * Agrupa picks por deporte
 */
function groupBySport(picks: PickEntity[]): ChartDataDistribution {
  const sports: Record<string, number> = {};

  picks.forEach((pick) => {
    sports[pick.sport] = (sports[pick.sport] || 0) + 1;
  });

  // Ordenar por cantidad descendente
  const sortedSports = Object.entries(sports).sort(([, a], [, b]) => b - a);

  return {
    labels: sortedSports.map(([sport]) => sport),
    values: sortedSports.map(([, count]) => count),
  };
}

/**
 * Agrupa picks por tipo
 */
function groupByPickType(picks: PickEntity[]): ChartDataDistribution {
  const types: Record<string, number> = {};

  picks.forEach((pick) => {
    types[pick.pickType] = (types[pick.pickType] || 0) + 1;
  });

  return {
    labels: Object.keys(types),
    values: Object.values(types),
  };
}

/**
 * Genera todos los datos para los 4 charts
 */
export function generateChartsData(picks: PickEntity[]): TipsterChartsData {
  return {
    oddsDistribution: groupByOddsRange(picks),
    stakeDistribution: groupByStake(picks),
    sportDistribution: groupBySport(picks),
    pickTypeDistribution: groupByPickType(picks),
  };
}

/**
 * Colores para charts (matching con constants.js de vanilla)
 */
export const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];

/**
 * Configuración base para Chart.js
 */
export const BASE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        color: '#E0E0E0',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#E0E0E0',
      bodyColor: '#E0E0E0',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },
  },
};
```

**Archivo `src/features/tipster-detail/utils/index.ts`:**
```typescript
export { generateChartsData, CHART_COLORS, BASE_CHART_OPTIONS } from './tipster-charts.utils';
```

---

### 3. Hook useTipsterDetail

**Archivo `src/features/tipster-detail/hooks/useTipsterDetail.ts`:**
```typescript
import { useState, useEffect, useMemo } from 'react';
import { useTipsters } from '@features/tipsters';
import { usePicks } from '@features/picks';
import { useFollows } from '@features/follows';
import { calculateStats } from '@shared/utils/calculations.utils';
import { calculateTraceability } from '@features/follows/utils';
import type { TipsterDetailStats, TipsterMyStats } from '../types';

interface UseTipsterDetailReturn {
  tipster: ReturnType<typeof useTipsters>['tipsters'][0] | null;
  picks: ReturnType<typeof usePicks>['picks'];
  follows: ReturnType<typeof useFollows>['follows'];
  stats: TipsterDetailStats | null;
  myStats: TipsterMyStats | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para obtener todos los datos del detalle de un tipster
 */
export function useTipsterDetail(tipsterId: string): UseTipsterDetailReturn {
  const { tipsters, loading: tipstersLoading } = useTipsters();
  const { picks, loading: picksLoading } = usePicks();
  const { follows, loading: followsLoading } = useFollows();

  const [error, setError] = useState<string | null>(null);

  // Obtener tipster
  const tipster = useMemo(
    () => tipsters.find((t) => t.id === tipsterId) || null,
    [tipsters, tipsterId]
  );

  // Filtrar picks del tipster
  const tipsterPicks = useMemo(
    () => picks.filter((p) => p.tipsterId === tipsterId),
    [picks, tipsterId]
  );

  // Filtrar follows del tipster
  const tipsterFollows = useMemo(
    () => follows.filter((f) => f.tipsterId === tipsterId),
    [follows, tipsterId]
  );

  // Calcular estadísticas generales
  const stats = useMemo<TipsterDetailStats | null>(() => {
    if (!tipster || tipsterPicks.length === 0) return null;

    const baseStats = calculateStats(tipsterPicks);
    const traceability = calculateTraceability(tipsterId, tipsterPicks, follows);

    return {
      totalPicks: baseStats.totalPicks,
      resolvedPicks: baseStats.resolvedPicks,
      wonPicks: baseStats.wonPicks,
      lostPicks: baseStats.lostPicks,
      voidPicks: baseStats.voidPicks,
      winrate: baseStats.winrate,
      yield: baseStats.yield,
      totalProfit: baseStats.totalProfit,
      totalStaked: baseStats.totalStaked,
      avgOdds: baseStats.avgOdds,
      avgStake: baseStats.avgStake,
      traceability,
    };
  }, [tipster, tipsterPicks, tipsterId, follows]);

  // Calcular My Stats (comparación)
  const myStats = useMemo<TipsterMyStats | null>(() => {
    if (!tipster || tipsterFollows.length === 0) return null;

    // Stats del tipster (solo picks seguidas)
    const followedPickIds = tipsterFollows.map((f) => f.pickId);
    const followedPicks = tipsterPicks.filter((p) => followedPickIds.includes(p.id));
    const tipsterStats = calculateStats(followedPicks);

    // Stats del usuario (sus follows)
    const resolvedFollows = tipsterFollows.filter((f) => f.userIsResolved);
    const wonFollows = resolvedFollows.filter((f) => f.userResult === 'Ganada');

    const userTotalProfit = resolvedFollows.reduce((sum, follow) => {
      if (follow.userResult === 'Ganada') {
        return sum + (follow.userOdds - 1) * follow.userStake;
      } else if (follow.userResult === 'Perdida') {
        return sum - follow.userStake;
      }
      return sum; // Void
    }, 0);

    const userTotalStaked = resolvedFollows.reduce(
      (sum, follow) => sum + follow.userStake,
      0
    );

    const userWinrate =
      resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length) * 100 : 0;
    const userYield =
      userTotalStaked > 0 ? (userTotalProfit / userTotalStaked) * 100 : 0;

    return {
      tipsterStats: {
        resolvedPicks: tipsterStats.resolvedPicks,
        wonPicks: tipsterStats.wonPicks,
        winrate: tipsterStats.winrate,
        yield: tipsterStats.yield,
        totalProfit: tipsterStats.totalProfit,
      },
      userStats: {
        resolvedFollows: resolvedFollows.length,
        wonFollows: wonFollows.length,
        winrate: userWinrate,
        yield: userYield,
        totalProfit: userTotalProfit,
      },
      difference: {
        winrate: userWinrate - tipsterStats.winrate,
        yield: userYield - tipsterStats.yield,
        profit: userTotalProfit - tipsterStats.totalProfit,
      },
    };
  }, [tipster, tipsterPicks, tipsterFollows]);

  // Manejo de errores
  useEffect(() => {
    if (!tipstersLoading && !tipster) {
      setError('Tipster no encontrado');
    } else {
      setError(null);
    }
  }, [tipster, tipstersLoading]);

  const loading = tipstersLoading || picksLoading || followsLoading;

  return {
    tipster,
    picks: tipsterPicks,
    follows: tipsterFollows,
    stats,
    myStats,
    loading,
    error,
  };
}
```

---

### 4. Hook useTipsterCharts

**Archivo `src/features/tipster-detail/hooks/useTipsterCharts.ts`:**
```typescript
import { useEffect, useRef, useState } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TipsterChartsData } from '../types';
import { CHART_COLORS, BASE_CHART_OPTIONS } from '../utils';

// Registrar componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface UseTipsterChartsReturn {
  oddsChartRef: React.RefObject<HTMLCanvasElement>;
  stakeChartRef: React.RefObject<HTMLCanvasElement>;
  sportChartRef: React.RefObject<HTMLCanvasElement>;
  pickTypeChartRef: React.RefObject<HTMLCanvasElement>;
}

/**
 * Hook para gestionar los 4 charts de Chart.js
 */
export function useTipsterCharts(chartsData: TipsterChartsData): UseTipsterChartsReturn {
  const oddsChartRef = useRef<HTMLCanvasElement>(null);
  const stakeChartRef = useRef<HTMLCanvasElement>(null);
  const sportChartRef = useRef<HTMLCanvasElement>(null);
  const pickTypeChartRef = useRef<HTMLCanvasElement>(null);

  const [chartsInstances] = useState<{
    odds: Chart | null;
    stake: Chart | null;
    sport: Chart | null;
    pickType: Chart | null;
  }>({
    odds: null,
    stake: null,
    sport: null,
    pickType: null,
  });

  useEffect(() => {
    // Destruir charts existentes
    if (chartsInstances.odds) chartsInstances.odds.destroy();
    if (chartsInstances.stake) chartsInstances.stake.destroy();
    if (chartsInstances.sport) chartsInstances.sport.destroy();
    if (chartsInstances.pickType) chartsInstances.pickType.destroy();

    // Crear chart de odds (bar)
    if (oddsChartRef.current) {
      const ctx = oddsChartRef.current.getContext('2d');
      if (ctx) {
        chartsInstances.odds = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartsData.oddsDistribution.labels,
            datasets: [
              {
                label: 'Picks por Rango de Cuota',
                data: chartsData.oddsDistribution.values,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 1,
              },
            ],
          },
          options: {
            ...BASE_CHART_OPTIONS,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#E0E0E0',
                  stepSize: 1,
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                },
              },
              x: {
                ticks: {
                  color: '#E0E0E0',
                },
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // Crear chart de stakes (bar)
    if (stakeChartRef.current) {
      const ctx = stakeChartRef.current.getContext('2d');
      if (ctx) {
        chartsInstances.stake = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartsData.stakeDistribution.labels,
            datasets: [
              {
                label: 'Picks por Stake',
                data: chartsData.stakeDistribution.values,
                backgroundColor: CHART_COLORS[1],
                borderColor: CHART_COLORS[1],
                borderWidth: 1,
              },
            ],
          },
          options: {
            ...BASE_CHART_OPTIONS,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#E0E0E0',
                  stepSize: 1,
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                },
              },
              x: {
                ticks: {
                  color: '#E0E0E0',
                },
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // Crear chart de deportes (doughnut)
    if (sportChartRef.current) {
      const ctx = sportChartRef.current.getContext('2d');
      if (ctx) {
        chartsInstances.sport = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: chartsData.sportDistribution.labels,
            datasets: [
              {
                label: 'Picks por Deporte',
                data: chartsData.sportDistribution.values,
                backgroundColor: CHART_COLORS.slice(0, chartsData.sportDistribution.labels.length),
                borderWidth: 2,
                borderColor: '#1E293B',
              },
            ],
          },
          options: BASE_CHART_OPTIONS,
        });
      }
    }

    // Crear chart de tipos de pick (doughnut)
    if (pickTypeChartRef.current) {
      const ctx = pickTypeChartRef.current.getContext('2d');
      if (ctx) {
        chartsInstances.pickType = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: chartsData.pickTypeDistribution.labels,
            datasets: [
              {
                label: 'Picks por Tipo',
                data: chartsData.pickTypeDistribution.values,
                backgroundColor: CHART_COLORS.slice(0, chartsData.pickTypeDistribution.labels.length),
                borderWidth: 2,
                borderColor: '#1E293B',
              },
            ],
          },
          options: BASE_CHART_OPTIONS,
        });
      }
    }

    // Cleanup
    return () => {
      if (chartsInstances.odds) chartsInstances.odds.destroy();
      if (chartsInstances.stake) chartsInstances.stake.destroy();
      if (chartsInstances.sport) chartsInstances.sport.destroy();
      if (chartsInstances.pickType) chartsInstances.pickType.destroy();
    };
  }, [chartsData]);

  return {
    oddsChartRef,
    stakeChartRef,
    sportChartRef,
    pickTypeChartRef,
  };
}
```

**Archivo `src/features/tipster-detail/hooks/index.ts`:**
```typescript
export { useTipsterDetail } from './useTipsterDetail';
export { useTipsterCharts } from './useTipsterCharts';
```

---

### 5. TipsterDetailHeader Component

**Archivo `src/features/tipster-detail/components/TipsterDetailHeader/TipsterDetailHeader.tsx`:**
```typescript
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@shared/components';
import type { TipsterEntity } from '@features/tipsters';

interface TipsterDetailHeaderProps {
  tipster: TipsterEntity;
  onEdit: () => void;
  onReset: () => void;
  onAddPick: () => void;
}

/**
 * Header con nombre, canal y acciones del tipster
 */
export const TipsterDetailHeader: FC<TipsterDetailHeaderProps> = ({
  tipster,
  onEdit,
  onReset,
  onAddPick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4 p-5 bg-surface rounded-lg border border-white/5 md:flex-col md:items-start md:gap-3">
      <div className="flex items-center gap-4 md:w-full">
        <button 
          className="flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/10 hover:-translate-x-0.5"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} color="#E0E0E0" />
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text m-0 md:text-xl">{tipster.name}</h1>
          <p className="text-sm text-info">{tipster.channel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:w-full md:flex-wrap">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit size={16} />
          Editar
        </Button>
        <Button variant="outline" size="sm" onClick={onAddPick}>
          <Plus size={16} />
          Añadir Pick
        </Button>
        <Button variant="danger" size="sm" onClick={onReset}>
          <RotateCcw size={16} />
          Resetear
        </Button>
      </div>
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/TipsterDetailHeader/index.ts`:**
```typescript
export { TipsterDetailHeader } from './TipsterDetailHeader';
```

---

### 6. TipsterDetailTabs Component

**Archivo `src/features/tipster-detail/components/TipsterDetailTabs/TipsterDetailTabs.tsx`:**
```typescript
import { FC } from 'react';
import { cn } from '@shared/utils';
import type { TipsterDetailTab } from '../../types';

interface TipsterDetailTabsProps {
  activeTab: TipsterDetailTab;
  onTabChange: (tab: TipsterDetailTab) => void;
}

const TABS: { id: TipsterDetailTab; label: string }[] = [
  { id: 'stats', label: 'Estadísticas' },
  { id: 'myStats', label: 'Mis Estadísticas' },
  { id: 'picksHistory', label: 'Historial de Picks' },
  { id: 'followsHistory', label: 'Mis Follows' },
];

/**
 * Tabs de navegación del detalle
 */
export const TipsterDetailTabs: FC<TipsterDetailTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 p-1 bg-surface rounded-lg border border-white/5 overflow-x-auto md:justify-start">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "flex-1 min-w-max px-5 py-3 text-sm font-medium rounded-lg border-none cursor-pointer transition-all whitespace-nowrap",
            "hover:bg-white/5 hover:text-text",
            "md:flex-none md:text-xs md:px-4 md:py-2",
            activeTab === tab.id
              ? "text-white bg-primary hover:bg-primary"
              : "text-info bg-transparent"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/TipsterDetailTabs/index.ts`:**
```typescript
export { TipsterDetailTabs } from './TipsterDetailTabs';
```

---

### 7. TipsterStatsGrid Component

**Archivo `src/features/tipster-detail/components/TipsterStatsGrid/TipsterStatsGrid.tsx`:**
```typescript
import { FC } from 'react';
import { cn } from '@shared/utils';
import type { TipsterDetailStats } from '../../types';
import { formatNumber } from '@shared/utils/format.utils';

interface TipsterStatsGridProps {
  stats: TipsterDetailStats;
}

/**
 * Grid de estadísticas del tipster (10 cards)
 */
export const TipsterStatsGrid: FC<TipsterStatsGridProps> = ({ stats }) => {
  const statsData = [
    { label: 'Total Picks', value: stats.totalPicks.toString() },
    { label: 'Resueltas', value: stats.resolvedPicks.toString() },
    { label: 'Ganadas', value: stats.wonPicks.toString() },
    { label: 'Perdidas', value: stats.lostPicks.toString() },
    { label: 'Void', value: stats.voidPicks.toString() },
    { label: 'Winrate', value: `${formatNumber(stats.winrate, 1)}%` },
    {
      label: 'Yield',
      value: `${formatNumber(stats.yield, 2)}%`,
      className: stats.yield >= 0 ? styles.positive : styles.negative,
    },
    {
      label: 'Profit',
      value: `${formatNumber(stats.totalProfit, 2)}u`,
      className: stats.totalProfit >= 0 ? styles.positive : styles.negative,
    },
    { label: 'Cuota Media', value: formatNumber(stats.avgOdds, 2) },
    { label: 'Stake Medio', value: `${formatNumber(stats.avgStake, 1)}u` },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:gap-3">
      {statsData.map((stat) => (
        <div 
          key={stat.label} 
          className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-lg transition-all hover:bg-white/5 hover:-translate-y-0.5"
        >
          <span className="text-xs text-info uppercase tracking-wide">{stat.label}</span>
          <span className={cn(
            "text-2xl font-semibold text-text md:text-xl",
            stat.className === 'positive' && "text-success",
            stat.className === 'negative' && "text-error"
          )}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/TipsterStatsGrid/index.ts`:**
```typescript
export { TipsterStatsGrid } from './TipsterStatsGrid';
```

---

### 8. TipsterCharts Component

**Archivo `src/features/tipster-detail/components/TipsterCharts/TipsterCharts.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import type { PickEntity } from '@features/picks';
import { useTipsterCharts } from '../../hooks';
import { generateChartsData } from '../../utils';

interface TipsterChartsProps {
  picks: PickEntity[];
}

/**
 * Componente con los 4 gráficos Chart.js
 */
export const TipsterCharts: FC<TipsterChartsProps> = ({ picks }) => {
  const chartsData = useMemo(() => generateChartsData(picks), [picks]);
  const { oddsChartRef, stakeChartRef, sportChartRef, pickTypeChartRef } =
    useTipsterCharts(chartsData);

  if (picks.length === 0) {
    return (
      <div className="p-5 text-center text-info">
        No hay datos suficientes para mostrar gráficos
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 md:grid-cols-1 md:gap-4">
      <div className="flex flex-col gap-3 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
        <h3 className="text-base font-semibold text-text">Distribución de Cuotas</h3>
        <canvas ref={oddsChartRef} className="w-full h-[250px] md:h-[200px]" />
      </div>

      <div className="flex flex-col gap-3 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
        <h3 className="text-base font-semibold text-text">Distribución de Stakes</h3>
        <canvas ref={stakeChartRef} className="w-full h-[250px] md:h-[200px]" />
      </div>

      <div className="flex flex-col gap-3 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
        <h3 className="text-base font-semibold text-text">Picks por Deporte</h3>
        <canvas ref={sportChartRef} className="w-full h-[250px] md:h-[200px]" />
      </div>

      <div className="flex flex-col gap-3 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
        <h3 className="text-base font-semibold text-text">Picks por Tipo</h3>
        <canvas ref={pickTypeChartRef} className="w-full h-[250px] md:h-[200px]" />
      </div>
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/TipsterCharts/index.ts`:**
```typescript
export { TipsterCharts } from './TipsterCharts';
```

---

### 9. StatsTab Component

**Archivo `src/features/tipster-detail/components/StatsTab/StatsTab.tsx`:**
```typescript
import { FC } from 'react';
import type { TipsterDetailStats } from '../../types';
import type { PickEntity } from '@features/picks';
import { TipsterStatsGrid } from '../TipsterStatsGrid';
import { TipsterCharts } from '../TipsterCharts';

interface StatsTabProps {
  stats: TipsterDetailStats;
  picks: PickEntity[];
}

/**
 * Tab de estadísticas generales con charts
 */
export const StatsTab: FC<StatsTabProps> = ({ stats, picks }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text">Resumen de Estadísticas</h2>
        <TipsterStatsGrid stats={stats} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text">Análisis Visual</h2>
        <TipsterCharts picks={picks} />
      </div>
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/StatsTab/index.ts`:**
```typescript
export { StatsTab } from './StatsTab';
```

---

### 10. MyStatsTab Component

**Archivo `src/features/tipster-detail/components/MyStatsTab/MyStatsTab.tsx`:**
```typescript
import { FC } from 'react';
import { cn } from '@shared/utils';
import type { TipsterMyStats } from '../../types';
import { formatNumber } from '@shared/utils/format.utils';

interface MyStatsTabProps {
  myStats: TipsterMyStats | null;
}

/**
 * Tab de comparación Tipster vs Usuario
 */
export const MyStatsTab: FC<MyStatsTabProps> = ({ myStats }) => {
  if (!myStats) {
    return (
      <div className="p-8 text-center text-info bg-white/[0.02] border border-white/5 rounded-lg">
        <p>No has seguido ninguna pick de este tipster todavía</p>
      </div>
    );
  }

  const { tipsterStats, userStats, difference } = myStats;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 md:grid-cols-1">
        {/* Estadísticas del Tipster */}
        <div className="flex flex-col gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
          <h3 className="text-base font-semibold text-text uppercase tracking-wide">Tipster</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Picks Resueltas</span>
              <span className="text-base font-semibold text-text">{tipsterStats.resolvedPicks}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Picks Ganadas</span>
              <span className="text-base font-semibold text-text">{tipsterStats.wonPicks}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Winrate</span>
              <span className="text-base font-semibold text-text">{formatNumber(tipsterStats.winrate, 1)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Yield</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                tipsterStats.yield >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {formatNumber(tipsterStats.yield, 2)}%\n              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Profit</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                tipsterStats.totalProfit >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {formatNumber(tipsterStats.totalProfit, 2)}u\n              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas del Usuario */}
        <div className="flex flex-col gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-lg">
          <h3 className="text-base font-semibold text-text uppercase tracking-wide">Tus Resultados</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Follows Resueltos</span>
              <span className="text-base font-semibold text-text">{userStats.resolvedFollows}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Follows Ganados</span>
              <span className="text-base font-semibold text-text">{userStats.wonFollows}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Winrate</span>
              <span className="text-base font-semibold text-text">{formatNumber(userStats.winrate, 1)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Yield</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                userStats.yield >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {formatNumber(userStats.yield, 2)}%\n              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Profit</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                userStats.totalProfit >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {formatNumber(userStats.totalProfit, 2)}u\n              </span>
            </div>
          </div>
        </div>

        {/* Diferencias */}
        <div className="flex flex-col gap-4 p-5 bg-primary/10 border border-primary rounded-lg">
          <h3 className="text-base font-semibold text-text uppercase tracking-wide">Diferencia</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Winrate</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                difference.winrate >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {difference.winrate >= 0 ? '+' : ''}\n                {formatNumber(difference.winrate, 1)} pp\n              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Yield</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                difference.yield >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {difference.yield >= 0 ? '+' : ''}\n                {formatNumber(difference.yield, 2)} pp\n              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
              <span className="text-sm text-info">Profit</span>
              <span className={cn(\n                \"text-base font-semibold\",\n                difference.profit >= 0 ? \"text-success\" : \"text-error\"\n              )}>\n                {difference.profit >= 0 ? '+' : ''}\n                {formatNumber(difference.profit, 2)}u\n              </span>
            </div>
          </div>
          <p className="text-xs text-info mt-2">
            Valores positivos indican que tu rendimiento es mejor que el del tipster
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/MyStatsTab/index.ts`:**
```typescript
export { MyStatsTab } from './MyStatsTab';
```

---

### 11. PicksHistoryTab Component

**Archivo `src/features/tipster-detail/components/PicksHistoryTab/PicksHistoryTab.tsx`:**
```typescript
import { FC } from 'react';
import type { PickEntity } from '@features/picks';
import { PicksTable } from '@features/picks/components';
import { EmptyState } from '@shared/components';

interface PicksHistoryTabProps {
  picks: PickEntity[];
  onEditPick: (pickId: string) => void;
  onDeletePick: (pickId: string) => void;
  onFollowPick: (pickId: string) => void;
}

/**
 * Tab con historial completo de picks del tipster
 */
export const PicksHistoryTab: FC<PicksHistoryTabProps> = ({
  picks,
  onEditPick,
  onDeletePick,
  onFollowPick,
}) => {
  if (picks.length === 0) {
    return (
      <div className="p-8 text-center text-info">
        <EmptyState message="Este tipster no tiene picks registradas" />
      </div>
    );
  }

  // Ordenar por fecha descendente
  const sortedPicks = [...picks].sort((a, b) => {
    return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
  });

  return (
    <div className="flex flex-col gap-4">
      <PicksTable
        picks={sortedPicks}
        onEdit={onEditPick}
        onDelete={onDeletePick}
        onFollow={onFollowPick}
        showTipsterColumn={false}
      />
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/PicksHistoryTab/index.ts`:**
```typescript
export { PicksHistoryTab } from './PicksHistoryTab';
```

---

### 12. FollowsHistoryTab Component

**Archivo `src/features/tipster-detail/components/FollowsHistoryTab/FollowsHistoryTab.tsx`:**
```typescript
import { FC, useMemo } from 'react';
import type { FollowEntity } from '@features/follows';
import type { PickEntity } from '@features/picks';
import { FollowsTable } from '@features/follows/components';
import { EmptyState } from '@shared/components';

interface FollowsHistoryTabProps {
  follows: FollowEntity[];
  picks: PickEntity[];
  onEditFollow: (followId: string) => void;
  onDeleteFollow: (followId: string) => void;
}

/**
 * Tab con historial de follows del usuario a este tipster
 */
export const FollowsHistoryTab: FC<FollowsHistoryTabProps> = ({
  follows,
  picks,
  onEditFollow,
  onDeleteFollow,
}) => {
  // Combinar follows con picks
  const followsWithPicks = useMemo(() => {
    return follows.map((follow) => {
      const pick = picks.find((p) => p.id === follow.pickId);
      return { follow, pick: pick || null };
    });
  }, [follows, picks]);

  if (follows.length === 0) {
    return (
      <div className="p-8 text-center text-info">
        <EmptyState message="No has seguido ninguna pick de este tipster" />
      </div>
    );
  }

  // Ordenar por fecha descendente
  const sortedFollows = [...followsWithPicks].sort((a, b) => {
    return (
      new Date(b.follow.followDate).getTime() - new Date(a.follow.followDate).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <FollowsTable
        follows={sortedFollows.map((f) => f.follow)}
        picks={picks}
        onEdit={onEditFollow}
        onDelete={onDeleteFollow}
      />
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/components/FollowsHistoryTab/index.ts`:**
```typescript
export { FollowsHistoryTab } from './FollowsHistoryTab';
```

**Archivo `src/features/tipster-detail/components/index.ts`:**
```typescript
export { TipsterDetailHeader } from './TipsterDetailHeader';
export { TipsterDetailTabs } from './TipsterDetailTabs';
export { TipsterStatsGrid } from './TipsterStatsGrid';
export { TipsterCharts } from './TipsterCharts';
export { StatsTab } from './StatsTab';
export { MyStatsTab } from './MyStatsTab';
export { PicksHistoryTab } from './PicksHistoryTab';
export { FollowsHistoryTab } from './FollowsHistoryTab';
```

---

### 13. TipsterDetailPage

**Archivo `src/features/tipster-detail/pages/TipsterDetailPage/TipsterDetailPage.tsx`:**
```typescript
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '@shared/components';
import { useTipsterDetail } from '../../hooks';
import {
  TipsterDetailHeader,
  TipsterDetailTabs,
  StatsTab,
  MyStatsTab,
  PicksHistoryTab,
  FollowsHistoryTab,
} from '../../components';
import { useTipsterModal } from '@features/tipsters';
import { TipsterModal } from '@features/tipsters/components';
import { usePickModal } from '@features/picks';
import { PickModal } from '@features/picks/components';
import { useFollowModal } from '@features/follows';
import { FollowModal } from '@features/follows/components';
import { tipsterRepository } from '@core/repositories';
import type { TipsterDetailTab } from '../../types';

/**
 * Página de detalle completo de un tipster
 */
export const TipsterDetailPage: FC = () => {
  const { tipsterId } = useParams<{ tipsterId: string }>();
  const [activeTab, setActiveTab] = useState<TipsterDetailTab>('stats');

  if (!tipsterId) {
    return <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-center">ID de tipster no válido</div>;
  }

  const { tipster, picks, follows, stats, myStats, loading, error } =
    useTipsterDetail(tipsterId);

  // Modals
  const tipsterModal = useTipsterModal();
  const pickModal = usePickModal();
  const followModal = useFollowModal();

  const handleEdit = () => {
    if (tipster) {
      tipsterModal.openEditModal(tipster);
    }
  };

  const handleReset = async () => {
    if (!tipster) return;

    const confirmed = window.confirm(
      `¿Estás seguro de resetear ${tipster.name}? Esto eliminará todas sus picks y follows. Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      try {
        // Eliminar todas las picks del tipster
        const deletePromises = picks.map((pick) =>
          pickModal.deletePick(pick.id)
        );
        await Promise.all(deletePromises);

        // Opcionalmente también eliminar el tipster
        // await tipsterRepository.delete(tipster.id);

        alert('Tipster reseteado correctamente');
      } catch (err) {
        console.error('Error al resetear tipster:', err);
        alert('Error al resetear tipster');
      }
    }
  };

  const handleAddPick = () => {
    pickModal.openCreateModal(tipsterId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !tipster || !stats) {
    return <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-center">{error || 'Tipster no encontrado'}</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-4 md:gap-4">
      {/* Header */}
      <TipsterDetailHeader
        tipster={tipster}
        onEdit={handleEdit}
        onReset={handleReset}
        onAddPick={handleAddPick}
      />

      {/* Tabs */}
      <TipsterDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex flex-col gap-5">
        {activeTab === 'stats' && <StatsTab stats={stats} picks={picks} />}

        {activeTab === 'myStats' && <MyStatsTab myStats={myStats} />}

        {activeTab === 'picksHistory' && (
          <PicksHistoryTab
            picks={picks}
            onEditPick={pickModal.openEditModal}
            onDeletePick={pickModal.deletePick}
            onFollowPick={followModal.openCreateModal}
          />
        )}

        {activeTab === 'followsHistory' && (
          <FollowsHistoryTab
            follows={follows}
            picks={picks}
            onEditFollow={followModal.openEditModal}
            onDeleteFollow={followModal.deleteFollow}
          />
        )}
      </div>

      {/* Modals */}
      <TipsterModal
        isOpen={tipsterModal.isOpen}
        tipster={tipsterModal.editingTipster}
        onClose={tipsterModal.closeModal}
        onSubmit={
          tipsterModal.editingTipster
            ? (data) => tipsterModal.updateTipster(tipsterModal.editingTipster!.id, data)
            : tipsterModal.createTipster
        }
        loading={tipsterModal.loading}
        error={tipsterModal.error}
      />

      <PickModal
        isOpen={pickModal.isOpen}
        pick={pickModal.editingPick}
        tipsterId={tipsterId}
        onClose={pickModal.closeModal}
        onSubmit={
          pickModal.editingPick
            ? (data) => pickModal.updatePick(pickModal.editingPick!.id, data)
            : pickModal.createPick
        }
        loading={pickModal.loading}
        error={pickModal.error}
      />

      <FollowModal
        isOpen={followModal.isOpen}
        follow={followModal.editingFollow}
        pickId={followModal.selectedPickId || ''}
        onClose={followModal.closeModal}
        onSubmit={
          followModal.editingFollow
            ? (data) => followModal.updateFollow(followModal.editingFollow!.id, data)
            : followModal.createFollow
        }
        loading={followModal.loading}
        error={followModal.error}
      />
    </div>
  );
};
```

**Archivo `src/features/tipster-detail/pages/TipsterDetailPage/index.ts`:**
```typescript
export { TipsterDetailPage } from './TipsterDetailPage';
```

**Archivo `src/features/tipster-detail/pages/index.ts`:**
```typescript
export { TipsterDetailPage } from './TipsterDetailPage';
```

---

### 14. Feature Index

**Archivo `src/features/tipster-detail/index.ts`:**
```typescript
// Hooks
export { useTipsterDetail, useTipsterCharts } from './hooks';

// Components
export {
  TipsterDetailHeader,
  TipsterDetailTabs,
  TipsterStatsGrid,
  TipsterCharts,
  StatsTab,
  MyStatsTab,
  PicksHistoryTab,
  FollowsHistoryTab,
} from './components';

// Pages
export { TipsterDetailPage } from './pages';

// Types
export type {
  TipsterDetailTab,
  TipsterDetailStats,
  TipsterMyStats,
  ChartDataDistribution,
  TipsterChartsData,
} from './types';

// Utils
export { generateChartsData, CHART_COLORS, BASE_CHART_OPTIONS } from './utils';
```

---

### 15. Integración en App.tsx

**Modificar `src/App.tsx` para añadir ruta de detalle:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import { PrivateRoute } from './features/auth';
import { LoginPage, SignupPage } from './features/auth/pages';
import { TipstersPage } from './features/tipsters/pages';
import { AllPicksPage } from './features/picks/pages';
import { MyPicksPage } from './features/follows/pages';
import { DashboardPage } from './features/dashboard/pages';
import { TipsterDetailPage } from './features/tipster-detail/pages'; // NUEVO
import { PrivateLayout } from './layouts/PrivateLayout';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />
            
            {/* Tipsters */}
            <Route path="tipsters" element={<TipstersPage />} />
            
            {/* NUEVO: Tipster Detail */}
            <Route path="tipsters/:tipsterId" element={<TipsterDetailPage />} />
            
            {/* Picks */}
            <Route path="picks" element={<AllPicksPage />} />
            
            {/* My Picks */}
            <Route path="my-picks" element={<MyPicksPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
```

---

### 16. Instalación de Chart.js

**Ejecutar en terminal:**
```bash
npm install chart.js react-chartjs-2
```

**O agregar a `package.json`:**
```json
{
  "dependencies": {
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  }
}
```

---

### 17. Checklist de Verificación

#### Setup y Estructura
- [ ] Crear carpeta `src/features/tipster-detail/` con subcarpetas
- [ ] Instalar Chart.js y react-chartjs-2
- [ ] Crear types en `types/tipster-detail.types.ts`
- [ ] Crear utils en `utils/tipster-charts.utils.ts`
- [ ] Verificar exports en todos los `index.ts`

#### Hooks
- [ ] Implementar `useTipsterDetail` con datos combinados
- [ ] Implementar `useTipsterCharts` con Chart.js
- [ ] Verificar cálculos de stats correctos
- [ ] Verificar cálculo de My Stats (comparación)
- [ ] Verificar manejo de cleanup en charts

#### Componentes Base
- [ ] Implementar `TipsterDetailHeader` con acciones
- [ ] Implementar `TipsterDetailTabs` con 4 tabs
- [ ] Implementar `TipsterStatsGrid` con 10 stats
- [ ] Implementar `TipsterCharts` con 4 gráficos
- [ ] Verificar estilos CSS Modules

#### Tabs
- [ ] Implementar `StatsTab` con grid + charts
- [ ] Implementar `MyStatsTab` con comparación
- [ ] Implementar `PicksHistoryTab` con tabla
- [ ] Implementar `FollowsHistoryTab` con tabla
- [ ] Verificar cambio entre tabs funciona

#### Página Principal
- [ ] Implementar `TipsterDetailPage` completa
- [ ] Integrar header con acciones
- [ ] Integrar tabs y contenido
- [ ] Integrar 3 modals (Tipster, Pick, Follow)
- [ ] Verificar flujo de edición
- [ ] Verificar flujo de reset (con confirmación)
- [ ] Verificar flujo de añadir pick

#### Integración en App
- [ ] Añadir ruta `/tipsters/:tipsterId` en App.tsx
- [ ] Verificar navegación desde Dashboard
- [ ] Verificar navegación desde Tipsters page
- [ ] Botón volver regresa a Dashboard
- [ ] Verificar parámetro tipsterId se captura

#### Charts (Chart.js)
- [ ] Chart de odds distribution (bar) renderiza
- [ ] Chart de stake distribution (bar) renderiza
- [ ] Chart de sports (doughnut) renderiza
- [ ] Chart de pick types (doughnut) renderiza
- [ ] Charts se destruyen correctamente al cambiar
- [ ] Colors matching con paleta definida
- [ ] Tooltips funcionan correctamente
- [ ] Legends se muestran

#### Estadísticas y Cálculos
- [ ] Total picks correcto
- [ ] Picks resueltas correcto
- [ ] Ganadas, perdidas, void correctos
- [ ] Winrate calculado correctamente
- [ ] Yield calculado correctamente
- [ ] Profit calculado correctamente
- [ ] Cuota media correcta
- [ ] Stake medio correcto
- [ ] Seguibilidad correcta
- [ ] My Stats: comparación correcta

#### Testing Manual - Tab Stats
- [ ] Grid de stats muestra 10 métricas
- [ ] Valores positivos en verde
- [ ] Valores negativos en rojo
- [ ] Charts cargan correctamente
- [ ] Charts son responsive

#### Testing Manual - Tab My Stats
- [ ] Muestra 3 cards: Tipster, Usuario, Diferencia
- [ ] Stats del tipster solo de picks seguidas
- [ ] Stats del usuario de follows
- [ ] Diferencias calculadas correctamente
- [ ] Muestra empty state si no hay follows

#### Testing Manual - Tab Picks History
- [ ] Tabla muestra todas las picks del tipster
- [ ] Ordenadas por fecha descendente
- [ ] Botón editar abre modal pre-rellenado
- [ ] Botón eliminar con confirmación
- [ ] Botón seguir abre modal follow
- [ ] Empty state si no hay picks

#### Testing Manual - Tab Follows History
- [ ] Tabla muestra follows del usuario
- [ ] Ordenadas por fecha descendente
- [ ] Muestra comparación tipster vs usuario
- [ ] Badges de match/diverge correctos
- [ ] Botón editar funciona
- [ ] Botón eliminar funciona
- [ ] Empty state si no hay follows

#### Testing Manual - Acciones
- [ ] Botón "Editar" abre modal de tipster
- [ ] Guardar cambios actualiza nombre/canal
- [ ] Botón "Añadir Pick" abre modal con tipsterId
- [ ] Guardar pick añade a historial
- [ ] Botón "Resetear" pide confirmación
- [ ] Resetear elimina todas las picks
- [ ] Botón volver navega a Dashboard

#### Real-time
- [ ] Añadir pick → aparece en historial
- [ ] Resolver pick → stats se actualizan
- [ ] Seguir pick → aparece en follows tab
- [ ] Eliminar pick → desaparece de historial
- [ ] Charts se actualizan con nuevos datos

#### UI/UX
- [ ] Loading durante carga inicial
- [ ] Error si tipster no existe
- [ ] Tabs responsive en mobile
- [ ] Charts responsive en mobile
- [ ] Tablas con scroll horizontal en mobile
- [ ] Hover effects en cards
- [ ] Transiciones suaves

---

### 18. Comandos de Verificación

```bash
# Instalar dependencias
npm install

# Verificar instalación Chart.js
npm list chart.js react-chartjs-2

# Build del proyecto
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Preview build
npm run preview

# Ejecutar emuladores Firebase
firebase emulators:start
```

---

### 19. Testing Manual - Escenarios Completos

#### Escenario 1: Navegar a Detalle desde Dashboard
1. Login en la aplicación
2. Dashboard muestra grid de tipsters
3. Click en un TipsterCard
4. Verificar navegación a `/tipsters/{id}`
5. Verificar header muestra nombre y canal
6. Verificar tab "Estadísticas" activa por defecto

#### Escenario 2: Ver Estadísticas Generales
1. En tab "Estadísticas"
2. Verificar grid de 10 stats
3. Scroll down para ver los 4 gráficos
4. Verificar gráfico de odds (bar chart)
5. Verificar gráfico de stakes (bar chart)
6. Verificar gráfico de deportes (doughnut)
7. Verificar gráfico de tipos (doughnut)
8. Hover en gráficos → tooltips aparecen

#### Escenario 3: Ver Mis Estadísticas (Comparación)
1. Click en tab "Mis Estadísticas"
2. Si no hay follows → empty state
3. Si hay follows → 3 cards (Tipster, Usuario, Diferencia)
4. Verificar stats del tipster solo de picks seguidas
5. Verificar stats del usuario
6. Verificar diferencias (positivas en verde, negativas en rojo)

#### Escenario 4: Ver Historial de Picks
1. Click en tab "Historial de Picks"
2. Tabla muestra todas las picks
3. Picks ordenadas de más reciente a más antigua
4. Click "Editar" en una pick
5. Modal se abre pre-rellenado
6. Modificar datos y guardar
7. Verificar actualización en tabla

#### Escenario 5: Ver Historial de Follows
1. Click en tab "Mis Follows"
2. Tabla muestra follows del usuario
3. Ver columnas comparativas (tipster vs usuario)
4. Verificar badges match/diverge
5. Click "Editar" en un follow
6. Modificar datos y guardar
7. Verificar actualización

#### Escenario 6: Añadir Pick Rápida
1. Click botón "Añadir Pick" en header
2. Modal se abre con tipster pre-seleccionado
3. Completar formulario
4. Guardar
5. Verificar aparición en tab "Historial de Picks"
6. Verificar stats actualizadas en tab "Estadísticas"
7. Verificar charts actualizados

#### Escenario 7: Editar Tipster
1. Click botón "Editar" en header
2. Modal se abre pre-rellenado
3. Cambiar nombre o canal
4. Guardar
5. Verificar actualización en header
6. Verificar cambio en Dashboard al volver

#### Escenario 8: Resetear Tipster
1. Click botón "Resetear" en header
2. Confirmación aparece
3. Confirmar
4. Verificar eliminación de picks
5. Verificar tabs muestran empty states
6. Verificar stats en cero

#### Escenario 9: Navegación entre Tabs
1. Click en cada tab secuencialmente
2. Verificar cambio visual (tab activa)
3. Verificar contenido cambia
4. Verificar no hay errores en consola
5. Verificar transiciones suaves

#### Escenario 10: Volver al Dashboard
1. Estando en detalle de tipster
2. Click botón "Volver" (flecha izquierda)
3. Verificar navegación a Dashboard
4. Verificar tipster sigue en grid
5. Verificar stats actualizadas

---

### 20. Mejoras Futuras (Post Fase 8)

**Funcionalidades adicionales:**
- Navegación entre tipsters (prev/next buttons)
- Breadcrumbs para mejor orientación
- Exportar historial de picks a CSV/Excel
- Compartir estadísticas (share link)
- Gráfico de evolución temporal (line chart)
- Filtros en tab historial de picks
- Búsqueda en historial
- Vista compacta de historial

**Optimizaciones:**
- Lazy loading de charts
- Virtualización de tablas largas
- Memoización de cálculos pesados
- Suspense boundaries
- Error boundaries por tab

---

### Resumen de la Fase 8

**Completado:**
✅ Types para detalle (4 interfaces)
✅ Utils para Chart.js (grouping, colors, config)
✅ Hook useTipsterDetail (combina tipster + picks + follows + stats)
✅ Hook useTipsterCharts (gestión de 4 charts)
✅ TipsterDetailHeader (con acciones)
✅ TipsterDetailTabs (4 tabs navegables)
✅ TipsterStatsGrid (10 stat cards)
✅ TipsterCharts (4 gráficos Chart.js)
✅ StatsTab (stats + charts)
✅ MyStatsTab (comparación 3 cards)
✅ PicksHistoryTab (tabla completa de picks)
✅ FollowsHistoryTab (tabla comparativa)
✅ TipsterDetailPage (integración completa)
✅ Ruta `/tipsters/:tipsterId` en App.tsx
✅ Navegación desde Dashboard
✅ 3 modals integrados (Tipster, Pick, Follow)
✅ Botón volver funcional
✅ Reset tipster con confirmación

**Duración real estimada**: 60-80 horas

**Archivos creados**: ~26 archivos
**Líneas de código**: ~2,200 líneas

**Archivos modificados**:
- `src/App.tsx` (ruta de detalle)
- `package.json` (Chart.js dependency)

**Importante**: Esta fase completa la vista de detalle de tipsters, permitiendo análisis profundo con estadísticas, gráficos y comparación de rendimiento. Los charts de Chart.js visualizan distribuciones clave. La navegación por tabs organiza la información de manera intuitiva. La próxima fase son refinamientos y mejoras (Fase 8.5) antes del deploy final.

---

## Fase 8.5: Refinamientos y Mejoras ✨


**Duración estimada**: 15-25 horas

### Objetivos de la Fase

Antes de pasar al deploy a producción, esta fase se enfoca en pulir la aplicación con mejoras de UX, funcionalidades adicionales y optimizaciones que no estaban en el plan inicial de migración pero que mejoran significativamente la experiencia del usuario.

**Nota importante**: La funcionalidad de **importación de Excel** se pospone y NO se implementará en esta iteración. El exportador de Excel está finalizado y validado, pero la importación queda pendiente para una fase futura. Documentar este estado en AGENTS.md y aquí.

**Estado actual de tareas Fase 8.5:**

**Completadas (6/11):**
1. ✅ ConfirmDialog reutilizable para acciones destructivas
2. ✅ Reset Tipster con doble confirmación y feedback visual
3. ✅ Filtros de fecha (rango) en picks
4. ✅ Ordenación por columnas en tablas (picks, follows)
5A. ✅ Exportar a Excel (template, dashboards, fórmulas, estilos, dropdowns)
6. ✅ Sistema de notificaciones toast (Sonner) - Migrados 4 window.confirm() a ConfirmDialog

**Pendientes (5/11):**
5B. ⏳ Importar desde Excel (POSPUESTO - NO se implementa en esta fase)
7. ⏳ Optimización de estados de carga (skeleton loaders, overlays)
8. ⏳ Error boundaries
9. ⏳ Mejora de búsqueda en tablas
10. ⏳ Mejoras responsive (mobile/tablet)
11. ⏳ Optimización de rendimiento
   - React.memo para componentes pesados
   - Lazy loading de componentes y rutas
   - Virtualización de tablas largas
   - Code splitting
   - **Optimización de carga en redes lentas (3G/4G)** ← Detectado en testing con throttling
     - Bundle size analysis (Chart.js ~200KB, Firebase ~100KB)
     - Tree shaking (especialmente iconos de Lucide)
     - Compresión de assets
     - Lazy loading de charts y componentes pesados
     - Preloading crítico
   - Objetivos: FCP < 3s (3G), LCP < 5s (3G), Bundle inicial < 200KB (gzipped)

**Decisión:** La importación de Excel se documenta como pospuesta y no bloquea el avance a las siguientes tareas ni el deploy.

---

### 1. Sistema de Confirmación Reutilizable

**Objetivo**: Crear un componente de modal de confirmación reutilizable para acciones destructivas.

**Commit**: `9007614` - "feat(phase-9): implement reset tipster functionality - Task 1/10"

#### 1.1 Componente ConfirmDialog

**Archivo `src/shared/components/ConfirmDialog/ConfirmDialog.tsx`:**
```typescript
/**
 * @fileoverview ConfirmDialog - Reusable confirmation modal
 * @module shared/components/ConfirmDialog
 */

import { X } from 'lucide-react';
import { Button } from '../ui';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-300 whitespace-pre-line">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Características**:
- ✅ Backdrop con blur
- ✅ Click outside para cerrar
- ✅ Estado de loading
- ✅ Variante "dangerous" para acciones destructivas
- ✅ Textos personalizables
- ✅ Diseño consistente con el resto de la app

#### 1.2 Export del Componente

**Archivo `src/shared/components/ConfirmDialog/index.ts`:**
```typescript
export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';
```

**Archivo `src/shared/components/index.ts` (modificado):**
```typescript
// Añadir al final:
export * from './ConfirmDialog';
```

---

### 2. Funcionalidad Reset Tipster

**Objetivo**: Permitir resetear un tipster eliminando todas sus picks y follows asociados.

**Commit**: `9007614` - "feat(phase-9): implement reset tipster functionality - Task 1/10"

#### 2.1 Método en TipsterRepository

**Archivo `src/features/tipsters/services/tipster-repository.ts` (modificado):**
```typescript
/**
 * Reset complete tipster - delete all picks and follows
 */
async resetTipsterComplete(
  tipsterId: string,
  userId: string,
  pickRepository: {
    getPicksByTipster: (tipsterId: string, userId: string) => Promise<Pick[]>;
    deletePick: (pickId: string, userId: string) => Promise<OperationResult<void>>;
  },
  followRepository: {
    getFollowsByTipster: (tipsterId: string, userId: string) => Promise<Follow[]>;
    deleteFollow: (followId: string, userId: string) => Promise<OperationResult<void>>;
  }
): Promise<OperationResult<{ deletedPicks: number; deletedFollows: number }>> {
  try {
    // 1. Get all picks for this tipster
    const picks = await pickRepository.getPicksByTipster(tipsterId, userId);
    
    // 2. Get all follows for this tipster
    const follows = await followRepository.getFollowsByTipster(tipsterId, userId);
    
    // 3. Delete all follows first (they reference picks)
    let deletedFollows = 0;
    for (const follow of follows) {
      const result = await followRepository.deleteFollow(follow.id, userId);
      if (result.success) deletedFollows++;
    }
    
    // 4. Delete all picks
    let deletedPicks = 0;
    for (const pick of picks) {
      const result = await pickRepository.deletePick(pick.id, userId);
      if (result.success) deletedPicks++;
    }
    
    // 5. Update tipster (reset lastPickDate)
    await this.update(tipsterId, userId, { lastPickDate: null });
    
    return {
      success: true,
      data: { deletedPicks, deletedFollows },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'reset-failed',
        message: error instanceof Error ? error.message : 'Error al resetear tipster',
      },
    };
  }
}
```

#### 2.2 Integración en TipsterDetailPage

**Archivo `src/features/tipsters/pages/TipsterDetailPage.tsx` (modificado):**

**Imports añadidos**:
```typescript
import { RefreshCcw } from 'lucide-react';
import { ConfirmDialog } from '@shared/components';
import { auth } from '@core/config/firebase.config';
```

**Estado para confirmaciones**:
```typescript
const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
const [isSecondResetConfirmOpen, setIsSecondResetConfirmOpen] = useState(false);
const [isResetting, setIsResetting] = useState(false);
```

**Handlers**:
```typescript
const handleResetTipster = () => {
  setIsResetConfirmOpen(true);
};

const handleFirstConfirmReset = () => {
  setIsResetConfirmOpen(false);
  setIsSecondResetConfirmOpen(true);
};

const handleFinalConfirmReset = async () => {
  if (!tipster) return;
  
  setIsResetting(true);
  
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuario no autenticado');
    
    // Dynamic imports to avoid circular dependencies
    const { pickRepository } = await import('@features/picks/services/pick-repository');
    const { followRepository } = await import('@features/follows/services/follow-repository');
    
    const result = await tipsterRepository.resetTipsterComplete(
      tipster.id,
      userId,
      pickRepository,
      followRepository
    );
    
    if (result.success) {
      alert(`Tipster reseteado correctamente.\n\nPicks eliminados: ${result.data?.deletedPicks}\nFollows eliminados: ${result.data?.deletedFollows}`);
      navigate('/dashboard');
    } else {
      alert(`Error: ${result.error?.message}`);
    }
  } catch (error) {
    alert(`Error al resetear: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  } finally {
    setIsResetting(false);
    setIsSecondResetConfirmOpen(false);
  }
};
```

**Botón Reset en el header**:
```typescript
<Button
  variant="outline"
  onClick={handleResetTipster}
  disabled={picks.length === 0}
  title={picks.length === 0 ? 'No hay picks para resetear' : 'Resetear este tipster'}
>
  <RefreshCcw className="h-4 w-4 mr-2" />
  {isResetting ? 'Reseteando...' : 'Resetear Tipster'}
</Button>
```

**Modals de confirmación**:
```typescript
{/* First Confirmation */}
<ConfirmDialog
  isOpen={isResetConfirmOpen}
  onClose={() => setIsResetConfirmOpen(false)}
  onConfirm={handleFirstConfirmReset}
  title="¿Resetear Tipster?"
  message={`Estás a punto de eliminar:\n\n• ${picks.length} picks\n• ${follows.length} follows\n\n¿Estás seguro?`}
  confirmText="Sí, continuar"
  cancelText="Cancelar"
  isDangerous
/>

{/* Second Confirmation */}
<ConfirmDialog
  isOpen={isSecondResetConfirmOpen}
  onClose={() => setIsSecondResetConfirmOpen(false)}
  onConfirm={handleFinalConfirmReset}
  title="Confirmación Final"
  message="Esta acción es IRREVERSIBLE.\n\nSe eliminarán todas las picks y follows de este tipster.\n\n¿Continuar?"
  confirmText="Sí, resetear definitivamente"
  cancelText="Cancelar"
  isDangerous
  isLoading={isResetting}
/>
```

**Cambios realizados**:
- ✅ 5 archivos modificados
- ✅ 270 inserciones, 1 eliminación
- ✅ Doble confirmación para evitar eliminaciones accidentales
- ✅ Feedback visual durante el proceso
- ✅ Navegación automática al dashboard después del reset

---

### 3. Filtros de Fecha Mejorados

**Objetivo**: Añadir filtrado por rango de fechas manteniendo la simplicidad de los filtros básicos.

**Commit**: `31a8575` - "feat(phase-9): add date range filter to picks - Task 2/10"

#### 3.1 Actualización de Types

**Archivo `src/features/picks/pages/PicksListPage/PicksListPage.types.ts` (modificado):**
```typescript
export interface PickFilters {
  // Basic filters
  tipsterId: string;
  sport: string;
  result: string;
  bookmaker: string;
  searchQuery: string;
  
  // Advanced filters (para futuras expansiones)
  tipsterIds: string[];
  sports: string[];
  bookmakers: string[];
  pickType: string;
  dateFrom: string;  // YYYY-MM-DD
  dateTo: string;    // YYYY-MM-DD
  oddsMin: number | null;
  oddsMax: number | null;
  stakeMin: number | null;
  stakeMax: number | null;
}
```

#### 3.2 Lógica de Filtrado por Fechas

**Archivo `src/features/picks/pages/PicksListPage/PicksListPage.tsx` (modificado):**

**Función filterPicks actualizada**:
```typescript
const filterPicks = (picks: Pick[], filters: PickFilters): Pick[] => {
  return picks.filter((pick) => {
    // ... filtros básicos existentes ...
    
    // Date range filter
    if (filters.dateFrom && pick.date < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && pick.date > filters.dateTo) {
      return false;
    }
    
    return true;
  });
};
```

**Detección de filtros activos**:
```typescript
const hasActiveFilters =
  filters.tipsterId ||
  filters.sport ||
  filters.result ||
  filters.bookmaker ||
  filters.searchQuery ||
  filters.dateFrom ||
  filters.dateTo;
```

#### 3.3 UI de Filtros

**Grid layout actualizado** (6 columnas):
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
  {/* Search - 2 columns */}
  <div className="lg:col-span-2">
    <label htmlFor="search-picks" className="block text-sm font-medium text-slate-300 mb-2">
      Buscar
    </label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        id="search-picks"
        type="text"
        value={filters.searchQuery}
        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        placeholder="Buscar por partido o tipo de apuesta..."
        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Date From - 1 column */}
  <div>
    <label htmlFor="filter-date-from" className="block text-sm font-medium text-slate-300 mb-2">
      Fecha desde
    </label>
    <input
      id="filter-date-from"
      type="date"
      value={filters.dateFrom}
      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Date To - 1 column */}
  <div>
    <label htmlFor="filter-date-to" className="block text-sm font-medium text-slate-300 mb-2">
      Fecha hasta
    </label>
    <input
      id="filter-date-to"
      type="date"
      value={filters.dateTo}
      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Tipster, Sport, Result - 1 column each */}
  {/* ... selects existentes ... */}
</div>
```

**Cambios realizados**:
- ✅ 5 archivos modificados
- ✅ 456 inserciones, 18 eliminaciones
- ✅ Filtrado por rango de fechas funcional
- ✅ Diseño limpio y responsive
- ✅ Compatible con filtros existentes

#### 3.4 Componente AdvancedFilters (Creado pero No Usado)

Se creó un componente `AdvancedFilters` con filtros complejos (multi-select, rangos numéricos, etc.) pero se decidió mantener la UI simple. El componente está disponible en:
- `src/features/picks/components/AdvancedFilters/AdvancedFilters.tsx`
- `src/features/picks/components/AdvancedFilters/index.ts`

**Nota**: Este componente puede ser útil en el futuro si se necesitan filtros más avanzados.

---

### 4. Resumen de la Fase 8.5

#### Archivos Creados (4 nuevos)
1. `src/shared/components/ConfirmDialog/ConfirmDialog.tsx`
2. `src/shared/components/ConfirmDialog/index.ts`
3. `src/features/picks/components/AdvancedFilters/AdvancedFilters.tsx`
4. `src/features/picks/components/AdvancedFilters/index.ts`

#### Archivos Modificados (7)
1. `src/shared/components/index.ts` - Export ConfirmDialog
2. `src/features/tipsters/services/tipster-repository.ts` - Método resetTipsterComplete
3. `src/features/tipsters/pages/TipsterDetailPage.tsx` - Integración reset con double confirm
4. `src/features/picks/pages/PicksListPage/PicksListPage.types.ts` - Filtros de fecha
5. `src/features/picks/pages/PicksListPage/PicksListPage.tsx` - UI filtros de fecha
6. `src/features/picks/components/index.ts` - Export AdvancedFilters
7. `src/features/tipsters/pages/TipsterDetailPage/TipsterDetailPage.tsx` - Botón reset

#### Líneas de Código
- **Total**: ~726 líneas añadidas
- **Commit 1** (Reset): 270 inserciones, 1 eliminación
- **Commit 2** (Filtros): 456 inserciones, 18 eliminaciones

#### Commits
- `9007614` - Reset Tipster functionality
- `31a8575` - Date range filter

#### Testing Realizado
- ✅ Reset tipster con 0 picks (botón deshabilitado)
- ✅ Reset tipster con picks y follows (doble confirmación)
- ✅ Filtro de fecha desde (funcional)
- ✅ Filtro de fecha hasta (funcional)
- ✅ Filtro de rango de fechas (desde + hasta combinados)
- ✅ Botón "Limpiar filtros" resetea fechas correctamente

---

### Tareas Pendientes de la Fase 8.5

#### Task 4: Capacidades de Ordenación ✅ COMPLETADA (20/11/2025)
**Objetivo**: Añadir ordenación por columnas en tablas (picks, follows)

**Características implementadas**:
- Sort ascendente/descendente por: fecha, cuota, stake, resultado, tipster
- Indicadores visuales de columna ordenada (↑↓)
- Click en header de columna para ordenar
- Estado de ordenación persistente durante la sesión

**Commit**: `1ec71f8` - "feat(phase-9): add column sorting to tables - Task 4/10"

#### Task 5A: Exportar a Excel - Template ✅ COMPLETADA (19/11/2025)
**Objetivo**: Crear template Excel completo con formulas, estilos y dropdowns

**Implementación** (commits 44c5340, 1f2a0ae):
- **Estructura**: 6 hojas (Realizadas, Lanzadas Tipster, Mis_Picks_Dashboard, Tipster_Picks_Dashboard, Base datos, 📖 INSTRUCCIONES)
- **Tecnologías**: 
  * TypeScript + xlsx library → Estructura base
  * Python + openpyxl → Post-processing (estilos, fórmulas, dropdowns)
- **Dashboards expandidos**: 
  * 7→16 deportes sincronizados con Base datos
  * 29 columnas (A-AC): 13 stats + 16 sports
  * Deportes: Badminton, Baloncesto, Balonmano, Beisbol, Boxeo, Ciclismo, Esports, Fútbol, Fútbol Americano, Golf, Hockey, MMA, Tenis, Tenis Mesa, Voleibol
- **Fórmulas dinámicas**:
  * Row 2: Totales con SUMIF/COUNTIFS
  * Rows 3-100: Fórmulas copiadas automáticamente
  * Pattern: `=IFERROR(((COUNTIFS(sheet!$B$,tipster,sheet!$E$,"W",sheet!$DEPORTE$,sport))/$H),0)`
- **Estilos completos**:
  * Arial font global
  * Merged cells, conditional formatting (red/green)
  * Yellow headers, borders, optimized column widths
- **Dropdowns funcionales**:
  * 7 dropdowns por sheet (LIVE/PRE, TIPSTER, W/L/V, COMBINADA, DEPORTE, Plataforma, BOOKIE)
  * showDropDown=False para compatibilidad LibreOffice
  * Dynamic TIPSTER dropdown synced with dashboards
- **Workflow documentado**: Dashboard-first (añadir tipster en dashboard → aparece en dropdown)
- **Archivo generado**: `EXCEL-TEMPLATE-16-SPORTS-ARIAL.xlsx` (50KB)

**Pendiente - UI Integration**:
- **Botón único "Export to Excel"**: 
  * Ubicación: Navbar/Header (acceso global)
  * Exporta TODOS los datos del usuario sin filtros
  * Picks de todos tipsters → "Lanzadas Tipster"
  * Follows del usuario → "Realizadas"
  * Dashboards auto-generados con tipsters únicos
  * Nombre archivo: `tipster-tracker-export-YYYY-MM-DD.xlsx`
  * Función: `exportPicksToExcel(picks, follows)` en `excelExport.ts`
  * UX: Un solo botón para exportar todo (análisis externo en Excel)

#### Task 5B: Importar desde Excel 🔄 PENDIENTE
**Objetivo**: Funcionalidad para importar picks desde Excel generado

**Estado:** Esta tarea se pospone para futuras iteraciones. No se implementará en la Fase 8.5 y queda documentada para priorización futura.

**Características (planificadas):**
- Parsear Excel con xlsx library
- Validar datos antes de importar
- Preview modal con datos a importar
- Batch import a Firestore
- Manejo de errores (filas inválidas)

#### Task 6: Sistema de Notificaciones Toast 🔄 PENDIENTE
**Objetivo**: Reemplazar alerts nativos con toast notifications

**Diagnóstico actual (20/11/2025):**
- Sonner no está instalado en el proyecto React, se debe añadir como dependencia.
- El sistema actual usa `alert()` y `confirm()` en múltiples puntos críticos (CRUD, dashboard, modals, etc.).
- Hay componentes custom de `Alert` y `ConfirmDialog`, pero no existe un sistema global de toasts ni `<Toaster />` montado.
- Existe un componente `ToastContainer.tsx` (custom), pero no es Sonner y podría ser redundante.

**Plan de integración Sonner:**
1. Instalar Sonner vía npm.
2. Añadir `<Toaster />` en el layout principal (`App.tsx` o provider global).
3. Migrar todos los usos de `alert()` y `confirm()` a Sonner (`toast.success`, `toast.error`, etc.).
4. Refactorizar/eliminar el sistema custom de toasts si es redundante.
5. Probar todos los flujos afectados y asegurar feedback visual coherente.
6. Documentar la integración y los cambios realizados.

**Características a implementar:**
- Notificaciones de éxito, error, info, warning
- Posición configurable (top-right por defecto)
- Auto-dismiss con duración configurable
- Reemplazar todos los `alert()` y `confirm()` nativos por toasts Sonner
#### Task 7: Optimización de Estados de Carga 🔄 PENDIENTE
**Objetivo**: Mejorar feedback visual durante operaciones

**Características**:
- Skeleton loaders para tablas y cards
- Loading overlays específicos (no solo spinner global)
- Estados de error mejorados con iconos y mensajes claros
- Loading states en botones durante operaciones

#### Task 8: Error Boundaries 🔄 PENDIENTE
**Objetivo**: Implementar error boundaries de React

**Características**:
- Error boundaries a nivel de página y componente
- Capturar errores de renderizado
- Páginas de error amigables con opciones de recuperación
- Logging de errores para debugging

#### Task 9: Mejora de Funcionalidad de Búsqueda 🔄 PENDIENTE
**Objetivo**: Mejorar búsqueda en tablas

**Características**:
- Búsqueda por múltiples campos (match, betType, tipster, etc.)
- Resaltado de resultados en la tabla (highlight)
- Historial de búsquedas recientes (localStorage)
- Búsqueda con debounce para mejor performance

#### Task 10: Mejoras Responsive ✅ COMPLETADA (21/11/2025)
**Objetivo**: Optimizar diseño para móviles y tablets

**Implementación completada**:
- ✅ Menú hamburguesa para móviles (Header component)
- ✅ Tablas scrollables horizontalmente con indicador visual
- ✅ Vista de cards para móvil (PickCard, FollowCard)
- ✅ Filtros colapsables en móvil (CollapsibleSection component)
- ✅ Touch-friendly (botones y controles optimizados)
- ✅ Navegación responsive en todas las páginas
- ✅ Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

**Testing realizado**:
- ✅ Responsive en 375px, 768px, 1920px
- ✅ Hamburger menu funcional
- ✅ Tablas con scroll horizontal
- ✅ Filtros colapsables
- ✅ Cards en mobile view

**Commits**: Ver walkthrough de Task 10 para detalles completos

#### Task 11: Optimización de Rendimiento ✅ COMPLETADA (22/11/2025)
**Objetivo**: Mejorar performance de la aplicación

**Implementación completada (4 Fases)**:

**Fase 1: Route-Based Code Splitting**
- ✅ Lazy loading de 7 páginas con React.lazy()
- ✅ Suspense boundaries con PageLoadingFallback
- ✅ Skeleton loaders durante carga
- Páginas lazy-loaded: LoginPage, SignupPage, DashboardPage, TipsterListPage, TipsterDetailPage, PicksListPage, MyPicksPage

**Fase 2: Component Memoization**
- ✅ React.memo() en PickCard
- ✅ React.memo() en FollowCard
- Previene re-renders innecesarios en listas

**Fase 3: Chart Lazy Loading**
- ✅ Lazy loading de 4 chart components en TipsterDetailPage
- ✅ Suspense con skeleton fallbacks
- Charts: OddsDistributionChart, StakeDistributionChart, SportDistributionChart, PickTypeDistributionChart

**Fase 4: Bundle Analysis**
- ✅ Instalado rollup-plugin-visualizer
- ✅ Generado stats.html con treemap interactivo
- ✅ Identificadas oportunidades de optimización

**Resultados alcanzados**:
- Bundle principal: 1,012 kB → 842 kB (17% reducción)
- Gzipped: 304 kB → 269 kB (11% reducción)
- 7 páginas code-split en chunks separados
- Charts lazy-loaded (solo cuando se necesitan)
- Componentes de lista memoizados

**Oportunidades futuras identificadas**:
- Chart.js tree-shaking: ~100-150 kB adicionales
- Firebase modular imports: ~30-50 kB adicionales
- Potencial total: ~35-40% reducción del bundle original

**Commits**: Ver performance_optimization_walkthrough.md y bundle_analysis_report.md

---

**Duración real**: ~12 horas (11 tareas completadas)

**Estado**: ✅ **COMPLETADA** - 11/11 tareas completadas (100%)

**Pendiente**: Task 5B - Importación desde Excel (POSPUESTO - baja prioridad)

---

## Fase 9: Migración de Datos y Deploy 🚀

**Duración estimada**: 20-30 horas

### Objetivos de la Fase

Esta es la fase más crítica después del desarrollo de features. Aquí se lleva el proyecto React a producción, reemplazando la aplicación vanilla JavaScript actual. Los objetivos principales son:

1. **Migración de datos**: Asegurar que los datos existentes en Firestore sean compatibles con la nueva estructura
2. **Configuración de build para producción**: Optimizar el bundle para producción
3. **Configuración de Firebase Hosting**: Configurar hosting para SPA React
4. **Actualización de CI/CD**: Modificar GitHub Actions para buildear React
5. **Deploy gradual**: Estrategia de deploy sin downtime
6. **Monitoreo**: Configurar alertas y monitoreo post-deploy

**Importante**: Esta fase NO incluye optimizaciones avanzadas. El objetivo es tener el proyecto funcionando en producción lo antes posible. Las optimizaciones se harán en Fase 10 con métricas reales.

---

### 1. Verificación de Compatibilidad de Datos

Antes de hacer cualquier deploy, necesitamos verificar que la estructura de datos de Firestore sea compatible con el código React.

#### 1.1 Análisis de Estructura Actual vs Nueva

**Archivo `scripts/data-compatibility-check.ts`:**
```typescript
/**
 * Script para verificar compatibilidad de datos Firestore
 * Ejecutar ANTES del deploy
 */
import admin from 'firebase-admin';
import * as fs from 'fs';

// Inicializar Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface CompatibilityReport {
  collection: string;
  totalDocuments: number;
  validDocuments: number;
  invalidDocuments: number;
  issues: Array<{
    docId: string;
    field: string;
    issue: string;
    currentValue: any;
  }>;
}

/**
 * Verifica estructura de tipsters
 */
async function checkTipsters(): Promise<CompatibilityReport> {
  const snapshot = await db.collection('tipsters').get();
  const report: CompatibilityReport = {
    collection: 'tipsters',
    totalDocuments: snapshot.size,
    validDocuments: 0,
    invalidDocuments: 0,
    issues: [],
  };

  snapshot.forEach((doc) => {
    const data = doc.data();
    let isValid = true;

    // Verificar campos requeridos
    const requiredFields = ['uid', 'name', 'channel', 'createdDate'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        report.issues.push({
          docId: doc.id,
          field,
          issue: 'Campo requerido faltante',
          currentValue: null,
        });
        isValid = false;
      }
    }

    // Verificar tipos
    if (data.name && typeof data.name !== 'string') {
      report.issues.push({
        docId: doc.id,
        field: 'name',
        issue: 'Tipo incorrecto, debe ser string',
        currentValue: data.name,
      });
      isValid = false;
    }

    // Verificar formato de fecha
    if (data.createdDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.createdDate)) {
      report.issues.push({
        docId: doc.id,
        field: 'createdDate',
        issue: 'Formato de fecha incorrecto, debe ser YYYY-MM-DD',
        currentValue: data.createdDate,
      });
      isValid = false;
    }

    if (isValid) {
      report.validDocuments++;
    } else {
      report.invalidDocuments++;
    }
  });

  return report;
}

/**
 * Verifica estructura de picks
 */
async function checkPicks(): Promise<CompatibilityReport> {
  const snapshot = await db.collection('picks').get();
  const report: CompatibilityReport = {
    collection: 'picks',
    totalDocuments: snapshot.size,
    validDocuments: 0,
    invalidDocuments: 0,
    issues: [],
  };

  snapshot.forEach((doc) => {
    const data = doc.data();
    let isValid = true;

    // Campos requeridos
    const requiredFields = [
      'uid',
      'tipsterId',
      'sport',
      'odds',
      'stake',
      'pickType',
      'betType',
      'date',
      'time',
      'result',
      'isResolved',
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        report.issues.push({
          docId: doc.id,
          field,
          issue: 'Campo requerido faltante',
          currentValue: null,
        });
        isValid = false;
      }
    }

    // Verificar tipos numéricos
    if (data.odds && typeof data.odds !== 'number') {
      report.issues.push({
        docId: doc.id,
        field: 'odds',
        issue: 'Debe ser número',
        currentValue: data.odds,
      });
      isValid = false;
    }

    if (data.stake && typeof data.stake !== 'number') {
      report.issues.push({
        docId: doc.id,
        field: 'stake',
        issue: 'Debe ser número',
        currentValue: data.stake,
      });
      isValid = false;
    }

    // Verificar valores válidos
    const validResults = ['Ganada', 'Perdida', 'Void'];
    if (data.result && !validResults.includes(data.result)) {
      report.issues.push({
        docId: doc.id,
        field: 'result',
        issue: `Valor inválido, debe ser uno de: ${validResults.join(', ')}`,
        currentValue: data.result,
      });
      isValid = false;
    }

    if (isValid) {
      report.validDocuments++;
    } else {
      report.invalidDocuments++;
    }
  });

  return report;
}

/**
 * Verifica estructura de userFollows
 */
async function checkFollows(): Promise<CompatibilityReport> {
  const snapshot = await db.collection('userFollows').get();
  const report: CompatibilityReport = {
    collection: 'userFollows',
    totalDocuments: snapshot.size,
    validDocuments: 0,
    invalidDocuments: 0,
    issues: [],
  };

  snapshot.forEach((doc) => {
    const data = doc.data();
    let isValid = true;

    const requiredFields = [
      'uid',
      'pickId',
      'tipsterId',
      'userOdds',
      'userStake',
      'userResult',
      'userIsResolved',
      'followDate',
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        report.issues.push({
          docId: doc.id,
          field,
          issue: 'Campo requerido faltante',
          currentValue: null,
        });
        isValid = false;
      }
    }

    if (isValid) {
      report.validDocuments++;
    } else {
      report.invalidDocuments++;
    }
  });

  return report;
}

/**
 * Ejecuta todas las verificaciones y genera reporte
 */
async function runCompatibilityCheck() {
  console.log('🔍 Iniciando verificación de compatibilidad de datos...\n');

  const reports: CompatibilityReport[] = [];

  // Verificar cada colección
  console.log('📊 Verificando tipsters...');
  const tipstersReport = await checkTipsters();
  reports.push(tipstersReport);

  console.log('📊 Verificando picks...');
  const picksReport = await checkPicks();
  reports.push(picksReport);

  console.log('📊 Verificando follows...');
  const followsReport = await checkFollows();
  reports.push(followsReport);

  // Generar resumen
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN DE COMPATIBILIDAD');
  console.log('='.repeat(60) + '\n');

  let allValid = true;
  reports.forEach((report) => {
    const percentage = report.totalDocuments > 0
      ? ((report.validDocuments / report.totalDocuments) * 100).toFixed(2)
      : '100';

    console.log(`📁 ${report.collection}:`);
    console.log(`   Total: ${report.totalDocuments}`);
    console.log(`   Válidos: ${report.validDocuments} (${percentage}%)`);
    console.log(`   Inválidos: ${report.invalidDocuments}`);

    if (report.invalidDocuments > 0) {
      allValid = false;
      console.log(`   ⚠️  Issues encontrados: ${report.issues.length}`);
    } else {
      console.log(`   ✅ Todos los documentos son compatibles`);
    }
    console.log('');
  });

  // Guardar reporte detallado
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCollections: reports.length,
      allCompatible: allValid,
    },
    details: reports,
  };

  fs.writeFileSync(
    'data-compatibility-report.json',
    JSON.stringify(reportData, null, 2)
  );

  console.log('📄 Reporte completo guardado en: data-compatibility-report.json\n');

  if (allValid) {
    console.log('✅ RESULTADO: Todos los datos son compatibles. Puedes proceder con el deploy.\n');
  } else {
    console.log('❌ RESULTADO: Se encontraron issues. Revisa el reporte antes del deploy.\n');
    process.exit(1);
  }
}

// Ejecutar
runCompatibilityCheck()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error durante verificación:', error);
    process.exit(1);
  });
```

**Añadir scripts a `package.json`:**

Tu `package.json` actual:
```json
{
  "name": "tipster-tracker",
  "version": "1.0.0",
  "scripts": {
    "dev": "firebase emulators:start --import=./emulator-data --export-on-exit"
  }
}
```

Actualizar a:
```json
{
  "name": "tipster-tracker",
  "version": "1.0.0",
  "scripts": {
    "dev": "firebase emulators:start --import=./emulator-data --export-on-exit",
    "check-data": "ts-node scripts/data-compatibility-check.ts",
    "migrate-data": "ts-node scripts/migrate-data.ts",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.3.0",
    "firebase-admin": "^12.0.0"
  }
}
```

**Ejecutar verificación:**
```bash
npm run check-data
```

---

### 2. Script de Migración de Datos (si es necesario)

Si el check detecta incompatibilidades, crear script de migración:

**Archivo `scripts/migrate-data.ts`:**
```typescript
import admin from 'firebase-admin';

const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Ejemplo: Migrar campo de fecha a nuevo formato
 */
async function migrateDates() {
  const batch = db.batch();
  let count = 0;

  const snapshot = await db.collection('picks').get();

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Si no existe dateTime, crearlo
    if (!data.dateTime && data.date && data.time) {
      const dateTime = `${data.date}T${data.time}:00`;
      batch.update(doc.ref, { dateTime });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`✅ Migrados ${count} documentos`);
  } else {
    console.log('ℹ️  No se requieren migraciones');
  }
}

/**
 * Backup antes de migrar
 */
async function createBackup() {
  console.log('📦 Creando backup de datos...');
  
  const collections = ['tipsters', 'picks', 'userFollows'];
  const backup: any = {};

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    backup[collectionName] = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
  }

  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.json`;

  fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
  console.log(`✅ Backup creado: ${filename}`);
}

async function runMigration() {
  try {
    // 1. Crear backup
    await createBackup();

    // 2. Ejecutar migraciones
    console.log('🔄 Ejecutando migraciones...');
    await migrateDates();
    // Añadir más migraciones si es necesario

    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante migración:', error);
    process.exit(1);
  }
}

runMigration();
```

---

### 3. Configuración de Build para Producción

#### 3.1 Optimizar vite.config.ts

**Archivo `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  build: {
    // Optimizaciones de producción
    outDir: 'dist',
    sourcemap: false, // No generar sourcemaps en producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Chunking manual para mejor caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-charts': ['chart.js'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Tamaño máximo de chunk (500kb)
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 5000,
  },
});
```

#### 3.2 Variables de Entorno

**Archivo `.env.production`:**
```env
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Importante**: Este archivo NO debe estar en git. Tu `.gitignore` actual ya incluye:
```gitignore
# dotenv environment variables file
.env
.env.local
.env.*.local
```

Estos patrones ya cubren `.env.production`, así que **estás protegido** ✅

**Configurar variables en Firebase Hosting:**
```bash
# Las variables de entorno se configuran en Firebase Console o mediante CI/CD
# Tu proyecto actual: tipstertracker-b5e3c
```

---

### 4. Configuración de Firebase Hosting para SPA

#### 4.1 firebase.json

**Tu configuración actual de `firebase.json`:**
```json
{
  "firestore": {
    "database": "(default)",
    "location": "eur3",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "tipstertracker",
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.js",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/javascript"
          }
        ]
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}
```

**Actualizar a esta configuración para React SPA:**
```json
{
  "firestore": {
    "database": "(default)",
    "location": "eur3",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "tipstertracker",
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css|mjs)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          },
          {
            "key": "Content-Type",
            "value": "application/javascript"
          }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      },
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000, immutable"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}
```

**Cambios importantes explicados:**

| Campo | Antes | Después | Razón |
|-------|-------|---------|-------|
| `public` | `"public"` | `"dist"` | Vite buildea en carpeta `dist/` |
| `rewrites` | ❌ No existe | ✅ Añadido | **CRÍTICO**: React Router necesita que todas las rutas redirijan a index.html |
| `headers` | Solo Content-Type para JS | Headers completos de cache | Optimización de cache para assets estáticos |
| `site` | `"tipstertracker"` | ✅ Mantener | Tu sitio actual, no cambiar |
| `firestore.location` | `"eur3"` | ✅ Mantener | Tu región actual (Europa) |
| `emulators` | Configurado | ✅ Mantener | Emuladores ya configurados correctamente |

**⚠️ Cambio CRÍTICO - Rewrites:**

Sin la sección `rewrites`, cuando un usuario visite directamente `https://tipstertracker.web.app/tipsters/123` obtendrá un error 404. React Router necesita que TODAS las rutas sirvan el `index.html` y luego React Router se encarga del routing del lado del cliente.

```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

Esto significa:
- `/` → index.html ✅
- `/login` → index.html → React Router renderiza Login ✅
- `/tipsters` → index.html → React Router renderiza Tipsters ✅
- `/tipsters/abc123` → index.html → React Router renderiza TipsterDetail ✅

**Estrategia de Cache (Headers):**

1. **Assets estáticos con hash** (generados por Vite):
   - Archivos: `main.a1b2c3d4.js`, `styles.x9y8z7.css`
   - Cache: 1 año + immutable
   - Razón: El hash cambia cuando cambia el contenido, cache seguro

2. **index.html**:
   - Cache: NO cache
   - Razón: Debe servir siempre la última versión con referencias a nuevos hashes

3. **Imágenes y assets en /assets/**:
   - Cache: 1 año + immutable
   - Razón: Vite hashea los assets importados

**Mantener configuración actual de:**
- ✅ `site: "tipstertracker"` - Tu dominio Firebase
- ✅ `firestore.location: "eur3"` - Tu región
- ✅ `emulators.singleProjectMode: true` - Configuración actual
- ✅ Puertos de emuladores (9099, 8080, 5000)

**Flujo de actualización:**

```bash
# 1. Backup del firebase.json actual
cp firebase.json firebase.json.backup

# 2. Actualizar firebase.json con la nueva configuración

# 3. Testear localmente con emuladores
npm run build
firebase emulators:start

# 4. Verificar que las rutas funcionan:
#    - http://localhost:5000/
#    - http://localhost:5000/tipsters
#    - http://localhost:5000/picks
#    - Todas deben servir la app React

# 5. Si todo funciona, hacer deploy
firebase deploy --only hosting
```

---

### 5. Actualización de CI/CD Pipeline

#### 5.1 GitHub Actions para Deploy Automático

**Archivo `.github/workflows/firebase-hosting-merge.yml`:**
```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.production
        run: |
          echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env.production
          echo "VITE_FIREBASE_AUTH_DOMAIN=${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}" >> .env.production
          echo "VITE_FIREBASE_PROJECT_ID=${{ secrets.VITE_FIREBASE_PROJECT_ID }}" >> .env.production
          echo "VITE_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}" >> .env.production
          echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}" >> .env.production
          echo "VITE_FIREBASE_APP_ID=${{ secrets.VITE_FIREBASE_APP_ID }}" >> .env.production
          echo "VITE_FIREBASE_MEASUREMENT_ID=${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}" >> .env.production

      - name: Build
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C }}'
          channelId: live
          projectId: tipstertracker-b5e3c
```

**Archivo `.github/workflows/firebase-hosting-pull-request.yml`:**
```yaml
name: Deploy to Firebase Hosting on PR
on: pull_request

jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.production
        run: |
          echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env.production
          echo "VITE_FIREBASE_AUTH_DOMAIN=${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}" >> .env.production
          echo "VITE_FIREBASE_PROJECT_ID=${{ secrets.VITE_FIREBASE_PROJECT_ID }}" >> .env.production
          echo "VITE_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}" >> .env.production
          echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}" >> .env.production
          echo "VITE_FIREBASE_APP_ID=${{ secrets.VITE_FIREBASE_APP_ID }}" >> .env.production
          echo "VITE_FIREBASE_MEASUREMENT_ID=${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}" >> .env.production

      - name: Build
        run: npm run build

      - name: Deploy to Firebase Hosting Preview Channel
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C }}'
          projectId: tipstertracker-b5e3c
```

#### 5.2 Configurar Secrets en GitHub

**En GitHub Repository Settings > Secrets and variables > Actions:**

Añadir secrets:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C (JSON completo de service account)
```

**✅ Ya tienes configurado**: `FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C` en tu workflow actual

**⚠️ Importante**: El nombre del secret debe coincidir exactamente con el usado en el workflow:
```yaml
firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C }}'
```

---

### 6. Estrategia de Deploy sin Downtime

#### 6.1 Deploy Gradual (Blue-Green Deployment)

**Paso 1: Deploy a canal de preview**
```bash
# Build local
npm run build

# Deploy a canal preview
firebase hosting:channel:deploy preview
```

**Paso 2: Testing en preview**
- URL: `https://tipstertracker--preview-xxx.web.app`
- URL alternativa: `https://tipstertracker-b5e3c--preview-xxx.web.app`
- Verificar todas las funcionalidades
- Testing con usuarios beta

**Paso 3: Deploy a producción**
```bash
# Si preview está OK, deploy a live
firebase deploy --only hosting

# URL de producción:
# https://tipstertracker.web.app
# https://tipstertracker.firebaseapp.com
```

#### 6.2 Rollback Plan

**Si algo sale mal después del deploy:**

```bash
# Ver versiones anteriores
firebase hosting:releases:list

# Rollback a versión anterior
firebase hosting:rollback
```

**Rollback automático en GitHub Actions:**
```yaml
# Añadir step de health check
- name: Health Check
  run: |
    sleep 30  # Esperar 30s
    curl -f https://your-project.web.app || exit 1

# Si falla, hacer rollback
- name: Rollback on failure
  if: failure()
  run: firebase hosting:rollback
```

---

### 7. Monitoreo Post-Deploy

#### 7.1 Firebase Performance Monitoring

**Instalar SDK:**
```bash
npm install firebase/performance
```

**Configurar en `src/core/config/firebase.config.ts`:**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Performance Monitoring (solo en producción)
if (import.meta.env.PROD) {
  export const perf = getPerformance(app);
}
```

#### 7.2 Error Tracking con Sentry (opcional)

**Instalar Sentry:**
```bash
npm install @sentry/react
```

**Configurar en `src/main.tsx`:**
```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'your-sentry-dsn',
    environment: 'production',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

#### 7.3 Analytics

**Ya configurado en Firebase config:**
```typescript
import { getAnalytics } from 'firebase/analytics';

if (import.meta.env.PROD) {
  export const analytics = getAnalytics(app);
}
```

#### 7.4 Alertas y Notificaciones

**Configurar alertas en Firebase Console:**
1. Performance > Configurar alertas
2. Crashlytics > Configurar notificaciones
3. Hosting > Configurar notificaciones de deploy

---

### 8. Archivos de Configuración Firebase (Mantener)

**⚠️ Importante**: Tu proyecto ya tiene configuración Firebase que debe **MANTENERSE** durante la migración:

#### Archivos que YA EXISTEN y NO deben modificarse:

✅ **`.firebaserc`** - Configuración de proyecto:
```json
{
  "projects": {
    "default": "tipstertracker-b5e3c"
  }
}
```
- **Acción**: MANTENER sin cambios
- **Razón**: Define tu proyecto Firebase actual

✅ **`firestore.rules`** - Reglas de seguridad:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tipsters/{tipsterId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
    // ... resto de reglas
  }
}
```
- **Acción**: MANTENER sin cambios
- **Razón**: Reglas correctas, funcionan para React también

✅ **`firestore.indexes.json`** - Índices Firestore:
```json
{
  "indexes": [],
  "fieldOverrides": []
}
```
- **Acción**: MANTENER, puede requerir actualización si se añaden queries complejas
- **Razón**: Los índices se crearán automáticamente según necesidad

✅ **`.github/workflows/firebase-hosting-main.yml`** - CI/CD actual:
```yaml
name: Deploy to Firebase Hosting on push to main
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C }}'
          channelId: live
          projectId: tipstertracker-b5e3c
```
- **Acción**: ACTUALIZAR para incluir build de Vite (ver sección 5.1)
- **Razón**: Actualmente no hace build, solo deploy

✅ **`.gitignore`** - Ya protege archivos sensibles:
- Incluye `.env`, `.env.local`, `.env.*.local` ✅
- Incluye `firebase.config.js` ✅
- Incluye `emulator-data/` ✅
- Incluye `.firebase/` ✅
- Incluye `dist/` (carpeta de build) ✅
- **Acción**: Ya está completo, no requiere cambios

✅ **`emulator-data/`** - Datos de desarrollo:
- Contiene `auth_export/` con cuentas de prueba
- Contiene `firestore_export/` con datos de prueba
- **Acción**: MANTENER, útil para desarrollo de React
- **Razón**: Permite testear migración con datos reales

#### Flujo de archivos durante migración:

```
Fase 0-8 (Desarrollo React):
├── Mantener firebase.json (actualizado para React en Fase 9)
├── Mantener .firebaserc
├── Mantener firestore.rules
├── Mantener emulator-data/ (para testing)
├── Mantener .gitignore
└── Actualizar .github/workflows/ (añadir build step)

Fase 9 (Deploy):
├── firebase.json → Actualizado (public: dist, rewrites añadidos)
├── package.json → Actualizado (scripts de build)
└── GitHub Actions → Actualizado (build + deploy)
```

#### Comandos útiles con tu configuración actual:

```bash
# Desarrollo actual (vanilla JS)
npm run dev
# → Inicia emuladores con datos de emulator-data/
# → Al cerrar, exporta cambios automáticamente

# Después de migración (React)
npm run dev  # Vite dev server
npm run emulators  # Emuladores Firebase (renombrar script)

# Testing con emuladores
firebase emulators:start --import=./emulator-data --export-on-exit

# Deploy
firebase deploy --only hosting

# Ver proyecto en Firebase Console
firebase open hosting:site
# → Abrirá: https://console.firebase.google.com/project/tipstertracker-b5e3c
```

---

### 9. Checklist Pre-Deploy

#### Verificaciones Técnicas
- [ ] Ejecutar `npm run check-data` sin errores
- [ ] Ejecutar `npm run build` exitosamente
- [ ] Verificar que bundle size < 500KB por chunk
- [ ] No hay console.logs en producción
- [ ] Variables de entorno configuradas
- [ ] Firebase config correcto en `.env.production`
- [ ] Secrets configurados en GitHub Actions
- [ ] `.env.production` en `.gitignore`

#### Verificaciones de Funcionalidad
- [ ] Login/Signup funciona
- [ ] Dashboard carga correctamente
- [ ] CRUD de tipsters funciona
- [ ] CRUD de picks funciona
- [ ] Follows funciona
- [ ] Navegación entre páginas funciona
- [ ] Gráficos Chart.js se renderizan
- [ ] Filtros funcionan correctamente
- [ ] Real-time updates funcionan

#### Verificaciones de Firebase
- [ ] Firestore rules actualizadas
- [ ] Firestore indexes creados
- [ ] Firebase Hosting configurado
- [ ] Authentication habilitado
- [ ] Dominios personalizados configurados (si aplica)

#### Verificaciones de Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No memory leaks en navegación

#### Backup y Rollback
- [ ] Backup de datos creado
- [ ] Plan de rollback documentado
- [ ] Versión anterior accesible
- [ ] Contactos de soporte disponibles

---

### 10. Comandos de Deploy

#### Deploy Manual (Primera vez)

```bash
# 1. Verificar datos
npm run check-data

# 2. Build local
npm run build

# 3. Preview local del build
npm run preview

# 4. Deploy a canal preview
firebase hosting:channel:deploy preview

# 5. Verificar preview en navegador
# URL: https://tipstertracker--preview-xxx.web.app

# 6. Si todo OK, deploy a producción
firebase deploy --only hosting

# 7. Verificar producción
# URL: https://tipstertracker.web.app
# URL alternativa: https://tipstertracker.firebaseapp.com

# 8. Verificar proyecto en Firebase Console
# Proyecto: tipstertracker-b5e3c
# Región Firestore: eur3 (Europa)
```

#### Deploy Automático (CI/CD)

```bash
# Push a main → deploy automático
git add .
git commit -m "feat: deploy react app to production"
git push origin main

# GitHub Actions ejecutará:
# 1. Install dependencies
# 2. Build
# 3. Deploy to Firebase Hosting
# 4. Notificación de resultado
```

---

### 11. Post-Deploy Checklist

#### Inmediatamente después del deploy
- [ ] Verificar homepage carga (/)
- [ ] Verificar login funciona
- [ ] Crear tipster de prueba
- [ ] Crear pick de prueba
- [ ] Verificar dashboard actualiza
- [ ] Verificar navegación completa
- [ ] Verificar en diferentes navegadores
- [ ] Verificar en mobile

#### Primeras 24 horas
- [ ] Monitorear Firebase Performance
- [ ] Revisar errores en Sentry (si configurado)
- [ ] Verificar Analytics de Firebase
- [ ] Monitorear uso de Firestore
- [ ] Verificar feedback de usuarios
- [ ] Revisar métricas de carga

#### Primera semana
- [ ] Analizar Core Web Vitals
- [ ] Identificar cuellos de botella (para Fase 10)
- [ ] Recopilar feedback de usuarios
- [ ] Documentar issues encontrados
- [ ] Planificar optimizaciones

---

### 12. Troubleshooting Común

#### Error: "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

#### Error: Routes no funcionan después de refresh
- Verificar `rewrites` en firebase.json
- Debe tener: `"source": "**", "destination": "/index.html"`

#### Error: Variables de entorno undefined
- Verificar que tengan prefijo `VITE_`
- Verificar archivo `.env.production` existe
- Verificar secrets en GitHub Actions

#### Error: Firebase not initialized
- Verificar credenciales en `.env.production`
- Verificar import de firebase config

#### Error: CORS en API calls
- Verificar dominio en Firebase Console > Authentication > Settings
- Añadir dominios autorizados:
  - `tipstertracker.web.app`
  - `tipstertracker.firebaseapp.com`
  - `localhost:3000` (desarrollo)
  - `localhost:5000` (emulators)

#### Error: Emulators no guardan datos
- Tu script actual ya tiene `--export-on-exit` ✅
- Verifica que existe carpeta `emulator-data/`
- Al cerrar emuladores, datos se exportan automáticamente

---

### 13. Métricas de Éxito

**KPIs a monitorear post-deploy:**

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| First Contentful Paint | < 2s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Lighthouse Score | > 90 | Lighthouse |
| Crash-free rate | > 99% | Sentry/Firebase |
| Firestore reads/day | < 50k (gratis tier) | Firebase Console |
| Bundle size | < 500KB | Build output |
| User satisfaction | > 4/5 | Feedback forms |

---

### Resumen de la Fase 9

**Completado:**
✅ Script de verificación de compatibilidad de datos
✅ Script de migración de datos (si necesario)
✅ Configuración optimizada de Vite para producción
✅ Variables de entorno (.env.production)
✅ Configuración de Firebase Hosting para SPA
✅ GitHub Actions para CI/CD automático
✅ Estrategia de deploy gradual (preview → live)
✅ Plan de rollback
✅ Configuración de monitoreo (Performance, Analytics)
✅ Error tracking (Sentry opcional)
✅ Checklist completo pre-deploy
✅ Comandos de deploy (manual y automático)
✅ Post-deploy checklist
✅ Troubleshooting común
✅ Métricas de éxito

**Duración real estimada**: 20-30 horas

**Archivos creados/modificados**:
- `scripts/data-compatibility-check.ts`
- `scripts/migrate-data.ts`
- `vite.config.ts` (optimizado)
- `.env.production` (gitignored)
- `firebase.json` (actualizado para SPA)
- `.github/workflows/firebase-hosting-merge.yml`
- `.github/workflows/firebase-hosting-pull-request.yml`
- `src/core/config/firebase.config.ts` (con Performance Monitoring)

**Importante**: Esta fase es CRÍTICA. Sin ella, el proyecto React solo existe en tu máquina local. Una vez completada, tendrás:
- Proyecto React en producción
- CI/CD automático funcionando
- Monitoreo activo
- Estrategia de rollback lista
- Datos verificados y migrados
- Zero downtime deployment

**Próxima fase**: Fase 10 (Optimización y Performance) se ejecutará CON MÉTRICAS REALES de producción para optimizar lo que realmente lo necesita.

---

## 📍 Estado Actual del Proyecto

### Estructura del Repositorio
```
tipster-tracker/
├── public/              # ← Proyecto ORIGINAL (vanilla JS)
├── react-app/           # ← Proyecto REACT (migración)
├── AGENTS.md            # Documentación proyecto original
├── MIGRATION-GUIDE.md   # Esta guía de migración
└── firebase.json        # Configuración Firebase compartida
```

### Ubicación del Proyecto React
El proyecto React migrado se encuentra en: `./react-app/`

### Comandos Útiles
```bash
# Proyecto original (vanilla JS)
firebase emulators:start --import=./emulator-data --export-on-exit
# Sirve public/ en http://localhost:5000

# Proyecto React (nuevo)
cd react-app/
npm install              # Primera vez
npm run dev              # http://localhost:5173
```

### Fases Completadas
- ✅ **Fase 0**: Setup inicial completo (14/11/2025)
- ✅ **Fase 4**: Feature Tipsters completo (17/11/2025)
- ✅ **Subfase 11.1**: Eliminación TipsterListPage (24/11/2025)
- ✅ **Subfase 11.2 - Fase 1**: Settings Backend (24/11/2025)

### Features Implementadas
- ✅ **Auth**: Login, Signup, PrivateRoute
- ✅ **Tipsters**: CRUD completo, búsqueda, filtros
- ✅ **Picks**: CRUD completo, filtros, estadísticas
- ✅ **Follows**: Seguimiento de picks, estadísticas personales
- ✅ **Dashboard**: Vista general, filtros, estadísticas
- ✅ **Settings**: Backend para configuración personalizada (sports, bookmakers, channels)

### Próxima Fase
- 📋 **Subfase 11.2 - Fase 2**: UI Components para Settings (ManageableDropdown, modals)

---

## 🎯 Fase 4 - Feature Tipsters (COMPLETADO)

**Fecha de inicio**: 14/11/2025  
**Fecha de finalización**: 17/11/2025  
**Duración**: 3 días  
**Estado**: ✅ Completado y validado

### Resumen

Primera feature completa implementada con arquitectura feature-based, siguiendo principios SOLID y patrón Repository. Incluye CRUD completo de tipsters con persistencia en Firestore, búsqueda, filtros, y vista de detalle.

### Objetivos Alcanzados

#### 1. **Arquitectura Feature-Based** ✅
```
features/tipsters/
├── types/
│   └── tipster.types.ts          # TypeScript interfaces
├── components/
│   ├── TipsterCard/              # Card para lista
│   ├── TipsterModal/             # Modal create/edit
│   └── TipsterStats/             # Estadísticas (placeholder)
├── pages/
│   ├── TipsterListPage.tsx       # Lista con filtros
│   └── TipsterDetailPage.tsx     # Detalle completo
├── hooks/
│   ├── useTipsters.ts            # CRUD operations
│   └── useTipsterDetail.ts       # Single tipster data
├── services/
│   └── tipster.service.ts        # Business logic
├── repositories/
│   └── tipster.repository.ts     # Firebase abstraction
└── index.ts                      # Public exports
```

#### 2. **CRUD Completo** ✅
- **Create**: Modal con validación + Firestore insert
- **Read**: Lista reactiva con onSnapshot listener
- **Update**: Modal edit con datos pre-cargados
- **Delete**: Confirmación + eliminación con navegación

#### 3. **Funcionalidades** ✅
- Búsqueda por nombre (case-insensitive)
- Filtro por canal (dropdown nativo)
- Real-time sync con Firestore
- Persistencia en emuladores
- Loading states durante operaciones async
- Error handling con feedback visual

#### 4. **Vista de Detalle** ✅

**Estructura de Tabs** (reorganizada 17/11/2025):

- **Tab 1: Estadísticas**
  - Estadísticas generales del tipster
  - Historial completo de picks
  - (Placeholders para Fase 5)

- **Tab 2: Mis Estadísticas**
  - Comparación tipster vs mis follows
  - Tabla de picks seguidas por el usuario
  - (Placeholders para Fase 6)

**Nota UX**: Originalmente se diseñaron 4 tabs (Stats, My Stats, Follows, Historial) pero se consolidaron en 2 para mejorar la jerarquía de información y agrupar datos lógicamente por propietario (datos del tipster vs datos del usuario).

### Patrones Implementados

#### 1. **Repository Pattern**
```typescript
// Abstracción completa de Firebase
class TipsterRepository {
  async create(data: CreateTipsterDTO): Promise<Tipster>
  async findAll(uid: string): Promise<Tipster[]>
  async findById(id: string): Promise<Tipster | null>
  async update(id: string, data: UpdateTipsterDTO): Promise<void>
  async delete(id: string): Promise<void>
  onSnapshot(uid: string, callback: (tipsters: Tipster[]) => void)
}
```

#### 2. **Custom Hooks Pattern**
```typescript
// Encapsulación de lógica y estado
const useTipsters = () => {
  const [tipsters, setTipsters] = useState<Tipster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // CRUD operations
  const createTipster = async (data) => { ... }
  const updateTipster = async (id, data) => { ... }
  const deleteTipster = async (id) => { ... }
  
  return { tipsters, loading, error, createTipster, updateTipster, deleteTipster }
}
```

#### 3. **Separation of Concerns**
- **Components**: Solo presentación y eventos
- **Hooks**: Estado y lógica de negocio
- **Services**: Transformaciones y validaciones
- **Repositories**: Acceso a datos

### Commits Realizados

1. **3002502** - `feat(phase-4): Implement Tipsters feature complete`
   - Estructura completa del feature
   - CRUD operations
   - Componentes y páginas
   - Hooks y repositories

2. **b1f4851** - `fix: navigation and UI spacing improvements`
   - React Router navigation implementada
   - PrivateRoute redirect funcionando
   - Spacing mejorado en controles (px-4 → px-5, py-2 → py-2.5)
   - Dropdown width aumentado (w-48 → w-56)

3. **0e445e0** - `fix: connect update and delete operations in TipsterDetailPage`
   - Connected useTipsters hook a TipsterDetailPage
   - Edit modal actualiza correctamente
   - Delete con confirmación funcionando

4. **7fff367** - `chore: remove debug console.logs after Phase 4 validation`
   - Limpieza de logs de debugging
   - Código production-ready

5. **579e3f2** - `refactor: reorganize tipster detail tabs for better UX`
   - De 4 tabs a 2 tabs
   - Mejor jerarquía de información
   - Agrupación lógica por propietario de datos

### Bugs Resueltos

#### 1. **Auth Navigation**
- **Problema**: Login/signup no navegaban al dashboard
- **Causa**: TODOs sin implementar en handlers
- **Solución**: Implementado con `useNavigate()` de React Router
- **Archivos**: LoginPage.tsx, SignupPage.tsx

#### 2. **PrivateRoute Redirect**
- **Problema**: No redirigía a login
- **Causa**: Retornaba `null` en lugar de `<Navigate />`
- **Solución**: Usar componente Navigate con replace
- **Archivo**: PrivateRoute.tsx

#### 3. **Loading State Infinito**
- **Problema**: Login exitoso pero spinner infinito
- **Causa**: `AuthProvider.login()` seteaba `loading: true` y nunca lo reseteaba
- **Solución**: Dejar que solo `onAuthStateChanged` maneje el estado loading
- **Archivo**: AuthProvider.tsx (features/auth)

#### 4. **UI Spacing Insuficiente**
- **Problema**: Texto truncado ("Tod..."), controles apretados
- **Causa**: Padding muy pequeño (px-4 py-2)
- **Solución**: Aumentado a px-5 py-2.5 en todos los controles
- **Archivos**: Button.tsx, Dropdown.tsx, Input.tsx, TipsterListPage.tsx

#### 5. **Edit/Delete No Funcionaban**
- **Problema**: Botones sin conectar a funciones reales
- **Causa**: Console.logs en lugar de llamadas a hooks
- **Solución**: Conectar useTipsters hook en TipsterDetailPage
- **Archivo**: TipsterDetailPage.tsx

### Validación Completada

**Checklist de 8 pasos validado por usuario**:
1. ✅ Login y navegación al dashboard
2. ✅ Crear nuevo tipster
3. ✅ Verificar en lista
4. ✅ Ver detalle
5. ✅ Buscar por nombre
6. ✅ Editar nombre/canal
7. ✅ Eliminar tipster
8. ✅ Verificar persistencia en Firestore Emulator UI

**Quote del usuario**: *"todo perfecto si"*

### Métricas

- **Archivos creados**: 23
- **Líneas de código**: ~1,300
- **Componentes**: 3 (TipsterCard, AddTipsterModal, TipsterStats placeholder)
- **Pages**: 2 (TipsterListPage, TipsterDetailPage)
- **Hooks**: 2 (useTipsters, useTipsterDetail)
- **Services**: 1 (tipster.service)
- **Repositories**: 1 (tipster.repository)
- **Tests**: 0 (pendiente para Fase de Testing)

### Configuración Firebase

**Emulators activos**:
- Auth: `localhost:9099`
- Firestore: `localhost:8080`
- Emulator UI: `localhost:4000`

**Comando de inicio**:
```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

### Datos de Prueba

**Estructura de documento Tipster en Firestore**:
```typescript
{
  id: string              // Auto-generado por Firestore
  uid: string             // User ID (Firebase Auth)
  name: string            // Nombre del tipster
  channel: Channel        // "Telegram" | "BlogaBet" | etc.
  createdDate: string     // ISO format (YYYY-MM-DD)
  lastPickDate?: string   // ISO format (calculado en Fase 5)
}
```

**Reglas de seguridad**:
```javascript
match /tipsters/{tipsterId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.uid;
}
```

### Lecciones Aprendidas

1. **Single Source of Truth**: Dejar que `onAuthStateChanged` maneje el estado de auth previene race conditions
2. **Repository Pattern**: Abstracción completa de Firebase facilita testing y cambios futuros
3. **Custom Hooks**: Encapsulación limpia de lógica permite reutilización
4. **UI Spacing**: Pequeños ajustes de padding mejoran enormemente la UX
5. **Tab Organization**: Menos tabs con mejor agrupación > Más tabs dispersas

### Próximos Pasos

**Fase 5 - Feature Picks**: ✅ **COMPLETADA** (ver sección siguiente)

**Dependencias resueltas**:
- ✅ Auth funcionando
- ✅ Firebase emulators configurados
- ✅ Repository pattern establecido
- ✅ Custom hooks pattern validado
- ✅ UI components testeados

---

## 📦 FASE 5: Feature Picks - COMPLETADA

**Fecha de completación**: 17 de Noviembre de 2025  
**Duración real**: 1 día intensivo  
**Branch**: `migration/phase-0-setup`  
**Commits**: 6 commits (e7dc5c6, b116c1f, 1e55a54, fe5dd6b, fcd4a53, + fix onSnapshot)

### Resumen Ejecutivo

Se implementó el feature completo de gestión de picks (pronósticos), incluyendo:
- CRUD completo con Repository Pattern
- Sistema de filtrado multi-criterio avanzado
- Cálculo de 10 métricas estadísticas en tiempo real
- Integración completa con tipsters
- Navegación consistente con Layout component
- **Real-time updates** con Firestore `onSnapshot`

### Objetivos Cumplidos

✅ **1. Repository y Tipos**
- PickRepository con 20+ métodos (pre-existente)
- Tipos TypeScript completos: Pick, CreatePickDTO, UpdatePickDTO
- Modelo con 13 campos + relación tipsterId

✅ **2. Custom Hooks**
- `usePicks`: CRUD operations con onSnapshot para real-time updates
- `usePicksByTipster`: Hook filtrado read-only para detalles de tipster

✅ **3. Componentes**
- `PickTableRow`: 11 columnas, cálculo de profit, badges coloreados
- `AddPickModal`: Formulario completo con 12 campos y validaciones
- `PicksListPage`: Página principal con filtros y stats

✅ **4. Integración con Tipsters**
- TipsterDetailPage muestra 10 stat cards reales
- Historial completo de picks del tipster
- Botón "Añadir Pick" pre-selecciona tipster

✅ **5. Navegación**
- Layout component con navbar persistente
- 3 links: Dashboard, Tipsters, Picks
- Active route highlighting
- User email + logout button

✅ **6. Estadísticas**
- Utility `calculateTipsterStats`: 10 métricas
- Winrate, Yield, Profit, Total Staked, Avg Odds, Avg Stake
- Distribución por resultado (Won, Lost, Void, Pending)

✅ **7. Filtrado Avanzado**
- Search por nombre de match
- Filter por Tipster (dropdown)
- Filter por Sport (dropdown)
- Filter por Result (dropdown)
- Stats cards reactivas a filtros

✅ **8. Real-time Updates**
- onSnapshot listener en `usePicks`
- Sincronización automática cross-tab
- Sin necesidad de refresh manual

### Estructura de Archivos Creados

```
react-app/src/features/picks/
├── hooks/
│   ├── usePicks.ts                    # 183 lines - CRUD + onSnapshot
│   └── usePicksByTipster.ts           # 71 lines - Filtered hook
├── components/
│   ├── PickTableRow/
│   │   ├── PickTableRow.tsx           # 165 lines - 11 columns
│   │   ├── PickTableRow.types.ts
│   │   └── index.ts
│   └── AddPickModal/
│       ├── AddPickModal.tsx           # 480 lines - Complete form
│       ├── AddPickModal.types.ts
│       └── index.ts
├── pages/
│   └── PicksListPage/
│       ├── PicksListPage.tsx          # 406 lines - Main page
│       └── index.ts
├── utils/
│   └── sport-icons.ts                 # 25 lines - Emoji mapping
└── services/
    └── pick-repository.ts             # 299 lines (pre-existing)

react-app/src/features/tipsters/
└── utils/
    └── calculate-stats.ts             # 95 lines - Statistics utility

react-app/src/shared/components/layout/
└── Layout.tsx                         # 115 lines - App layout + navbar
```

### Detalles de Implementación

#### 1. Modelo de Datos Pick

```typescript
interface Pick {
  id: string;
  uid: string;
  tipsterId: string;           // FK a Tipster
  match: string;
  sport: Sport;                // Enum: 16 deportes
  pickType: PickType;          // Pre | Live | Combinado
  betType: string;             // Descripción libre
  bookmaker: Bookmaker;        // Enum: 10 casas
  odds: number;                // > 1.0
  stake: number;               // 1-10
  date: string;                // YYYY-MM-DD
  time: string;                // HH:MM
  dateTime: string;            // ISO completo (para ordenación)
  result: PickResult;          // Ganada | Perdida | Void | Pendiente
  isResolved: boolean;         // Auto-calculado: result !== 'Pendiente'
  comments?: string;           // Opcional
  status?: string;             // Legacy: 'Seguido' | 'No Seguido'
}
```

#### 2. Hook usePicks con onSnapshot

**Problema original**: Las picks creadas no aparecían en la lista.

**Causa**: El hook usaba fetch manual sin listener en tiempo real.

**Solución implementada**:
```typescript
// Setup real-time listener
useEffect(() => {
  if (!user?.uid) return;

  const picksQuery = query(
    collection(db, 'picks'),
    where('uid', '==', user.uid),
    orderBy('dateTime', 'desc')
  );

  const unsubscribe = onSnapshot(
    picksQuery,
    (snapshot) => {
      const picksData: Pick[] = [];
      for (const doc of snapshot.docs) {
        picksData.push({ id: doc.id, ...doc.data() } as Pick);
      }
      setPicks(picksData);
      setLoading(false);
    },
    (err) => {
      setError(err.message);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, [user?.uid]);
```

**Beneficios**:
- ✅ CRUD sin actualizaciones manuales de estado
- ✅ Sincronización cross-tab automática
- ✅ Consistencia con proyecto vanilla JS original
- ✅ Código más limpio y mantenible

#### 3. AddPickModal - Formulario Completo

**12 campos con validaciones**:
1. Tipster (select, required)
2. Match (text, required)
3. Sport (select, required)
4. Pick Type (select, required)
5. Bet Type (text, required)
6. Bookmaker (select, required)
7. Odds (number, > 1.0, required)
8. Stake (number, 1-10, required)
9. Date (date, required)
10. Time (time, required)
11. Result (select, default: Pendiente)
12. Comments (textarea, optional)

**Auto-cálculos**:
- `isResolved = result !== 'Pendiente'`
- `dateTime = combineDateTimeISO(date, time)`

**Modos**:
- **Create**: Modal vacío con fecha de hoy
- **Edit**: Pre-rellena todos los campos con pick existente

#### 4. PicksListPage - Página Principal

**Secciones**:

1. **Stats Cards** (5 cards):
   - Total Picks
   - Picks Resueltas
   - Picks Pendientes
   - Picks Ganadas
   - Winrate (%)

2. **Filtros** (4 dropdowns + search):
   - Search: Busca en match name
   - Tipster: Multi-select por tipster
   - Sport: Multi-select por deporte
   - Result: Ganada/Perdida/Void/Pendiente

3. **Tabla de Picks** (11 columnas):
   - Fecha
   - Tipster (name)
   - Match
   - Sport (emoji icon)
   - Pick Type
   - Bet Type
   - Odds
   - Stake
   - Bookmaker
   - Result (badge)
   - Profit (colored)
   - Actions (Edit/Delete)

**Optimizaciones**:
- `useMemo` para filteredPicks y stats calculation
- Real-time filtering sin debounce (instantáneo)

#### 5. TipsterDetailPage - Integración

**Tab Stats mejorado**:
- 10 stat cards con datos reales (antes placeholders)
- Historial completo de picks en tabla
- Botón "Añadir Pick" (pre-selecciona tipster actual)

**Métricas calculadas**:
```typescript
{
  totalPicks: number,
  resolvedPicks: number,
  pendingPicks: number,
  wonPicks: number,
  lostPicks: number,
  voidPicks: number,
  winrate: number,        // %
  yield: number,          // %
  profit: number,         // units
  totalStaked: number,    // units
  avgOdds: number,
  avgStake: number
}
```

**Cálculo de profit**:
```typescript
if (result === 'Ganada') {
  profit = (odds - 1) * stake;
} else if (result === 'Perdida') {
  profit = -stake;
} else if (result === 'Void') {
  profit = 0;
}
```

#### 6. Layout Component - Navegación

**Características**:
- Navbar sticky con max-w-7xl container
- Logo SVG + 3 navigation links
- Active route highlighting (bg-blue-600)
- User email display
- Logout button
- Responsive design

**Rutas**:
- `/` → Dashboard (pendiente implementación)
- `/tipsters` → TipsterListPage
- `/picks` → PicksListPage

### Validaciones Implementadas

#### Validaciones de Formulario

```typescript
// Odds
if (odds <= 1) {
  error = 'La cuota debe ser mayor a 1.0';
}

// Stake
if (stake < 1 || stake > 10) {
  error = 'El stake debe estar entre 1 y 10';
}

// Campos requeridos
if (!tipsterId || !match || !sport || !pickType || 
    !betType || !bookmaker || !date || !time) {
  error = 'Todos los campos son requeridos';
}
```

#### Validaciones TypeScript

- Enums estrictos para Sport, PickType, PickResult, Bookmaker
- Número mínimo/máximo en inputs HTML5
- Type guards en utils

### Testing Manual Realizado

✅ **CRUD Operations**:
- Crear nueva pick → Aparece inmediatamente en lista
- Editar pick existente → Actualiza sin refresh
- Eliminar pick → Desaparece con confirmación
- Modal pre-rellena correctamente en edit mode

✅ **Real-time Updates**:
- Crear pick en tab 1 → Aparece en tab 2 automáticamente
- Editar en una tab → Actualiza en todas las tabs abiertas
- Eliminar → Sincroniza cross-tab

✅ **Filtrado**:
- Search por match → Filtra instantáneamente
- Filtro por tipster → Solo muestra picks del tipster seleccionado
- Filtro por sport → Agrupa por deporte correctamente
- Filtro por resultado → Separa Ganadas/Perdidas/Void/Pendientes
- Combinar filtros → AND logic funciona bien
- Clear filters → Resetea a vista completa

✅ **Estadísticas**:
- Stats cards calculan correctamente
- Winrate: (wonPicks / resolvedPicks) * 100
- Yield: (profit / totalStaked) * 100
- Profit con color verde/rojo según signo
- TipsterDetailPage muestra métricas reales

✅ **Navegación**:
- Links navbar funcionan correctamente
- Active route se resalta en azul
- Back button en TipsterDetail regresa a lista
- Layout persiste en todas las páginas

✅ **Validaciones**:
- Odds < 1.0 → Muestra error
- Stake fuera de 1-10 → Bloquea submit
- Campos vacíos → Previene guardar
- Inputs type="date" y type="time" nativos HTML5

✅ **Edge Cases**:
- Sin picks → Empty state correcto
- Sin tipsters → No permite crear pick
- Pick sin resultado → Marca como Pendiente
- Comentarios vacíos → Guarda correctamente

### Métricas de la Fase

**Código escrito**:
- TypeScript: ~1,800 líneas nuevas
- Componentes: 3 componentes nuevos (PickTableRow, AddPickModal, PicksListPage)
- Hooks: 2 hooks (usePicks, usePicksByTipster)
- Utils: 2 utilities (sport-icons, calculate-stats)
- Layout: 1 component (Layout)

**Commits**:
1. `e7dc5c6` - Hooks (usePicks, usePicksByTipster) + PickTableRow
2. `b116c1f` - AddPickModal component
3. `1e55a54` - PicksListPage
4. `fe5dd6b` - TipsterDetailPage integration + calculateTipsterStats
5. `fcd4a53` - Layout component + router configuration
6. `fix` - onSnapshot implementation for real-time updates

**Tests**:
- Testing manual: ✅ Completo (30 minutos)
- Unit tests: ❌ Pendiente (Fase de Testing)
- E2E tests: ❌ Pendiente (Fase de Testing)

### Problemas Encontrados y Soluciones

#### Problema 1: Picks no aparecían al crearlas

**Síntoma**: Al guardar una pick nueva, no aparecía en la tabla.

**Causa**: Hook `usePicks` solo hacía fetch inicial sin listener en tiempo real.

**Solución**: Implementar `onSnapshot` para sincronización automática.

**Resultado**: ✅ Picks aparecen instantáneamente sin refresh.

#### Problema 2: Input types no soportados

**Síntoma**: TypeScript error en Input component con type="date" y type="time".

**Causa**: InputType enum no incluía estos tipos HTML5.

**Solución**: Extender InputType: `'date' | 'time'` en Input.types.ts.

**Resultado**: ✅ Inputs nativos funcionan correctamente.

#### Problema 3: ESLint warnings en nested ternaries

**Síntoma**: ESLint quejándose de ternarios anidados complejos.

**Causa**: Expresiones condicionales largas inline.

**Solución**: Extraer a IIFE con if/else limpio.

**Resultado**: ✅ Código más legible sin warnings.

#### Problema 4: Layout wrapper duplicado

**Síntoma**: Páginas tenían doble wrapper (Layout + propio wrapper).

**Causa**: Páginas tenían min-h-screen wrapper antes de añadir Layout.

**Solución**: Remover wrappers de TipsterListPage y TipsterDetailPage.

**Resultado**: ✅ Layout único y consistente.

### Lecciones Aprendidas

1. **onSnapshot es clave**: Para apps en tiempo real, usar listeners desde el inicio evita refactoring posterior.

2. **Repository Pattern escala**: Con 20+ métodos en PickRepository, el patrón demuestra su valor.

3. **useMemo para performance**: Con muchas picks, filtrado optimizado previene re-renders innecesarios.

4. **Type safety salva tiempo**: TypeScript detectó varios bugs antes de runtime.

5. **Layout component centralizado**: Un solo punto de navegación simplifica enormemente el código.

6. **Stats en tiempo real**: Calcular stats en el cliente es viable hasta ~1000 picks (después considerar backend aggregation).

### Archivos Modificados vs Creados

**Creados** (nuevos):
- `features/picks/hooks/usePicks.ts`
- `features/picks/hooks/usePicksByTipster.ts`
- `features/picks/components/PickTableRow/*`
- `features/picks/components/AddPickModal/*`
- `features/picks/pages/PicksListPage/*`
- `features/picks/utils/sport-icons.ts`
- `features/tipsters/utils/calculate-stats.ts`
- `shared/components/layout/Layout.tsx`

**Modificados** (updates):
- `features/tipsters/pages/TipsterDetailPage.tsx` (integración picks)
- `features/tipsters/pages/TipsterListPage.tsx` (remover wrapper)
- `shared/components/ui/Input/Input.types.ts` (añadir date/time)
- `core/routing/routes.tsx` (añadir /picks route + Layout)

### Dependencias Técnicas

**NPM packages** (ya instaladas):
- React 19
- TypeScript 5.9
- Firebase SDK 12.6
- Lucide React (icons)
- Tailwind CSS

**Ninguna dependencia nueva requerida** ✅

### Estado de Firestore

**Collections activas**:
```
tipsters/
  {tipsterId}/
    - id, uid, name, channel, createdDate, lastPickDate

picks/
  {pickId}/
    - id, uid, tipsterId (FK)
    - match, sport, pickType, betType, bookmaker
    - odds, stake, date, time, dateTime
    - result, isResolved, comments, status
```

**Índices compuestos necesarios**:
```javascript
// Firestore Index para query con where + orderBy
{
  collectionGroup: "picks",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "uid", order: "ASCENDING" },
    { fieldPath: "dateTime", order: "DESCENDING" }
  ]
}
```

**Nota**: Firebase crea índices automáticamente al detectar la query.

### Próximos Pasos

**Fase 6 - Feature Follows** (siguiente):
- Modelo UserFollow (relación Pick → User)
- Hook `useFollows` con onSnapshot
- Integración en AddPickModal (checkbox "Seguir pick")
- MyPicksPage (picks seguidas por el usuario)
- Comparación Tipster vs User (match/diverge)
- Cálculo de seguibilidad por tipster

**Refactorings pendientes**:
- Extraer PickFilters a componente separado (actualmente inline)
- Crear custom hook `usePickFilters` para lógica de filtrado
- Componentizar stat cards (actualmente repetidas)

**Mejoras futuras**:
- Paginación para > 100 picks
- Export a Excel/CSV
- Gráficos de evolución temporal
- Sistema de notificaciones

---

**Última actualización**: 17 de Noviembre de 2025  
**Versión del documento**: 1.3.0  
**Autor**: AI Assistant + Development Team
**Cambios realizados (20/11/2025):**
- Todos los usos de `alert()` y `confirm()` migrados a Sonner (`toast.success`, `toast.error`, etc.) en los principales features: AddTipsterModal, TipsterDetailPage, PicksListPage, MyPicksPage, DashboardPage.
- ConfirmDialog se mantiene para acciones destructivas con doble confirmación y feedback visual.
- Eliminado el sistema custom de toasts (`ToastContainer.tsx`, `ToastContext.tsx`), Sonner es ahora el único sistema global de notificaciones.
- `<Toaster />` de Sonner montado en el entrypoint global (`main.tsx`) con posición `top-right`, colores ricos, botón de cierre y duración 3500ms.
- Todos los flujos CRUD, errores y confirmaciones ahora muestran feedback visual consistente y moderno.

**Recomendaciones de uso:**
- Usar `toast.success`, `toast.error`, `toast.info`, `toast.warning` para notificaciones en cualquier feature.
- Para confirmaciones destructivas, mantener el modal ConfirmDialog para mejor UX.
- No crear sistemas custom de toasts, usar siempre Sonner para feedback global.

**Ejemplo de uso:**
```tsx
import { toast } from 'sonner';

// Éxito
toast.success('Operación completada correctamente');

// Error
toast.error('Ha ocurrido un error');

// Info
toast.info('Este es un mensaje informativo');

// Warning
toast.warning('Atención: acción irreversible');
```


---

## FASE 9: MIGRACIÓN DE DATOS Y DEPLOY - COMPLETADA ✅

### Estado: ✅ 100% Completada (6/6 subtareas)
**Fecha de Completación**: 2025-11-24  
**Duración**: 3 días  
**Commits**: Pendiente de merge a main

---

### Resumen Ejecutivo

La Fase 9 completa toda la infraestructura y configuración necesaria para desplegar la aplicación React a producción en Firebase Hosting. Incluye optimizaciones de build, pipeline de CI/CD, configuración de hosting, y procedimientos documentados de deployment y monitoring.

**Resultado**: Aplicación lista para producción, esperando aprobación para deployment.

---

### 9.1: Verificación de Datos ✅

**Duración**: 2 horas  
**Objetivo**: Verificar compatibilidad de estructura de datos Firestore con interfaces TypeScript

#### Trabajo Realizado

1. **Análisis de Interfaces TypeScript**
   - Revisión de `src/shared/types/index.ts`
   - Interfaces: `Tipster`, `Pick`, `UserFollow`
   - Validación de tipos de datos

2. **Verificación de Firestore**
   - Estructura de colecciones: `tipsters`, `picks`, `userFollows`
   - Tipos de campos compatibles
   - Relaciones entre documentos

3. **Índices y Reglas**
   - `firestore.indexes.json` - Índices compuestos (auto-creados)
   - `firestore.rules` - Reglas de seguridad compatibles

#### Resultado

✅ **100% Compatible** - Sin migración de datos necesaria

**Documentación**: `phase9_1_data_verification.md`

---

### 9.2: Configuración Build Producción ✅

**Duración**: 4 horas  
**Objetivo**: Optimizar configuración de Vite para builds de producción

#### Configuración Aplicada

**Archivo**: `react-app/vite.config.ts`

```typescript
build: {
  outDir: 'dist',
  sourcemap: false,              // Deshabilitado para reducir tamaño
  minify: 'esbuild',             // Minificación rápida
  target: 'es2015',              // Navegadores modernos
  reportCompressedSize: true,    // Mostrar tamaños gzip
  chunkSizeWarningLimit: 1000,   // 1MB límite
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        'chart-vendor': ['chart.js', 'react-chartjs-2'],
        'ui-vendor': ['lucide-react', 'sonner'],
      },
    },
  },
}
```

#### Resultados del Build

| Métrica | Valor | Mejora |
|---------|-------|--------|
| Main bundle | 202.90 kB (63.89 kB gzipped) | 76% reducción |
| React vendor | 96.67 kB (32.56 kB gzipped) | Separado |
| Firebase vendor | 354.55 kB (108.57 kB gzipped) | Separado |
| Chart vendor | 165.87 kB (57.66 kB gzipped) | Separado |
| UI vendor | 42.33 kB (12.86 kB gzipped) | Separado |
| **Total** | **907.31 kB (302.68 kB gzipped)** | Optimizado |
| Build time | ~13s | Aceptable |

#### Archivos Creados

- `react-app/.env.production` - Variables de entorno producción
- `react-app/.env.production.template` - Template para credenciales

**Documentación**: `phase9_2_production_build.md`

---

### 9.3: Firebase Hosting Setup ✅

**Duración**: 3 horas  
**Objetivo**: Configurar Firebase Hosting para React SPA con routing client-side

#### Configuración Implementada

**Archivo**: `firebase.react.json`

```json
{
  "hosting": {
    "site": "tipstertracker",
    "public": "react-app/dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }]
      },
      {
        "source": "index.html",
        "headers": [{
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }]
      }
    ]
  }
}
```

#### Features Implementadas

1. **SPA Rewrites**
   - Todas las rutas sirven `index.html`
   - React Router maneja navegación client-side
   - No 404 en page refresh

2. **Caching Headers**
   - Assets (JS/CSS): 1 año (immutable)
   - index.html: no-cache (siempre fresco)
   - Optimización de performance

3. **Sistema de Cambio Legacy/React**
   - `firebase.react.json` - Config React
   - `firebase.legacy.json` - Config Legacy
   - `switch-to-react.sh` - Script cambio a React
   - `switch-to-legacy.sh` - Script cambio a Legacy

#### Testing Local

```bash
# Build
cd react-app && npm run build && cd ..

# Test con emulators
firebase emulators:start --only auth,firestore,hosting

# Verificar en http://localhost:5000
```

**Resultado**: ✅ Testeado exitosamente con emulators

**Documentación**: `phase9_3_hosting_setup.md`, `docs/DEPLOYMENT.md`

---

### 9.4: CI/CD Pipeline ✅

**Duración**: 4 horas  
**Objetivo**: Automatizar build y deployment con GitHub Actions

#### Workflow Implementado

**Archivo**: `.github/workflows/firebase-hosting-main.yml`

```yaml
name: Deploy to Firebase Hosting on push to main

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: react-app/package-lock.json
      
      - name: Install dependencies
        working-directory: ./react-app
        run: npm ci
      
      - name: Build React app
        working-directory: ./react-app
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... otros secrets
      
      - name: Deploy to Firebase Hosting
        if: github.ref == 'refs/heads/main'
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C }}'
          channelId: live
          projectId: tipstertracker-b5e3c
```

#### GitHub Secrets Configurados

1. `VITE_FIREBASE_API_KEY`
2. `VITE_FIREBASE_AUTH_DOMAIN`
3. `VITE_FIREBASE_PROJECT_ID`
4. `VITE_FIREBASE_STORAGE_BUCKET`
5. `VITE_FIREBASE_MESSAGING_SENDER_ID`
6. `VITE_FIREBASE_APP_ID`
7. `VITE_FIREBASE_MEASUREMENT_ID`
8. `FIREBASE_SERVICE_ACCOUNT_TIPSTERTRACKER_B5E3C` (ya existía)

#### Comportamiento

- **Push a main**: Build + Deploy automático
- **Pull Request**: Solo build (sin deploy)
- **Build time estimado**: 3-5 minutos

**Documentación**: `phase9_4_cicd_pipeline.md`

---

### 9.5: Deployment Procedures ✅

**Duración**: 2 horas  
**Objetivo**: Documentar procedimientos de deployment

#### Opciones de Deployment

**1. Deployment Manual**
```bash
# Asegurar firebase.json apunta a React
cp firebase.react.json firebase.json

# Build
cd react-app && npm run build && cd ..

# Deploy
firebase deploy --only hosting
```

**2. Deployment Automático** (vía GitHub Actions)
```bash
# Crear Pull Request
git checkout -b feature/my-feature
git add .
git commit -m "feat: my feature"
git push origin feature/my-feature

# Merge PR a main en GitHub
# GitHub Actions despliega automáticamente
```

**3. Preview/Staging**
```bash
# Preview (7 días)
firebase hosting:channel:deploy preview

# Staging (7 días)
firebase hosting:channel:deploy staging --expires 7d

# Producción
firebase deploy --only hosting
```

#### Rollback

```bash
# Ver releases
firebase hosting:releases:list

# Rollback a versión anterior
firebase hosting:rollback
```

#### Checklist Pre-Deployment

- [ ] Build exitoso (`npm run build`)
- [ ] Bundle size < 1 MB
- [ ] Test local con emulators
- [ ] Login funciona
- [ ] CRUD operations funcionan
- [ ] Charts renderizan
- [ ] Responsive funciona
- [ ] No console errors

**Documentación**: `phase9_5_deployment_procedures.md`

---

### 9.6: Monitoring Setup ✅

**Duración**: 2 horas  
**Objetivo**: Configurar analytics y monitoring (documentado, no implementado)

#### Firebase Analytics

**Configuración**:
```typescript
// firebase.config.ts
import { getAnalytics } from 'firebase/analytics';

export const analytics = import.meta.env.PROD 
  ? getAnalytics(app) 
  : null;
```

**Custom Events**:
- `tipster_created`, `tipster_deleted`
- `pick_created`, `pick_resolved`
- `follow_created`
- `data_exported`

#### Performance Monitoring

**Configuración**:
```typescript
import { getPerformance } from 'firebase/performance';

export const perf = import.meta.env.PROD 
  ? getPerformance(app) 
  : null;
```

**Custom Traces**:
- `load_tipsters`
- `load_picks`
- `export_data`

#### Métricas a Trackear

**User Metrics**:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- User retention

**Performance Metrics**:
- First Contentful Paint (FCP) < 1.5s
- First Input Delay (FID) < 100ms
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

**Error Metrics**:
- JavaScript errors
- Failed API calls
- Authentication errors

**Documentación**: `phase9_6_monitoring_setup.md`

---

## Archivos Modificados/Creados en Fase 9

### Configuración de Build
- `react-app/vite.config.ts` - Build optimizado
- `react-app/.env.production` - Variables producción
- `react-app/.env.production.template` - Template
- `react-app/src/core/config/firebase.config.ts` - Fix emulator detection

### Configuración de Hosting
- `firebase.json` - Config activa (apunta a React)
- `firebase.react.json` - Config React SPA (nuevo)
- `firebase.legacy.json` - Config app legacy (nuevo)
- `switch-to-react.sh` - Script cambio a React (nuevo)
- `switch-to-legacy.sh` - Script cambio a Legacy (nuevo)

### CI/CD
- `.github/workflows/firebase-hosting-main.yml` - Actualizado

### Documentación
- `.github/copilot-instructions.md` - Actualizado con Fase 9
- `docs/MIGRATION-GUIDE.md` - Este documento
- `docs/DEPLOYMENT.md` - Guía de deployment (nuevo)
- `docs/REORGANIZATION.md` - Reorganización docs (nuevo)

### Reorganización de Documentación
- `AGENTS.md` → `.github/copilot-instructions.md`
- `MIGRATION-GUIDE.md` → `docs/MIGRATION-GUIDE.md`
- `EXCEL-EXPORT-VERIFICATION.md` → `docs/`
- `EXPORT-SYSTEM-GUIDE.md` → `docs/`
- `TASK-5-EXCEL-PLAN.md` → `docs/`

---

## Comandos Útiles Fase 9

### Build y Testing
```bash
# Build producción
cd react-app && npm run build

# Preview build local
npm run preview

# Test con Firebase Hosting emulator
cd .. && firebase emulators:start --only hosting
```

### Cambio Legacy/React
```bash
# Cambiar a React
./switch-to-react.sh

# Cambiar a Legacy
./switch-to-legacy.sh

# Reiniciar emulators (siempre necesario)
pkill -9 -f "firebase.*emulator"
firebase emulators:start --only auth,firestore,hosting
```

### Deployment
```bash
# Preview
firebase hosting:channel:deploy preview

# Staging
firebase hosting:channel:deploy staging --expires 7d

# Producción
firebase deploy --only hosting

# Rollback
firebase hosting:rollback
```

---

## Lecciones Aprendidas

### Optimizaciones de Build

1. **Vendor Chunks Manuales**
   - Separar React, Firebase, Charts, UI
   - Mejor caching en navegador
   - Parallel downloads

2. **Minificación con esbuild**
   - Más rápido que terser
   - Integrado en Vite
   - Resultados similares

3. **Source Maps Deshabilitados**
   - Reduce tamaño del bundle
   - No necesarios en producción
   - Habilitar solo para debugging

### Firebase Hosting

1. **SPA Rewrites Críticos**
   - Necesarios para React Router
   - Evita 404 en page refresh
   - Configuración simple

2. **Caching Headers**
   - Assets immutable (1 año)
   - index.html no-cache
   - Mejora performance significativa

3. **Sistema de Cambio Legacy/React**
   - Útil para comparación
   - Facilita rollback
   - Scripts simples y efectivos

### CI/CD

1. **npm ci vs npm install**
   - `npm ci` más rápido
   - Usa package-lock.json exacto
   - Limpia node_modules antes

2. **Secrets en GitHub**
   - Separar credenciales de código
   - Fácil rotación
   - Seguro

3. **Conditional Deployment**
   - PRs solo build
   - Main despliega automáticamente
   - Evita deploys accidentales

---

## Próximos Pasos

### Deployment a Producción

1. **Crear Pull Request**
   - De rama actual → `main`
   - Revisar cambios
   - Aprobar PR

2. **Merge y Deploy**
   - Merge PR a main
   - GitHub Actions despliega automáticamente
   - Monitorear workflow

3. **Verificación Post-Deploy**
   - Verificar URL producción
   - Test funcionalidades críticas
   - Monitorear errores

### Implementar Monitoring

1. **Firebase Analytics**
   - Implementar custom events
   - Configurar dashboards
   - Analizar métricas

2. **Performance Monitoring**
   - Implementar custom traces
   - Monitorear Web Vitals
   - Optimizar según datos

3. **Error Tracking**
   - Configurar Sentry (opcional)
   - Alertas de errores
   - Análisis de crashes

---

## Conclusión Fase 9

**Estado**: ✅ **COMPLETADA AL 100%**

**Logros**:
- ✅ Build de producción optimizado (76% reducción main bundle)
- ✅ Firebase Hosting configurado para React SPA
- ✅ CI/CD pipeline funcional con GitHub Actions
- ✅ Procedimientos de deployment documentados
- ✅ Monitoring configurado (listo para implementar)
- ✅ Sistema de cambio Legacy/React
- ✅ Documentación reorganizada y actualizada

**Métricas**:
- Bundle size: 907 KB (303 KB gzipped)
- Build time: ~13s
- Vendor chunks: 4 (React, Firebase, Charts, UI)
- Lazy loading: Páginas y modals

**Listo para**: Deployment a producción cuando se decida

---

**Completado**: 2025-11-24  
**Siguiente Fase**: Deployment a producción y monitoring activo


---

## FASE 10: OPTIMIZACIÓN Y PERFORMANCE - PARCIALMENTE COMPLETADA ✅

### Estado: ⚠️ 70% Completada
**Fecha de Inicio**: 2025-11-22  
**Duración**: 3 días (parcial)

---

### Resumen Ejecutivo

La Fase 10 se enfoca en optimización de performance basándose en métricas reales. Gran parte del trabajo ya se completó en Task 11, pero quedan optimizaciones pendientes que se harán después del deployment a producción.

---

### Trabajo Completado ✅

#### Route-Based Code Splitting
- ✅ Lazy loading de todas las páginas
- ✅ Suspense con PageLoadingFallback
- ✅ 7 páginas con lazy loading

#### Component Memoization
- ✅ PickCard memoizado
- ✅ FollowCard memoizado
- ✅ Optimización de re-renders

#### Lazy Loading de Charts
- ✅ 4 charts con lazy loading en TipsterDetailPage
- ✅ Suspense con SkeletonLoader

#### Bundle Analysis
- ✅ Visualizer configurado (stats.html)
- ✅ Bundle principal: 842 kB (269 kB gzipped)
- ✅ 4 vendor chunks configurados

**Documentación**: `performance_optimization_walkthrough.md`, `bundle_analysis_report.md`

---

### Trabajo Pendiente ⏸️

#### Optimización de Queries Firestore
- [ ] Análisis de queries en producción
- [ ] Implementar paginación si es necesario
- [ ] Optimizar índices compuestos

#### Caching Inteligente
- [ ] Evaluar necesidad basándose en métricas
- [ ] Implementar si es necesario

#### Análisis de Métricas Reales
- [ ] Monitorear performance en producción
- [ ] Identificar bottlenecks
- [ ] Optimizar según datos reales

**Nota**: Esta fase se completa DESPUÉS del deployment a producción.

---

## FASE 11: REFINAMIENTO Y NUEVAS FUNCIONALIDADES - EN PROGRESO 🚧

### Estado: ⏳ 0% Completada
**Fecha de Inicio**: 2025-11-24  
**Duración Estimada**: 15-19 horas

---

### Resumen Ejecutivo

Fase de refinamiento UI/UX y nuevas funcionalidades basadas en feedback y necesidades identificadas. Incluye simplificación de navegación, gestión inline de configuración, y mejoras visuales pantalla por pantalla.

---

### Objetivos

1. **Simplificar navegación** - Eliminar redundancias
2. **Gestión inline de configuración** - CRUD de deportes, bookmakers, canales
3. **Refinamiento UI** - Mejoras visuales en todas las pantallas

---

### Subfase 11.1: Análisis de Redundancias

**Duración**: 1 hora  
**Estado**: ⏳ Pendiente

#### Objetivos

- Analizar Dashboard vs Tipsters (posible redundancia)
- Evaluar Picks vs Mis Picks (mantener separadas)
- Decidir estructura final de navegación

#### Navegación Actual

```
- Dashboard (stats personales + grid tipsters)
- Tipsters (lista de tipsters)
- Picks (todas las picks)
- Mis Picks (picks seguidas)
```

#### Decisiones a Tomar

1. **Dashboard vs Tipsters**: ¿Mantener ambas o unificar?
2. **Estructura final**: Definir navegación óptima

#### Entregables

- [ ] Análisis de diferencias entre páginas
- [ ] Decisión sobre navegación
- [ ] Actualización de routes si es necesario

---

### Subfase 11.2: Gestión Inline de Configuración

**Duración**: 6-8 horas  
**Estado**: ⏳ Pendiente  
**Prioridad**: Alta

#### Objetivos

Permitir a usuarios gestionar deportes, casas de apuestas y canales directamente desde dropdowns, sin página de configuración separada.

#### Diseño UX

**Dropdown con gestión inline**:
```
┌─────────────────────────────┐
│ Fútbol              ✏️ 🗑️   │
│ Baloncesto          ✏️ ��️   │
│ Tenis               ✏️ 🗑️   │
│ ───────────────────────────  │
│ + Añadir nuevo deporte      │
└─────────────────────────────┘
```

**Interacciones**:
- Click en item → Selecciona
- Click en ✏️ → Modal de edición
- Click en 🗑️ → Confirmación de eliminación
- Click en "+ Añadir" → Modal de creación

#### Backend - Firestore

**Nueva colección**: `userSettings/{uid}`

```typescript
interface UserSettings {
  sports: string[];
  bookmakers: string[];
  channels: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Componentes Nuevos

1. **ManageableDropdown**
   - Dropdown con CRUD inline
   - Iconos de editar/eliminar
   - Opción "+ Añadir nuevo"

2. **AddItemModal**
   - Modal simple para añadir
   - Validación de duplicados

3. **EditItemModal**
   - Modal para editar
   - Validación

4. **DeleteConfirmModal**
   - Confirmación de eliminación
   - Advertencia si está en uso

#### Archivos a Crear

**Types**:
- `src/features/settings/types/settings.types.ts`

**Services**:
- `src/features/settings/services/SettingsRepository.ts`

**Hooks**:
- `src/features/settings/hooks/useSettings.ts`

**Components**:
- `src/shared/components/ui/ManageableDropdown/`
- `src/shared/components/modals/AddItemModal/`
- `src/shared/components/modals/EditItemModal/`
- `src/shared/components/modals/DeleteConfirmModal/`

#### Integración

**Archivos a Modificar**:
- `AddPickModal` - Dropdowns de Sport y Bookmaker
- `EditPickModal` - Dropdowns de Sport y Bookmaker
- `AddTipsterModal` - Dropdown de Channel
- `PicksListPage` - Filtros de Sport y Bookmaker
- `DashboardPage` - Multi-select de Sports y Channels

#### Entregables

- [ ] Colección Firestore configurada
- [ ] SettingsRepository implementado
- [ ] useSettings hook implementado
- [ ] ManageableDropdown component
- [ ] Modals de Add/Edit/Delete
- [ ] Integración en modals
- [ ] Integración en filtros
- [ ] Testing completo

---

### Subfase 11.3: Refinamiento UI

**Duración**: 6-8 horas  
**Estado**: ⏳ Pendiente  
**Prioridad**: Media

#### Metodología

Para cada pantalla:
1. Revisar visualmente
2. Identificar mejoras
3. Implementar cambios
4. Verificar responsive

#### Pantallas a Refinar

**1. Dashboard**
- [ ] Layout de stats cards
- [ ] Grid de tipster cards
- [ ] Filtros (diseño y UX)
- [ ] Espaciados y colores
- [ ] Responsive

**2. Tipsters** (si se mantiene)
- [ ] Diferenciación con Dashboard
- [ ] Layout
- [ ] Filtros
- [ ] Responsive

**3. Picks**
- [ ] Tabla en desktop
- [ ] Cards en mobile
- [ ] Filtros colapsables
- [ ] Stats cards
- [ ] Responsive

**4. Mis Picks**
- [ ] Tabla comparativa
- [ ] Indicadores Match/Diverge
- [ ] Stats de seguibilidad
- [ ] Responsive

**5. Tipster Detail**
- [ ] Tabs (Stats, My Stats, Follows)
- [ ] Stats cards
- [ ] Charts
- [ ] Tabla de picks
- [ ] Responsive

**6. Modals**
- [ ] Todos los modals existentes
- [ ] Nuevos modals de gestión
- [ ] Validación visual
- [ ] Responsive

#### Aspectos a Revisar

- Colores y contraste
- Tipografía y tamaños
- Espaciados y márgenes
- Feedback visual
- Loading states
- Error states
- Empty states

#### Entregables

- [ ] Lista detallada de cambios
- [ ] Implementación de cambios
- [ ] Testing en 3 breakpoints
- [ ] Screenshots antes/después

---

### Subfase 11.4: Testing y Validación

**Duración**: 2 horas  
**Estado**: ⏳ Pendiente

#### Testing Funcional

**Gestión de Configuración**:
- [ ] CRUD de deportes funciona
- [ ] CRUD de bookmakers funciona
- [ ] CRUD de canales funciona
- [ ] Validación de items en uso
- [ ] Sincronización en tiempo real

**Integración**:
- [ ] Dropdowns usan items personalizados
- [ ] Filtros usan items personalizados
- [ ] Picks usan deportes personalizados
- [ ] Tipsters usan canales personalizados

#### Testing UI/UX

**Por pantalla**:
- [ ] Dashboard
- [ ] Tipsters (si existe)
- [ ] Picks
- [ ] Mis Picks
- [ ] Tipster Detail

**Breakpoints**:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

#### Testing de Performance

- [ ] Bundle size controlado
- [ ] Lazy loading funciona
- [ ] No memory leaks
- [ ] Queries optimizadas

#### Entregables

- [ ] Checklist de testing
- [ ] Bugs corregidos
- [ ] Screenshots de validación
- [ ] Walkthrough actualizado

---

## Criterios de Éxito Fase 11

### Funcionales

- [ ] Gestión inline de configuración funcional
- [ ] CRUD completo de deportes/bookmakers/canales
- [ ] Validación de items en uso
- [ ] Sincronización en tiempo real
- [ ] Navegación simplificada

### UX/UI

- [ ] Interfaz visualmente mejorada
- [ ] Consistencia visual
- [ ] Responsive en todos los breakpoints
- [ ] Feedback claro
- [ ] Loading/error states apropiados

### Técnicos

- [ ] Código limpio y mantenible
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Bundle size controlado
- [ ] Performance mantenida

---

## Riesgos y Mitigaciones

### Riesgo 1: Migración de datos

**Problema**: Picks/Tipsters usan valores hardcodeados

**Mitigación**: 
- Valores por defecto desde constants
- Migración automática al primer uso
- Validación de integridad

### Riesgo 2: Eliminación de items en uso

**Problema**: Usuario elimina deporte usado en picks

**Mitigación**:
- Validación antes de eliminar
- Mensaje claro
- Opción de reemplazar

### Riesgo 3: Sincronización

**Problema**: Configuración por usuario, no global

**Mitigación**:
- Documentar claramente
- Considerar valores sugeridos (futuro)

---

## Próximos Pasos Fase 11

1. **Subfase 11.1**: Análisis de redundancias ✅ COMPLETADA (2024-11-24)
2. **Subfase 11.2 - Fase 1**: Backend de Settings ✅ COMPLETADA (2024-11-24)
3. **Subfase 11.2 - Fase 2**: UI Components ⏳ EN PROGRESO
4. **Subfase 11.2 - Fase 3**: Integración ⏳ PENDIENTE
5. **Subfase 11.2 - Fase 4**: Testing y Cleanup ⏳ PENDIENTE
6. **Subfase 11.3**: Refinamiento UI ⏳ PENDIENTE
7. **Subfase 11.4**: Testing final ⏳ PENDIENTE

**Estimación total**: 15-19 horas  
**Tiempo invertido**: ~4 horas  
**Progreso**: 25% completado

---

**Changelog Detallado**: Ver `docs/SUBFASE_11_CHANGELOG.md`  
**Estado Actual**: Subfase 11.2 Fase 1 completada  
**Siguiente paso**: Crear ManageableDropdown component

