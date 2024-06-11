import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import axios from 'axios';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEYNAR_API_KEY;

async function getUserEthAddress(username: string): Promise<string> {
  const response = await axios.get(NEYNAR_API_URL, {
    headers: {
      accept: 'application/json',
      api_key: API_KEY,
    },
    params: {
      q: username,
    },
  });

  const user = response.data.result.users.find((user: any) => user.username === username);
  return user?.verified_addresses?.eth_addresses?.[0] || 'No ETH address found';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { senderUsername, receiverUsername, amount, reference } = req.body;

    try {
      const senderAddress = await getUserEthAddress(senderUsername);
      const receiverAddress = await getUserEthAddress(receiverUsername);

      await sql`
        INSERT INTO transactions (sender_address, receiver_address, amount, reference)
        VALUES (${senderAddress}, ${receiverAddress}, ${amount}, ${reference})
      `;

      res.status(200).json({ message: 'Transaction saved successfully' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Error handling webhook' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
