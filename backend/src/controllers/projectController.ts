import { Response } from 'express';
import { prisma } from '@/database/client';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { companyId: req.user!.companyId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    logger.error('Error obteniendo proyectos:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        companyId: req.user!.companyId,
      },
      include: {
        products: {
          include: {
            _count: {
              select: {
                versions: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: { message: 'Proyecto no encontrado' }
      });
      return;
    }

    res.json({ success: true, data: project });
  } catch (error) {
    logger.error('Error obteniendo proyecto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const companyId = req.user!.companyId;

    const project = await prisma.project.create({
      data: {
        name,
        companyId,
      },
    });

    logger.info(`Proyecto creado: ${project.name}`);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    logger.error('Error creando proyecto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const project = await prisma.project.updateMany({
      where: {
        id,
        companyId: req.user!.companyId,
      },
      data: { name },
    });

    if (project.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Proyecto no encontrado' }
      });
      return;
    }

    logger.info(`Proyecto actualizado: ${id}`);
    res.json({ success: true, message: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    logger.error('Error actualizando proyecto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.deleteMany({
      where: {
        id,
        companyId: req.user!.companyId,
      },
    });

    if (project.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Proyecto no encontrado' }
      });
      return;
    }

    logger.info(`Proyecto eliminado: ${id}`);
    res.json({ success: true, message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    logger.error('Error eliminando proyecto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};



