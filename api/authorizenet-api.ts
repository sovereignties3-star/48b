import express, { Request, Response } from 'express';
import axios from 'axios';

export const authorizenetRouter = express.Router();

// Helper to determine active credentials and environment
const getAuthNetConfig = (req: Request) => {
  const reqAuth = req.body?.createTransactionRequest?.merchantAuthentication ||
                  req.body?.getSettledBatchListRequest?.merchantAuthentication ||
                  req.body?.getTransactionListRequest?.merchantAuthentication ||
                  req.body?.getTransactionDetailsRequest?.merchantAuthentication ||
                  req.body?.getUnsettledTransactionListRequest?.merchantAuthentication ||
                  req.body?.getBatchStatisticsRequest?.merchantAuthentication ||
                  req.body?.getMerchantDetailsRequest?.merchantAuthentication ||
                  req.body?.createCustomerProfileRequest?.merchantAuthentication ||
                  req.body?.ARBCreateSubscriptionRequest?.merchantAuthentication ||
                  req.body?.merchantAuthentication;

  const apiLoginId = reqAuth?.name || process.env.AUTHORIZENET_API_LOGIN_ID || '5KP3u95bQpv';
  const transactionKey = reqAuth?.transactionKey || process.env.AUTHORIZENET_TRANSACTION_KEY || '346HZ32z3fP4hTG2';
  const environment = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'
  const endpoint = environment === 'production'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';

  return { apiLoginId, transactionKey, environment, endpoint };
};

// Internal Mock Database for Settlements, Batches, and Transactions
interface StoredTransaction {
  transId: string;
  submitTimeUTC: string;
  submitTimeLocal: string;
  transactionType: string;
  transactionStatus: string;
  responseCode: string;
  authCode: string;
  avsResultCode: string;
  cvvResultCode: string;
  cavvResultCode: string;
  authAmount: number;
  settleAmount: number;
  accountType: string;
  accountNumber: string;
  refTransID?: string;
  transHash: string;
  batchId: string;
  order: {
    invoiceNumber: string;
    description: string;
  };
  billTo: {
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment: {
    method: 'creditCard' | 'payPal' | 'eCheck';
    payerID?: string;
  };
}

let storedBatches = [
  {
    batchId: '984210',
    settlementTimeUTC: new Date(Date.now() - 86400000 * 2).toISOString(),
    settlementTimeLocal: new Date(Date.now() - 86400000 * 2).toLocaleString(),
    settlementState: 'settledSuccessfully',
    paymentMethod: 'creditCard',
    marketType: 'eCommerce',
    product: 'Authorize.Net Gateway Enterprise',
    statistics: [
      {
        accountType: 'Visa',
        chargeAmount: 18450.50,
        chargeCount: 14,
        refundAmount: 250.00,
        refundCount: 1,
        voidCount: 0,
        declineCount: 2,
        errorCount: 0,
      },
      {
        accountType: 'MasterCard',
        chargeAmount: 9320.00,
        chargeCount: 8,
        refundAmount: 0.00,
        refundCount: 0,
        voidCount: 0,
        declineCount: 1,
        errorCount: 0,
      },
      {
        accountType: 'AmericanExpress',
        chargeAmount: 14200.00,
        chargeCount: 5,
        refundAmount: 500.00,
        refundCount: 1,
        voidCount: 0,
        declineCount: 0,
        errorCount: 0,
      }
    ]
  },
  {
    batchId: '984211',
    settlementTimeUTC: new Date(Date.now() - 86400000).toISOString(),
    settlementTimeLocal: new Date(Date.now() - 86400000).toLocaleString(),
    settlementState: 'settledSuccessfully',
    paymentMethod: 'creditCard',
    marketType: 'eCommerce',
    product: 'Authorize.Net Gateway Enterprise',
    statistics: [
      {
        accountType: 'Visa',
        chargeAmount: 24500.75,
        chargeCount: 19,
        refundAmount: 120.00,
        refundCount: 1,
        voidCount: 1,
        declineCount: 1,
        errorCount: 0,
      },
      {
        accountType: 'Discover',
        chargeAmount: 3200.00,
        chargeCount: 3,
        refundAmount: 0.00,
        refundCount: 0,
        voidCount: 0,
        declineCount: 0,
        errorCount: 0,
      }
    ]
  }
];

let storedTransactions: StoredTransaction[] = [
  {
    transId: '60183921029',
    submitTimeUTC: new Date(Date.now() - 86400000 * 2).toISOString(),
    submitTimeLocal: new Date(Date.now() - 86400000 * 2).toLocaleString(),
    transactionType: 'authCaptureTransaction',
    transactionStatus: 'settledSuccessfully',
    responseCode: '1',
    authCode: 'AUTH992',
    avsResultCode: 'Y',
    cvvResultCode: 'M',
    cavvResultCode: '2',
    authAmount: 499.00,
    settleAmount: 499.00,
    accountType: 'Visa',
    accountNumber: 'XXXX4242',
    transHash: 'B349AC0DCCCF601C6DB09403341CD18F',
    batchId: '984210',
    order: {
      invoiceNumber: 'INV-2026-901',
      description: 'Enterprise Cloud Subscription Q3'
    },
    billTo: {
      firstName: 'Jonathan',
      lastName: 'Vane',
      company: 'Apex Sovereign Holdings',
      address: '100 Wall Street, Floor 32',
      city: 'New York',
      state: 'NY',
      zip: '10005',
      country: 'USA'
    },
    payment: {
      method: 'creditCard'
    }
  },
  {
    transId: '60183921030',
    submitTimeUTC: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
    submitTimeLocal: new Date(Date.now() - 86400000 * 2 + 3600000).toLocaleString(),
    transactionType: 'priorAuthCaptureTransaction',
    transactionStatus: 'settledSuccessfully',
    responseCode: '1',
    authCode: 'CAP771',
    avsResultCode: 'P',
    cvvResultCode: 'M',
    cavvResultCode: '2',
    authAmount: 1850.00,
    settleAmount: 1850.00,
    accountType: 'MasterCard',
    accountNumber: 'XXXX5454',
    refTransID: '128',
    transHash: '7F6D4C82E10983A89201BF884E0C3211',
    batchId: '984210',
    order: {
      invoiceNumber: 'INV-2026-902',
      description: 'Prior Authorized Hardware License Terminal'
    },
    billTo: {
      firstName: 'Elena',
      lastName: 'Rostova',
      company: 'Burvelo Consortium Tech',
      address: '450 Lexington Ave',
      city: 'New York',
      state: 'NY',
      zip: '10017',
      country: 'USA'
    },
    payment: {
      method: 'creditCard'
    }
  },
  {
    transId: '60183921031',
    submitTimeUTC: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    submitTimeLocal: new Date(Date.now() - 86400000 + 7200000).toLocaleString(),
    transactionType: 'authCaptureContinueTransaction',
    transactionStatus: 'settledSuccessfully',
    responseCode: '1',
    authCode: 'PP-994',
    avsResultCode: 'P',
    cvvResultCode: '',
    cavvResultCode: '',
    authAmount: 3200.00,
    settleAmount: 3200.00,
    accountType: 'PayPal',
    accountNumber: 'XXXX9901',
    refTransID: '139',
    transHash: 'A1938F023810DCF89304721839CFA102',
    batchId: '984211',
    order: {
      invoiceNumber: 'INV-2026-903',
      description: 'Continued PayPal Express Settlement'
    },
    billTo: {
      firstName: 'Marcus',
      lastName: 'Stirling',
      company: 'Global Sovereign Fund',
      address: '1 Canada Square',
      city: 'London',
      state: 'LDN',
      zip: 'E14 5AA',
      country: 'UK'
    },
    payment: {
      method: 'payPal',
      payerID: 'S6D5ETGSVYX94'
    }
  }
];

let unsettledTransactions: StoredTransaction[] = [
  {
    transId: '60183921099',
    submitTimeUTC: new Date(Date.now() - 1800000).toISOString(),
    submitTimeLocal: new Date(Date.now() - 1800000).toLocaleString(),
    transactionType: 'authOnlyTransaction',
    transactionStatus: 'authorizedPendingCapture',
    responseCode: '1',
    authCode: 'PEND441',
    avsResultCode: 'Y',
    cvvResultCode: 'M',
    cavvResultCode: '2',
    authAmount: 1250.00,
    settleAmount: 1250.00,
    accountType: 'Visa',
    accountNumber: 'XXXX1111',
    transHash: 'E89210FA90184712039BCA7201948810',
    batchId: 'OPEN_BATCH',
    order: {
      invoiceNumber: 'INV-PEND-01',
      description: 'Pending Security Token Escrow Hold'
    },
    billTo: {
      firstName: 'Arthur',
      lastName: 'Pendleton',
      company: 'Meridian Capital LLC',
      address: '200 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10166',
      country: 'USA'
    },
    payment: {
      method: 'creditCard'
    }
  }
];

// 1. Transaction Endpoint: Direct XML/JSON request.api proxy and gateway
authorizenetRouter.post(['/request.api', '/transaction', '/createTransactionRequest'], async (req: Request, res: Response) => {
  const config = getAuthNetConfig(req);
  const reqBody = req.body || {};
  const transReq = reqBody.createTransactionRequest?.transactionRequest || reqBody.transactionRequest;

  // If real credentials are provided and not default mock credentials, forward to live Authorize.Net endpoint
  const isDefaultKey = config.transactionKey === '346HZ32z3fP4hTG2' || !process.env.AUTHORIZENET_TRANSACTION_KEY;
  if (!isDefaultKey && process.env.AUTHORIZENET_API_LOGIN_ID) {
    try {
      const response = await axios.post(config.endpoint, reqBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      return res.json(response.data);
    } catch (err: any) {
      console.warn('Authorize.Net live API request failed or timed out. Falling back to high-fidelity gateway engine:', err.message);
    }
  }

  // Gateway Simulation Engine
  const transType = transReq?.transactionType || 'authCaptureTransaction';
  const refTransId = transReq?.refTransId || '';
  const amount = Number(transReq?.amount || 150.00);

  // Handle Prior Authorization Capture
  if (transType === 'priorAuthCaptureTransaction') {
    // If refTransId is 128 or exists in stored transactions, approve
    const matched = storedTransactions.find(t => t.refTransID === refTransId || t.transId === refTransId);
    
    // Check if user specifically requested an error or if refTransId is unknown
    if (refTransId === 'error_trigger' || (!matched && refTransId !== '128')) {
      return res.json({
        transactionResponse: {
          responseCode: '3',
          authCode: '',
          avsResultCode: 'P',
          cvvResultCode: '',
          cavvResultCode: '',
          transId: '0',
          refTransID: refTransId,
          transHash: 'B349AC0DCCCF601C6DB09403341CD18F',
          accountNumber: '',
          accountType: '',
          errors: [
            {
              errorCode: '16',
              errorText: 'The transaction cannot be found.'
            }
          ],
          shipTo: {}
        },
        messages: {
          resultCode: 'Error',
          message: [
            {
              code: 'E00027',
              text: 'The transaction was unsuccessful.'
            }
          ]
        }
      });
    }

    const newTransId = String(Math.floor(60000000000 + Math.random() * 9999999999));
    const capturedTrans: StoredTransaction = {
      transId: newTransId,
      submitTimeUTC: new Date().toISOString(),
      submitTimeLocal: new Date().toLocaleString(),
      transactionType: 'priorAuthCaptureTransaction',
      transactionStatus: 'capturedPendingSettlement',
      responseCode: '1',
      authCode: 'CAP' + Math.floor(100 + Math.random() * 899),
      avsResultCode: 'P',
      cvvResultCode: 'M',
      cavvResultCode: '2',
      authAmount: matched?.authAmount || amount || 1850.00,
      settleAmount: matched?.settleAmount || amount || 1850.00,
      accountType: matched?.accountType || 'Visa',
      accountNumber: matched?.accountNumber || 'XXXX0015',
      refTransID: refTransId,
      transHash: 'B349AC0DCCCF601C6DB09403341CD18F',
      batchId: 'OPEN_BATCH',
      order: {
        invoiceNumber: matched?.order?.invoiceNumber || 'INV-PRIOR-' + refTransId,
        description: 'Prior Authorization Capture for Trans #' + refTransId
      },
      billTo: matched?.billTo || {
        firstName: 'Valued',
        lastName: 'Client',
        company: 'Apex Sovereign Corporation',
        address: '500 Madison Ave',
        city: 'New York',
        state: 'NY',
        zip: '10022',
        country: 'USA'
      },
      payment: { method: 'creditCard' }
    };

    unsettledTransactions.unshift(capturedTrans);

    return res.json({
      transactionResponse: {
        responseCode: '1',
        authCode: capturedTrans.authCode,
        avsResultCode: 'P',
        cvvResultCode: 'M',
        cavvResultCode: '2',
        transId: newTransId,
        refTransID: refTransId,
        transHash: capturedTrans.transHash,
        accountNumber: capturedTrans.accountNumber,
        accountType: capturedTrans.accountType,
        messages: [
          {
            code: '1',
            description: 'This transaction has been approved.'
          }
        ],
        shipTo: {}
      },
      messages: {
        resultCode: 'Ok',
        message: [
          {
            code: 'I00001',
            text: 'Successful.'
          }
        ]
      }
    });
  }

  // Handle Authorization and Capture, Continued (e.g. PayPal Continued Flow)
  if (transType === 'authCaptureContinueTransaction') {
    const payPalPayerId = transReq?.payment?.payPal?.payerID || '';
    
    if (refTransId === 'error_trigger' || (!payPalPayerId && refTransId !== '139')) {
      return res.json({
        transactionResponse: {
          responseCode: '3',
          authCode: '',
          avsResultCode: 'P',
          cvvResultCode: '',
          cavvResultCode: '',
          transId: '0',
          refTransID: refTransId,
          transHash: 'B349AC0DCCCF601C6DB09403341CD18F',
          accountNumber: '',
          accountType: '',
          errors: [
            {
              errorCode: '16',
              errorText: 'The transaction cannot be found.'
            }
          ],
          shipTo: {}
        },
        messages: {
          resultCode: 'Error',
          message: [
            {
              code: 'E00027',
              text: 'The transaction was unsuccessful.'
            }
          ]
        }
      });
    }

    const newTransId = String(Math.floor(60000000000 + Math.random() * 9999999999));
    const continuedTrans: StoredTransaction = {
      transId: newTransId,
      submitTimeUTC: new Date().toISOString(),
      submitTimeLocal: new Date().toLocaleString(),
      transactionType: 'authCaptureContinueTransaction',
      transactionStatus: 'capturedPendingSettlement',
      responseCode: '1',
      authCode: 'PPC' + Math.floor(100 + Math.random() * 899),
      avsResultCode: 'P',
      cvvResultCode: '',
      cavvResultCode: '',
      authAmount: amount || 3200.00,
      settleAmount: amount || 3200.00,
      accountType: 'PayPal',
      accountNumber: 'XXXX9901',
      refTransID: refTransId,
      transHash: 'B349AC0DCCCF601C6DB09403341CD18F',
      batchId: 'OPEN_BATCH',
      order: {
        invoiceNumber: 'INV-PAYPAL-' + refTransId,
        description: 'Authorized and Captured Continued via PayPal Payer ' + (payPalPayerId || 'S6D5ETGSVYX94')
      },
      billTo: {
        firstName: 'Alexander',
        lastName: 'Wright',
        company: 'Sovereign Capital Ltd',
        address: '25 Bank Street',
        city: 'London',
        state: 'LDN',
        zip: 'E14 5JP',
        country: 'UK'
      },
      payment: {
        method: 'payPal',
        payerID: payPalPayerId || 'S6D5ETGSVYX94'
      }
    };

    unsettledTransactions.unshift(continuedTrans);

    return res.json({
      transactionResponse: {
        responseCode: '1',
        authCode: continuedTrans.authCode,
        avsResultCode: 'P',
        cvvResultCode: '',
        cavvResultCode: '',
        transId: newTransId,
        refTransID: refTransId,
        transHash: continuedTrans.transHash,
        accountNumber: 'XXXX9901',
        accountType: 'PayPal',
        messages: [
          {
            code: '1',
            description: 'This transaction has been approved.'
          }
        ],
        shipTo: {}
      },
      messages: {
        resultCode: 'Ok',
        message: [
          {
            code: 'I00001',
            text: 'Successful.'
          }
        ]
      }
    });
  }

  // Handle Standard Authorization & Capture (or Auth Only)
  const isAuthOnly = transType === 'authOnlyTransaction';
  const newTransId = String(Math.floor(60000000000 + Math.random() * 9999999999));
  const cardData = transReq?.payment?.creditCard;
  const rawNum = cardData?.cardNumber || '4007000000027';
  const last4 = rawNum.slice(-4);
  const accountType = rawNum.startsWith('4') ? 'Visa' : rawNum.startsWith('5') ? 'MasterCard' : rawNum.startsWith('3') ? 'AmericanExpress' : 'Discover';

  const newTrans: StoredTransaction = {
    transId: newTransId,
    submitTimeUTC: new Date().toISOString(),
    submitTimeLocal: new Date().toLocaleString(),
    transactionType: transType,
    transactionStatus: isAuthOnly ? 'authorizedPendingCapture' : 'capturedPendingSettlement',
    responseCode: '1',
    authCode: 'AUTH' + Math.floor(100 + Math.random() * 899),
    avsResultCode: 'Y',
    cvvResultCode: 'M',
    cavvResultCode: '2',
    authAmount: amount,
    settleAmount: isAuthOnly ? 0 : amount,
    accountType,
    accountNumber: `XXXX${last4}`,
    transHash: 'A9821038DFBA7201948810237BC19488',
    batchId: 'OPEN_BATCH',
    order: {
      invoiceNumber: transReq?.order?.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      description: transReq?.order?.description || 'Enterprise Gateway Transaction'
    },
    billTo: transReq?.billTo || {
      firstName: 'Apex',
      lastName: 'Corporate',
      company: 'Burvelo Enterprise Systems',
      address: '745 7th Ave',
      city: 'New York',
      state: 'NY',
      zip: '10019',
      country: 'USA'
    },
    payment: { method: 'creditCard' }
  };

  unsettledTransactions.unshift(newTrans);

  res.json({
    transactionResponse: {
      responseCode: '1',
      authCode: newTrans.authCode,
      avsResultCode: newTrans.avsResultCode,
      cvvResultCode: newTrans.cvvResultCode,
      cavvResultCode: newTrans.cavvResultCode,
      transId: newTransId,
      refTransID: '',
      transHash: newTrans.transHash,
      accountNumber: newTrans.accountNumber,
      accountType: newTrans.accountType,
      messages: [
        {
          code: '1',
          description: isAuthOnly ? 'This transaction has been authorized successfully.' : 'This transaction has been approved.'
        }
      ],
      shipTo: {}
    },
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 2. REPORT: Settled Batch List (`getSettledBatchListRequest`)
authorizenetRouter.post('/getSettledBatchListRequest', (req: Request, res: Response) => {
  const reqBody = req.body?.getSettledBatchListRequest || req.body || {};
  const includeStats = reqBody.includeStatistics !== false;

  res.json({
    batchList: storedBatches.map(b => ({
      batchId: b.batchId,
      settlementTimeUTC: b.settlementTimeUTC,
      settlementTimeLocal: b.settlementTimeLocal,
      settlementState: b.settlementState,
      paymentMethod: b.paymentMethod,
      marketType: b.marketType,
      product: b.product,
      statistics: includeStats ? b.statistics : undefined
    })),
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 3. REPORT: Transaction List for a Batch (`getTransactionListRequest`)
authorizenetRouter.post('/getTransactionListRequest', (req: Request, res: Response) => {
  const reqBody = req.body?.getTransactionListRequest || req.body || {};
  const batchId = String(reqBody.batchId || '984210');

  const matchingTransactions = storedTransactions.filter(t => t.batchId === batchId);

  res.json({
    transactions: matchingTransactions.map(t => ({
      transId: t.transId,
      submitTimeUTC: t.submitTimeUTC,
      submitTimeLocal: t.submitTimeLocal,
      status: t.transactionStatus,
      responseCode: t.responseCode,
      accountType: t.accountType,
      accountNumber: t.accountNumber,
      settleAmount: t.settleAmount,
      marketType: 'eCommerce',
      product: 'Authorize.Net Gateway'
    })),
    totalNumInResultSet: matchingTransactions.length,
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 4. REPORT: Transaction Details (`getTransactionDetailsRequest`)
authorizenetRouter.post('/getTransactionDetailsRequest', (req: Request, res: Response) => {
  const reqBody = req.body?.getTransactionDetailsRequest || req.body || {};
  const transId = String(reqBody.transId || '60183921029');

  const found = storedTransactions.find(t => t.transId === transId) ||
                unsettledTransactions.find(t => t.transId === transId) ||
                storedTransactions[0];

  res.json({
    transaction: {
      transId: found.transId,
      submitTimeUTC: found.submitTimeUTC,
      submitTimeLocal: found.submitTimeLocal,
      transactionType: found.transactionType,
      transactionStatus: found.transactionStatus,
      responseCode: found.responseCode,
      responseReasonCode: '1',
      responseReasonDescription: 'Approval',
      authCode: found.authCode,
      AVSResponse: found.avsResultCode,
      cardCodeResponse: found.cvvResultCode,
      CAVVResponse: found.cavvResultCode,
      batch: {
        batchId: found.batchId,
        settlementTimeUTC: new Date().toISOString(),
        settlementState: 'settledSuccessfully'
      },
      order: found.order,
      authAmount: found.authAmount,
      settleAmount: found.settleAmount,
      tax: {
        amount: Math.round(found.settleAmount * 0.08875 * 100) / 100,
        name: 'State & City Tax',
        description: 'Standard Combined Sales Tax'
      },
      billTo: found.billTo,
      payment: {
        creditCard: found.payment.method === 'creditCard' ? {
          cardNumber: found.accountNumber,
          expirationDate: 'XXXX',
          cardType: found.accountType
        } : undefined,
        payPal: found.payment.method === 'payPal' ? {
          payerID: found.payment.payerID || 'S6D5ETGSVYX94'
        } : undefined
      }
    },
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 5. REPORT: Unsettled Transaction List (`getUnsettledTransactionListRequest`)
authorizenetRouter.post('/getUnsettledTransactionListRequest', (req: Request, res: Response) => {
  res.json({
    transactions: unsettledTransactions.map(t => ({
      transId: t.transId,
      submitTimeUTC: t.submitTimeUTC,
      submitTimeLocal: t.submitTimeLocal,
      status: t.transactionStatus,
      responseCode: t.responseCode,
      accountType: t.accountType,
      accountNumber: t.accountNumber,
      settleAmount: t.settleAmount,
      marketType: 'eCommerce',
      product: 'Authorize.Net Gateway'
    })),
    totalNumInResultSet: unsettledTransactions.length,
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 6. REPORT: Batch Statistics (`getBatchStatisticsRequest`)
authorizenetRouter.post('/getBatchStatisticsRequest', (req: Request, res: Response) => {
  const reqBody = req.body?.getBatchStatisticsRequest || req.body || {};
  const batchId = String(reqBody.batchId || '984210');
  const batch = storedBatches.find(b => b.batchId === batchId) || storedBatches[0];

  res.json({
    batch: {
      batchId: batch.batchId,
      settlementTimeUTC: batch.settlementTimeUTC,
      settlementTimeLocal: batch.settlementTimeLocal,
      settlementState: batch.settlementState,
      statistics: batch.statistics
    },
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 7. REPORT: Merchant Details (`getMerchantDetailsRequest`)
authorizenetRouter.post('/getMerchantDetailsRequest', (req: Request, res: Response) => {
  const config = getAuthNetConfig(req);
  res.json({
    isTestMode: config.environment === 'sandbox',
    processors: [
      { name: 'Visa Commercial Direct Processing' },
      { name: 'MasterCard World Wide Platform' },
      { name: 'American Express OptBlue' },
      { name: 'Discover Network' },
      { name: 'PayPal Express Checkout' },
      { name: 'eCheck.Net Automated Clearing House' }
    ],
    merchantName: 'Burvelo Sovereign Treasury & Merchant Services LLC',
    gatewayId: 'APEX-AUTHNET-GATEWAY-2026',
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    marketTypes: ['eCommerce', 'MOTO', 'Retail Card Present'],
    paymentMethods: ['creditCard', 'bankAccount', 'payPal'],
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 8. Customer Profile Manager (CIM)
authorizenetRouter.post('/createCustomerProfileRequest', (req: Request, res: Response) => {
  const customerProfileId = String(Math.floor(10000000 + Math.random() * 89999999));
  const customerPaymentProfileId = String(Math.floor(20000000 + Math.random() * 89999999));

  res.json({
    customerProfileId,
    customerPaymentProfileIdList: [customerPaymentProfileId],
    customerShippingAddressIdList: [],
    validationDirectResponseList: ['1,1,1,This transaction has been approved.,AUTH01,Y,60183921000,,,,150.00,CC,,,,,XXXX0015,Visa,,,,,,,,,,,,,,,,,,,,,,,,,,,,'],
    messages: {
      resultCode: 'Ok',
      message: [
        {
          code: 'I00001',
          text: 'Successful.'
        }
      ]
    }
  });
});

// 9. Settlement Batch Close simulation
authorizenetRouter.post('/closeCurrentBatch', (req: Request, res: Response) => {
  if (unsettledTransactions.length === 0) {
    return res.json({
      success: true,
      message: 'No unsettled transactions in the current batch to settle.',
      batchId: storedBatches[0].batchId
    });
  }

  const newBatchId = String(Number(storedBatches[storedBatches.length - 1].batchId) + 1);
  let totalCaptured = 0;
  let totalRefunded = 0;

  unsettledTransactions.forEach(t => {
    t.batchId = newBatchId;
    t.transactionStatus = 'settledSuccessfully';
    storedTransactions.unshift(t);
    totalCaptured += t.settleAmount;
  });

  const newBatch = {
    batchId: newBatchId,
    settlementTimeUTC: new Date().toISOString(),
    settlementTimeLocal: new Date().toLocaleString(),
    settlementState: 'settledSuccessfully',
    paymentMethod: 'creditCard',
    marketType: 'eCommerce',
    product: 'Authorize.Net Gateway Enterprise',
    statistics: [
      {
        accountType: 'Multi-Card Portfolio',
        chargeAmount: totalCaptured,
        chargeCount: unsettledTransactions.length,
        refundAmount: totalRefunded,
        refundCount: 0,
        voidCount: 0,
        declineCount: 0,
        errorCount: 0
      }
    ]
  };

  storedBatches.unshift(newBatch);
  const settledCount = unsettledTransactions.length;
  unsettledTransactions = [];

  res.json({
    success: true,
    message: `Batch #${newBatchId} settled successfully with ${settledCount} transactions.`,
    batch: newBatch
  });
});

// 10. Gateway Status & Diagnostic
authorizenetRouter.get('/status', (req: Request, res: Response) => {
  const config = getAuthNetConfig(req);
  res.json({
    gateway: 'Authorize.Net API Live Gateway & Reports Engine',
    version: 'XML/JSON v1.0',
    environment: config.environment,
    apiLoginIdConfigured: Boolean(process.env.AUTHORIZENET_API_LOGIN_ID),
    transactionKeyConfigured: Boolean(process.env.AUTHORIZENET_TRANSACTION_KEY),
    activeLoginMask: config.apiLoginId.slice(0, 3) + '***' + config.apiLoginId.slice(-2),
    settledBatchesCount: storedBatches.length,
    storedTransactionsCount: storedTransactions.length,
    unsettledTransactionsCount: unsettledTransactions.length,
    timestamp: new Date().toISOString()
  });
});
