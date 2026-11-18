import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createProduct, listProducts } from '../controllers/productController.js';

const router = Router();
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: result.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  next();
};

router.get('/', listProducts);
router.post('/',
  body('name').isString().trim().isLength({ min: 2, max: 150 }).withMessage('Name must be 2–150 characters'),
  body('brand').isString().trim().notEmpty().withMessage('Brand is required'),
  body('description').isString().trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number').toFloat(),
  body('imageUrl').isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Image URL must be an HTTP(S) URL'),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer').toInt(),
  validate,
  createProduct
);

export default router;
