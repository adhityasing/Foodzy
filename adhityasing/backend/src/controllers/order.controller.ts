import { Request, Response } from 'express';
import { getPool, isDatabaseAvailable } from '../config/database';
import { randomUUID } from 'crypto';
import { sendOrderConfirmationEmail } from '../services/email.service';
import jwt from 'jsonwebtoken';

const getUserIdFromToken = (req: Request): string | null => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded.userId;
  } catch {
    return null;
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, deliveryMethod, paymentMethod, billingAddress } = req.body;
    const pool = getPool();
    if (!pool || !isDatabaseAvailable()) {
      res.status(503).json({ 
        message: 'Database not available in production mode. This feature requires database for local development.'
      });
      return;
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const deliveryCharges = deliveryMethod === 'free' ? 0 : 5;
    const total = subtotal + deliveryCharges;

    // Get user ID from token if available
    const userId = getUserIdFromToken(req);

    // Create order
    const orderId = randomUUID();
    await pool.query(
      `INSERT INTO orders (
        id, user_id, subtotal, delivery_charges, total, delivery_method, payment_method,
        first_name, last_name, address, city, post_code, country, region_state, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        subtotal,
        deliveryCharges,
        total,
        deliveryMethod,
        paymentMethod,
        billingAddress.firstName,
        billingAddress.lastName,
        billingAddress.address || null,
        billingAddress.city,
        billingAddress.postCode || null,
        billingAddress.country,
        billingAddress.regionState || null,
        'confirmed',
      ]
    );

    // Create order items
    for (const item of items) {
      const itemId = randomUUID();
      await pool.query(
        `INSERT INTO order_items (
          id, order_id, product_id, product_name, product_image, price, quantity, selected_weight
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          orderId,
          item.id,
          item.name,
          item.image || null,
          item.price,
          item.quantity,
          item.selectedWeight || null,
        ]
      );
    }

    // Get full order details
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    const order = (orders as any[])[0];
    const itemsList = orderItems as any[];

    // Send confirmation email
    try {
      const userEmail = userId
        ? ((await pool.query('SELECT email FROM users WHERE id = ?', [userId])) as any)[0][0]?.email
        : billingAddress.email;
    
      if (userEmail) {
        await sendOrderConfirmationEmail(
          userEmail,
          orderId,
          {
            ...order,
            items: itemsList.map((item) => ({
              name: item.product_name,
              quantity: item.quantity,
              price: parseFloat(item.price),
            })),
            // Ensure totals are numbers when passed through
            subtotal: parseFloat(order.subtotal),
            delivery_charges: parseFloat(order.delivery_charges),
            total: parseFloat(order.total),
          }
        );
      }
    } catch (emailErr) {
      console.error('Order created, but failed to send confirmation email:', emailErr);
    }

    res.status(201).json({
      id: order.id,
      userId: order.user_id,
      items: itemsList.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        image: item.product_image,
        price: parseFloat(item.price),
        quantity: item.quantity,
        selectedWeight: item.selected_weight,
      })),
      subtotal: parseFloat(order.subtotal),
      deliveryCharges: parseFloat(order.delivery_charges),
      total: parseFloat(order.total),
      deliveryMethod: order.delivery_method,
      paymentMethod: order.payment_method,
      billingAddress: {
        firstName: order.first_name,
        lastName: order.last_name,
        address: order.address,
        city: order.city,
        postCode: order.post_code,
        country: order.country,
        regionState: order.region_state,
      },
      status: order.status,
      createdAt: order.created_at,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (!pool || !isDatabaseAvailable()) {
      res.status(503).json({ 
        message: 'Database not available in production mode. This feature requires database for local development.'
      });
      return;
    }

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    const orderList = orders as any[];

    if (orderList.length === 0) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const [orderItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    const items = orderItems as any[];

    const order = orderList[0];
    res.json({
      id: order.id,
      userId: order.user_id,
      items: items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        image: item.product_image,
        price: parseFloat(item.price),
        quantity: item.quantity,
        selectedWeight: item.selected_weight,
      })),
      subtotal: parseFloat(order.subtotal),
      deliveryCharges: parseFloat(order.delivery_charges),
      total: parseFloat(order.total),
      deliveryMethod: order.delivery_method,
      paymentMethod: order.payment_method,
      billingAddress: {
        firstName: order.first_name,
        lastName: order.last_name,
        address: order.address,
        city: order.city,
        postCode: order.post_code,
        country: order.country,
        regionState: order.region_state,
      },
      status: order.status,
      createdAt: order.created_at,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

