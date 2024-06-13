import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (req.method === 'POST') {
    const { sender_address, receiver_address, amount, reference, tx_hash, receiver_username } = req.body;

    try {
      await sql`
        INSERT INTO history (sender_address, receiver_address, amount, reference, tx_hash, receiver_username)
        VALUES (${sender_address}, ${receiver_address}, ${amount}, ${reference}, ${tx_hash}, ${receiver_username})
      `;
      res.status(200).json({ message: 'Transaction added to history' });
    } catch (error) {
      console.error('Error inserting transaction into history:', error);
      res.status(500).json({ error: 'Error inserting transaction into history' });
    }
  } else if (req.method === 'GET') {
    if (typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid address' });
      return;
    }

    try {
      const result = await sql`
        SELECT * FROM history WHERE LOWER(sender_address) = LOWER(${address})
      `;

      res.status(200).json({ transactions: result.rows });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ error: 'Error fetching transaction history' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
