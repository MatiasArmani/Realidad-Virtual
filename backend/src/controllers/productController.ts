import { Response } from 'express';
import { prisma } from '@/database/client';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.query;

    const whereClause: any = {
      project: {
        companyId: req.user!.companyId,
      },
    };

    if (projectId) {
      whereClause.projectId = projectId as string;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    logger.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        project: {
          companyId: req.user!.companyId,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        versions: {
          include: {
            _count: {
              select: {
                submodels: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado' }
      });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error) {
    logger.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, sku, projectId } = req.body;

    // Verificar que el proyecto pertenece a la empresa
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: req.user!.companyId,
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: { message: 'Proyecto no encontrado' }
      });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        projectId,
      },
    });

    logger.info(`Producto creado: ${product.name}`);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    logger.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, sku } = req.body;

    const product = await prisma.product.updateMany({
      where: {
        id,
        project: {
          companyId: req.user!.companyId,
        },
      },
      data: { name, sku },
    });

    if (product.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado' }
      });
      return;
    }

    logger.info(`Producto actualizado: ${id}`);
    res.json({ success: true, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    logger.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.deleteMany({
      where: {
        id,
        project: {
          companyId: req.user!.companyId,
        },
      },
    });

    if (product.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado' }
      });
      return;
    }

    logger.info(`Producto eliminado: ${id}`);
    res.json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    logger.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};



