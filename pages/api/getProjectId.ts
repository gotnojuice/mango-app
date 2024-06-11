// pages/api/getProjectId.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ projectId: process.env.WALLET_CONNECT_PROJECTID });
}
