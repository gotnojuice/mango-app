import axios from 'axios';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';
const API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

// Define the type for the user object returned by the API
export interface User {
    username: string;
    pfp_url: string;
    custody_address: string; // Include custody_address in the User interface
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
      const users: User[] = response.data.result.users.map((user: any) => ({
        username: user.username,
        pfp_url: user.pfp_url,
        custody_address: user.custody_address, // Include custody_address in the User object
      }));
  
      return users;
    } catch (error) {
      console.error('Error fetching username suggestions:', error);
      throw error;
    }
  };