# Foodzy - A Treasure of Tastes 🍽️

A modern e-commerce platform built for food and grocery shopping, featuring a beautiful, responsive design and a complete shopping experience from browsing products to checkout.

## Overview

Foodzy is a full-stack e-commerce application that allows users to browse through a wide selection of food products, add them to their cart, and complete purchases. The platform features an intuitive user interface, product filtering, detailed product pages, and a seamless checkout process with order management.

## Tech Stack

### Frontend
- **React 18** with **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management for cart and authentication
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** with **TypeScript** - Server runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **Nodemailer** - Email service for OTP and order confirmations
- **Express Validator** - Request validation

## Features

### Product Catalog
- Browse products across multiple categories (Fruits, Snacks, Dairy, Beverages, etc.)
- Filter products by category, price range, and tags
- Search functionality
- Detailed product pages with specifications, descriptions, and images
- Related/popular products suggestions

### Shopping Experience
- Add products to cart with quantity selection
- Weight/size options for products
- Real-time cart updates
- Persistent cart state
- Product ratings and reviews display

### User Interface
- Responsive design that works on all devices
- Clean, modern UI matching Figma design specifications
- Smooth animations and transitions
- Intuitive navigation
- Beautiful product cards with images and pricing

### Order Management
- Complete checkout process
- Multiple delivery options
- Order confirmation emails
- Order history tracking

## Project Structure

```
foodzy/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/
│   │   └── images/        # Static image assets
│   └── package.json
│
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic (email, etc.)
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodzy
   ```

2. **Set up the Backend**

   Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=foodzy
   JWT_SECRET=your-secret-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   PORT=3001
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will automatically create the database and tables on first run, and seed it with sample products.

3. **Set up the Frontend**

   In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file (optional, for custom API URL):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## How It Works

### Product Management
Products are stored in a MySQL database with details including name, description, price, images, categories, brands, ratings, and tags. The backend automatically syncs product data on startup, ensuring the database always has the latest product information.

### Image Handling
Product images are stored in the `frontend/public/images/` directory, organized by type:
- `products/` - Individual product images
- `hero/` - Hero section images
- `promotional/` - Promotional banner images
- `delivery/` - Delivery-related images
- `footer/` - Footer images

The frontend uses a centralized `imagePaths.ts` utility to manage all image references, making it easy to update image paths across the application.

### State Management
- **Cart Store (Zustand)**: Manages shopping cart state, including items, quantities, and selected variants
- **Auth Store (Zustand)**: Handles user authentication state and JWT tokens

### API Communication
The frontend communicates with the backend through RESTful API endpoints:
- Products: `GET /api/products`, `GET /api/products/:id`
- Authentication: `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`
- Orders: `POST /api/orders`, `GET /api/orders/:id`

### Database Schema
The application uses a MySQL database with the following main tables:
- `products` - Product catalog with all details
- `orders` - Customer orders
- `order_items` - Individual items in each order

## Key Pages

### Home Page
- Hero section with featured content
- Promotional banners
- Popular products grid
- Daily best sells section
- Deals of the day section
- Newsletter subscription
- Feature highlights

### Product Detail Page
- Large product image
- Product name and description
- Ratings and reviews
- Product specifications (brand, flavour, diet type, weight, etc.)
- Price with original price (if on sale)
- Size/weight selection
- Quantity selector
- Add to cart functionality
- Description and packaging information tabs
- Related products section

### Checkout Page
- Cart summary
- Delivery method selection
- Payment method selection
- Billing address form
- Order review
- Order confirmation

## Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

## Environment Configuration

### Backend Environment Variables
Make sure to set up your `.env` file in the backend directory with:
- Database connection details
- JWT secret for token generation
- SMTP credentials for email services (Gmail recommended)

### Frontend Environment Variables
The frontend can optionally use a `.env` file to configure:
- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:3001/api`)

## Image Assets

All product images should be placed in `frontend/public/images/products/` as PNG files. The naming convention follows the product name or ID. The application includes a utility function that automatically maps product IDs and names to their corresponding image paths.

## Deployment

### Frontend
The frontend can be deployed to platforms like:
- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment with Git integration
- **GitHub Pages** - For static hosting

Build the frontend:
```bash
cd frontend
npm run build
```

The `dist/` folder contains the production-ready files.

### Backend
The backend can be deployed to:
- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **Heroku** - Classic platform
- **AWS EC2** - For more control

Make sure to:
1. Set up environment variables on your hosting platform
2. Configure your MySQL database (use a managed service like AWS RDS or PlanetScale)
3. Update CORS settings to allow your frontend domain

## Notes

- The database automatically creates tables and seeds sample data on first startup
- Product images are served as static assets from the `public` folder
- The application uses local image paths, so make sure all required images are in place
- Cart state persists in the browser during the session

## License

MIT

---

Built with ❤️ using React, TypeScript, and Node.js
