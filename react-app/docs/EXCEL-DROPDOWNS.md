# 📋 DROPDOWNS (DATA VALIDATIONS) - IMPLEMENTACIÓN AUTOMÁTICA

Este documento explica los dropdowns (validaciones de datos) del Excel exportado.

**✅ IMPLEMENTADO**: Los dropdowns se configuran **automáticamente** mediante el script Python `add-excel-styles.py` usando `openpyxl`. No requiere configuración manual.

---

## 📊 HOJAS: "Lanzadas Tipster" y "Realizadas"

### Columnas con Dropdowns

| Columna | Header | Tipo Validación | Origen Datos | Rango a Aplicar |
|---------|--------|----------------|--------------|-----------------|
| **A** | LIVE-PRE | Lista | 'Base datos'!$G$2:$G$4 | A7:A1853 |
| **B** | TIPSTER | Lista (dinámica) | Tipster_Picks_Dashboard!$A$3:$A$100 | B7:B1853 |
| **E** | W/L/V | Lista manual | W,L,V,HW,HL | E7:E1853 |
| **P/Q*** | COMBINADA | Lista | 'Base datos'!$H$2:$H$3 | P7:P1853 (Lanzadas) / Q7:Q2001 (Realizadas) |
| **Q/R*** | DEPORTE | Lista | 'Base datos'!$E$2:$E$20 | Q7:Q1853 (Lanzadas) / R7:R2001 (Realizadas) |
| **R/S*** | Plataforma | Lista | 'Base datos'!$C$2:$C$20 | R7:R1853 (Lanzadas) / S7:S2001 (Realizadas) |
| **S/T*** | BOOKIE | Lista | 'Base datos'!$A$2:$A$30 | S7:S1853 (Lanzadas) / T7:T2001 (Realizadas) |

_* Las columnas difieren entre "Lanzadas Tipster" (sin Comentarios) y "Realizadas" (con Comentarios en P)_

---

## ✅ IMPLEMENTACIÓN AUTOMÁTICA

Los dropdowns se configuran automáticamente mediante el script `add-excel-styles.py`:

```bash
# El script se ejecuta automáticamente después de generar el Excel
python3 scripts/add-excel-styles.py archivo.xlsx
```

### Código de Implementación (openpyxl)

```python
from openpyxl import load_workbook
from openpyxl.worksheet.datavalidation import DataValidation

wb = load_workbook('archivo.xlsx')
ws = wb['Lanzadas Tipster']

# Ejemplo: Dropdown para columna A (LIVE-PRE)
dv_livepre = DataValidation(
    type="list",
    formula1="'Base datos'!$G$2:$G$4",
    allow_blank=False
)
dv_livepre.error = 'Valor no válido'
dv_livepre.errorTitle = 'Error'
ws.add_data_validation(dv_livepre)
dv_livepre.add('A7:A1853')

# Ejemplo: Dropdown para columna E (W/L/V)
dv_result = DataValidation(
    type="list",
    formula1='"W,L,V,HW,HL"',
    allow_blank=False
)
ws.add_data_validation(dv_result)
dv_result.add('E7:E1853')

# Ejemplo: Dropdown para columna B (TIPSTER - dinámico)
dv_tipster = DataValidation(
    type="list",
    formula1="Tipster_Picks_Dashboard!$A$3:$A$100",
    allow_blank=False
)
ws.add_data_validation(dv_tipster)
dv_tipster.add('B7:B1853')

wb.save('archivo.xlsx')
```

---

## 📋 DROPDOWNS POR COLUMNA - DETALLE

### ✅ Columna A: LIVE-PRE
- **Valores**: PRE, LIVE, Combinado
- **Origen**: Hoja 'Base datos', rango $G$2:$G$4
- **Descripción**: Tipo de apuesta (antes del partido, en directo, o combinada)

### ✅ Columna B: TIPSTER
- **Valores**: Dinámicos (nombres de tipsters activos)
- **Origen**: Hoja 'Tipster_Picks_Dashboard', rango $A$3:$A$100
- **Descripción**: Nombre del tipster que recomendó la pick
- **Nota**: Este dropdown se actualiza automáticamente al añadir/eliminar tipsters

### ✅ Columna E: W/L/V
- **Valores**: W (Win), L (Loss), V (Void), HW (Half Win), HL (Half Loss)
- **Origen**: Lista manual "W,L,V,HW,HL"
- **Descripción**: Resultado de la pick
  - W: Ganada
  - L: Perdida
  - V: Void/Anulada
  - HW: Media ganada (Asian handicap)
  - HL: Media perdida (Asian handicap)

### ✅ Columna P (Lanzadas) / Q (Realizadas): COMBINADA
- **Valores**: Si, No
- **Origen**: Hoja 'Base datos', rango $H$2:$H$3
- **Descripción**: Indica si la pick es parte de una apuesta combinada

### ✅ Columna Q (Lanzadas) / R (Realizadas): DEPORTE
- **Valores**: Fútbol, Baloncesto, Tenis, etc.
- **Origen**: Hoja 'Base datos', rango $E$2:$E$20
- **Descripción**: Deporte de la pick
- **Personalizable**: Se puede añadir más deportes en la hoja 'Base datos'

### ✅ Columna R (Lanzadas) / S (Realizadas): Plataforma envio pick
- **Valores**: Telegram, BlogaBet, Discord, etc.
- **Origen**: Hoja 'Base datos', rango $C$2:$C$20
- **Descripción**: Canal o plataforma donde el tipster publicó la pick
- **Personalizable**: Se puede añadir más canales en la hoja 'Base datos'

### ✅ Columna S (Lanzadas) / T (Realizadas): BOOKIE
- **Valores**: Bet365, Betfair, Codere, etc.
- **Origen**: Hoja 'Base datos', rango $A$2:$A$30
- **Descripción**: Casa de apuestas recomendada o utilizada
- **Personalizable**: Se puede añadir más bookmakers en la hoja 'Base datos'

---

## 🔄 ACTUALIZACIÓN DINÁMICA

### Dropdowns que se actualizan automáticamente:

1. **TIPSTER** (Columna B):
   - Se actualiza al añadir/eliminar tipsters en la app
   - Lee desde 'Tipster_Picks_Dashboard' que se genera dinámicamente

2. **DEPORTE, Plataforma, BOOKIE** (desde 'Base datos'):
   - Se pueden editar directamente en la hoja 'Base datos'
   - Los dropdowns reflejan los cambios automáticamente

---

## 🎯 SCRIPT AUTOMATIZADO (FUTURO)

Para automatizar completamente la configuración de dropdowns, se podría:

1. **Crear script Python** (`scripts/add-excel-dropdowns.py`) usando `openpyxl`
2. **Integrar en el flujo de exportación** de la app React
3. **Aplicar automáticamente** todas las validaciones al exportar

**Ventajas**:
- ✅ Configuración automática
- ✅ Consistencia garantizada
- ✅ Sin intervención manual

**Desventaja**:
- ⚠️ Requiere `openpyxl` instalado en servidor/cliente

---

## 📝 NOTAS IMPORTANTES

1. **Rangos de datos**: Los rangos (A7:A1853, B7:B2001) están configurados para soportar ~1800-2000 picks
2. **Hoja 'Base datos'**: Debe contener los valores de referencia para dropdowns
3. **Formato de lista manual**: Para listas cortas (W/L/V), se puede usar `"valor1,valor2,valor3"` directamente
4. **Compatibilidad**: Las validaciones funcionan en Excel, LibreOffice Calc y Google Sheets

---

## 🎯 ESTADO ACTUAL

- [x] Script Python para añadir dropdowns automáticamente ✅
- [x] Integrado en workflow de exportación ✅
- [x] Documentación completa de dropdowns ✅
- [ ] Exportación con datos reales desde la app ⏳
- [ ] Integración en UI (botones de exportación) ⏳

---

## 🚀 PRÓXIMOS PASOS

1. **Exportar con datos reales**:
   - Implementar `exportPicksToExcel(picks, follows)` en `excelExport.ts`
   - Mapear Pick → Lanzadas Tipster
   - Mapear UserFollow → Realizadas
   - Calcular dashboards con datos reales

2. **Integración UI**:
   - Añadir botones de exportación en:
     * PicksListPage (exportar picks filtrados)
     * MyPicksPage (exportar follows filtrados)
     * Dashboard (exportar todo)

3. **Task 5B - Import from Excel**:
   - Upload component
   - Parsing y validación
   - Preview con errores
   - Batch import a Firestore

---

**Última actualización**: 19 de Noviembre de 2025  
**Estado**: Dropdowns completamente automatizados ✅
