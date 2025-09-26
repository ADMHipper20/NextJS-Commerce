import pool from './db';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    kind: string;
    stock: number;
  };
}

export const getCartItems = async (userId: number): Promise<CartItem[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.image_url,
        p.kind,
        p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    
    return result.rows;
  } finally {
    client.release();
  }
};

export const addToCart = async (userId: number, productId: number, quantity: number = 1): Promise<CartItem> => {
  const client = await pool.connect();
  try {
    // Check if item already exists in cart
    const existingItem = await client.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    if (existingItem.rows.length > 0) {
      // Update quantity
      const result = await client.query(
        'UPDATE cart SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      );
      
      // Get the updated item with product details
      const updatedItem = await client.query(`
        SELECT 
          c.id,
          c.user_id,
          c.product_id,
          c.quantity,
          p.id as product_id,
          p.name,
          p.price,
          p.image_url,
          p.kind,
          p.stock
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.id = $1
      `, [result.rows[0].id]);
      
      return updatedItem.rows[0];
    } else {
      // Add new item
      const result = await client.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
      
      // Get the new item with product details
      const newItem = await client.query(`
        SELECT 
          c.id,
          c.user_id,
          c.product_id,
          c.quantity,
          p.id as product_id,
          p.name,
          p.price,
          p.image_url,
          p.kind,
          p.stock
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.id = $1
      `, [result.rows[0].id]);
      
      return newItem.rows[0];
    }
  } finally {
    client.release();
  }
};

export const updateCartItem = async (userId: number, cartItemId: number, quantity: number): Promise<CartItem | null> => {
  const client = await pool.connect();
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await client.query(
        'DELETE FROM cart WHERE id = $1 AND user_id = $2',
        [cartItemId, userId]
      );
      return null;
    }
    
    const result = await client.query(
      'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, cartItemId, userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Get the updated item with product details
    const updatedItem = await client.query(`
      SELECT 
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.image_url,
        p.kind,
        p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1
    `, [cartItemId]);
    
    return updatedItem.rows[0];
  } finally {
    client.release();
  }
};

export const removeFromCart = async (userId: number, cartItemId: number): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2',
      [cartItemId, userId]
    );
    
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};

export const clearCart = async (userId: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM cart WHERE user_id = $1',
      [userId]
    );
  } finally {
    client.release();
  }
};
