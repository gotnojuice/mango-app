import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { sql } from '@vercel/postgres';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const NEYNAR_POST_CAST_URL = 'https://api.neynar.com/v2/farcaster/cast';
const API_KEY = process.env.NEYNAR_API_KEY;
const SIGNER_UUID = process.env.SIGNER_UUID;

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
    console.log('Webhook payload:', JSON.stringify(req.body, null, 2));

    const { data } = req.body;
    const cast = data.object === 'cast' ? data : null;

    if (!cast) {
      console.error('No cast object in payload');
      res.status(400).json({ error: 'Invalid payload structure' });
      return;
    }

    const { text, author, hash } = cast;

    console.log('Cast:', JSON.stringify(cast, null, 2));
    console.log('Text:', text);
    console.log('Author:', JSON.stringify(author, null, 2));

    if (!text || !author) {
      res.status(400).json({ error: 'Invalid payload structure' });
      return;
    }

    const senderUsername = author.username;
    const match = text.match(/^@mangobot pay @([a-zA-Z0-9._]+) (\d+(\.\d+)?) (\w+) - (.+)$/);

    if (!match) {
      res.status(400).json({ error: 'Invalid message format' });
      return;
    }

    const receiverUsername = match[1];
    const amount = match[2];
    const currency = match[4];
    const reference = match[5];

    console.log('Sender Username:', senderUsername);
    console.log('Receiver Username:', receiverUsername);
    console.log('Amount:', amount);
    console.log('Currency:', currency);
    console.log('Reference:', reference);

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
        return user?.verified_addresses?.eth_addresses?.[0] || null;
      } catch (error) {
        console.error('Error fetching user address:', error);
        return null;
      }
    };

    const senderAddress = await fetchUserAddress(senderUsername);
    const receiverAddress = await fetchUserAddress(receiverUsername);

    console.log('Sender Address:', senderAddress);
    console.log('Receiver Address:', receiverAddress);

    if (!senderAddress || !receiverAddress) {
      res.status(400).json({ error: 'Could not retrieve sender or receiver address' });

      // Reply to the cast to notify about the missing verified address
      try {
        await axios.post(
          NEYNAR_POST_CAST_URL,
          {
            signer_uuid: SIGNER_UUID,
            text: `Could not process transaction. The receiver @${receiverUsername} does not have a verified ETH address.`,
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
        console.error('Error replying to the cast about missing address:', replyError);
      }

      return;
    }

    try {
      await sql`
        INSERT INTO transactions (sender_address, receiver_address, amount, reference, receiver_username, hash)
        VALUES (${senderAddress}, ${receiverAddress}, ${amount}, ${reference}, ${receiverUsername}, ${hash})
      `;
    } catch (dbError) {
      console.error('Error inserting transaction:', dbError);
      res.status(500).json({ error: 'Error recording transaction' });
      return;
    }

    // Reply to the cast to notify about the transaction
    try {
      await axios.post(
        NEYNAR_POST_CAST_URL,
        {
          signer_uuid: SIGNER_UUID,
          text: `Transaction ready for approval, head to https://mangojuice.vercel.app/approve to confirm.`,
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

    res.status(200).json({ message: 'Transaction recorded and reply sent' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
