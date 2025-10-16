import { Router } from 'express';
import { body } from 'express-validator';
import { getCompany, updateCompany } from '@/controllers/companyController';
import { authenticate, requireRole } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Validaciones
const updateValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
];

// Rutas
router.get('/', getCompany);
router.put('/', updateValidation, validateRequest, updateCompany);

export default router;



