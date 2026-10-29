import { Router, Request, Response } from 'express';
import axios from 'axios';

export const krogerCartRouter = Router();

const KROGER_CLIENT_ID = process.env.KROGER_CLIENT_ID;
const KROGER_CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET;
const KROGER_REDIRECT_URI = process.env.KROGER_REDIRECT_URI || 'http://localhost:3000/api/kroger/callback';

/**
 * PUT /api/kroger/cart/add
 * Add items to an authenticated customer's cart.
 */
krogerCartRouter.put('/add', async (req: Request, res: Response) => {
  const { items, accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.put(
      'https://api.kroger.com/v1/cart/add',
      { items },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(204).send();
  } catch (err: any) {
    console.error('[KROGER CART API ERROR]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to add item to cart' });
  }
});
