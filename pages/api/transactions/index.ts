import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    res.status(400).json({ error: 'Invalid address' });
    return;
  }

  console.log('Queried address:', address);

  try {
    // Log the addresses in the database to check for discrepancies
    const addressesResult = await sql`SELECT DISTINCT sender_address FROM transactions`;
    console.log('Addresses in the database:', addressesResult.rows);

    const result = await sql`
      SELECT * FROM transactions WHERE LOWER(sender_address) = LOWER(${address})
    `;

    console.log('Fetched transactions:', result.rows);
    res.status(200).json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
}
