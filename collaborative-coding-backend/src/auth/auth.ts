import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'collaborative_coding',
  password: 'admin123',
  port: 5432,
});

export const registerUser = async (username: string, password: string) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const queryText = 'INSERT INTO users(username, password) VALUES($1, $2)';
    await client.query(queryText, [username, hashedPassword]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const authenticateUser = async (username: string, password: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
      return token;
    }
    return null;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, 'secret');
  } catch (err) {
    return null;
  }
};
