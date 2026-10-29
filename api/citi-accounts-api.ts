import { Router, Request, Response } from 'express';

export const citiAccountsApiRouter = Router();

// Placeholder for account summary
citiAccountsApiRouter.get('/v1/accounts', async (req: Request, res: Response) => {
  // TODO: Replace with real Citi API call: https://sandbox.apihub.citi.com/gcb/api/v1/accounts
  const mockAccounts = [
    {
      accountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
      unmaskedAccountNumber: '7211270900'
    }
  ];
  
  res.status(200).json({
    accounts: mockAccounts
  });
});

// Placeholder for account details
citiAccountsApiRouter.get('/v1/accounts/:accountId', async (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Placeholder for transactions
citiAccountsApiRouter.get('/v1/accounts/:accountId/transactions', async (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});
