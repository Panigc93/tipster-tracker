# UI Components - Base Design System

**✅ Phase 2 COMPLETA** - Design System completo

Componentes UI fundamentales que se reutilizan en todas las features de la aplicación.

## 📦 Componentes Disponibles

### Componentes Base (MINI-Phase 2)
- ✅ **Button** - Botón con variantes, tamaños y loading
- ✅ **Input** - Campo de entrada con label y validación
- ✅ **Card** - Contenedor con sections opcionales
- ✅ **Alert** - Mensajes informativos con variantes

### Componentes Phase 2 COMPLETE
- ✅ **Modal** - Dialog con portal, backdrop y animaciones
- ✅ **Dropdown** - Select single/multi con búsqueda
- ✅ **Table** - Tabla con sorting y estados
- ✅ **Badge** - Status badges con variantes
- ✅ **Spinner** - Loading indicators
- ✅ **Toast** - Notificaciones temporales con ToastProvider
- ✅ **Tabs** - Navegación por pestañas con keyboard
- ✅ **Checkbox** - Checkbox con estado indeterminate
- ✅ **Radio** - RadioGroup para selección única
- ✅ **Switch** - Toggle con loading state
- ✅ **Textarea** - Textarea con auto-resize y contador
- ✅ **Divider** - Separador horizontal/vertical

**Total: 16 componentes**

## 🎨 Componentes Detallados

### Button

Botón con múltiples variantes, tamaños y estados.

**Variantes**:
- `primary` - Azul (acción principal)
- `secondary` - Gris (acción secundaria)
- `outline` - Borde transparente (acción terciaria)
- `danger` - Rojo (acción destructiva)

**Tamaños**:
- `sm` - Pequeño
- `md` - Mediano (default)
- `lg` - Grande

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;           // Muestra spinner y deshabilita
  fullWidth?: boolean;          // Ancho completo
  icon?: React.ReactNode;       // Icono antes del texto
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Ejemplos**:
```tsx
import { Button } from '@shared/components/ui';
import { Plus } from 'lucide-react';

// Botón básico
<Button variant="primary" onClick={handleClick}>
  Guardar
</Button>

// Con loading
<Button variant="primary" loading>
  Guardando...
</Button>

// Con icono
<Button variant="secondary" icon={<Plus className="h-4 w-4" />}>
  Añadir Tipster
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Eliminar
</Button>

// Full width
<Button variant="primary" fullWidth>
  Iniciar Sesión
</Button>
```

---

### Input

Campo de entrada con label, estados de error, y toggle de contraseña.

**Tipos**:
- `text`, `email`, `password`, `number`, `tel`, `url`

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;               // Label del input
  error?: string;               // Mensaje de error
  helperText?: string;          // Texto de ayuda
  fullWidth?: boolean;          // Ancho completo
  icon?: React.ReactNode;       // Icono al inicio
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e) => void;
}
```

**Ejemplos**:
```tsx
import { Input } from '@shared/components/ui';
import { Mail, Lock } from 'lucide-react';

// Input básico
<Input
  label="Nombre"
  placeholder="Tu nombre"
  required
/>

// Con error
<Input
  label="Email"
  type="email"
  error="Email inválido"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Password con toggle
<Input
  label="Contraseña"
  type="password"
  icon={<Lock className="h-5 w-5" />}
  required
/>

// Con helper text
<Input
  label="Stake"
  type="number"
  helperText="Entre 1 y 10 unidades"
  min={1}
  max={10}
/>
```

---

### Card

Contenedor con background, borde y sombra.

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;     // Header opcional
  footer?: React.ReactNode;     // Footer opcional
  className?: string;
  noPadding?: boolean;          // Sin padding interno
  clickable?: boolean;          // Efecto hover
  onClick?: () => void;
}
```

**Ejemplos**:
```tsx
import { Card } from '@shared/components/ui';

// Card básico
<Card>
  <h2>Título</h2>
  <p>Contenido del card</p>
</Card>

// Con header y footer
<Card
  header={<h3 className="font-bold">Estadísticas</h3>}
  footer={<button>Ver más</button>}
>
  <div>Contenido...</div>
</Card>

// Clickable
<Card clickable onClick={() => navigate('/tipster/123')}>
  <h4>Tipster Name</h4>
  <p>Stats...</p>
</Card>

// Sin padding (control total)
<Card noPadding>
  <img src="..." className="w-full" />
  <div className="p-4">Custom padding</div>
</Card>
```

---

### Alert

Componente para mostrar mensajes con diferentes niveles de severidad.

**Variantes**:
- `error` - Rojo (errores)
- `success` - Verde (éxito)
- `warning` - Naranja (advertencias)
- `info` - Azul (información)

**Props**:
```typescript
interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  title?: string;               // Título opcional
  children: React.ReactNode;    // Mensaje
  dismissible?: boolean;        // Botón X para cerrar
  onDismiss?: () => void;       // Callback al cerrar
  className?: string;
}
```

**Ejemplos**:
```tsx
import { Alert } from '@shared/components/ui';

// Error alert
<Alert variant="error" title="Error de autenticación">
  Credenciales inválidas. Por favor, inténtalo de nuevo.
</Alert>

// Success alert
<Alert variant="success">
  ¡Tipster creado exitosamente!
</Alert>

// Dismissible
<Alert 
  variant="warning" 
  dismissible 
  onDismiss={() => setShowAlert(false)}
>
  Esta acción no se puede deshacer.
</Alert>

// Info con título
<Alert variant="info" title="Información">
  Recuerda actualizar los picks regularmente.
</Alert>
```

---

## 🎨 Paleta de Colores

```css
Primary (Blue):   #3B82F6
Success (Green):  #10B981
Error (Red):      #EF4444
Warning (Orange): #F59E0B
Info (Blue):      #6B7280

Background:       #0F172A (dark navy)
Surface:          #1E293B (slate-800)
Border:           #334155 (slate-700)
Text Primary:     #E0E0E0
Text Secondary:   #94A3B8
```

## 📦 Uso

```tsx
// Importar componentes
import { Button, Input, Card, Alert } from '@shared/components/ui';

// O importaciones individuales
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
```

## 🔧 Estilos

- Todos los componentes usan **Tailwind CSS**
- Dark theme por defecto
- Transiciones suaves (200ms)
- Focus states con ring azul
- Estados disabled con opacidad 50%

## ♿ Accesibilidad

- ✅ Atributos ARIA apropiados
- ✅ Labels asociados a inputs
- ✅ Focus visible
- ✅ Keyboard navigation
- ✅ Screen reader friendly

## 🆕 Componentes Phase 2 COMPLETE

### Modal
Dialog modal con Portal rendering y animaciones.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar acción"
  size="md"
  footer={<Button onClick={() => setIsOpen(false)}>Cerrar</Button>}
>
  <p>¿Estás seguro de realizar esta acción?</p>
</Modal>
```

### Dropdown
Select con single/multi-select y búsqueda.

```tsx
<Dropdown
  mode="multi"
  searchable
  options={[
    { value: 'football', label: 'Fútbol' },
    { value: 'basketball', label: 'Baloncesto' }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### Table
Tabla con sorting y estados de loading/empty.

```tsx
<Table
  columns={[
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={users}
  keyExtractor={(user) => user.id}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

### Toast
Sistema de notificaciones con provider y hook.

```tsx
// En App.tsx
<ToastProvider>
  <ToastContainer position="top-right" />
  <YourApp />
</ToastProvider>

// En cualquier componente
const { addToast } = useToast();
addToast('Guardado correctamente', 'success');
```

### Tabs
Navegación por pestañas con keyboard support.

```tsx
<Tabs 
  tabs={[
    { key: 'profile', label: 'Perfil' },
    { key: 'settings', label: 'Ajustes' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
<TabPanel tabKey="profile" activeTab={activeTab}>
  <ProfileContent />
</TabPanel>
```

Ver ejemplos detallados de todos los componentes en cada archivo individual.

## 📝 Notas

- ✅ **Phase 2 COMPLETA**: 16 componentes implementados
- Todos los componentes son **TypeScript strict mode**
- 0 errores de ESLint
- Accesibilidad completa (ARIA, keyboard, screen readers)
- Design system consistente con Tailwind CSS
