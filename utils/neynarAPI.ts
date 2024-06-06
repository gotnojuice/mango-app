import axios from 'axios';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

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

export const searchUsernames = async (query: string): Promise<User[]> => {
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

    // Assuming the response structure contains a "users" array within "result"
    const users: User[] = response.data.result.users;

    return users;
  } catch (error) {
    console.error('Error fetching username suggestions:', error);
    throw error;
  }
};
