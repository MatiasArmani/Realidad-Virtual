# Guía de Testing - Etapa 2: Data Model & Auth

## 🚀 Setup Inicial

### 1. Instalar Dependencias
```powershell
# En la raíz del proyecto
npm install
```

### 2. Iniciar Servicios Docker
```powershell
# Iniciar PostgreSQL, Redis y MinIO
npm run docker:up

# Verificar que estén corriendo
docker-compose ps
```

### 3. Configurar Base de Datos
```powershell
# Ir al directorio backend
cd backend

# Instalar dependencias del backend
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar con datos de prueba
npm run db:seed

# Volver a la raíz
cd ..
```

## 🧪 Testing Manual

### Opción 1: Usando VS Code REST Client

1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `test-api.http`
3. Ejecuta las peticiones una por una haciendo click en "Send Request"

### Opción 2: Usando PowerShell/curl

#### 1. Health Check
```powershell
curl http://localhost:3001/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 1.234
}
```

#### 2. Login
```powershell
$body = @{
    email = "admin@empresa-demo.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Guardar el token
$token = $response.data.token
Write-Host "Token: $token"
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@empresa-demo.com",
      "name": "Administrador",
      "role": "ADMIN",
      "companyId": "..."
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 3. Obtener Empresa
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3001/api/companies" -Headers $headers
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Empresa Demo",
    "slug": "empresa-demo",
    "users": [...],
    "_count": {
      "projects": 1,
      "users": 2
    }
  }
}
```

#### 4. Crear Proyecto
```powershell
$body = @{
    name = "Proyecto de Prueba"
} | ConvertTo-Json

$project = Invoke-RestMethod -Uri "http://localhost:3001/api/projects" -Method POST -Body $body -ContentType "application/json" -Headers $headers

# Guardar el ID del proyecto
$projectId = $project.data.id
Write-Host "Project ID: $projectId"
```

#### 5. Listar Proyectos
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/projects" -Headers $headers
```

#### 6. Crear Producto
```powershell
$body = @{
    name = "Máquina de Prueba"
    sku = "MAQ-TEST-001"
    projectId = $projectId
} | ConvertTo-Json

$product = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $body -ContentType "application/json" -Headers $headers

$productId = $product.data.id
Write-Host "Product ID: $productId"
```

#### 7. Listar Productos
```powershell
# Todos los productos
Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Headers $headers

# Productos de un proyecto específico
Invoke-RestMethod -Uri "http://localhost:3001/api/products?projectId=$projectId" -Headers $headers
```

#### 8. Actualizar Producto
```powershell
$body = @{
    name = "Máquina Actualizada"
    sku = "MAQ-TEST-001-V2"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Method PUT -Body $body -ContentType "application/json" -Headers $headers
```

#### 9. Obtener Producto Específico
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Headers $headers
```

#### 10. Eliminar Producto
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Method DELETE -Headers $headers
```

### Opción 3: Script de Testing Completo

Crea un archivo `test-etapa-2.ps1`:

```powershell
# Script completo de testing
Write-Host "🧪 Iniciando testing de Etapa 2..." -ForegroundColor Green

# 1. Health Check
Write-Host "`n1️⃣ Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3001/health"
Write-Host "Status: $($health.status)" -ForegroundColor Green

# 2. Login
Write-Host "`n2️⃣ Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@empresa-demo.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token
Write-Host "✅ Login exitoso - Usuario: $($loginResponse.data.user.email)" -ForegroundColor Green

# Headers con token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Obtener Empresa
Write-Host "`n3️⃣ Obtener Empresa..." -ForegroundColor Yellow
$company = Invoke-RestMethod -Uri "http://localhost:3001/api/companies" -Headers $headers
Write-Host "✅ Empresa: $($company.data.name) - Proyectos: $($company.data._count.projects)" -ForegroundColor Green

# 4. Crear Proyecto
Write-Host "`n4️⃣ Crear Proyecto..." -ForegroundColor Yellow
$projectBody = @{
    name = "Proyecto Test $(Get-Date -Format 'HHmmss')"
} | ConvertTo-Json

$project = Invoke-RestMethod -Uri "http://localhost:3001/api/projects" -Method POST -Body $projectBody -Headers $headers
$projectId = $project.data.id
Write-Host "✅ Proyecto creado - ID: $projectId" -ForegroundColor Green

# 5. Listar Proyectos
Write-Host "`n5️⃣ Listar Proyectos..." -ForegroundColor Yellow
$projects = Invoke-RestMethod -Uri "http://localhost:3001/api/projects" -Headers $headers
Write-Host "✅ Total proyectos: $($projects.data.Count)" -ForegroundColor Green

# 6. Crear Producto
Write-Host "`n6️⃣ Crear Producto..." -ForegroundColor Yellow
$productBody = @{
    name = "Producto Test $(Get-Date -Format 'HHmmss')"
    sku = "TEST-$(Get-Random -Maximum 9999)"
    projectId = $projectId
} | ConvertTo-Json

$product = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $productBody -Headers $headers
$productId = $product.data.id
Write-Host "✅ Producto creado - ID: $productId" -ForegroundColor Green

# 7. Listar Productos
Write-Host "`n7️⃣ Listar Productos..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "http://localhost:3001/api/products?projectId=$projectId" -Headers $headers
Write-Host "✅ Productos en proyecto: $($products.data.Count)" -ForegroundColor Green

# 8. Actualizar Producto
Write-Host "`n8️⃣ Actualizar Producto..." -ForegroundColor Yellow
$updateBody = @{
    name = "Producto Actualizado"
    sku = "TEST-UPDATED"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Method PUT -Body $updateBody -Headers $headers
Write-Host "✅ Producto actualizado" -ForegroundColor Green

# 9. Obtener Producto
Write-Host "`n9️⃣ Obtener Producto..." -ForegroundColor Yellow
$productDetail = Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Headers $headers
Write-Host "✅ Producto: $($productDetail.data.name) - SKU: $($productDetail.data.sku)" -ForegroundColor Green

# 10. Eliminar Producto
Write-Host "`n🔟 Eliminar Producto..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3001/api/products/$productId" -Method DELETE -Headers $headers
Write-Host "✅ Producto eliminado" -ForegroundColor Green

# 11. Eliminar Proyecto
Write-Host "`n1️⃣1️⃣ Eliminar Proyecto..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3001/api/projects/$projectId" -Method DELETE -Headers $headers
Write-Host "✅ Proyecto eliminado" -ForegroundColor Green

Write-Host "`n🎉 Testing completado exitosamente!" -ForegroundColor Green
```

Luego ejecuta:
```powershell
.\test-etapa-2.ps1
```

## 🗄️ Testing de Base de Datos

### Prisma Studio (Interfaz Gráfica)

```powershell
cd backend
npx prisma studio
```

Abre automáticamente en http://localhost:5555 donde puedes:
- Ver todas las tablas
- Editar registros
- Agregar datos manualmente
- Verificar relaciones

### PostgreSQL Cliente

```powershell
# Conectarse a la base de datos
docker exec -it webapp-3d-ar-db psql -U postgres -d webapp_3d_ar

# Comandos SQL útiles
\dt                          # Listar tablas
SELECT * FROM companies;     # Ver empresas
SELECT * FROM users;         # Ver usuarios
SELECT * FROM projects;      # Ver proyectos
\q                          # Salir
```

## ✅ Checklist de Validación

### Autenticación
- [ ] Login con credenciales correctas devuelve token
- [ ] Login con credenciales incorrectas devuelve error 401
- [ ] Registro crea nuevo usuario y empresa
- [ ] Endpoints protegidos sin token devuelven error 401
- [ ] Endpoints protegidos con token válido funcionan

### Companies
- [ ] GET /api/companies devuelve empresa del usuario
- [ ] PUT /api/companies actualiza nombre de empresa
- [ ] Response incluye conteo de proyectos y usuarios

### Projects
- [ ] GET /api/projects lista proyectos de la empresa
- [ ] POST /api/projects crea nuevo proyecto
- [ ] PUT /api/projects/:id actualiza proyecto
- [ ] DELETE /api/projects/:id elimina proyecto
- [ ] No se puede acceder a proyectos de otras empresas

### Products
- [ ] GET /api/products lista productos
- [ ] GET /api/products?projectId=X filtra por proyecto
- [ ] POST /api/products crea producto
- [ ] PUT /api/products/:id actualiza producto
- [ ] DELETE /api/products/:id elimina producto
- [ ] No se puede crear producto en proyecto de otra empresa

## 🐛 Problemas Comunes

### Error: "Cannot connect to database"
```powershell
# Verificar que Docker esté corriendo
docker-compose ps

# Reiniciar servicios
npm run docker:down
npm run docker:up
```

### Error: "Module not found"
```powershell
# Reinstalar dependencias
cd backend
npm install
npx prisma generate
```

### Error: "Table does not exist"
```powershell
# Ejecutar migraciones
cd backend
npx prisma migrate dev
npm run db:seed
```

### Error: "Port already in use"
```powershell
# Cambiar puertos en .env o detener otros servicios
# Para ver qué usa el puerto 3001:
netstat -ano | findstr :3001
```

## 📊 Logs y Debugging

### Ver logs del backend
```powershell
cd backend
npm run dev
# Los logs aparecerán en consola
```

### Ver logs de Docker
```powershell
# Todos los servicios
npm run docker:logs

# Solo PostgreSQL
docker-compose logs -f postgres
```

### Habilitar logs detallados de Prisma
En `backend/src/database/client.ts` ya está configurado para mostrar queries en desarrollo.

## 📝 Próximos Pasos

Una vez validada la Etapa 2:
1. ✅ Verificar que todos los endpoints funcionan
2. ✅ Confirmar que las relaciones de datos son correctas
3. ✅ Validar que la autenticación protege las rutas
4. 🚀 Continuar con Etapa 3: Pipeline de Assets
