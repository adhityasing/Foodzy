import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'Adhi@0409',
  database: process.env.DB_DATABASE || 'foodzy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

export const createConnection = async (): Promise<void> => {
  try {
    // First, connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.end();

    // Create connection pool with database
    pool = mysql.createPool(dbConfig);

    // Test connection
    const testConnection = await pool.getConnection();
    await testConnection.ping();
    testConnection.release();

    // Initialize tables
    await initializeTables();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const initializeTables = async (): Promise<void> => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // OTP table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_expires_at (expires_at)
      )
    `);

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        image VARCHAR(500),
        category VARCHAR(100),
        brand VARCHAR(100),
        rating DECIMAL(3, 2) DEFAULT 0,
        review_count INT DEFAULT 0,
        tag ENUM('Sale', 'New', 'Hot'),
        weight VARCHAR(50),
        flavour VARCHAR(100),
        diet_type VARCHAR(100),
        speciality VARCHAR(255),
        info VARCHAR(255),
        items INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      )
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        subtotal DECIMAL(10, 2) NOT NULL,
        delivery_charges DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        delivery_method VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(100) NOT NULL,
        post_code VARCHAR(20),
        country VARCHAR(100) NOT NULL,
        region_state VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      )
    `);

    // Order items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(500),
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        selected_weight VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id)
      )
    `);

    // Insert or update sample products
    await insertSampleProducts();
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
};

const insertSampleProducts = async (): Promise<void> => {
  const sampleProducts = [
    {
      id: '1',
      name: 'Fresh organic villa farm lemon 500gm pack',
      description: 'Fresh organic lemons',
      price: 28.85,
      original_price: 32.8,
      image: '/images/products/lemon.png',
      category: 'Fruits',
      brand: 'NestFood',
      rating: 4.0,
      review_count: 75,
      tag: 'Hot',
    },
    {
      id: '2',
      name: 'Best snakes with hazel nut pack 200gm',
      description: 'Premium hazelnuts',
      price: 52.85,
      original_price: 55.8,
      image: '/images/products/hazelnut.png',
      category: 'Snacks',
      brand: 'Stouffer',
      rating: 3.5,
      review_count: 50,
      tag: 'Sale',
    },
    {
      id: '3',
      name: 'organic fresh venilafarm watermelon',
      description: 'Fresh organic watermelon',
      price: 48.85,
      original_price: 52.8,
      image: '/images/products/watermelon.png',
      category: 'Fruits',
      brand: 'Starkist',
      rating: 4.0,
      review_count: 60,
      tag: 'New',
    },
    {
      id: '4',
      name: 'fresh orange apple 1 kg',
      description: 'Fresh organic apples',
      price: 17.85,
      original_price: 19.8,
      image: '/images/products/apple.png',
      category: 'Fruits',
      brand: 'NestFood',
      rating: 4.0,
      review_count: 80,
    },
    {
      id: '5',
      name: 'Blue Diamond Almonds Lightly Salted Vegetables',
      description: 'Premium lightly salted almonds, perfect for snacking',
      price: 23.85,
      original_price: 25.8,
      image: '/images/products/blue-diamond-almonds.png',
      category: 'Snacks',
      brand: 'Blue Diamond',
      rating: 4.0,
      review_count: 45,
      tag: 'Sale',
    },
    {
      id: '6',
      name: 'Chobani Complete Vanilla Greek Yogurt',
      description: 'Creamy vanilla Greek yogurt with complete nutrition',
      price: 54.85,
      original_price: 55.8,
      image: '/images/products/mighty-muffin.png',
      category: 'Dairy',
      brand: 'Chobani',
      rating: 4.0,
      review_count: 30,
    },
    {
      id: '7',
      name: 'Canada Dry Ginger Ale - 2 L Bottle - 200ml - 400g',
      description: 'Refreshing ginger ale beverage',
      price: 32.85,
      original_price: 35.8,
      image: '/images/products/pistachio-butter.png',
      category: 'Beverages',
      brand: 'Canada Dry',
      rating: 4.0,
      review_count: 25,
    },
    {
      id: '8',
      name: 'Encore Seafoods Stuffed Alaskan Salmon',
      description: 'Premium stuffed Alaskan salmon',
      price: 35.85,
      original_price: 57.8,
      image: '/images/products/yuya-niacin.png',
      category: 'Seafood',
      brand: 'Encore Seafoods',
      rating: 4.0,
      review_count: 15,
      tag: 'Sale',
    },
    {
      id: '9',
      name: 'Gorton\'s Beer Battered Fish Fillets with soft paper',
      description: 'Crispy beer battered fish fillets',
      price: 23.85,
      original_price: 25.0,
      image: '/images/products/cafe-altura.png',
      category: 'Seafood',
      brand: 'Gorton\'s',
      rating: 4.0,
      review_count: 70,
      tag: 'Hot',
    },
    {
      id: '10',
      name: 'Haagen-Dazs Caramel Cone Ice Cream Ketchup',
      description: 'Rich caramel cone ice cream',
      price: 22.85,
      original_price: 24.8,
      image: '/images/products/pukka-latte.png',
      category: 'Desserts',
      brand: 'Haagen-Dazs',
      rating: 2.0,
      review_count: 10,
    },
    {
      id: '11',
      name: 'All Natural Italian-Style Chicken Meatballs',
      description: 'All natural Italian-style chicken meatballs, perfect for your favorite pasta dishes',
      price: 19.50,
      original_price: 30.00,
      image: '/images/products/chicken-meatballs.png',
      category: 'Meats',
      brand: 'Hodo Foods',
      rating: 4.5,
      review_count: 120,
      tag: 'Sale',
    },
    {
      id: '12',
      name: 'Angie\'s Boomchickapop Sweet and Salty',
      description: 'Sweet and salty popcorn snack, perfectly balanced flavor',
      price: 4.99,
      original_price: 6.99,
      image: '/images/products/boomchickapop.png',
      category: 'Snacks',
      brand: 'Angie\'s',
      rating: 4.3,
      review_count: 85,
      tag: 'Sale',
    },
    {
      id: '13',
      name: 'Foster Farms Takeout Crispy Classic',
      description: 'Crispy classic chicken strips, restaurant quality at home',
      price: 12.99,
      original_price: 16.99,
      image: '/images/products/foster-farms.png',
      category: 'Meats',
      brand: 'Foster Farms',
      rating: 4.6,
      review_count: 150,
      tag: 'Hot',
    },
    {
      id: '14',
      name: 'Blue Diamond Almonds Lightly Salted',
      description: 'Premium lightly salted almonds, perfect for snacking',
      price: 8.99,
      original_price: 10.59,
      image: '/images/products/blue-diamond-almonds.png',
      category: 'Snacks',
      brand: 'Blue Diamond',
      rating: 4.4,
      review_count: 95,
      tag: 'Sale',
    },
    {
      id: '15',
      name: 'Seeds of Change Organic Quinoa, Brown, & Red Rice',
      description: 'Premium organic quinoa mixed with brown and red rice, perfect for healthy meals',
      price: 32.85,
      original_price: 33.8,
      image: '/images/products/quinoa-mix.png',
      category: 'Grains',
      brand: 'Seeds of Change',
      rating: 4.0,
      review_count: 90,
      tag: 'Sale',
    },
    {
      id: '16',
      name: 'Fresh Organic Vegetable Mix',
      description: 'Fresh organic mix of kale, cucumber, and carrots, perfect for salads',
      price: 12.99,
      original_price: 15.99,
      image: '/images/products/vegetable-mix.png',
      category: 'Vegetables',
      brand: 'NestFood',
      rating: 4.5,
      review_count: 65,
      tag: 'Hot',
    },
    {
      id: '17',
      name: 'Fresh Citrus Mix',
      description: 'Fresh mix of oranges and lemons, bursting with vitamin C',
      price: 18.85,
      original_price: 22.50,
      image: '/images/products/citrus-mix.png',
      category: 'Fruits',
      brand: 'NestFood',
      rating: 4.3,
      review_count: 55,
      tag: 'New',
    },
    {
      id: '18',
      name: 'Fresh Green Peas',
      description: 'Fresh organic green peas, perfect for soups and side dishes',
      price: 9.99,
      original_price: 12.99,
      image: '/images/products/green-peas.png',
      category: 'Vegetables',
      brand: 'NestFood',
      rating: 4.2,
      review_count: 40,
      tag: 'Sale',
    },
  ];

  for (const product of sampleProducts) {
    await pool.query(
      `INSERT INTO products (
        id, name, description, price, original_price, image, category, brand, 
        rating, review_count, tag, weight, flavour, diet_type, speciality, info, items
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        price = VALUES(price),
        original_price = VALUES(original_price),
        image = VALUES(image),
        category = VALUES(category),
        brand = VALUES(brand),
        rating = VALUES(rating),
        review_count = VALUES(review_count),
        tag = VALUES(tag),
        weight = VALUES(weight),
        flavour = VALUES(flavour),
        diet_type = VALUES(diet_type),
        speciality = VALUES(speciality),
        info = VALUES(info),
        items = VALUES(items)`,
      [
        product.id,
        product.name,
        product.description,
        product.price,
        product.original_price || null,
        product.image,
        product.category,
        product.brand || null,
        product.rating || null,
        product.review_count || 0,
        product.tag || null,
        (product as any).weight || null,
        (product as any).flavour || null,
        (product as any).diet_type || null,
        (product as any).speciality || null,
        (product as any).info || null,
        (product as any).items || 1,
      ]
    );
  }
};

export const getPool = (): mysql.Pool => {
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  return pool;
};

export default pool!;

