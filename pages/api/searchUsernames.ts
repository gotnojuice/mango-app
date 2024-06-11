import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEYNAR_API_KEY;

// Define the type for the verified addresses object
interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

// Define the type for the user object returned by the API
export interface User {
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: VerifiedAddresses;
}

const searchUsernames = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
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
