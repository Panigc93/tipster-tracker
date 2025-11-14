# Tipster Tracker - React Migration

Proyecto React con TypeScript para la migración del Tipster Tracker.

## 🚀 Stack Tecnológico

- **React 19** - Framework UI
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 3** - Styling
- **Firebase SDK 12** - Backend (Auth + Firestore)
- **React Router 7** - Routing
- **Chart.js 4** - Gráficos
- **Lucide React** - Iconografía

## 📁 Arquitectura

Feature-based architecture con principios SOLID:

```
src/
├── features/       # Módulos por funcionalidad
├── shared/         # Código compartido
├── core/           # Configuración
└── assets/         # Recursos estáticos
```

## 🛠️ Desarrollo

### Instalación

```bash
npm install
```

### Variables de Entorno

Copia `.env.example` a `.env` y configura tus credenciales de Firebase:

```bash
cp .env.example .env
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en http://localhost:5173

### Linting y Formateo

```bash
npm run lint        # ESLint
npm run lint:fix    # Fix automático
npm run format      # Prettier
```

### Build para producción

```bash
npm run build
npm run preview     # Preview del build
```

## 📖 Documentación

Ver `../MIGRATION-GUIDE.md` para detalles completos de la migración.

## ✅ Estado

- **Fase 0**: Completada ✅ (14/11/2025)
- **Fase 1**: En progreso...
