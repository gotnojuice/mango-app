import { query } from './db';
import axios from 'axios';

const API_KEY = process.env.NEYNAR_API_KEY;

const getUserData = async (username) => {
  const response = await axios.get(`https://api.neynar.com/v2/farcaster/user/${username}`, {
    headers: {
      accept: 'application/json',
      api_key: API_KEY,
    },
  });
  return response.data.result;
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { body } = req;
  const { mention, text, username: casterUsername } = body;

  if (mention === '@mangobot' && text.includes('pay')) {
    const match = text.match(/pay @(\w+) (\d+) USDC/);
    if (match) {
      const [, mentionedUsername, amount] = match;

      try {
        const casterData = await getUserData(casterUsername);
        const mentionedData = await getUserData(mentionedUsername);

        const casterEthAddress = casterData.profile.verified_addresses.eth_addresses[0];
        const mentionedEthAddress = mentionedData.profile.verified_addresses.eth_addresses[0];

        // Store the transaction request in the database
        await query(
          'INSERT INTO transactions (caster_eth_address, mentioned_eth_address, amount) VALUES ($1, $2, $3)',
          [casterEthAddress, mentionedEthAddress, amount]
        );

        res.status(200).json({ message: `Payment request for ${mentionedUsername} for ${amount} USDC received.` });
      } catch (error) {
        console.error('Error processing payment request:', error);
        res.status(500).json({ message: 'Error processing payment request.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid command format.' });
    }
  } else {
    res.status(200).json({ message: 'Not relevant for this bot.' });
  }
};
