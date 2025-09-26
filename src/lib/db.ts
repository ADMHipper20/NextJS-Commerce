import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/bloom_crust',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;

// Database schema setup
export const initDB = async () => {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        kind VARCHAR(100),
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample products if they don't exist
    const productCount = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCount.rows[0].count) === 0) {
      const sampleProducts = [
        { name: 'Artisan Sourdough', description: 'Naturally leavened sourdough bread', price: 3.90, category: 'Bread & Rolls', image_url: '/assets/Bread & Rolls/sliced-loaf-artisan-sourdough-bread.jpg', kind: 'Sourdough', stock: 6 },
        { name: 'Baguette', description: 'Classic French baguette', price: 2.50, category: 'Bread & Rolls', image_url: '/assets/Bread & Rolls/baguettes-bread.jpg', kind: 'French Bread', stock: 12 },
        { name: 'Square Loaf', description: 'Soft sandwich loaf', price: 3.20, category: 'Bread & Rolls', image_url: '/assets/Bread & Rolls/square-loaf-bread.jpg', kind: 'Soft Loaf', stock: 8 },
        { name: 'Spelt Teacakes', description: 'Traditional English teacakes', price: 2.80, category: 'Bread & Rolls', image_url: '/assets/Bread & Rolls/spelt-english-teackes.jpg', kind: 'Spelt', stock: 9 },
        { name: 'Butter Croissant', description: 'Flaky butter croissant', price: 2.20, category: 'Pastry', image_url: '/assets/Pastry/butter-croissantsjpg.jpg', kind: 'Viennoiserie', stock: 14 },
        { name: 'Cinnamon Roll', description: 'Sweet cinnamon swirl', price: 2.70, category: 'Pastry', image_url: '/assets/Pastry/cinnamon-roll.jpg', kind: 'Sweet Roll', stock: 7 },
        { name: 'Baked Cinnamon Buns', description: 'Sticky cinnamon buns', price: 2.60, category: 'Pastry', image_url: '/assets/Pastry/baked-cinnamon-buns.jpg', kind: 'Bun', stock: 10 },
        { name: 'Pain au Chocolat', description: 'Chocolate croissant', price: 2.90, category: 'Pastry', image_url: '/assets/Pastry/pain_au_chocolat_luc_viatour.jpg', kind: 'Viennoiserie', stock: 11 },
        { name: 'Puff with Raisins', description: 'Puff pastry with raisins', price: 2.40, category: 'Pastry', image_url: '/assets/Pastry/puff-pastry-with-raisins.jpg', kind: 'Puff Pastry', stock: 5 },
        { name: 'Sausage Roll', description: 'British sausage roll', price: 2.30, category: 'Pastry', image_url: '/assets/Pastry/british-sausage-rolls.jpg', kind: 'Savory', stock: 10 },
        { name: 'Brownies', description: 'Rich chocolate brownies', price: 3.00, category: 'Cakes & Sweets', image_url: '/assets/Cakes & Sweets/variants-brownies.jpg', kind: 'Chocolate', stock: 16 },
        { name: 'Victoria Sponge', description: 'Classic layer cake', price: 4.50, category: 'Cakes & Sweets', image_url: '/assets/Cakes & Sweets/victoria-sponge-cake.jpg', kind: 'Classic Cake', stock: 4 },
        { name: 'Dundee Cake', description: 'Traditional Scottish fruit cake', price: 4.20, category: 'Cakes & Sweets', image_url: '/assets/Cakes & Sweets/traditional-scottish-dundee-cake.jpg', kind: 'Fruit Cake', stock: 3 },
        { name: 'Apple Pie', description: 'Classic apple pie', price: 4.00, category: 'Pies & Tarts', image_url: '/assets/Pies & Tarts/old-fashioned-apple_pie.jpg', kind: 'Pie', stock: 5 },
        { name: 'Pastéis de Nata', description: 'Portuguese custard tarts', price: 2.00, category: 'Pies & Tarts', image_url: '/assets/Pies & Tarts/portuguese-custard-tarts-pasteis-de-nata.jpg', kind: 'Custard Tart', stock: 20 },
      ];

      for (const product of sampleProducts) {
        await client.query(
          'INSERT INTO products (name, description, price, category, image_url, kind, stock) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [product.name, product.description, product.price, product.category, product.image_url, product.kind, product.stock]
        );
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};
