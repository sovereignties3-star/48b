export interface CitiAccount {
  accountId: string;
  displayAccountNumber: string;
  accountGroup: string;
  accountClassification: string;
  productName: string;
  currencyCode: string;
  currentBalance: number;
  availableBalance?: number;
  outstandingBalance?: number;
  creditLimit?: number;
  accountStatus: string;
  rawDetails?: any;
}

export interface AccountGroupTotal {
  group: string;
  currentBalance: number;
  availableBalance?: number;
  currencyCode: string;
}

export interface CitiTransaction {
  transactionId: string;
  accountId: string;
  transactionDate: string;
  postingDate?: string;
  description: string;
  transactionAmount: number;
  currencyCode: string;
  transactionType: 'CREDIT' | 'DEBIT' | string;
  category?: string;
}

export interface ApiConfig {
  url: string;
  bearerToken: string;
  clientId: string;
  uuid: string;
  mode: 'live' | 'mock' | 'sandbox';
  autoRefreshInterval: number;
}

export interface ApiResponseInfo {
  status: number;
  statusText: string;
  durationMs: number;
  timestamp: string;
  headers: Record<string, string>;
  rawBody: any;
}
