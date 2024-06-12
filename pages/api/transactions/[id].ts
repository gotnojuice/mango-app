import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import axios from 'axios';

const NEYNAR_POST_CAST_URL = 'https://api.neynar.com/v2/farcaster/cast';
const API_KEY = process.env.NEYNAR_API_KEY;
const SIGNER_UUID = process.env.SIGNER_UUID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (Array.isArray(id) || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const result = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *
      `;

      const deletedTransaction = result.rows[0];
      if (deletedTransaction) {
        const { hash } = deletedTransaction;

        try {
          // Reply to the cast to notify about the approval
          await axios.post(
            NEYNAR_POST_CAST_URL,
            {
              text: `Transaction approved.`,
              reply_to_hash: hash,
            },
            {
              headers: {
                accept: 'application/json',
                api_key: API_KEY,
                Authorization: `Bearer ${SIGNER_UUID}`,
              },
            }
          );
        } catch (replyError) {
          console.error('Error replying to the cast:', replyError);
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Error deleting transaction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
