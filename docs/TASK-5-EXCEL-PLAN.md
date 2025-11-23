# Task 5: Import/Export Excel - Análisis y Plan de Implementación

## 📊 Estructura del Excel Template

### Sheets Identificados:
1. **Realizadas** - Picks seguidos por el usuario (UserFollows)
2. **Lanzadas Tipster** - Picks lanzados por tipsters (Picks)
3. **Mis_Picks_Dashboard** - Dashboard auto-generado de user follows
4. **Tipster_Picks_Dashboard** - Dashboard auto-generado de tipster picks
5. **Base datos** - Datos de referencia (bookmakers, deportes, canales, etc.)

---

## 🗂️ Mapeo de Columnas - Sheet "Lanzadas Tipster" (Picks)

| Columna Excel | Header Excel | Tipo | Campo App | Notas |
|---------------|--------------|------|-----------|-------|
| A | LIVE-PRE | Manual | pickType | Dropdown: PRE/LIVE/Combinado |
| B | TIPSTER | Manual | tipsterId | Dropdown desde dashboard, crea tipster si no existe |
| C | STAKE | Manual | stake | Número 1-10 |
| D | CUOTA | Manual | odds | Número decimal |
| E | W/L/V | Manual | result | W=Ganada, L=Perdida, V=Void |
| F | Res. Uds | Fórmula | - | Auto-calculado (NO exportar/importar) |
| G | CANTIDAD | Fórmula | - | Auto-calculado (NO exportar/importar) |
| H | Res. € | Fórmula | - | Auto-calculado (NO exportar/importar) |
| I | FECHA | Manual | date | Formato: YYYY-MM-DD o DD/MM/YYYY |
| J | HORA | Manual | time | Formato: HH:MM |
| K | FECHA PARTIDO (PRE) | Manual | - | Opcional, info adicional |
| L | HORA PARTIDO (PRE) | Manual | - | Opcional, info adicional |
| M | APUESTA | Manual | betType | Descripción de la apuesta |
| P | COMBINADA | Manual | - | Si/No (relacionado con pickType) |
| Q | DEPORTE | Manual | sport | Dropdown desde Base datos |
| R | PLATAFORMA ENVIO PICK | Manual | - | Canal del tipster (ya en tipster.channel) |
| S | BOOKIE Recomendado | Manual | bookmaker | Dropdown desde Base datos |

**Fila 2**: Contiene fórmulas de stats generales (✅ ganadas, ❌ perdidas, 🔵 void, etc.) - NO importar  
**Fila 6**: Headers de columnas  
**Fila 7+**: Datos de entrada

---

## 🗂️ Mapeo de Columnas - Sheet "Realizadas" (UserFollows)

| Columna Excel | Header Excel | Tipo | Campo App | Notas |
|---------------|--------------|------|-----------|-------|
| A | LIVE-PRE | Manual | pickType (del pick original) | Referencia |
| B | TIPSTER | Manual | tipsterId | Dropdown |
| C | STAKE | Manual | userStake | Número 1-10 del usuario |
| D | CUOTA | Manual | userOdds | Número decimal del usuario |
| E | W/L/V | Manual | userResult | W=Ganada, L=Perdida, V=Void del usuario |
| F | Res. Uds | Fórmula | - | Auto-calculado |
| G | CANTIDAD | Fórmula | - | Auto-calculado |
| H | Res. € | Fórmula | - | Auto-calculado |
| I | FECHA PICK | Manual | dateTimeFollowed | Fecha de seguimiento |
| J | HORA PICK | Manual | dateTimeFollowed | Hora de seguimiento |
| K | FECHA PARTIDO (PRE) | Manual | - | Opcional |
| L | HORA PARTIDO (PRE) | Manual | - | Opcional |
| M | APUESTA | Manual | betType (del pick original) | Referencia |
| P | Comentarios | Manual | - | Comentarios del usuario |
| Q | COMBINADA | Manual | - | Si/No |
| R | DEPORTE | Manual | sport (del pick original) | Referencia |
| S | PLATAFORMA ENVIO PICK | Manual | - | Canal |
| T | BOOKIE | Manual | bookmaker (del usuario) | Casa real usada |

---

## 🗂️ Sheet "Base datos" (Reference Data)

| Columna | Header | Contenido |
|---------|--------|-----------|
| A | BOOKIES | Lista de casas de apuestas |
| C | Plataformas de Pick/Tipsters | Lista de canales (Blogabet, Telegram, etc.) |
| E | DEPORTE | Lista de deportes |
| G | LIVE-PRE | PRE, LIVE |
| I | COMBINADA | Si, No, Sí |

---

## 📋 Plan de Implementación

### **Task 5A: Export to Excel** (Prioridad 1)

#### Funcionalidad:
- **Botón "Exportar a Excel"** en:
  1. PicksListPage (All Picks)
  2. MyPicksPage (My Picks)
  3. Dashboard (opcional - exportar todos los datos)

#### Estructura del archivo exportado:

**Sheets a generar:**
1. **Lanzadas Tipster** (todas las picks de todos los tipsters)
2. **Realizadas** (todos los follows del usuario)
3. **Base datos** (datos de referencia de la app)

#### Formato de exportación:

**Sheet "Lanzadas Tipster"**:
```
Fila 1: Stats (✅, ❌, 🔵, etc.) - Valores calculados
Fila 2: Fórmulas de stats globales
Fila 3-5: Instrucciones/plantilla
Fila 6: Headers de columnas
Fila 7+: Datos de picks
```

**Columnas exportadas** (valores manuales únicamente):
- A: pickType (LIVE/PRE/Combinado)
- B: tipsterName
- C: stake
- D: odds
- E: result (W/L/V o vacío si no resuelta)
- I: date (formato DD/MM/YYYY)
- J: time (formato HH:MM)
- M: betType
- Q: sport
- S: bookmaker

**Columnas con fórmulas** (se exportan con fórmulas de Excel):
- F: `=IF((E7)="w",C7*D7-C7,IF((E7)="L",-C7,0))` (Beneficio en unidades)
- G: `=IFERROR(($I$2/VLOOKUP(B7,Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C7,"")` (Cantidad apostada con bank)
- H: `=IF((E7)="w",G7*D7-G7,IF((E7)="L",-G7,0))` (Beneficio en €)

**Sheet "Realizadas"**:
Similar estructura, con datos de UserFollows.

**Sheet "Base datos"**:
- Exportar arrays de constants.ts:
  - allBookmakers → Columna A
  - allChannels → Columna C
  - allSports → Columna E
  - ["PRE", "LIVE"] → Columna G
  - ["Si", "No"] → Columna I

#### Librería a usar:
```bash
npm install xlsx --save-dev
npm install @types/xlsx --save-dev
```

#### Implementación técnica:

**Nuevo archivo**: `src/shared/utils/excelExport.ts`

```typescript
import * as XLSX from 'xlsx';
import { Pick, UserFollow, Tipster } from '@/shared/types';
import { allSports, allBookmakers, allChannels } from '@/shared/constants';

interface ExportOptions {
  picks?: Pick[];
  follows?: UserFollow[];
  tipsters?: Tipster[];
  includeFormulas?: boolean;
}

export const exportToExcel = (options: ExportOptions) => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Lanzadas Tipster
  if (options.picks) {
    const pickSheet = generatePickSheet(options.picks, options.tipsters);
    XLSX.utils.book_append_sheet(workbook, pickSheet, 'Lanzadas Tipster');
  }
  
  // Sheet 2: Realizadas
  if (options.follows) {
    const followSheet = generateFollowSheet(options.follows, options.tipsters, options.picks);
    XLSX.utils.book_append_sheet(workbook, followSheet, 'Realizadas');
  }
  
  // Sheet 3: Base datos
  const baseDataSheet = generateBaseDataSheet();
  XLSX.utils.book_append_sheet(workbook, baseDataSheet, 'Base datos');
  
  // Generar archivo
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tipster-tracker-${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

function generatePickSheet(picks: Pick[], tipsters?: Tipster[]) {
  // Ordenar por fecha desc
  const sortedPicks = [...picks].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Crear estructura con fila de stats, headers, y datos
  const rows = [
    // Fila 1: Stats (dejar vacío por ahora)
    ['', '✅', '❌', '🔵', 'UDS.', 'Beneficio', 'Yield Global', 'Bank Actual', 'Bank Inicial', 'Apostado'],
    // Fila 2: Fórmulas (agregar después)
    [],
    // Fila 3-5: Plantilla
    ['      PLANTILLA EII', '', '', '', '', 'rellenar con los picks que lanza el tipster'],
    [],
    [],
    // Fila 6: Headers
    ['LIVE-PRE', 'TIPSTER', 'STAKE', 'CUOTA', 'W/L/V', 'Res. Uds', 'CANTIDAD', 'Res. €', 'FECHA', 'HORA', 'FECHA PARTIDO (PRE)', 'HORA PARTIDO (PRE)', 'APUESTA', '', '', 'COMBINADA', 'DEPORTE', 'PLATAFORMA ENVIO PICK', 'BOOKIE Recomendado'],
  ];
  
  // Fila 7+: Datos
  sortedPicks.forEach(pick => {
    const tipster = tipsters?.find(t => t.id === pick.tipsterId);
    const row = [
      pick.pickType || 'PRE', // A
      tipster?.name || '', // B
      pick.stake, // C
      pick.odds, // D
      pick.isResolved ? (pick.result === 'Ganada' ? 'W' : pick.result === 'Perdida' ? 'L' : 'V') : '', // E
      // F, G, H: fórmulas (agregar después con cellFormula)
      '', '', '',
      formatDate(pick.date), // I
      pick.time, // J
      '', // K
      '', // L
      pick.betType, // M
      '', '', // N, O vacías
      '', // P combinada
      pick.sport, // Q
      tipster?.channel || '', // R
      pick.bookmaker, // S
    ];
    rows.push(row);
  });
  
  return XLSX.utils.aoa_to_sheet(rows);
}

function generateFollowSheet(follows: UserFollow[], tipsters?: Tipster[], picks?: Pick[]) {
  // Similar a generatePickSheet pero con datos de follows
  // ...
}

function generateBaseDataSheet() {
  const rows = [
    ['BOOKIES', '', 'Plataformas de Pick/Tipsters', '', 'DEPORTE', '', 'LIVE-PRE', '', 'COMBINADA'],
  ];
  
  const maxLength = Math.max(
    allBookmakers.length,
    allChannels.length,
    allSports.length
  );
  
  for (let i = 0; i < maxLength; i++) {
    rows.push([
      allBookmakers[i] || '',
      '',
      allChannels[i] || '',
      '',
      allSports[i] || '',
      '',
      i < 2 ? (i === 0 ? 'PRE' : 'LIVE') : '',
      '',
      i < 2 ? (i === 0 ? 'Si' : 'No') : '',
    ]);
  }
  
  return XLSX.utils.aoa_to_sheet(rows);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
```

#### Integración en componentes:

**PicksListPage.tsx**:
```tsx
import { exportToExcel } from '@/shared/utils/excelExport';

// En el componente
const handleExport = () => {
  exportToExcel({
    picks: filteredPicks, // Solo picks filtradas actualmente
    tipsters,
  });
};

// En el JSX (añadir botón junto a filtros)
<Button
  variant="outline"
  onClick={handleExport}
  className="gap-2"
>
  <Download size={16} />
  Exportar a Excel
</Button>
```

**MyPicksPage.tsx**:
```tsx
const handleExport = () => {
  exportToExcel({
    follows: filteredFollows, // Solo follows filtrados
    tipsters,
    picks, // Necesarios para contexto
  });
};
```

---

### **Task 5B: Import from Excel** (Prioridad 2)

#### Funcionalidad:
- **Botón "Importar desde Excel"** en:
  1. PicksListPage
  2. MyPicksPage
  3. Dashboard (para importación masiva)

#### Flujo de importación:

1. **Upload de archivo** (.xlsx)
2. **Validación de estructura**:
   - Verificar que existen los sheets requeridos
   - Verificar headers en fila 6
   - Validar formato de datos
3. **Preview de datos** (modal con tabla):
   - Mostrar picks/follows a importar
   - Indicar errores de validación
   - Permitir seleccionar qué filas importar
4. **Confirmación**:
   - Botón "Importar X picks" / "Importar X follows"
   - Mostrar progreso durante importación
5. **Resultado**:
   - Toast con resumen: "✅ 15 picks importadas, ⚠️ 2 con errores"
   - Log de errores si los hay

#### Validaciones:

**Para Picks**:
- ✅ Tipster existe o crear nuevo
- ✅ Stake entre 1-10
- ✅ Odds > 1.0
- ✅ Fecha válida
- ✅ Sport existe en allSports
- ✅ Bookmaker existe en allBookmakers
- ✅ pickType: PRE/LIVE/Combinado
- ✅ result: W/L/V o vacío

**Para Follows**:
- ✅ Pick original existe (match por tipster + fecha + odds?)
- ✅ userStake entre 1-10
- ✅ userOdds > 1.0
- ✅ userResult: W/L/V o vacío

#### Implementación técnica:

**Nuevo archivo**: `src/shared/utils/excelImport.ts`

```typescript
import * as XLSX from 'xlsx';
import { Pick, UserFollow, Tipster } from '@/shared/types';

interface ImportResult {
  success: boolean;
  picks?: Pick[];
  follows?: UserFollow[];
  errors: ImportError[];
  summary: ImportSummary;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  newTipsters: string[];
}

export const importFromExcel = async (
  file: File,
  existingTipsters: Tipster[]
): Promise<ImportResult> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  
  const result: ImportResult = {
    success: false,
    errors: [],
    summary: {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      newTipsters: [],
    },
  };
  
  // Validar estructura del archivo
  if (!workbook.SheetNames.includes('Lanzadas Tipster')) {
    result.errors.push({
      row: 0,
      field: 'file',
      message: 'Sheet "Lanzadas Tipster" no encontrado',
      value: null,
    });
    return result;
  }
  
  // Parsear picks
  const pickSheet = workbook.Sheets['Lanzadas Tipster'];
  const pickRows = XLSX.utils.sheet_to_json(pickSheet, { header: 1, range: 6 }); // Desde fila 7 (índice 6)
  
  const picks: Pick[] = [];
  
  pickRows.forEach((row: any, idx) => {
    const rowNumber = idx + 7; // Offset de fila real en Excel
    
    // Validar y parsear cada campo
    const validation = validatePickRow(row, existingTipsters, rowNumber);
    
    if (validation.valid) {
      picks.push(validation.pick!);
      result.summary.validRows++;
    } else {
      result.errors.push(...validation.errors);
      result.summary.invalidRows++;
    }
  });
  
  result.success = result.summary.validRows > 0;
  result.picks = picks;
  result.summary.totalRows = pickRows.length;
  
  return result;
};

function validatePickRow(
  row: any[],
  existingTipsters: Tipster[],
  rowNumber: number
): { valid: boolean; pick?: Partial<Pick>; errors: ImportError[] } {
  const errors: ImportError[] = [];
  
  // Validar cada campo según mapeo
  const pickType = row[0]; // Columna A
  const tipsterName = row[1]; // Columna B
  const stake = row[2]; // Columna C
  const odds = row[3]; // Columna D
  const result = row[4]; // Columna E
  const date = row[8]; // Columna I
  const time = row[9]; // Columna J
  const betType = row[12]; // Columna M
  const sport = row[16]; // Columna Q
  const bookmaker = row[18]; // Columna S
  
  // Validaciones
  if (!tipsterName) {
    errors.push({
      row: rowNumber,
      field: 'tipster',
      message: 'Tipster es requerido',
      value: tipsterName,
    });
  }
  
  if (!stake || stake < 1 || stake > 10) {
    errors.push({
      row: rowNumber,
      field: 'stake',
      message: 'Stake debe estar entre 1 y 10',
      value: stake,
    });
  }
  
  if (!odds || odds <= 1.0) {
    errors.push({
      row: rowNumber,
      field: 'odds',
      message: 'Odds debe ser mayor a 1.0',
      value: odds,
    });
  }
  
  // ... más validaciones
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Crear objeto Pick
  const pick: Partial<Pick> = {
    pickType: pickType || 'PRE',
    // tipsterId: se resolverá después
    stake: Number(stake),
    odds: Number(odds),
    result: mapExcelResult(result),
    isResolved: !!result,
    date: parseExcelDate(date),
    time: time || '00:00',
    betType: betType || '',
    sport: sport || '',
    bookmaker: bookmaker || '',
  };
  
  return { valid: true, pick, errors: [] };
}

function mapExcelResult(excelResult: string): string {
  if (!excelResult) return '';
  const upper = excelResult.toUpperCase();
  if (upper === 'W') return 'Ganada';
  if (upper === 'L') return 'Perdida';
  if (upper === 'V') return 'Void';
  return '';
}

function parseExcelDate(excelDate: any): string {
  // Parsear fecha de Excel (puede ser serial number o string)
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  // Si es string DD/MM/YYYY, convertir a YYYY-MM-DD
  if (typeof excelDate === 'string' && excelDate.includes('/')) {
    const [day, month, year] = excelDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return excelDate;
}
```

**Componente de Import**:

**Nuevo archivo**: `src/features/picks/components/ImportExcelModal.tsx`

```tsx
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { importFromExcel, ImportResult } from '@/shared/utils/excelImport';
import { usePicksContext } from '@/features/picks/context/PicksContext';
import { useTipstersContext } from '@/features/tipsters/context/TipstersContext';

export const ImportExcelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addPick } = usePicksContext();
  const { tipsters } = useTipstersContext();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportResult(null);
    }
  };
  
  const handlePreview = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const result = await importFromExcel(file, tipsters);
      setImportResult(result);
    } catch (error) {
      console.error('Error al procesar archivo:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirmImport = async () => {
    if (!importResult || !importResult.picks) return;
    
    setIsProcessing(true);
    try {
      // Importar picks una por una
      for (const pick of importResult.picks) {
        await addPick(pick);
      }
      
      // Mostrar toast de éxito
      onClose();
    } catch (error) {
      console.error('Error al importar picks:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importar desde Excel">
      <div className="space-y-4">
        {/* Upload */}
        <div>
          <label className="btn btn--outline cursor-pointer">
            <Upload size={16} />
            Seleccionar archivo Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && <p className="mt-2 text-sm">Archivo: {file.name}</p>}
        </div>
        
        {/* Preview Button */}
        {file && !importResult && (
          <Button onClick={handlePreview} disabled={isProcessing}>
            {isProcessing ? 'Procesando...' : 'Vista previa'}
          </Button>
        )}
        
        {/* Result Preview */}
        {importResult && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 bg-surface rounded-lg">
              <h4 className="font-medium mb-2">Resumen de importación</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>{importResult.summary.validRows} picks válidos</span>
                </div>
                {importResult.summary.invalidRows > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-error" />
                    <span>{importResult.summary.invalidRows} picks con errores</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className="p-4 bg-error/10 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-medium mb-2 text-error">Errores encontrados</h4>
                <ul className="space-y-1 text-sm">
                  {importResult.errors.slice(0, 10).map((error, idx) => (
                    <li key={idx}>
                      Fila {error.row}, campo "{error.field}": {error.message}
                    </li>
                  ))}
                  {importResult.errors.length > 10 && (
                    <li className="text-muted">... y {importResult.errors.length - 10} errores más</li>
                  )}
                </ul>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleConfirmImport}
                disabled={!importResult.success || isProcessing}
              >
                {isProcessing ? 'Importando...' : `Importar ${importResult.summary.validRows} picks`}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
```

---

## 📅 Estimación de Tiempo

**Task 5A - Export**:
- Setup librería xlsx: 15 min
- Función generatePickSheet: 1h
- Función generateFollowSheet: 45 min
- Función generateBaseDataSheet: 30 min
- Fórmulas de Excel: 1h
- Integración en componentes: 30 min
- Testing: 1h
- **Total: ~5 horas**

**Task 5B - Import**:
- Función importFromExcel: 1.5h
- Validaciones: 1.5h
- Componente ImportExcelModal: 2h
- Preview y UI: 1h
- Manejo de errores: 1h
- Testing: 1.5h
- **Total: ~8.5 horas**

**Total Task 5: ~13.5 horas (2 días de trabajo)**

---

## ✅ Checklist de Implementación

### Task 5A - Export:
- [ ] Instalar xlsx library
- [ ] Crear excelExport.ts con funciones base
- [ ] Implementar generatePickSheet con estructura correcta
- [ ] Añadir fórmulas de Excel en columnas auto-calculadas
- [ ] Implementar generateFollowSheet
- [ ] Implementar generateBaseDataSheet
- [ ] Añadir botón Export en PicksListPage
- [ ] Añadir botón Export en MyPicksPage
- [ ] Probar exportación con datos reales
- [ ] Verificar formato compatible con template
- [ ] Commit y push

### Task 5B - Import:
- [ ] Crear excelImport.ts con funciones base
- [ ] Implementar validaciones de datos
- [ ] Crear ImportExcelModal component
- [ ] Implementar preview de datos
- [ ] Implementar confirmación e importación real
- [ ] Manejo de errores y feedback
- [ ] Añadir botón Import en PicksListPage
- [ ] Añadir botón Import en MyPicksPage
- [ ] Probar importación con template Excel
- [ ] Probar casos de error (datos inválidos)
- [ ] Commit y push

---

## 🎯 Priorización

1. **Fase 1**: Task 5A (Export) - Más simple, da valor inmediato
2. **Fase 2**: Task 5B (Import) - Más complejo, requiere validaciones extensas

¿Procedemos con Task 5A primero?
