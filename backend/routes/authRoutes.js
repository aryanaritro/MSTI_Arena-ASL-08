import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { register } from '../controllers/authController.js';

const router = Router();
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: result.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  next();
};

router.post('/register',
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters'),
  validate,
  register
);

export default router;
