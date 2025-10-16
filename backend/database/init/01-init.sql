-- Script de inicialización de base de datos
-- Este archivo se ejecuta automáticamente al crear el contenedor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_products_project_id ON products(project_id);
CREATE INDEX IF NOT EXISTS idx_versions_product_id ON versions(product_id);
CREATE INDEX IF NOT EXISTS idx_submodels_version_id ON submodels(version_id);
CREATE INDEX IF NOT EXISTS idx_assets_submodel_id ON assets(submodel_id);
CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(token);
CREATE INDEX IF NOT EXISTS idx_shares_expires_at ON shares(expires_at);
CREATE INDEX IF NOT EXISTS idx_visits_share_id ON visits(share_id);
CREATE INDEX IF NOT EXISTS idx_visits_started_at ON visits(started_at);



