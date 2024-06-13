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
      const { tx_hash } = req.body ? JSON.parse(req.body) : { tx_hash: null };

      const result = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *
      `;

      const deletedTransaction = result.rows[0];
      if (deletedTransaction) {
        const { hash, sender_address, receiver_username, receiver_address, amount, reference, created_at } = deletedTransaction;

        // Insert the transaction into the history table
        await sql`
          INSERT INTO history (hash, sender_address, receiver_username, receiver_address, amount, reference, created_at, tx_hash)
          VALUES (${hash}, ${sender_address}, ${receiver_username}, ${receiver_address}, ${amount}, ${reference}, ${created_at}, ${tx_hash})
        `;

        try {
          // Reply to the cast to notify about the approval
          const basescanLink = `https://basescan.org/tx/${tx_hash}`;
          await axios.post(
            NEYNAR_POST_CAST_URL,
            {
              signer_uuid: SIGNER_UUID,
              text: `Transaction approved. You can view the transaction here: ${basescanLink}`,
              parent: hash,
            },
            {
              headers: {
                accept: 'application/json',
                api_key: API_KEY,
                'content-type': 'application/json',
              },
            }
          );
        } catch (replyError) {
          console.error('Error replying to the cast:', replyError);
        }

        res.status(200).json({ message: 'Transaction deleted and moved to history successfully' });
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
