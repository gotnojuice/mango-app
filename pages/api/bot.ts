import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { sql } from '@vercel/postgres';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEYNAR_API_KEY;

interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

interface User {
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: VerifiedAddresses;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    console.log('Webhook payload:', req.body);

    const cast = req.body?.data?.object;
    const text = cast?.text;
    const author = cast?.author;
    const mentionedProfiles = cast?.mentioned_profiles;

    if (!author?.username || !mentionedProfiles?.[0]?.username) {
      res.status(400).json({ error: 'Invalid payload structure' });
      return;
    }

    const senderUsername = author.username;
    const receiverUsername = mentionedProfiles[0].username;

    const match = text?.match(/^@mangobot pay @(\w+) (\d+) USDC - (.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Invalid message format' });
      return;
    }

    const amount = match[2];
    const reference = match[3];

    const fetchUserAddress = async (username: string): Promise<string | null> => {
      try {
        const response = await axios.get(NEYNAR_API_URL, {
          headers: {
            accept: 'application/json',
            api_key: API_KEY,
          },
          params: { q: username },
        });
        const users: User[] = response.data.result.users;
        const user = users.find(u => u.username === username);
        return user?.verified_addresses?.eth_addresses[0] || null;
      } catch (error) {
        console.error('Error fetching user address:', error);
        return null;
      }
    };

    const senderAddress = await fetchUserAddress(senderUsername);
    const receiverAddress = await fetchUserAddress(receiverUsername);

    if (!senderAddress || !receiverAddress) {
      res.status(400).json({ error: 'Could not retrieve sender or receiver address' });
      return;
    }

    await sql`
      INSERT INTO transactions (sender_address, receiver_address, amount, reference)
      VALUES (${senderAddress}, ${receiverAddress}, ${amount}, ${reference})
    `;

    res.status(200).json({ message: 'Transaction recorded' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
