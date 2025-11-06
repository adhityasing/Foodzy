import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { createOrder, getOrderById } from '../controllers/order.controller';

const router = Router();

router.post(
  '/',
  [
    body('items').isArray().notEmpty(),
    body('deliveryMethod').isIn(['free', 'flat']),
    body('paymentMethod').notEmpty(),
    body('billingAddress.firstName').notEmpty(),
    body('billingAddress.lastName').notEmpty(),
    body('billingAddress.city').notEmpty(),
    body('billingAddress.country').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createOrder
);

router.get('/:id', getOrderById);

export default router;

