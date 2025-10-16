# Web App 3D AR

Web App de Visualización 3D con AR para empresas que permite mostrar maquinarias y productos en 3D con funcionalidad de Realidad Aumentada.

## 🚀 Características

- **Visualización 3D**: Motor Babylon.js para renderizado 3D
- **Realidad Aumentada**: WebXR para Android/Desktop, Quick Look para iOS
- **Gestión de Assets**: Pipeline automático de optimización (GLB, USDZ)
- **Links Seguros**: Enlaces temporales con caducidad
- **Multi-tenant**: Cada empresa gestiona su espacio
- **Mobile-first**: Optimizado para dispositivos móviles

## 🏗️ Arquitectura

```
├── frontend/          # Next.js + Babylon.js
├── backend/           # Node.js + Express + PostgreSQL
├── jobs/              # Procesamiento de assets 3D
└── docker-compose.yml # Desarrollo local
```

## 🛠️ Tecnologías

- **Frontend**: Next.js, React, Babylon.js, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Prisma
- **Jobs**: Bull Queue, Redis, Sharp, gltf-pipeline
- **Storage**: MinIO (local), S3 (producción)
- **Infraestructura**: Docker, Docker Compose

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- Docker y Docker Compose
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd webapp-3d-ar
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar servicios de desarrollo**
   ```bash
   # Iniciar base de datos y servicios
   npm run docker:up
   
   # En otra terminal, iniciar la aplicación
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MinIO Console: http://localhost:9001

## 📋 Scripts Disponibles

### Setup Rápido
- **Windows**: `.\setup-dev.ps1`
- **Linux/macOS**: `./setup-dev.sh`
- **Manual**: Ver sección de instalación

### Desarrollo
- `npm run dev` - Iniciar frontend y backend
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run dev:jobs` - Solo jobs worker

### Base de Datos
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar datos de prueba
- `npm run db:studio` - Abrir Prisma Studio

### Docker
- `npm run docker:up` - Iniciar servicios
- `npm run docker:down` - Detener servicios
- `npm run docker:logs` - Ver logs

### Producción
- `npm run build` - Construir todos los módulos
- `npm run start` - Iniciar en producción

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Prisma ORM. La estructura sigue esta jerarquía:

```
Company → Project → Product → Version → Submodel → Asset
                                    └── Share → Visit
```

### Modelo de Datos Implementado
- **Companies**: Gestión de empresas multi-tenant
- **Users**: Sistema de usuarios con roles (ADMIN/USER)
- **Projects**: Proyectos por empresa
- **Products**: Productos por proyecto con SKU
- **Versions**: Versiones de productos con tags
- **Submodels**: Submodelos por versión
- **Assets**: Archivos 3D (GLB, USDZ, THUMB)
- **Shares**: Enlaces temporales para compartir
- **Visits**: Tracking de accesos y uso de AR

### Autenticación
- JWT con tokens de acceso y refresh
- Middleware de autenticación en todas las rutas protegidas
- Validación de roles (ADMIN/USER)
- Hash de contraseñas con bcrypt

## 🔐 Seguridad

- JWT para autenticación
- Rate limiting
- CORS configurado
- Headers de seguridad
- Signed URLs para assets
- Anti-bot con Turnstile

## 📊 Roadmap

- [x] **Etapa 1**: Setup & Documentación
- [x] **Etapa 2**: Data model & Auth
- [ ] **Etapa 3**: Pipeline de assets
- [ ] **Etapa 4**: Viewer 3D/AR
- [ ] **Etapa 5**: Links cerrados & Seguridad
- [ ] **Etapa 6**: Submodelos & Analíticas
- [ ] **Etapa 7**: Performance & Hardening

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte, contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
