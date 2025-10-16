import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '@/database/client';
import { generateTokens } from '@/utils/jwt';
import { logger } from '@/utils/logger';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export const login = async (req: Request<{}, AuthResponse, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas' }
      });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas' }
      });
      return;
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
      token: accessToken,
      refreshToken,
    };

    logger.info(`Usuario autenticado: ${user.email}`);
    res.json({ success: true, data: response });
  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const register = async (req: Request<{}, AuthResponse, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, name, password, companyName } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: { message: 'El usuario ya existe' }
      });
      return;
    }

    // Crear o encontrar empresa
    const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
    const company = await prisma.company.upsert({
      where: { slug: companySlug },
      update: {},
      create: {
        name: companyName,
        slug: companySlug,
      },
    });

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER',
        companyId: company.id,
      },
      include: {
        company: true,
      },
    });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
      token: accessToken,
      refreshToken,
    };

    logger.info(`Usuario registrado: ${user.email}`);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    logger.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: { message: 'Refresh token requerido' }
      });
      return;
    }

    // Verificar refresh token
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_SECRET!);
    
    // Buscar usuario
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

    // Generar nuevo access token
    const accessToken = require('jsonwebtoken').sign(
      {
        userId: user.id,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      success: true,
      data: { token: accessToken }
    });
  } catch (error) {
    logger.error('Error en refresh token:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Refresh token inválido' }
    });
  }
};



