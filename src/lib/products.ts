import pool from './db';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  kind: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    let sql = `
      SELECT * FROM products 
      WHERE is_active = true 
      AND (name ILIKE $1 OR description ILIKE $1 OR kind ILIKE $1)
    `;
    const params: any[] = [`%${query}%`];
    
    if (category && category !== 'all') {
      sql += ' AND category = $2';
      params.push(category);
    }
    
    sql += ' ORDER BY name ASC';
    
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getProducts = async (category?: string): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    let sql = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];
    
    if (category && category !== 'all') {
      sql += ' AND category = $1';
      params.push(category);
    }
    
    sql += ' ORDER BY category, name ASC';
    
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const getCategories = async (): Promise<string[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category'
    );
    
    return result.rows.map(row => row.category);
  } finally {
    client.release();
  }
};
