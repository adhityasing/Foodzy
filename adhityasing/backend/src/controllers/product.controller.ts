import { Request, Response } from 'express';
import { getPool } from '../config/database';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    
    const formattedProducts = (products as any[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image,
      category: product.category,
      brand: product.brand,
      rating: product.rating ? parseFloat(product.rating) : undefined,
      reviewCount: product.review_count,
      tag: product.tag,
      weight: product.weight,
      flavour: product.flavour,
      dietType: product.diet_type,
      speciality: product.speciality,
      info: product.info,
      items: product.items,
    }));

    res.json(formattedProducts);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    const productList = products as any[];

    if (productList.length === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const product = productList[0];
    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image,
      category: product.category,
      brand: product.brand,
      rating: product.rating ? parseFloat(product.rating) : undefined,
      reviewCount: product.review_count,
      tag: product.tag,
      weight: product.weight,
      flavour: product.flavour,
      dietType: product.diet_type,
      speciality: product.speciality,
      info: product.info,
      items: product.items,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const pool = getPool();

    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC',
      [category]
    );

    const formattedProducts = (products as any[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image,
      category: product.category,
      brand: product.brand,
      rating: product.rating ? parseFloat(product.rating) : undefined,
      reviewCount: product.review_count,
      tag: product.tag,
      weight: product.weight,
      flavour: product.flavour,
      dietType: product.diet_type,
      speciality: product.speciality,
      info: product.info,
      items: product.items,
    }));

    res.json(formattedProducts);
  } catch (error: any) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

