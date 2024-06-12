import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (Array.isArray(id) || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }

  if (req.method === 'DELETE') {
    try {
      await sql`
        DELETE FROM transactions
        WHERE id = ${id}
      `;
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Error deleting transaction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
