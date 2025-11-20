# 📊 Tipster Tracker - Export System Guide

## 🎯 Sistema de Exportación Excel

Este proyecto incluye un sistema completo de exportación a Excel con estilos profesionales, validaciones y fórmulas automáticas.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + Vite)                                    │
│  http://localhost:5173                                      │
│                                                             │
│  • Dashboard con FAB button                                │
│  • Hooks: usePicks, useFollows, useTipsters               │
│  • Envía datos JSON vía POST /api/export-excel            │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP POST
                  │ { picks, follows, tipsters }
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Express (Node.js)                                  │
│  http://localhost:3001                                      │
│                                                             │
│  1. Recibe datos JSON                                      │
│  2. Genera Excel con xlsx (estructura + datos)             │
│  3. Ejecuta Python para aplicar estilos                    │
│  4. Retorna archivo completo                               │
└─────────────────┬───────────────────────────────────────────┘
                  │ exec('python3 add-excel-styles.py')
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Python Script (openpyxl)                                   │
│                                                             │
│  • Estilos: Arial, colores, bordes                         │
│  • Dropdowns nativos de Excel                              │
│  • Formato condicional (profit)                            │
│  • Anchos de columna                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Desarrollo Local

### Requisitos

- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **openpyxl**: `pip3 install openpyxl`

### 1. Instalar dependencias

```bash
# Frontend
cd react-app
npm install

# Backend
cd ../functions
npm install
```

### 2. Iniciar servicios (2 terminales)

**Terminal 1 - Backend Express:**
```bash
cd functions
node index.js
```

Output esperado:
```
═══════════════════════════════════════════════════
🚀 TIPSTER TRACKER - EXCEL EXPORT BACKEND
═══════════════════════════════════════════════════
✅ Servidor corriendo en http://localhost:3001
📊 Endpoint: POST /api/export-excel
🏥 Health: GET /health
═══════════════════════════════════════════════════
```

**Terminal 2 - Frontend React:**
```bash
cd react-app
npm run dev
```

Output esperado:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### 3. Probar exportación

1. Abrir navegador: `http://localhost:5173`
2. Ir al Dashboard
3. Click en el botón flotante (esquina inferior derecha) 🔵
4. Esperar generación (~5-10s dependiendo de datos)
5. El Excel se descargará automáticamente

---

## 📁 Estructura del Proyecto

```
tipster-tracker/
├── react-app/                    # Frontend React
│   ├── src/
│   │   ├── features/
│   │   │   └── dashboard/
│   │   │       └── pages/
│   │   │           └── DashboardPage/
│   │   │               └── DashboardPage.tsx  # FAB button + API call
│   │   └── shared/
│   │       └── utils/
│   │           └── excelExport.ts  # DEPRECATED (legacy)
│   ├── vite.config.ts           # Proxy /api → localhost:3001
│   └── package.json
│
├── functions/                    # Backend Express
│   ├── index.js                 # Server principal + lógica Excel
│   ├── add-excel-styles.py      # Python styles script
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
├── firebase.json                 # Firebase config (hosting + rewrites)
└── EXPORT-SYSTEM-GUIDE.md       # Este documento
```

---

## 📊 Estructura del Excel Generado

### Hojas (6 total)

1. **Lanzadas Tipster** (picks lanzados por tipsters)
   - Columnas: TIPO, TIPSTER, PARTIDO, TIPO APUESTA, RESULTADO, CUOTA, UNIDADES, FECHA, LIGA, DEPORTE, PROFIT
   
2. **Realizadas** (picks seguidos por el usuario)
   - Columnas: TIPO, TIPSTER, PARTIDO, TIPO APUESTA, SEGUIDA, RESULTADO, CUOTA, UNIDADES, FECHA, LIGA, DEPORTE, PROFIT
   
3. **Dashboard General** (estadísticas de todos los tipsters)
   - Columnas: TIPSTER, PICKS, WON, LOST, VOID, %, PROFIT, YIELD, AVG CUOTA
   
4. **Dashboard Fútbol** (filtrado por deporte)
5. **Dashboard Basket** (filtrado por deporte)
6. **Dashboard Tenis** (filtrado por deporte)

### Características del Excel

✅ **Estilos profesionales**: Arial 11pt, colores, bordes  
✅ **Dropdowns nativos**: 7 validaciones por hoja (TIPO, RESULTADO, DEPORTE, etc.)  
✅ **Formato condicional**: Profit en rojo (negativo) o verde (positivo)  
✅ **Fórmulas automáticas**: Cálculos de %, YIELD, AVG CUOTA  
✅ **Anchos optimizados**: Columnas ajustadas para legibilidad  

---

## 🐛 Troubleshooting

### ❌ Error: Backend no responde

**Síntomas**: Alert "Error al generar Excel... ¿Está el backend corriendo?"

**Solución**:
```bash
# Verificar si el backend está corriendo
curl http://localhost:3001/health

# Si no responde, iniciar backend
cd functions && node index.js
```

---

### ❌ Error: `python3: command not found`

**Solución**:
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# macOS
brew install python3
```

---

### ❌ Error: `No module named 'openpyxl'`

**Solución**:
```bash
pip3 install openpyxl

# Si da error de permisos
pip3 install openpyxl --break-system-packages
```

---

### ❌ El Excel se descarga pero está vacío

**Diagnóstico**:
1. Abrir DevTools (F12) → Console
2. Buscar logs: `[DATA] Datos disponibles: picks: X, follows: Y`
3. Si X=0, Y=0 → No hay datos en Firestore

**Solución**: Asegúrate de tener picks/follows/tipsters en la base de datos

---

### ❌ El Excel no tiene estilos

**Diagnóstico**:
```bash
# Ver logs del backend (Terminal 1)
# Debe mostrar:
🎨 [STEP 3] Aplicando estilos con Python...
🐍 [PYTHON] Ejecutando: python3 ...
✅ [PYTHON] Estilos aplicados correctamente
```

**Solución**:
- Verificar que `add-excel-styles.py` existe en `functions/`
- Verificar que `openpyxl` está instalado

---

## 🚢 Deploy a Producción (Firebase + Cloud Run)

### Paso 1: Crear Dockerfile

```dockerfile
# functions/Dockerfile
FROM node:20-slim

# Instalar Python y openpyxl
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install openpyxl --break-system-packages

# Copiar código
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Exponer puerto Cloud Run
EXPOSE 8080
ENV PORT=8080

CMD ["node", "index.js"]
```

### Paso 2: Actualizar firebase.json

```json
{
  "hosting": {
    "site": "tipstertracker",
    "public": "react-app/dist",
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "excel-export",
          "region": "europe-west1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Paso 3: Deploy

```bash
# Build frontend
cd react-app
npm run build

# Deploy todo
cd ..
firebase deploy
```

---

## 📝 Flujo de Datos Completo

```
1. Usuario click en FAB button (Dashboard)
   ↓
2. DashboardPage.handleExportToExcel()
   - Lee: picks, follows, tipsters (hooks)
   - POST /api/export-excel con JSON
   ↓
3. Vite proxy redirige → http://localhost:3001
   ↓
4. Express backend recibe request
   ↓
5. generateExcelStructure()
   - generateLanzadasSheet(picks)
   - generateRealizadasSheet(follows)
   - generateDashboardSheet() x4
   ↓
6. XLSX.writeFile() → temp/export-TIMESTAMP.xlsx
   ↓
7. applyPythonStyles()
   - exec('python3 add-excel-styles.py file.xlsx')
   - Aplica: estilos, dropdowns, formato condicional
   ↓
8. res.download() → Archivo al navegador
   ↓
9. Frontend descarga automáticamente
   ↓
10. Backend limpia archivo temporal
```

---

## 🔗 Referencias

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Express.js + Node.js 20
- **Excel (Node)**: [SheetJS xlsx](https://sheetjs.com/)
- **Excel (Python)**: [openpyxl](https://openpyxl.readthedocs.io/)
- **Deploy**: Firebase Hosting + Cloud Run
- **Proxy**: Vite Server Proxy

---

## 📞 Soporte

Para issues o dudas, revisar:
- `functions/README.md` - Documentación del backend
- Logs del backend (Terminal 1)
- DevTools Console (F12)

---

**Última actualización**: 20 de noviembre de 2025
