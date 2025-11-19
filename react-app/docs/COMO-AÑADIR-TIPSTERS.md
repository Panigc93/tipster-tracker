# �� CÓMO AÑADIR Y USAR TIPSTERS EN EL EXCEL

## 🎯 FLUJO CORRECTO (MUY IMPORTANTE)

### ❌ LO QUE **NO** FUNCIONA:
```
1. Ir a "Realizadas"
2. Escribir "JOHN" directamente en columna B (TIPSTER)
3. Esperar que aparezca en el dropdown

❌ ESTO NO FUNCIONA porque el dropdown busca en el Dashboard
```

### ✅ LO QUE **SÍ** FUNCIONA:

```
PASO 1: AÑADIR EL TIPSTER AL DASHBOARD
┌─────────────────────────────────────────┐
│ Ve a la hoja "Mis_Picks_Dashboard"      │
│ o "Tipster_Picks_Dashboard"             │
│                                         │
│ Escribe "JOHN" en columna A             │
│ (en cualquier fila vacía: A4, A5, etc.)│
└─────────────────────────────────────────┘
              ↓
    ¡AUTOMÁTICAMENTE!
              ↓
┌─────────────────────────────────────────┐
│ "JOHN" aparece en el dropdown           │
│ de la hoja "Realizadas" o               │
│ "Lanzadas Tipster"                      │
└─────────────────────────────────────────┘
              ↓
PASO 2: REGISTRAR PICKS
┌─────────────────────────────────────────┐
│ Ve a "Realizadas" o "Lanzadas Tipster"  │
│                                         │
│ Abre el dropdown de columna B          │
│ (TIPSTER)                               │
│                                         │
│ ¡Verás "JOHN" en la lista!              │
└─────────────────────────────────────────┘
```

## 📊 ¿DÓNDE AÑADIR EL TIPSTER?

### Para picks que TÚ seguiste:
- **Dashboard**: `Mis_Picks_Dashboard` → Columna A
- **Registrar picks**: `Realizadas` → Columna B (dropdown)
- **Estadísticas**: Se calculan automáticamente en `Mis_Picks_Dashboard`

### Para picks que lanzó el tipster:
- **Dashboard**: `Tipster_Picks_Dashboard` → Columna A
- **Registrar picks**: `Lanzadas Tipster` → Columna B (dropdown)
- **Estadísticas**: Se calculan automáticamente en `Tipster_Picks_Dashboard`

## 🔄 DIAGRAMA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│           1. AÑADIR TIPSTER (Dashboard)                 │
│                                                         │
│  Mis_Picks_Dashboard                                    │
│  ┌─────────┬──────────┬─────────┬────────┐            │
│  │ TIPSTER │ Juega UDS│ Benefic │ Yield  │            │
│  ├─────────┼──────────┼─────────┼────────┤            │
│  │ Manolo  │    10    │  +25.3  │ +12.5% │            │
│  │ JOHN    │ ← ESCRIBE AQUÍ     │        │            │
│  └─────────┴──────────┴─────────┴────────┘            │
└─────────────────────────────────────────────────────────┘
                        ↓
              ¡AUTOMÁTICO!
                        ↓
┌─────────────────────────────────────────────────────────┐
│         2. DROPDOWN SE ACTUALIZA                        │
│                                                         │
│  Realizadas                                             │
│  ┌──────┬──────────▼──┬────────┬──────┐               │
│  │ LIVE │  TIPSTER    │ W/L/V  │ UDS  │               │
│  ├──────┼─────────────┼────────┼──────┤               │
│  │ PRE  │ [Manolo  ▼] │   W    │  2   │               │
│  │ LIVE │ [JOHN    ▼] │← AHORA APARECE │               │
│  └──────┴─────────────┴────────┴──────┘               │
└─────────────────────────────────────────────────────────┘
                        ↓
              ¡AUTOMÁTICO!
                        ↓
┌─────────────────────────────────────────────────────────┐
│         3. ESTADÍSTICAS SE CALCULAN                     │
│                                                         │
│  Mis_Picks_Dashboard                                    │
│  ┌─────────┬──────────┬─────────┬────────┐            │
│  │ TIPSTER │ Juega UDS│ Benefic │ Yield  │            │
│  ├─────────┼──────────┼─────────┼────────┤            │
│  │ Manolo  │    10    │  +25.3  │ +12.5% │            │
│  │ JOHN    │    2     │  +3.8   │ +8.2%  │← ¡CALCULADO!│
│  └─────────┴──────────┴─────────┴────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 💡 EJEMPLO PRÁCTICO PASO A PASO

### Quiero seguir picks de un tipster llamado "PETER"

**Paso 1**: Voy a `Mis_Picks_Dashboard`
```
Celda A4: escribo "PETER"
```

**Paso 2**: Voy a `Realizadas`
```
Celda B7: Hago click en el dropdown
        → ¡Veo "PETER" en la lista!
        → Lo selecciono
```

**Paso 3**: Completo el resto de la fila 7
```
A7: PRE
B7: PETER
C7: ❌ (si perdió)
D7: Fútbol
E7: Real Madrid vs Barcelona
...etc
```

**Paso 4**: Vuelvo a `Mis_Picks_Dashboard`
```
Fila 4 ahora muestra:
PETER | 1 | -2 | -100% | 1 | 0 | 1 | ...
      ↑ Todo calculado automáticamente
```

## ⚠️ ERRORES COMUNES

### ❌ Error 1: "Escribo el tipster en Realizadas y no aparece en el dropdown"
**Solución**: El tipster se añade en el DASHBOARD, no en Realizadas

### ❌ Error 2: "El dropdown está vacío"
**Solución**: Añade al menos un tipster en la columna A del dashboard correspondiente

### ❌ Error 3: "Las fórmulas no calculan"
**Solución**: Verifica que:
1. El tipster existe en el dashboard (columna A)
2. Hay picks registradas con ese nombre exacto en Realizadas/Lanzadas

## 🎓 RESUMEN CLAVE

| Acción                    | Hoja                       | Columna |
|---------------------------|----------------------------|---------|
| **Añadir tipster**        | Dashboard (Mis/Tipster)    | A       |
| **Seleccionar tipster**   | Realizadas/Lanzadas        | B       |
| **Ver estadísticas**      | Dashboard (Mis/Tipster)    | B-T     |

## 📝 CHECKLIST ANTES DE REGISTRAR UNA PICK

- [ ] ¿El tipster ya existe en el dashboard correspondiente?
- [ ] Si no existe, ¿lo añadí en la columna A del dashboard?
- [ ] ¿Aparece el tipster en el dropdown de la hoja de datos?
- [ ] ¿Completé todos los campos obligatorios?

---

**🎯 REGLA DE ORO**: 
Primero dashboard → Luego registrar picks → Estadísticas automáticas

