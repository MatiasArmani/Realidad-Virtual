import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/controllers/productController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Validaciones
const createValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('sku').optional().isLength({ min: 1 }).withMessage('SKU no puede estar vacío'),
  body('projectId').isLength({ min: 1 }).withMessage('ID de proyecto requerido'),
];

const updateValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('sku').optional().isLength({ min: 1 }).withMessage('SKU no puede estar vacío'),
];

const queryValidation = [
  query('projectId').optional().isLength({ min: 1 }).withMessage('ID de proyecto inválido'),
];

// Rutas
router.get('/', queryValidation, validateRequest, getProducts);
router.get('/:id', getProduct);
router.post('/', createValidation, validateRequest, createProduct);
router.put('/:id', updateValidation, validateRequest, updateProduct);
router.delete('/:id', deleteProduct);

export default router;



