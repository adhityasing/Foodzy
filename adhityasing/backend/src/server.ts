import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://foodzy-64ks3utg1-adhityasings-projects.vercel.app/',
    'http://localhost:5173'  // Keep for local development
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Foodzy API is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Foodzy API is running' });
});

// Initialize database connection
// This will be handled by the api/index.ts handler for Vercel
// For local development, we'll start the server after DB connection
if (process.env.VERCEL !== '1') {
  // Local development: wait for database before starting server
  createConnection()
    .then(() => {
      console.log('Database connected successfully');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error);
      process.exit(1);
    });
}

export default app;

