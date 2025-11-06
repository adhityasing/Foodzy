import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendOTP, verifyOTP } from '../controllers/auth.controller';

const router = Router();

router.post(
  '/send-otp',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  sendOTP
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 4, max: 6 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  verifyOTP
);

export default router;

