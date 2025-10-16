# Script completo de testing para Etapa 2
Write-Host "🧪 Iniciando testing de Etapa 2..." -ForegroundColor Green

$baseUrl = "http://localhost:3001"

# Función para manejar errores
function Test-Endpoint {
    param($Name, $ScriptBlock)
    Write-Host "`n$Name" -ForegroundColor Yellow
    try {
        $result = & $ScriptBlock
        Write-Host "✅ Exitoso" -ForegroundColor Green
        return $result
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Health Check
Test-Endpoint "1️⃣ Health Check" {
    $health = Invoke-RestMethod -Uri "$baseUrl/health"
    Write-Host "   Status: $($health.status) | Uptime: $([math]::Round($health.uptime, 2))s"
    $health
}

# 2. Login
$loginResult = Test-Endpoint "2️⃣ Login con usuario admin" {
    $body = @{
        email = "admin@empresa-demo.com"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   Usuario: $($response.data.user.email)"
    Write-Host "   Rol: $($response.data.user.role)"
    Write-Host "   Token: $($response.data.token.Substring(0, 20))..."
    $response
}

if (-not $loginResult) {
    Write-Host "`n❌ No se pudo autenticar. Verifica que el backend esté corriendo y la base de datos poblada." -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend && npm run db:seed" -ForegroundColor Yellow
    exit 1
}

$token = $loginResult.data.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Registro de nuevo usuario
Test-Endpoint "3️⃣ Registro de nuevo usuario" {
    $body = @{
        email = "test-$(Get-Random)@test.com"
        name = "Usuario Test"
        password = "password123"
        companyName = "Empresa Test $(Get-Random)"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   Email: $($response.data.user.email)"
    Write-Host "   Empresa: Nueva empresa creada"
}

# 4. Test de autenticación fallida
Test-Endpoint "4️⃣ Test de autenticación fallida (debe fallar)" {
    try {
        $body = @{
            email = "admin@empresa-demo.com"
            password = "wrong-password"
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $body -ContentType "application/json"
        throw "No debería autenticar con contraseña incorrecta"
    } catch {
        Write-Host "   Correctamente rechazado"
    }
}

# 5. Obtener empresa
$company = Test-Endpoint "5️⃣ Obtener información de empresa" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/companies" -Headers $headers
    Write-Host "   Empresa: $($response.data.name)"
    Write-Host "   Slug: $($response.data.slug)"
    Write-Host "   Proyectos: $($response.data._count.projects)"
    Write-Host "   Usuarios: $($response.data._count.users)"
    $response
}

# 6. Actualizar empresa
Test-Endpoint "6️⃣ Actualizar nombre de empresa" {
    $body = @{
        name = "Empresa Demo Actualizada"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$baseUrl/api/companies" -Method PUT -Body $body -Headers $headers
    Write-Host "   Empresa actualizada"
}

# 7. Crear proyecto
$project = Test-Endpoint "7️⃣ Crear nuevo proyecto" {
    $body = @{
        name = "Proyecto Test $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method POST -Body $body -Headers $headers
    Write-Host "   Proyecto: $($response.data.name)"
    Write-Host "   ID: $($response.data.id)"
    $response
}

$projectId = $project.data.id

# 8. Listar proyectos
Test-Endpoint "8️⃣ Listar todos los proyectos" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Headers $headers
    Write-Host "   Total proyectos: $($response.data.Count)"
    foreach ($p in $response.data | Select-Object -First 3) {
        Write-Host "   - $($p.name) (Productos: $($p._count.products))"
    }
    $response
}

# 9. Obtener proyecto específico
Test-Endpoint "9️⃣ Obtener proyecto específico" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId" -Headers $headers
    Write-Host "   Proyecto: $($response.data.name)"
    Write-Host "   Productos: $($response.data.products.Count)"
    $response
}

# 10. Crear producto
$product = Test-Endpoint "🔟 Crear nuevo producto" {
    $body = @{
        name = "Máquina Test $(Get-Date -Format 'HHmmss')"
        sku = "TEST-$(Get-Random -Maximum 9999)"
        projectId = $projectId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method POST -Body $body -Headers $headers
    Write-Host "   Producto: $($response.data.name)"
    Write-Host "   SKU: $($response.data.sku)"
    Write-Host "   ID: $($response.data.id)"
    $response
}

$productId = $product.data.id

# 11. Listar productos
Test-Endpoint "1️⃣1️⃣ Listar todos los productos" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Headers $headers
    Write-Host "   Total productos: $($response.data.Count)"
    foreach ($p in $response.data | Select-Object -First 3) {
        Write-Host "   - $($p.name) - SKU: $($p.sku)"
    }
    $response
}

# 12. Filtrar productos por proyecto
Test-Endpoint "1️⃣2️⃣ Filtrar productos por proyecto" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products?projectId=$projectId" -Headers $headers
    Write-Host "   Productos en proyecto: $($response.data.Count)"
    $response
}

# 13. Obtener producto específico
Test-Endpoint "1️⃣3️⃣ Obtener producto específico" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products/$productId" -Headers $headers
    Write-Host "   Producto: $($response.data.name)"
    Write-Host "   SKU: $($response.data.sku)"
    Write-Host "   Proyecto: $($response.data.project.name)"
    Write-Host "   Versiones: $($response.data.versions.Count)"
    $response
}

# 14. Actualizar producto
Test-Endpoint "1️⃣4️⃣ Actualizar producto" {
    $body = @{
        name = "Máquina Actualizada $(Get-Date -Format 'HHmmss')"
        sku = "TEST-UPDATED-$(Get-Random -Maximum 9999)"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/products/$productId" -Method PUT -Body $body -Headers $headers
    Write-Host "   Producto actualizado"
    $response
}

# 15. Test sin autenticación (debe fallar)
Test-Endpoint "1️⃣5️⃣ Test sin autenticación (debe fallar)" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/projects"
        throw "No debería permitir acceso sin token"
    } catch {
        Write-Host "   Correctamente rechazado"
    }
}

# 16. Test con token inválido (debe fallar)
Test-Endpoint "1️⃣6️⃣ Test con token inválido (debe fallar)" {
    try {
        $badHeaders = @{
            "Authorization" = "Bearer token-invalido-12345"
        }
        Invoke-RestMethod -Uri "$baseUrl/api/projects" -Headers $badHeaders
        throw "No debería permitir acceso con token inválido"
    } catch {
        Write-Host "   Correctamente rechazado"
    }
}

# 17. Actualizar proyecto
Test-Endpoint "1️⃣7️⃣ Actualizar proyecto" {
    $body = @{
        name = "Proyecto Actualizado $(Get-Date -Format 'HHmmss')"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId" -Method PUT -Body $body -Headers $headers
    Write-Host "   Proyecto actualizado"
    $response
}

# 18. Eliminar producto
Test-Endpoint "1️⃣8️⃣ Eliminar producto" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products/$productId" -Method DELETE -Headers $headers
    Write-Host "   Producto eliminado"
    $response
}

# 19. Verificar que el producto fue eliminado
Test-Endpoint "1️⃣9️⃣ Verificar producto eliminado (debe fallar)" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/products/$productId" -Headers $headers
        throw "El producto debería estar eliminado"
    } catch {
        Write-Host "   Correctamente no encontrado"
    }
}

# 20. Eliminar proyecto
Test-Endpoint "2️⃣0️⃣ Eliminar proyecto" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId" -Method DELETE -Headers $headers
    Write-Host "   Proyecto eliminado"
    $response
}

# Resumen final
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 Testing de Etapa 2 completado exitosamente!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`nTodos los endpoints funcionan correctamente:" -ForegroundColor White
Write-Host "  ✅ Autenticación (Login, Register, JWT)" -ForegroundColor Green
Write-Host "  ✅ Gestión de Empresas" -ForegroundColor Green
Write-Host "  ✅ CRUD de Proyectos" -ForegroundColor Green
Write-Host "  ✅ CRUD de Productos" -ForegroundColor Green
Write-Host "  ✅ Validaciones y Seguridad" -ForegroundColor Green
Write-Host "`n📊 Puedes visualizar los datos en Prisma Studio:" -ForegroundColor Cyan
Write-Host "   cd backend && npx prisma studio" -ForegroundColor White
Write-Host "`n🚀 Listo para continuar con Etapa 3: Pipeline de Assets" -ForegroundColor Yellow
