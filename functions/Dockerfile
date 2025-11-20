# 🐳 Dockerfile para Cloud Run
# Backend Express + Python para exportación Excel

FROM node:20-slim

# Instalar Python 3 y pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Instalar openpyxl para estilos Excel
RUN pip3 install openpyxl --break-system-packages

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar código fuente
COPY . .

# Crear directorio temp para archivos temporales
RUN mkdir -p temp

# Exponer puerto (Cloud Run usa 8080)
EXPOSE 8080

# Variable de entorno para puerto
ENV PORT=8080

# Comando de inicio
CMD ["node", "index.js"]
