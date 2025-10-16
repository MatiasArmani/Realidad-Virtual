# Script de setup para desarrollo en Windows PowerShell

Write-Host "🚀 Configurando entorno de desarrollo..." -ForegroundColor Green

# Verificar si Docker está ejecutándose
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no encontrado. Por favor instala Docker Desktop" -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
Write-Host "📋 Verificando Node.js..." -ForegroundColor Yellow
try {
    node --version | Out-Null
    Write-Host "✅ Node.js encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instala Node.js >= 18" -ForegroundColor Red
    exit 1
}

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Iniciar servicios de Docker
Write-Host "🐳 Iniciando servicios de Docker..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Generar cliente de Prisma
Write-Host "🗄️ Generando cliente de Prisma..." -ForegroundColor Yellow
cd backend
npx prisma generate

# Ejecutar migraciones
Write-Host "🗄️ Ejecutando migraciones..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Poblar base de datos con datos de prueba
Write-Host "🌱 Poblando base de datos..." -ForegroundColor Yellow
npm run db:seed

cd ..

Write-Host "🎉 Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el desarrollo:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Servicios disponibles:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  MinIO:    http://localhost:9001" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "  Email: admin@empresa-demo.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White



