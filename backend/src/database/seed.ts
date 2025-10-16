import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from '@/config';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Iniciando seed de base de datos...');

  // Crear empresa de ejemplo
  const company = await prisma.company.upsert({
    where: { slug: 'empresa-demo' },
    update: {},
    create: {
      name: 'Empresa Demo',
      slug: 'empresa-demo',
    },
  });

  logger.info(`✅ Empresa creada: ${company.name}`);

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', config.security.bcryptRounds);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@empresa-demo.com' },
    update: {},
    create: {
      email: 'admin@empresa-demo.com',
      name: 'Administrador',
      password: hashedPassword,
      role: UserRole.ADMIN,
      companyId: company.id,
    },
  });

  logger.info(`✅ Usuario admin creado: ${adminUser.email}`);

  // Crear usuario regular
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@empresa-demo.com' },
    update: {},
    create: {
      email: 'user@empresa-demo.com',
      name: 'Usuario Regular',
      password: hashedPassword,
      role: UserRole.USER,
      companyId: company.id,
    },
  });

  logger.info(`✅ Usuario regular creado: ${regularUser.email}`);

  // Crear proyecto de ejemplo
  const project = await prisma.project.create({
    data: {
      name: 'Proyecto Demo',
      companyId: company.id,
    },
  });

  logger.info(`✅ Proyecto creado: ${project.name}`);

  // Crear producto de ejemplo
  const product = await prisma.product.create({
    data: {
      name: 'Máquina Demo',
      sku: 'MAQ-001',
      projectId: project.id,
    },
  });

  logger.info(`✅ Producto creado: ${product.name}`);

  // Crear versión de ejemplo
  const version = await prisma.version.create({
    data: {
      tag: 'v1.0.0',
      notes: 'Versión inicial del producto',
      productId: product.id,
    },
  });

  logger.info(`✅ Versión creada: ${version.tag}`);

  // Crear submodelo de ejemplo
  const submodel = await prisma.submodel.create({
    data: {
      name: 'Modelo Principal',
      code: 'main',
      versionId: version.id,
    },
  });

  logger.info(`✅ Submodelo creado: ${submodel.name}`);

  logger.info('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    logger.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



