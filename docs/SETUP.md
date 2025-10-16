# Setup del Proyecto

## Prerrequisitos
- Node.js >= 18
- Docker Desktop ejecutándose

## Pasos

### 1. Instalar dependencias solo del backend
```powershell
cd backend
npm install
```

### 2. Configurar variables de entorno
```powershell
# En la raíz del proyecto
Copy-Item env.example .env
```

### 3. Iniciar PostgreSQL con Docker
```powershell
docker compose up -d
```

### 4. Configurar base de datos
```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Iniciar backend
```powershell
cd backend
npm run dev
```

Debería iniciar en http://localhost:3001

## Testing

En otra terminal:
```powershell
.\tests\test-etapa-2.ps1
```

## Credenciales
- Email: `admin@empresa-demo.com`
- Password: `admin123`
