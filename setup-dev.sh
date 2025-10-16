#!/bin/bash

# Script de setup para desarrollo en Linux/macOS

echo "🚀 Configurando entorno de desarrollo..."

# Verificar si Docker está ejecutándose
echo "📋 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no encontrado. Por favor instala Docker"
    exit 1
fi
echo "✅ Docker encontrado"

# Verificar si Node.js está instalado
echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Por favor instala Node.js >= 18"
    exit 1
fi
echo "✅ Node.js encontrado"

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📋 Creando archivo .env..."
    cp env.example .env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Iniciar servicios de Docker
echo "🐳 Iniciando servicios de Docker..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Generar cliente de Prisma
echo "🗄️ Generando cliente de Prisma..."
cd backend
npx prisma generate

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npx prisma migrate dev --name init

# Poblar base de datos con datos de prueba
echo "🌱 Poblando base de datos..."
npm run db:seed

cd ..

echo "🎉 Setup completado!"
echo ""
echo "Para iniciar el desarrollo:"
echo "  npm run dev"
echo ""
echo "Servicios disponibles:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  MinIO:    http://localhost:9001"
echo ""
echo "Credenciales de prueba:"
echo "  Email: admin@empresa-demo.com"
echo "  Password: admin123"



