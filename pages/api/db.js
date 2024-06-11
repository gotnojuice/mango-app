import { sql } from '@vercel/postgres';

export const query = async (text, params) => {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
