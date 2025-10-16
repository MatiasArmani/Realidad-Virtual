import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '@/controllers/projectController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Validaciones
const createValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
];

const updateValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
];

const queryValidation = [
  query('projectId').optional().isUUID().withMessage('ID de proyecto inválido'),
];

// Rutas
router.get('/', queryValidation, validateRequest, getProjects);
router.get('/:id', getProject);
router.post('/', createValidation, validateRequest, createProject);
router.put('/:id', updateValidation, validateRequest, updateProject);
router.delete('/:id', deleteProject);

export default router;



