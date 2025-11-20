# 🚀 Tipster Tracker - Excel Export Backend

Backend Express para generar exportaciones Excel completas con estilos y validaciones.

## 📋 Descripción

Este backend recibe datos del frontend (picks, follows, tipsters), genera un archivo Excel con la estructura completa, aplica estilos profesionales usando Python (openpyxl), y retorna el archivo listo para descargar.

## 🏗️ Arquitectura

```
Frontend (React)
    ↓ HTTP POST /api/export-excel
    ↓ { picks, follows, tipsters }
Express Backend (Node.js)
    ↓ 1. Genera estructura con xlsx
    ↓ 2. Pobla datos
    ↓ 3. Ejecuta Python para estilos
Python Script (openpyxl)
    ↓ Aplica: colores, fuentes, dropdowns, formato condicional
Excel Completo
    ↓ Download
Usuario
```

## 📦 Requisitos

- **Node.js**: >= 18.0.0
- **Python**: >= 3.8
- **Python packages**: `openpyxl`

### Instalación Python dependencies

```bash
pip3 install openpyxl
# o
pip3 install openpyxl --break-system-packages
```

## 🚀 Desarrollo Local

### 1. Instalar dependencias

```bash
cd functions
npm install
```

### 2. Iniciar backend

```bash
npm start
# o
node index.js
```

El servidor estará disponible en **http://localhost:3001**

### 3. Iniciar frontend (en otra terminal)

```bash
cd ../react-app
npm run dev
```

El frontend estará en **http://localhost:5173** y el proxy redirigirá `/api/*` al backend.

## 📡 API Endpoints

### POST `/api/export-excel`

Genera y retorna un archivo Excel completo con estilos.

**Request Body:**
```json
{
  "picks": [],      // Array de Pick[]
  "follows": [],    // Array de UserFollow[]
  "tipsters": []    // Array de Tipster[]
}
```

**Response:**
- Status: 200
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="tipster-tracker-export-YYYY-MM-DD.xlsx"`

**Errors:**
```json
{
  "error": "Error generando Excel",
  "details": "Error message"
}
```

### GET `/health`

Health check del servidor.

**Response:**
```json
{
  "status": "ok",
  "service": "excel-export-backend"
}
```

## 📁 Estructura

```
functions/
├── index.js                 # Express server principal
├── add-excel-styles.py      # Script Python para estilos
├── package.json             # Dependencies
├── temp/                    # Archivos temporales (gitignored)
└── README.md                # Esta documentación
```

## 🐛 Debugging

### Ver logs del backend

Los logs están en la terminal donde ejecutas `node index.js`:

```
📥 [REQUEST] Recibida petición de export
📊 [DATA] Picks: 50, Follows: 30, Tipsters: 10
🔨 [STEP 1] Generando estructura Excel...
💾 [STEP 2] Escribiendo archivo temporal...
🎨 [STEP 3] Aplicando estilos con Python...
🐍 [PYTHON] Ejecutando: python3 ...
✅ [PYTHON] Estilos aplicados correctamente
✅ [STEP 4] Enviando archivo al cliente...
🗑️  [CLEANUP] Archivo temporal eliminado
✅ [SUCCESS] Export completado correctamente
```

### Probar endpoint manualmente

```bash
curl -X POST http://localhost:3001/api/export-excel \
  -H "Content-Type: application/json" \
  -d '{"picks":[],"follows":[],"tipsters":[]}' \
  --output test.xlsx
```

## 🚢 Deploy (Cloud Run + Firebase)

### 1. Crear Dockerfile

```dockerfile
FROM node:20-slim

# Instalar Python y openpyxl
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install openpyxl --break-system-packages

# Copiar código
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Exponer puerto
EXPOSE 8080

# Iniciar servidor
CMD ["node", "index.js"]
```

### 2. Configurar Firebase (firebase.json)

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

### 3. Deploy

```bash
# Build frontend
cd react-app && npm run build

# Deploy todo
cd .. && firebase deploy
```

## ⚙️ Variables de Entorno

- `PORT`: Puerto del servidor (default: 3001)
- `NODE_ENV`: Entorno (development/production)

## 🔧 Troubleshooting

### Error: `python3: command not found`

Instala Python 3:
```bash
sudo apt install python3 python3-pip
```

### Error: `No module named 'openpyxl'`

Instala openpyxl:
```bash
pip3 install openpyxl --break-system-packages
```

### Error: `ENOSPC: no space left on device`

El directorio `temp/` se está llenando. Limpia archivos antiguos:
```bash
rm -rf functions/temp/*
```

### El archivo descargado no tiene estilos

Verifica logs del Python script. Debe mostrar:
```
✅ [PYTHON] Estilos aplicados correctamente
```

## 📝 Notas

- Los archivos temporales se eliminan automáticamente después de cada export
- El servidor soporta múltiples peticiones simultáneas
- El límite de tamaño JSON es 50MB (configurable en `express.json()`)

## 🔗 Referencias

- [xlsx (SheetJS)](https://sheetjs.com/) - Generación de Excel en Node.js
- [openpyxl](https://openpyxl.readthedocs.io/) - Estilos Excel en Python
- [Express.js](https://expressjs.com/) - Framework web
- [Firebase Cloud Run](https://firebase.google.com/docs/hosting/cloud-run) - Deploy
