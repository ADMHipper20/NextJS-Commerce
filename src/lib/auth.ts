import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
};

export const createUser = async (email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<User> => {
  const client = await pool.connect();
  try {
    const hashedPassword = await hashPassword(password);
    
    const result = await client.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, phone, address',
      [email, hashedPassword, firstName, lastName, phone]
    );
    
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getUserByEmail = async (email: string): Promise<User & { password_hash: string } | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, password_hash, first_name, last_name, phone, address FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, first_name, last_name, phone, address FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};
