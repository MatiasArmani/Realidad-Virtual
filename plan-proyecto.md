# Documentación de Desarrollo — Web App de Visualización 3D con AR

## 1. Visión del Proyecto
El proyecto consiste en una **web app** que permita a las empresas:
- **Crear un perfil** y gestionar proyectos/productos.  
- **Subir sus modelos 3D** de maquinarias (primer caso de uso).  
- **Generar links cerrados y temporales** para enviar a clientes/prospectos.  
- Que los clientes puedan **visualizar el producto en 3D** en cualquier dispositivo, y además **proyectarlo en su espacio físico real** usando AR.  

El sistema debe ser **seguro**, **escalable** y **mobile-first**, pensado para maquinarias pero extensible a muebles, electrodomésticos, etc.

---

## 2. Objetivos Principales
1. **Seguridad**: proteger modelos contra ingeniería inversa, compartir con links temporales y cerrados, bloquear bots.  
2. **Simplicidad de acceso**: experiencia sin necesidad de instalar apps, usable en cualquier smartphone.  
3. **AR robusto**: tracking y fijado espacial (hit-test y anchors).  
4. **Escalabilidad**: jerarquía clara de datos (empresa → proyecto → producto → versión → submodelo → asset).  
5. **Infraestructura propia en cloud**, con posibilidad de escalar y mantener costos controlados.  
6. **UI clara**: sin hand tracking, con una interfaz mínima y usable.

---

## 3. Alcance del MVP
- Subida de modelos GLB.  
- Pipeline automático de optimización (GLB optimizado + USDZ).  
- Visualización en 3D (Babylon.js) con botón “Ver en tu espacio”.  
- AR en Android/desktop: WebXR (hit-test y anchors).  
- AR en iOS: Quick Look via `<model-viewer ios-src="...usdz">`.  
- Generación de links temporales con caducidad.  
- Logs de acceso: dispositivo, duración, uso de AR.  
- Roles de usuario: admin y user por empresa.  
- Panel básico para gestionar proyectos/productos/versiones.  

---

## 4. Arquitectura

### 4.1 Frontend
- **Node.js + librerías vanilla/React mínimo para UI.**  
- **Babylon.js** como motor 3D/AR.  
- **`<model-viewer>`** como fallback iOS (Quick Look).  
- Mobile-first.  

### 4.2 Backend
- **Node.js (Express-like)** con arquitectura modular.  
- API REST segura con JWT short-lived.  
- Jobs en Node.js para pipeline de conversión/optimización.  
- Multi-tenant: cada empresa gestiona su propio espacio.

### 4.3 Base de Datos
- PostgreSQL.  
- Migraciones con Prisma/Knex.  
- Entidades: companies, users, projects, products, versions, submodels, assets, shares, visits.

### 4.4 Infraestructura
- Almacenamiento de assets: S3/R2.  
- CDN: CloudFront/Cloudflare.  
- Docker + ECS/Fargate.  
- CI/CD con GitHub Actions.  
- Infra como código (Terraform).  

### 4.5 Seguridad
- Signed URLs con TTL.  
- Rate limiting.  
- CSP/CORS estrictos.  
- Anti-bot: Cloudflare Turnstile/hCaptcha.  
- Auditoría de accesos.  

---

## 5. Modelo de Datos

### Jerarquía
```
Company ──< Project ──< Product ──< Version ──< Submodel ──< Asset
                                  └──< Share ──< Visit
```

### Tablas principales
- **companies**: id, name, slug, created_at.  
- **users**: id, email, name, role, company_id.  
- **projects**: id, company_id, name.  
- **products**: id, project_id, name, sku.  
- **versions**: id, product_id, tag, notes.  
- **submodels**: id, version_id, name, code.  
- **assets**: id, submodel_id, type [GLB, USDZ, THUMB], url, size_bytes, hash.  
- **shares**: id, version_id/product_id, token, expires_at, max_visits.  
- **visits**: id, share_id, ip, user_agent, device, started_at, ended_at, ar_used.  

---

## 6. API Inicial

### Autenticación
- `POST /auth/login` → JWT corto.  

### Jerarquía
- `POST /companies`, `GET /companies/:id`  
- `POST /projects`, `GET /projects?companyId=`  
- `POST /products`, `GET /products?projectId=`  
- `POST /versions`, `GET /versions?productId=`  
- `POST /submodels`, `GET /submodels?versionId=`  

### Assets
- `POST /assets/upload-url` → signed URL (S3).  
- `POST /assets/complete` → registra asset, dispara pipeline.  

### Shares
- `POST /shares` → genera token y caducidad.  
- `GET /experience/:token` → renderiza viewer.  

### Tracking
- `POST /visits/start`  
- `POST /visits/end`  

---

## 7. Pipeline de Assets
1. **Entrada**: GLB/FBX/OBJ.  
2. **Conversión** (si no es GLB): Blender headless/assimp.  
3. **Optimización**:  
   - gltfpack, meshopt, Draco.  
   - KTX2 para texturas.  
   - Generación LODs.  
4. **Derivados**: GLB optimizado, USDZ (Quick Look), thumbnail.  
5. **Validación**: tamaño, polígonos, materiales PBR.  
6. **Publicación**: subida a S3 con signed URLs.  

---

## 8. Seguridad
- **Enlaces temporales**: expiración + límite de visitas.  
- **Signed URLs**: TTL corto para assets.  
- **Anti-bot**: Turnstile/hCaptcha en acceso público.  
- **Obfuscación ligera**: buffers reordenados, nombres alterados.  
- **Headers de seguridad**: CSP, HSTS, CORS restringido.  
- **WAF** en CDN.  
- **Logs de auditoría** en tabla `visits`.

---

## 9. UI/UX
- **Panel empresa**: CRUD proyectos, productos, versiones.  
- **Experiencia pública (`/experience/:token`)**:  
  - Visor 3D (Babylon.js).  
  - Botón AR: WebXR en Android/desktop, Quick Look en iOS.  
  - Botón “Colocar modelo” (hit-test y anchor).  
  - Selector de variantes/submodelos.  
- **Accesibilidad**: contraste, labels, feedback de carga.  

---

## 10. Analíticas y Performance
- **Eventos**: view_opened, enter_ar, place_model, switch_variant, session_end.  
- **Métricas**: tamaño assets, LCP, FPS medio, abandonos.  
- **Budgets**: GLB ≤ 40 MB, LCP ≤ 3s en 4G, TTI ≤ 8s en gama media.  

---

## 11. Roadmap de Desarrollo

### Etapa 1 — Setup & Documentación
- Documentación (este archivo).  
- Repo inicial con frontend/backend/jobs.  
- docker-compose local.  

### Etapa 2 — Data model & Auth
- Migraciones en Postgres.  
- CRUD básico.  
- JWT login.  

### Etapa 3 — Pipeline de assets
- Subida GLB.  
- Optimización (gltfpack, Draco, meshopt, KTX2).  
- Generación USDZ.  
- Guardado en S3.  

### Etapa 4 — Viewer
- Babylon.js (WebXR hit-test + anchors).  
- `<model-viewer>` fallback iOS.  
- UI mínima: ver en 3D, botón AR, selector de variantes.  

### Etapa 5 — Links cerrados & Seguridad
- Generación de links temporales.  
- Anti-bot.  
- Signed URLs.  
- Tracking visitas.  

### Etapa 6 — Submodelos & Analíticas
- Selector de submodelos/variantes.  
- Eventos de analytics.  

### Etapa 7 — Performance & Hardening
- LODs e instancing.  
- CSP/CORS estrictos.  
- Budget checks en CI.  

---

## 12. Definition of Done (DoD)
- Código en main con CI verde.  
- Documentación actualizada.  
- Demo funcional (staging o video).  
- Checklist de seguridad y performance cumplido por etapa.  

---

## 13. Riesgos
- **Ingeniería inversa**: mitigada con optimización y obfuscación, pero no eliminada. Futuro: render-streaming.  
- **Compatibilidad iOS**: WebXR aún no soportado; Quick Look es dependiente.  
- **Bundle size**: riesgo de tiempos de carga altos; mitigado con imports granulares y pipeline.  
- **Escalabilidad de assets**: riesgo de modelos demasiado pesados; mitigado con validaciones y LODs.  
