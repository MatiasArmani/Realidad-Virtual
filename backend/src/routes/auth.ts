import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { login, register, refreshToken } from '@/controllers/authController';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();

// Validaciones
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
];

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('companyName').isLength({ min: 2 }).withMessage('Nombre de empresa debe tener al menos 2 caracteres'),
];

const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
];

// Rutas
router.post('/login', loginValidation, validateRequest, login);
router.post('/register', registerValidation, validateRequest, register);
router.post('/refresh', refreshValidation, validateRequest, refreshToken);

export default router;



