import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/database/client';
import { logger } from '@/utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { message: 'Token de acceso requerido' }
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Verificar que el usuario aún existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'Usuario no encontrado' }
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Token inválido' }
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'No autenticado' }
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { message: 'Permisos insuficientes' }
      });
      return;
    }

    next();
  };
};



