import { Router, Request, Response } from 'express';
import axios from 'axios';

export const metamaskApiRouter = Router();

// Proxy endpoint for multichain accounts
metamaskApiRouter.get('/v1/userstorage/multichain_accounts_groups', async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    const xProfileId = req.headers['x-profile-id'];

    if (!authorization || !xProfileId) {
      return res.status(401).json({ error: 'Missing authorization or x-profile-id headers' });
    }

    const response = await axios.get('https://user-storage.api.cx.metamask.io/api/v1/userstorage/multichain_accounts_groups', {
      headers: {
        'authorization': authorization,
        'x-profile-id': xProfileId,
        'accept': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Error proxying Metamask API request:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch data from Metamask API' });
  }
});
