import { Response } from 'express';
import { prisma } from '@/database/client';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';

export const getCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user!.companyId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            projects: true,
            users: true,
          },
        },
      },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        error: { message: 'Empresa no encontrada' }
      });
      return;
    }

    res.json({ success: true, data: company });
  } catch (error) {
    logger.error('Error obteniendo empresa:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const companyId = req.user!.companyId;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { name },
    });

    logger.info(`Empresa actualizada: ${company.name}`);
    res.json({ success: true, data: company });
  } catch (error) {
    logger.error('Error actualizando empresa:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};



