// Vercel serverless function handler for backend
// This file is in the backend folder for separate deployment
import app from '../src/server';

// Initialize database connection on cold start
import { createConnection } from '../src/config/database';

let dbInitialized = false;

// Initialize database connection (will be called on first request or cold start)
const initializeDB = async () => {
  if (!dbInitialized) {
    try {
      await createConnection();
      dbInitialized = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      // In serverless, we don't want to throw - let individual requests handle it
    }
  }
};

// Start DB initialization (non-blocking)
initializeDB().catch((err) => {
  console.error('Failed to initialize database:', err);
});

// Export the Express app for Vercel serverless function
export default app;

