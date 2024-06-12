import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    res.status(400).json({ error: 'Invalid address' });
    return;
  }

  try {
    const result = await sql`
      SELECT * FROM transactions WHERE sender_address = ${address} OR receiver_address = ${address}
    `;
    console.log('Fetched transactions:', result.rows);
    res.status(200).json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
}
