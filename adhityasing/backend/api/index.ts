// Vercel serverless function handler for backend
// This file is in the backend folder for separate deployment
import app from '../src/server';

// Database is not used in production - app will run without it
// The createConnection function will skip database connection in production/Vercel

// Export the Express app for Vercel serverless function
export default app;

