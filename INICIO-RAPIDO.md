# 🚀 Inicio Rápido - Guía de Testing

## Opción 1: Setup Automático (Recomendado)

### Windows PowerShell
```powershell
.\setup-dev.ps1
```

Si da error de ejecución de scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-dev.ps1
```

## Opción 2: Setup Manual Paso a Paso

### 1️⃣ Instalar Dependencias Globales
```powershell
# Verificar Node.js
node --version  # Debe ser >= 18

# Verificar Docker
docker --version
```

### 2️⃣ Instalar Dependencias del Proyecto
```powershell
# En la raíz del proyecto
npm install
```

### 3️⃣ Configurar Variables de Entorno
```powershell
# Copiar archivo de ejemplo
Copy-Item env.example .env

# El archivo .env ya tiene valores por defecto para desarrollo local
```

### 4️⃣ Iniciar Servicios Docker
```powershell
# Iniciar PostgreSQL, Redis y MinIO
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps

# Deberías ver:
# - webapp-3d-ar-db (PostgreSQL) - puerto 5432
# - webapp-3d-ar-redis (Redis) - puerto 6379
# - webapp-3d-ar-minio (MinIO) - puertos 9000, 9001
```

### 5️⃣ Configurar Base de Datos
```powershell
# Ir al directorio backend
cd backend

# Instalar dependencias específicas del backend
npm install

# Generar cliente Prisma
npx prisma generate

# Crear y ejecutar migraciones
npx prisma migrate dev --name init

# Poblar base de datos con datos de prueba
npm run db:seed

# Volver a la raíz
cd ..
```

### 6️⃣ Iniciar Backend
```powershell
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor iniciado en puerto 3001
📊 Entorno: development
🔗 URL: http://localhost:3001
```

### 7️⃣ Probar el Backend
**Abre una NUEVA terminal PowerShell** y ejecuta:

```powershell
# Test rápido
curl http://localhost:3001/health

# Test completo
.\test-etapa-2.ps1
```

## 🧪 Opciones de Testing

### A. Testing Automático (Más Fácil)
```powershell
# Ejecuta todos los tests automáticamente
.\test-etapa-2.ps1
```

### B. Testing Manual con REST Client (VS Code)
1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `test-api.http`
3. Haz click en "Send Request" sobre cada petición

### C. Testing Manual con PowerShell
```powershell
# 1. Health Check
curl http://localhost:3001/health

# 2. Login
$body = @{
    email = "admin@empresa-demo.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token

# 3. Obtener empresa
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/companies" -Headers $headers

# Continúa con los demás endpoints...
```

### D. Visualizar Datos con Prisma Studio
```powershell
cd backend
npx prisma studio
```
Abre automáticamente en http://localhost:5555

## 📊 Verificación Visual

### PostgreSQL - Ver datos directamente
```powershell
docker exec -it webapp-3d-ar-db psql -U postgres -d webapp_3d_ar

# Dentro de psql:
SELECT * FROM companies;
SELECT * FROM users;
SELECT * FROM projects;
\q  # para salir
```

### MinIO - Interfaz web
Abre: http://localhost:9001
- Usuario: `minioadmin`
- Contraseña: `minioadmin123`

## 🔧 Comandos Útiles

### Ver logs del backend
```powershell
cd backend
npm run dev
# Los logs aparecen en tiempo real
```

### Ver logs de Docker
```powershell
# Todos los servicios
docker-compose logs -f

# Solo PostgreSQL
docker-compose logs -f postgres

# Solo Redis
docker-compose logs -f redis
```

### Reiniciar servicios
```powershell
# Detener
docker-compose down

# Iniciar de nuevo
docker-compose up -d
```

### Resetear base de datos
```powershell
cd backend

# Opción 1: Reset completo (borra todo)
npx prisma migrate reset

# Opción 2: Solo poblar de nuevo
npm run db:seed
```

## ❌ Solución de Problemas

### Error: "Cannot connect to database"
```powershell
# Verificar que Docker esté corriendo
docker-compose ps

# Si no está corriendo, iniciar:
docker-compose up -d

# Esperar 10 segundos y reintentar
```

### Error: "Port 3001 is already in use"
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3001

# Opción 1: Matar el proceso
# Busca el PID en la última columna y ejecuta:
taskkill /PID <número> /F

# Opción 2: Cambiar puerto en backend/.env
# API_PORT=3002
```

### Error: "Module not found" o errores de TypeScript
```powershell
cd backend

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install

# Regenerar cliente Prisma
npx prisma generate
```

### Error: "Table does not exist"
```powershell
cd backend

# Ejecutar migraciones
npx prisma migrate dev

# Poblar datos
npm run db:seed
```

### Error al ejecutar script PowerShell
```powershell
# Permitir ejecución de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Reintentar
.\test-etapa-2.ps1
```

## 📝 Credenciales de Prueba

Después de ejecutar `npm run db:seed`:

**Usuario Admin:**
- Email: `admin@empresa-demo.com`
- Password: `admin123`
- Rol: ADMIN

**Usuario Regular:**
- Email: `user@empresa-demo.com`
- Password: `admin123`
- Rol: USER

**Empresa:**
- Nombre: Empresa Demo
- Slug: empresa-demo

## ✅ Checklist de Validación

Marca lo que hayas completado:

- [ ] Docker corriendo (postgres, redis, minio)
- [ ] Backend corriendo en puerto 3001
- [ ] Health check responde OK
- [ ] Login exitoso con admin@empresa-demo.com
- [ ] Puedes crear proyectos
- [ ] Puedes crear productos
- [ ] Prisma Studio muestra datos
- [ ] Script test-etapa-2.ps1 pasa todos los tests

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. ✅ Familiarízate con la estructura de la API
2. ✅ Explora los datos en Prisma Studio
3. ✅ Revisa el código en `backend/src/`
4. 🚀 Continúa con **Etapa 3: Pipeline de Assets**

---

## 💡 Tips

- Mantén el backend corriendo en una terminal
- Usa otra terminal para ejecutar tests
- Prisma Studio es útil para ver datos en tiempo real
- Los logs del backend muestran todas las queries SQL (en desarrollo)
- Si algo falla, revisa los logs del backend y Docker
