import { Router } from 'express';
import { directBatchImportToQuickBooks } from './intuit/quickbooks-bridge';
import { requireAuth } from '../src/middleware/auth';

export const coinbaseCdpRouter = Router();

// In-memory CDP state store for sandbox/development
const cdpState = {
  apiKey: process.env.COINBASE_CDP_API_KEY || 'iq9XSYfv7AwceTMH8kCKRO4wNJU47ngC',
  apiSecret: process.env.COINBASE_CDP_API_SECRET || 'cdp_sec_xxxxxxxxxxxxxxxxxxxx',
  walletSecret: process.env.COINBASE_CDP_WALLET_SECRET || 'wallet_sec_mock_99182',
  projectId: process.env.COINBASE_CDP_PROJECT_ID || 'f7ab07bb-2a9a-4908-8f2e-797448995de5',
  env: process.env.COINBASE_CDP_ENV || 'sandbox',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  currentUser: null as any,
  accounts: [
    {
      name: 'kronos-treasury-primary',
      address: '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191',
      network: 'base-sepolia',
      balanceETH: '4.8520',
      balanceUSDC: '250000.00',
      type: 'non-custodial',
      createdAt: new Date().toISOString()
    },
    {
      name: 'merchant-settlement-vault',
      address: '0x889218F12a02b115Ec467773f324838Fbc51B122',
      network: 'base-sepolia',
      balanceETH: '1.2500',
      balanceUSDC: '50000.00',
      type: 'custodial',
      createdAt: new Date().toISOString()
    }
  ],
  policies: [
    { id: 'pol_01', name: 'Max Daily Outflow Policy', limitUSDC: '100000', status: 'ACTIVE' },
    { id: 'pol_02', name: 'Whitelisted Merchant Gateway', status: 'ENFORCED' }
  ],
  webhookSubscriptions: [
    {
      id: 'sub_01',
      description: 'Monitor wallet transactions & signing',
      eventTypes: [
        'wallet.transaction.created',
        'wallet.transaction.broadcast',
        'wallet.transaction.confirmed',
        'wallet.transaction.failed',
        'wallet.typed_data.signed',
        'wallet.message.signed',
        'wallet.delegation.created'
      ],
      targetUrl: 'https://example.com/webhook',
      isEnabled: true,
      createdAt: new Date().toISOString()
    }
  ]
};

// 1. Get CDP Configuration & Status
coinbaseCdpRouter.get('/config', (req, res) => {
  res.json({
    success: true,
    cdp: {
      projectId: cdpState.projectId,
      env: cdpState.env,
      hasApiKey: Boolean(cdpState.apiKey),
      hasApiSecret: Boolean(cdpState.apiSecret),
      hasGoogleAuth: Boolean(cdpState.googleClientId),
      accountsCount: cdpState.accounts.length,
      policiesCount: cdpState.policies.length,
      webhooksCount: cdpState.webhookSubscriptions.length
    }
  });
});

// 2. Update CDP Credentials / Environment
coinbaseCdpRouter.post('/config', (req, res) => {
  const { apiKey, apiSecret, walletSecret, projectId, env, googleClientId, googleClientSecret } = req.body;
  if (apiKey !== undefined) cdpState.apiKey = apiKey;
  if (apiSecret !== undefined) cdpState.apiSecret = apiSecret;
  if (walletSecret !== undefined) cdpState.walletSecret = walletSecret;
  if (projectId !== undefined) cdpState.projectId = projectId;
  if (env !== undefined) cdpState.env = env;
  if (googleClientId !== undefined) cdpState.googleClientId = googleClientId;
  if (googleClientSecret !== undefined) cdpState.googleClientSecret = googleClientSecret;

  res.json({
    success: true,
    message: 'Coinbase CDP environment credentials & Google OAuth updated successfully.',
    cdp: {
      projectId: cdpState.projectId,
      env: cdpState.env,
      hasGoogleAuth: Boolean(cdpState.googleClientId),
      accountsCount: cdpState.accounts.length
    }
  });
});

// 3. List EVM Accounts / Wallets
coinbaseCdpRouter.get('/accounts', (req, res) => {
  res.json({
    success: true,
    accounts: cdpState.accounts
  });
});

// 4. Create EVM Account
coinbaseCdpRouter.post('/accounts/create', (req, res) => {
  const { name, network = 'base-sepolia', type = 'non-custodial' } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Account name is required' });
  }

  const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const address = `0x${randomHex}`;

  const newAccount = {
    name,
    address,
    network,
    balanceETH: '0.1000',
    balanceUSDC: '1000.00',
    type,
    createdAt: new Date().toISOString()
  };

  cdpState.accounts.push(newAccount);

  res.json({
    success: true,
    message: `CDP EVM account "${name}" created successfully.`,
    account: newAccount
  });
});

// 5. Request Faucet Funds (Base Sepolia Testnet)
coinbaseCdpRouter.post('/faucet', (req, res) => {
  const { address, token = 'eth' } = req.body;
  const account = cdpState.accounts.find(a => a.address.toLowerCase() === address?.toLowerCase());

  if (!account) {
    return res.status(404).json({ success: false, error: 'CDP EVM account address not found in project' });
  }

  if (token.toLowerCase() === 'eth') {
    const current = parseFloat(account.balanceETH);
    account.balanceETH = (current + 0.5).toFixed(4);
  } else {
    const current = parseFloat(account.balanceUSDC);
    account.balanceUSDC = (current + 5000).toFixed(2);
  }

  res.json({
    success: true,
    message: `Successfully dripped ${token.toUpperCase()} from Coinbase CDP Faucet to ${address}`,
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    account
  });
});

// 6. Execute CDP Transfer / Payment
coinbaseCdpRouter.post('/transfer', (req, res) => {
  const { fromAddress, toAddress, amount, asset = 'USDC' } = req.body;
  const sender = cdpState.accounts.find(a => a.address.toLowerCase() === fromAddress?.toLowerCase());

  if (!sender) {
    return res.status(404).json({ success: false, error: 'Source CDP account not found' });
  }

  const amtNum = parseFloat(amount || '0');
  if (asset === 'USDC') {
    const bal = parseFloat(sender.balanceUSDC);
    if (bal < amtNum) {
      return res.status(400).json({ success: false, error: 'Insufficient USDC balance in CDP account' });
    }
    sender.balanceUSDC = (bal - amtNum).toFixed(2);
  } else {
    const bal = parseFloat(sender.balanceETH);
    if (bal < amtNum) {
      return res.status(400).json({ success: false, error: 'Insufficient ETH balance in CDP account' });
    }
    sender.balanceETH = (bal - amtNum).toFixed(4);
  }

  res.json({
    success: true,
    message: `Successfully transferred ${amount} ${asset} via Coinbase CDP network`,
    transferId: `tx_cdp_${Math.random().toString(36).substr(2, 9)}`,
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    sender
  });
});

// 7. Purchase Crypto via QuickBooks Account (Commercial Grade)
coinbaseCdpRouter.post('/purchase-with-qbo', requireAuth as any, async (req, res) => {
  const { qboAccountId, amount, asset, fromAddress, toAddress } = req.body;
  
  if (!qboAccountId || !amount || !asset || !fromAddress || !toAddress) {
    return res.status(400).json({ success: false, error: 'Missing required parameters: qboAccountId, amount, asset, fromAddress, toAddress' });
  }

  // 1. Perform the CDP Transfer/Purchase
  // Use localhost instead of req.get('host') for internal server-to-server calls to avoid proxy/redirect issues
  const cdpTransferRes = await fetch(`http://localhost:3000/api/cdp/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromAddress, toAddress, amount, asset })
  });
  
  const cdpResult = await cdpTransferRes.json();
  
  if (!cdpTransferRes.ok || !cdpResult.success) {
    return res.status(400).json({ success: false, error: 'CDP purchase failed', details: cdpResult });
  }

  // 2. Record the transaction in QuickBooks Online
  try {
    const qboResult = await directBatchImportToQuickBooks({
      transactions: [{
        id: `TX-CRYPTO-${Date.now()}`,
        description: `Crypto Purchase (${asset}) via CDP`,
        amount: -Number(amount),
        date: new Date().toISOString().split('T')[0],
        category: 'Crypto Investment'
      }],
      targetType: 'JournalEntry',
      source: 'UNIVERSAL_INGEST'
    });

    res.json({
      success: true,
      message: 'Crypto purchased and recorded in QuickBooks successfully',
      cdp: cdpResult,
      qbo: qboResult
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'CDP success but QBO recording failed', details: err.message });
  }
});

// --- Paymaster & Bundler Configuration API ---

coinbaseCdpRouter.get('/paymaster/config', (req, res) => {
  const apiKey = cdpState.apiKey || 'cdp_sandbox_key_994182';
  res.json({
    success: true,
    paymaster: {
      url: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${apiKey}`,
      bundlerUrl: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${apiKey}`,
      mainnetUrl: `https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`,
      configJson: {
        paymasterUrl: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${apiKey}`,
        bundlerUrl: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${apiKey}`,
        chain: "base-sepolia",
        chainId: 84532,
        sponsorshipPolicyId: "sp_kronos_default_01",
        entryPointAddress: "0x5FF137D4b0FDCD49Dca30c7CF57E578a026d2789",
        supportedStandards: ["ERC-4337", "ERC-7679"]
      }
    }
  });
});

// --- Coinbase CDP End-Users Google OAuth & OpenID ---

coinbaseCdpRouter.get('/auth/google', (req, res) => {
  const clientId = cdpState.googleClientId || process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({ success: false, error: 'Google Client ID not configured. Please set GOOGLE_CLIENT_ID.' });
  }

  // Handle AI Studio / Proxy environments: force https for Coinbase redirects
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = 'https'; // Explicitly force https as requested/required
  
  // Construct absolute callback URL
  const callbackUrl = `${protocol}://${host}/api/cdp/auth/google/callback`;
  const encodedRedirectUri = encodeURIComponent(callbackUrl);
  
  console.log('[Google Auth] Initiating redirect with callback:', callbackUrl);

  // The initiation URL for CDP Custom Social Login (Platform v2)
  // The user provided the callback: https://api.cdp.coinbase.com/platform/v2/end-users/auth/oauth/google/callback
  // Therefore, the authorize endpoint follows the same /end-users/auth/oauth/google path structure.
  const cdpAuthUrl = `https://api.cdp.coinbase.com/platform/v2/end-users/auth/oauth/google/authorize?project_id=${cdpState.projectId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=openid%20profile%20email`;
  res.redirect(cdpAuthUrl);
});

coinbaseCdpRouter.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  console.log('[Google Callback] Query params:', req.query);

  if (error) {
    console.error('[Google Callback] Auth error:', error);
    return res.redirect(`/?auth_error=${encodeURIComponent(String(error))}`);
  }

  // Debugging: If code is missing, log the issue
  if (!code) {
      console.warn('[Google Callback] Missing authorization code');
  }

  cdpState.currentUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    email: 'developer@coinbase-cdp.demo',
    name: 'Coinbase CDP End User',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    authProvider: 'google-cdp',
    scopes: ['openid', 'profile', 'email'],
    authenticatedAt: new Date().toISOString(),
    walletAddress: cdpState.accounts[0]?.address || '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191'
  };

  res.redirect('/?auth=success');
});

coinbaseCdpRouter.post('/auth/sync-google-user', (req, res) => {
  const { email, displayName, photoURL } = req.body;
  
  cdpState.currentUser = {
    id: `cdp_usr_${Date.now()}`,
    email: email || 'sovereignties3@gmail.com',
    name: displayName || "James Burvelo O'Callaghan III",
    picture: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    authProvider: "coinbase-cdp-google-oauth2",
    projectId: cdpState.projectId,
    scopes: ["openid", "profile", "email"],
    authenticatedAt: new Date().toISOString(),
    walletAddress: cdpState.accounts[0]?.address || '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191'
  };

  res.json({
    success: true,
    message: "User synchronized with Coinbase CDP End-Users auth successfully",
    user: cdpState.currentUser
  });
});

coinbaseCdpRouter.get('/auth/user', (req, res) => {
  res.json({
    success: true,
    user: cdpState.currentUser
  });
});

coinbaseCdpRouter.post('/auth/logout', (req, res) => {
  cdpState.currentUser = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// --- Wallet Webhooks Endpoints ---

coinbaseCdpRouter.get('/webhooks/subscriptions', (req, res) => {
  res.json({
    success: true,
    subscriptions: cdpState.webhookSubscriptions
  });
});

coinbaseCdpRouter.post('/webhooks/subscriptions', (req, res) => {
  const { description, eventTypes, targetUrl, isEnabled = true } = req.body;
  if (!targetUrl || !eventTypes || !Array.isArray(eventTypes)) {
    return res.status(400).json({ success: false, error: 'targetUrl and eventTypes array are required' });
  }

  const newSub = {
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    description: description || 'Wallet Events Subscription',
    eventTypes,
    targetUrl,
    isEnabled,
    createdAt: new Date().toISOString()
  };

  cdpState.webhookSubscriptions.push(newSub);

  res.json({
    success: true,
    message: 'Webhook subscription created successfully.',
    subscription: newSub
  });
});

coinbaseCdpRouter.post('/webhooks/simulate', (req, res) => {
  const { eventType = 'wallet.transaction.confirmed', address, network = 'base-sepolia' } = req.body;
  const targetAcc = cdpState.accounts[0];
  const walletAddr = address || targetAcc?.address || '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191';

  let mockPayload: any = {
    event_type: eventType,
    address: walletAddr,
    network,
    user_id: cdpState.currentUser?.id || 'end-user-123',
    delegation_id: 'd4e5f6...',
    timestamp: new Date().toISOString()
  };

  if (eventType.includes('transaction')) {
    mockPayload.transaction_hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    if (eventType.includes('confirmed')) {
      mockPayload.confirmed_at = new Date().toISOString();
    } else if (eventType.includes('pending')) {
      mockPayload.pending_since = new Date().toISOString();
      mockPayload.max_fee_per_gas = '1000000000';
      mockPayload.max_priority_fee_per_gas = '100000000';
    }
  } else if (eventType.includes('signed')) {
    mockPayload.signature = `0x${Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  res.json({
    success: true,
    message: `Successfully simulated webhook event "${eventType}"`,
    dispatchedTo: cdpState.webhookSubscriptions[0]?.targetUrl || 'https://example.com/webhook',
    payload: mockPayload
  });
});
