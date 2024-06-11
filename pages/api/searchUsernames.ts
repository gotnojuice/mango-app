import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEYNAR_API_KEY;

interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface User {
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: VerifiedAddresses;
}

const searchUsernames = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }

  try {
    const response = await axios.get(NEYNAR_API_URL, {
      headers: {
        accept: 'application/json',
        api_key: API_KEY,
      },
      params: {
        q: query,
      },
    });

    const users: User[] = response.data.result.users;

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching username suggestions:', error);
    return res.status(500).json({ error: 'Error fetching username suggestions' });
  }
};

export default searchUsernames;
