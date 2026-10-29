import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const uberRouter = Router();

const UBER_CLIENT_ID = process.env.UBER_CLIENT_ID || 'zg_KrN8Oas_uFvVWSjpzFD5k9Pup8ixJ';
const UBER_CLIENT_SECRET = process.env.UBER_CLIENT_SECRET || 'BewztFdfnT4wKLU2H_4ye6HZyascz2zDHH7X5fKJ';
const UBER_REDIRECT_URI = process.env.UBER_REDIRECT_URI || 'http://localhost:3000/api/uber/callback';

let userTokens: any = null;

/**
 * POST /api/uber/jwt-token
 * Exchange JWT client assertion for an access token
 */
uberRouter.post('/jwt-token', async (req: Request, res: Response) => {
  const { scope } = req.body;
  const privateKey = process.env.UBER_PRIVATE_KEY;
  const kid = process.env.UBER_KEY_ID;
  const appId = process.env.UBER_APPLICATION_ID;

  if (!privateKey || !kid || !appId) {
    return res.status(500).json({ error: 'Missing Uber JWT credentials in environment' });
  }

  try {
    const header = { alg: 'RS256', typ: 'JWT', kid };
    const payload = {
      iss: appId,
      sub: appId,
      aud: 'auth.uber.com',
      jti: uuidv4(),
      exp: Math.floor(Date.now() / 1000) + 300 // 5 mins
    };

    const assertion = jwt.sign(payload, privateKey.replace(/\\n/g, '\n'), { header, algorithm: 'RS256' });

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_assertion', assertion);
    params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    params.append('scope', scope || 'places');

    const tokenRes = await axios.post('https://sandbox-login.uber.com/oauth/v2/token', params);
    userTokens = tokenRes.data;

    res.json({ success: true, tokens: userTokens });
  } catch (err: any) {
    console.error('[UBER JWT ASSERTION ERROR]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

/**
 * GET /api/uber/auth-url
 * Generate the Uber authorization URL
 */
uberRouter.get('/auth-url', (req: Request, res: Response) => {
  const scopes = req.query.scopes as string || 'history profile delivery';
  const authUrl = `https://auth.uber.com/oauth/v2/authorize?client_id=${UBER_CLIENT_ID}&redirect_uri=${encodeURIComponent(UBER_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  res.json({ authUrl });
});

/**
 * GET /api/uber/callback
 * Uber OAuth callback handler
 */
uberRouter.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing authorization code');

  try {
    const params = new URLSearchParams();
    params.append('client_id', UBER_CLIENT_ID);
    params.append('client_secret', UBER_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', UBER_REDIRECT_URI);
    params.append('code', code as string);

    const tokenRes = await axios.post('https://auth.uber.com/oauth/v2/token', params);
    userTokens = tokenRes.data;

    // Redirect back to the UI with a success flag
    res.redirect('/?uber_auth=success');
  } catch (err: any) {
    console.error('[UBER CALLBACK ERROR]', err.response?.data || err.message);
    res.redirect('/?uber_auth=error');
  }
});

/**
 * POST /api/uber/client-credentials-token
 * Exchange client credentials for an access token
 */
uberRouter.post('/client-credentials-token', async (req: Request, res: Response) => {
  const { scope } = req.body;
  try {
    const params = new URLSearchParams();
    params.append('client_id', UBER_CLIENT_ID);
    params.append('client_secret', UBER_CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');
    params.append('scope', scope || 'places');

    const tokenRes = await axios.post('https://auth.uber.com/oauth/v2/token', params);
    userTokens = tokenRes.data;

    res.json({ success: true, tokens: userTokens });
  } catch (err: any) {
    console.error('[UBER CLIENT CREDENTIALS ERROR]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

/**
 * GET /api/uber/tokens
 * Retrieve current tokens (in-memory for demo)
 */
uberRouter.get('/tokens', (req: Request, res: Response) => {
  res.json({ tokens: userTokens });
});

/**
 * GET /api/uber/products
 * Proxy request to Uber Products API
 */
uberRouter.get('/products', async (req: Request, res: Response) => {
  if (!userTokens?.access_token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No Uber access token available' });
  }

  const { latitude, longitude } = req.query;
  try {
    const response = await axios.get('https://api.uber.com/v1.2/products', {
      headers: {
        'Authorization': `Bearer ${userTokens.access_token}`,
        'Accept': 'application/json'
      },
      params: { latitude, longitude }
    });
    res.json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 502).json(err.response?.data || { error: err.message });
  }
});

/**
 * GET /api/uber/history
 * Proxy request to Uber History API
 */
uberRouter.get('/history', async (req: Request, res: Response) => {
  if (!userTokens?.access_token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No Uber access token available' });
  }

  try {
    const response = await axios.get('https://api.uber.com/v1.2/history', {
      headers: {
        'Authorization': `Bearer ${userTokens.access_token}`,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 502).json(err.response?.data || { error: err.message });
  }
});
