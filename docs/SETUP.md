# Setup del Proyecto - Web App 3D AR

## Prerrequisitos
- Node.js >= 18
- Docker Desktop (opcional, solo para PostgreSQL/Redis/MinIO)
- Git

## Setup Rápido

### 1. Clonar e instalar dependencias
```powershell
git clone <repo-url>
cd webapp-3d-ar
npm install
```

### 2. Configurar variables de entorno
```powershell
Copy-Item env.example .env
```

### 3. Configurar base de datos (SQLite - Sin Docker)
```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Iniciar backend
```powershell
npm run dev
```

**Backend**: http://localhost:3001

## Setup con Docker (Opcional)

Si querés usar PostgreSQL/Redis/MinIO:

### 1. Iniciar servicios Docker
```powershell
docker compose up -d
```

### 2. Cambiar a PostgreSQL en schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Configurar backend
```powershell
cd backend
Copy-Item ..\.env .env
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

## Testing

```powershell
# En otra terminal
.\tests\test-etapa-2.ps1
```

## Credenciales de Prueba
- **Email**: `admin@empresa-demo.com`
- **Password**: `admin123`

## Estructura del Proyecto

```
webapp-3d-ar/
├── backend/          # API Node.js + Express
├── frontend/         # Next.js + React
├── jobs/            # Workers para procesamiento
├── docs/            # Documentación
├── tests/           # Scripts de testing
└── docker-compose.yml
```

## Comandos Útiles

### Backend
```powershell
cd backend
npm run dev          # Desarrollo
npm run build        # Construir
npm run db:seed      # Poblar datos
npx prisma studio    # Interfaz visual DB
```

### Docker
```powershell
docker compose up -d     # Iniciar servicios
docker compose down      # Detener servicios
docker compose logs -f   # Ver logs
```

## Troubleshooting

### Error: "Cannot connect to database"
- Verificar que PostgreSQL esté corriendo: `docker ps`
- Reiniciar: `docker compose down && docker compose up -d`

### Error: "Module not found"
- Reinstalar: `Remove-Item -Recurse node_modules && npm install`

### Error: "Port already in use"
- Cambiar puerto en `backend/src/config/index.ts`
- O matar proceso: `netstat -ano | findstr :3001`

### Error de permisos PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Notas Importantes

- **SQLite** se usa por defecto para desarrollo (archivo `backend/dev.db`)
- **PostgreSQL** se usa en producción
- Los **enums** están convertidos a strings para compatibilidad con SQLite
- El archivo `.env` debe estar en la raíz del proyecto
- Para **producción**, cambiar a PostgreSQL y configurar variables de entorno apropiadas