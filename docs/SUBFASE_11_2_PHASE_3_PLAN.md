# Plan de Integración - Subfase 11.2 Fase 3

Este documento detalla los pasos exactos para integrar los componentes de UI de configuración (`ManageableDropdown`, `AddItemModal`, `EditItemModal`) en los modales y páginas existentes.

## 📦 Componentes a Integrar

- `ManageableDropdown`: Reemplaza a los `<select>` y `<Dropdown>` nativos.
- `AddItemModal`: Permite añadir nuevos items.
- `EditItemModal`: Permite editar items existentes.
- `useSettings`: Hook para acceder a los datos y funciones de configuración.

---

## 1. Modificación de `AddPickModal.tsx`

**Ubicación**: `src/features/picks/components/AddPickModal/AddPickModal.tsx`

### Paso 1.1: Imports
Añadir los siguientes imports:
```typescript
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown, AddItemModal, EditItemModal } from '@features/settings/components';
import type { SettingsCategory } from '@features/settings/types';
```

### Paso 1.2: Hooks y Estados
Dentro del componente `AddPickModal`:
```typescript
// Settings hook
const { 
  settings, 
  addSport, updateSport, 
  addBookmaker, updateBookmaker,
  ensureSportExists, ensureBookmakerExists 
} = useSettings();

// Modal states
const [addModalOpen, setAddModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [currentCategory, setCurrentCategory] = useState<SettingsCategory>('sport');
const [itemToEdit, setItemToEdit] = useState('');
```

### Paso 1.3: Handlers
Añadir funciones para manejar la apertura de modales y las acciones:
```typescript
const handleOpenAdd = (category: SettingsCategory) => {
  setCurrentCategory(category);
  setAddModalOpen(true);
};

const handleOpenEdit = (category: SettingsCategory, item: string) => {
  setCurrentCategory(category);
  setItemToEdit(item);
  setEditModalOpen(true);
};

const handleAddItem = async (item: string) => {
  if (currentCategory === 'sport') await addSport(item);
  else if (currentCategory === 'bookmaker') await addBookmaker(item);
};

const handleEditItem = async (oldItem: string, newItem: string) => {
  if (currentCategory === 'sport') await updateSport(oldItem, newItem);
  else if (currentCategory === 'bookmaker') await updateBookmaker(oldItem, newItem);
};
```

### Paso 1.4: Auto-añadir valores legacy
En el `useEffect` que carga los datos del pick (línea ~85), añadir llamadas a `ensure...`:
```typescript
if (pick.sport) ensureSportExists(pick.sport);
if (pick.bookmaker) ensureBookmakerExists(pick.bookmaker);
```

### Paso 1.5: Reemplazar Dropdowns
- **Sport**: Reemplazar `<select>` por `<ManageableDropdown>`
- **Bookmaker**: Reemplazar `<select>` por `<ManageableDropdown>`
- **User Bookmaker** (Follow): Reemplazar `<select>` por `<ManageableDropdown>`

### Paso 1.6: Añadir Modals
Al final del componente (antes de cerrar el fragmento o div principal), añadir:
```typescript
<AddItemModal
  isOpen={addModalOpen}
  onClose={() => setAddModalOpen(false)}
  onAdd={handleAddItem}
  category={currentCategory}
  existingItems={currentCategory === 'sport' ? settings?.sports || [] : settings?.bookmakers || []}
/>
<EditItemModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  onEdit={handleEditItem}
  category={currentCategory}
  currentItem={itemToEdit}
  existingItems={currentCategory === 'sport' ? settings?.sports || [] : settings?.bookmakers || []}
/>
```

---

## 2. Modificación de `AddTipsterModal.tsx`

**Ubicación**: `src/features/tipsters/components/AddTipsterModal/AddTipsterModal.tsx`

### Paso 2.1: Imports
```typescript
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown, AddItemModal, EditItemModal } from '@features/settings/components';
```

### Paso 2.2: Hooks y Estados
```typescript
const { settings, addChannel, updateChannel, ensureChannelExists } = useSettings();
const [addModalOpen, setAddModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [itemToEdit, setItemToEdit] = useState('');
```

### Paso 2.3: Reemplazar Dropdown
Reemplazar el componente `Dropdown` de Channel por `ManageableDropdown`.

---

## 3. Modificación de Filtros

### 3.1 `PicksListPage.tsx`
- Reemplazar filtros de Sport y Bookmaker en la sección de filtros.
- Nota: Aquí NO necesitamos `AddItemModal` ni `EditItemModal`, solo `ManageableDropdown` sin las props `onAdd` y `onEdit` (o deshabilitadas/ocultas si el componente lo requiere, quizás necesitemos ajustar `ManageableDropdown` para que `onAdd` y `onEdit` sean opcionales).

### 3.2 `DashboardPage.tsx`
- Reemplazar filtros de Sport y Channel.

---

## ⚠️ Notas Importantes

1. **ManageableDropdown Props**: Verificar si `onAdd` y `onEdit` son obligatorias. Si lo son, pasar funciones vacías o `undefined` en los filtros, o hacerlas opcionales en la interfaz.
2. **Estilos**: Asegurar que `ManageableDropdown` se vea bien dentro de los modales y las barras de filtros (ancho completo vs ancho fijo).
3. **Z-Index**: Verificar que los dropdowns y modales de settings tengan el z-index correcto para aparecer sobre los modales de Picks/Tipsters.
