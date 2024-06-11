import { query } from './db';

export default async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const result = await query('SELECT * FROM transactions WHERE caster_eth_address = $1', [address]);
    res.status(200).json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};
