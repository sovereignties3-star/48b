export interface AccountingCategory {
  id: string;
  name: string;
  code?: string;
  classification: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense' | 'Cost of Goods Sold';
  accountType: string;
  accountSubType?: string;
  parentCategory?: string;
  isSubCategory: boolean;
  description: string;
}

export const ACCOUNTING_CATEGORIES: AccountingCategory[] = [
  // Equity & Retained Earnings
  {
    id: '1c62db8a-42d6-49ce-88d6-556cb4a6dd9a',
    name: 'Retained Earnings',
    classification: 'Equity',
    accountType: 'Equity',
    accountSubType: 'RetainedEarnings',
    isSubCategory: false,
    description: 'Cumulative net earnings or profits retained in the business rather than paid out.'
  },
  {
    id: 'e04ae0f3-3b9f-45b4-a923-9fc9a1ec2683',
    name: 'Opening balance equity',
    classification: 'Equity',
    accountType: 'Equity',
    accountSubType: 'OpeningBalanceEquity',
    isSubCategory: false,
    description: 'Equity account used to balance initial balances when setting up accounts.'
  },
  {
    id: '939e6f8e-2899-45f9-8304-e7a13849b7fb',
    name: 'Owner draws',
    classification: 'Equity',
    accountType: 'Equity',
    accountSubType: 'OwnersEquity',
    isSubCategory: false,
    description: 'Distributions or withdrawals of cash/assets by business owners.'
  },
  {
    id: '21a15f3a-3579-47fe-918e-d4680603ef29',
    name: 'Owner investments',
    classification: 'Equity',
    accountType: 'Equity',
    accountSubType: 'OwnersEquity',
    isSubCategory: false,
    description: 'Capital contributions invested by owners into the business.'
  },
  {
    id: '76fa51a5-bf41-48ca-922c-dce646002c26',
    name: 'Common Stock',
    code: '330',
    classification: 'Equity',
    accountType: 'Equity',
    accountSubType: 'CommonStock',
    isSubCategory: false,
    description: 'Par value of common stock issued to corporate shareholders.'
  },

  // Income / Sales
  {
    id: 'f77cfa92-24a3-4652-b4a0-3e184d9b0577',
    name: 'Sales',
    classification: 'Income',
    accountType: 'Income',
    accountSubType: 'SalesOfProductIncome',
    isSubCategory: false,
    description: 'Gross revenue generated from standard business sales and services.'
  },
  {
    id: '021a4051-77a6-47e8-9523-fea49040efc0',
    name: 'Uncategorized Income',
    classification: 'Income',
    accountType: 'Income',
    accountSubType: 'OtherPrimaryIncome',
    isSubCategory: false,
    description: 'Holding account for received revenue requiring general ledger classification.'
  },
  {
    id: '4909fdfe-814c-414a-8a55-32184735c002',
    name: 'Billable Expense Income',
    classification: 'Income',
    accountType: 'Income',
    accountSubType: 'ServiceFeeIncome',
    isSubCategory: false,
    description: 'Income recognized from billing reimbursed operational expenses to clients.'
  },
  {
    id: '6e4a6205-1214-4335-9a6e-6e79defb4cf1',
    name: 'Other income',
    classification: 'Income',
    accountType: 'Other Income',
    accountSubType: 'OtherMiscellaneousIncome',
    isSubCategory: false,
    description: 'Incidental revenue from non-operating transactions.'
  },
  {
    id: '7f9aa2fd-1168-4433-8f35-e53c1404930e',
    name: 'Credit card rewards',
    classification: 'Income',
    accountType: 'Other Income',
    accountSubType: 'OtherMiscellaneousIncome',
    parentCategory: 'Other income',
    isSubCategory: true,
    description: 'Cashback bonuses and rebates earned on corporate credit cards.'
  },
  {
    id: 'dab82479-f554-4597-af58-14ab3a1e8de4',
    name: 'Insurance claims',
    classification: 'Income',
    accountType: 'Other Income',
    accountSubType: 'OtherMiscellaneousIncome',
    parentCategory: 'Other income',
    isSubCategory: true,
    description: 'Proceeds received from resolved corporate insurance loss settlements.'
  },
  {
    id: '3d1c5e7c-038f-4f93-ae39-def9f285ee5b',
    name: 'Interest earned',
    classification: 'Income',
    accountType: 'Other Income',
    accountSubType: 'InterestEarned',
    parentCategory: 'Other income',
    isSubCategory: true,
    description: 'Yield and interest generated on high-yield cash and deposit accounts.'
  },
  {
    id: '20e1fb8c-7542-45be-a986-9a6e92eb3b66',
    name: 'Sale of an asset',
    classification: 'Income',
    accountType: 'Other Income',
    accountSubType: 'GainOnSaleOfAssets',
    parentCategory: 'Other income',
    isSubCategory: true,
    description: 'Net gain recognized upon liquidation or disposal of capital assets.'
  },
  {
    id: 'adecfa9f-a6a8-43a0-9a1a-65ee64974244',
    name: 'Sales of Product Income',
    classification: 'Income',
    accountType: 'Income',
    accountSubType: 'SalesOfProductIncome',
    isSubCategory: false,
    description: 'Gross receipts from retail, wholesale, or physical digital goods sold.'
  },
  {
    id: 'e547cb46-fa47-44ae-8ef3-9ff0a6274051',
    name: 'Refunds to customers',
    classification: 'Income',
    accountType: 'Income',
    accountSubType: 'DiscountsRefundsGiven',
    isSubCategory: false,
    description: 'Contra-revenue account for customer returns, credits, and price concessions.'
  },

  // Assets
  {
    id: 'b896c3ab-c712-4265-a44a-e611ce68ffa8',
    name: 'Uncategorized Asset',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'OtherCurrentAssets',
    isSubCategory: false,
    description: 'Temporary asset bucket for asset purchases awaiting balance sheet audit.'
  },
  {
    id: '004b5e8f-ea86-44bd-af45-82fb9b4d4dd0',
    name: 'Accounts Receivable (A/R)',
    classification: 'Asset',
    accountType: 'Accounts Receivable',
    accountSubType: 'AccountsReceivable',
    isSubCategory: false,
    description: 'Outstanding invoices and claims owed by credit customers.'
  },
  {
    id: 'f3eb2c25-3e3e-4c32-960a-72bd0784ffed',
    name: 'Accounts Receivable',
    code: '120',
    classification: 'Asset',
    accountType: 'Accounts Receivable',
    accountSubType: 'AccountsReceivable',
    isSubCategory: false,
    description: 'Chart of Accounts code 120 standard customer receivable ledger.'
  },
  {
    id: 'e45b7b58-8b61-4744-a030-5de25bdb8509',
    name: '5435344343 Cash',
    classification: 'Asset',
    accountType: 'Bank',
    accountSubType: 'Checking',
    isSubCategory: false,
    description: 'Designated operating treasury checking bank account.'
  },
  {
    id: '81af62de-6014-49d2-8d23-cd258ca078f3',
    name: '590310699 Cash on hand',
    classification: 'Asset',
    accountType: 'Bank',
    accountSubType: 'CashOnHand',
    isSubCategory: false,
    description: 'Petty cash and liquid on-premise vault currency balance.'
  },
  {
    id: 'd5488012-360c-498c-9611-1ff7536c1817',
    name: 'Inventory Asset',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'Inventory',
    isSubCategory: false,
    description: 'Total wholesale value of physical and raw inventory held for sale.'
  },
  {
    id: 'a7727cd3-d012-4c05-a1ca-8e1c35d2e748',
    name: 'Buildings',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'Buildings',
    isSubCategory: false,
    description: 'Real estate commercial property and permanent structural assets.'
  },
  {
    id: 'f6d3f8e5-7847-43c6-a79a-3d3602572964',
    name: 'Land',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'Land',
    isSubCategory: false,
    description: 'Real estate land parcels and non-depreciable freehold property.'
  },
  {
    id: 'd11d1e47-bf7f-4c32-9269-229209f26ca2',
    name: 'Vehicles',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'Vehicles',
    isSubCategory: false,
    description: 'Automobiles, transport trucks, and logistics fleet vehicles owned.'
  },
  {
    id: '1ed347cd-80d4-4d40-a75e-a5939a0ae7c6',
    name: 'Long-term office equipment',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    isSubCategory: false,
    description: 'Capitalized durable office equipment with multi-year useful life.'
  },
  {
    id: '72fff615-ca32-4bcc-b667-2c35d72a9615',
    name: 'Computers & tablets',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Workstations, laptops, tablets, and engineering computing hardware.'
  },
  {
    id: '8aaa1776-1e60-47ea-a0ae-63a6acde7b3a',
    name: 'Computer Equipment',
    code: '160',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    isSubCategory: false,
    description: 'Chart of Accounts code 160 fixed asset IT server and computing equipment.'
  },
  {
    id: '0c441c97-fa11-42b1-9d0a-b5f2980a55e4',
    name: 'Copiers',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Enterprise multi-function printers, document scanners, and copiers.'
  },
  {
    id: '29266f5f-3f1a-40d3-bd71-6a8e03eca2cb',
    name: 'Custom software or app',
    classification: 'Asset',
    accountType: 'Other Asset',
    accountSubType: 'IntangibleAssets',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Internally developed proprietary software intellectual property.'
  },
  {
    id: 'f81a4069-e2e7-46cb-915a-c62e7be6cc9c',
    name: 'Furniture',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Office executive desks, conference chairs, and ergonomic fixtures.'
  },
  {
    id: '298b7451-f992-42b9-befc-e6bd7f5b65e3',
    name: 'Phones',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Corporate mobile phones, telecommunication hardware, and VoIP handsets.'
  },
  {
    id: '2a549509-3ff4-48a4-86eb-fb82bc103079',
    name: 'Photo & video equipment',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'FurnitureAndFixtures',
    parentCategory: 'Long-term office equipment',
    isSubCategory: true,
    description: 'Studio broadcast cameras, audio interfaces, and digital recording gear.'
  },
  {
    id: '3e843e93-dbb0-4831-ac5d-d19972a0c1a1',
    name: 'Tools, machinery, and equipment',
    classification: 'Asset',
    accountType: 'Fixed Asset',
    accountSubType: 'MachineryAndEquipment',
    isSubCategory: false,
    description: 'Manufacturing tooling, robotics, and industrial capital machinery.'
  },
  {
    id: '1eee5742-5224-48ed-ae39-0cb9437f0765',
    name: 'Payments to deposit',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'UndepositedFunds',
    isSubCategory: false,
    description: 'Funds collected from clients waiting for consolidated bank deposit batching.'
  },
  {
    id: 'dffe7b07-89bb-4a43-a45b-e1184066b3c2',
    name: 'Prepaid credit',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'PrepaidExpenses',
    isSubCategory: false,
    description: 'Credit balances extended with vendors or suppliers prior to invoice settlement.'
  },
  {
    id: '32103c50-9076-4899-9ffc-366e1ca08de0',
    name: 'Prepaid expenses',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'PrepaidExpenses',
    isSubCategory: false,
    description: 'Advance payments for services, subscriptions, and coverage not yet amortized.'
  },
  {
    id: 'e5afc5a0-eddb-4008-9d00-36545d8c0f4a',
    name: 'Loans to others',
    classification: 'Asset',
    accountType: 'Other Current Asset',
    accountSubType: 'LoansToOthers',
    isSubCategory: false,
    description: 'Notes receivable and bridge loans issued to counterparties or affiliates.'
  },

  // Liabilities
  {
    id: 'e57cfc03-a31c-4d32-b3bf-a363dfbf2a18',
    name: 'Accounts Payable (A/P)',
    classification: 'Liability',
    accountType: 'Accounts Payable',
    accountSubType: 'AccountsPayable',
    isSubCategory: false,
    description: 'Short-term obligations owed to suppliers and corporate creditors.'
  },
  {
    id: '0a75c30b-72c7-49dc-b769-5d74fab6c5b3',
    name: 'Accounts Payable',
    code: '200',
    classification: 'Liability',
    accountType: 'Accounts Payable',
    accountSubType: 'AccountsPayable',
    isSubCategory: false,
    description: 'Chart of Accounts code 200 primary vendor obligations ledger.'
  },
  {
    id: 'e25516e1-bc96-43ae-9793-df63e0c8954d',
    name: 'Customer prepayments',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'OtherCurrentLiabilities',
    isSubCategory: false,
    description: 'Unearned customer deposits held prior to milestone delivery.'
  },
  {
    id: '8a62327f-057b-46e3-8db9-7e6607fe83a9',
    name: 'Lines of credit',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'LineOfCredit',
    isSubCategory: false,
    description: 'Revolving bank commercial credit facility balance.'
  },
  {
    id: 'cf4356bc-9fb8-486b-a716-55668bfcbf41',
    name: 'Long-term business loans',
    classification: 'Liability',
    accountType: 'Long Term Liability',
    accountSubType: 'NotesPayable',
    isSubCategory: false,
    description: 'Institutional term debt obligations maturing after 12 months.'
  },
  {
    id: '76bb8dbb-ac1d-436f-8b2f-566b026ce2c1',
    name: 'Short-term business loans',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'OtherCurrentLiabilities',
    isSubCategory: false,
    description: 'Commercial promissory notes and bridge financing due within one year.'
  },
  {
    id: 'e4e1e6ee-7d46-4b7a-bc21-83529c2d16bd',
    name: 'Mortgages',
    classification: 'Liability',
    accountType: 'Long Term Liability',
    accountSubType: 'MortgagesPayable',
    isSubCategory: false,
    description: 'Commercial real estate mortgage principal notes payable.'
  },
  {
    id: 'c85b466f-7b91-4135-8396-b809873091e1',
    name: 'Payroll Liabilities',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'PayrollClearing',
    isSubCategory: false,
    description: 'Payroll tax and employee compensation withholdings pending agency payment.'
  },
  {
    id: '81d402f7-1083-4570-b835-30b144dde13c',
    name: 'Federal Taxes (941/944)',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'PayrollTaxPayable',
    parentCategory: 'Payroll Liabilities',
    isSubCategory: true,
    description: 'IRS Form 941/944 employer and employee federal tax withholdings.'
  },
  {
    id: '3dcc688c-2ada-4448-8c33-fa8b23ff9813',
    name: 'Employee Tax Payable',
    code: '230',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'PayrollTaxPayable',
    isSubCategory: false,
    description: 'Chart of Accounts code 230 employee payroll tax liabilities.'
  },
  {
    id: 'acea1a5e-2b87-4a44-a3d9-339279dcb4f7',
    name: 'Sales tax to pay',
    classification: 'Liability',
    accountType: 'Other Current Liability',
    accountSubType: 'SalesTaxPayable',
    isSubCategory: false,
    description: 'State and municipal sales taxes collected from customers.'
  },

  // Cost of Goods Sold (COGS)
  {
    id: 'b5a41a82-228d-4e56-a2b3-c74a7890b059',
    name: 'Cost of goods sold',
    classification: 'Cost of Goods Sold',
    accountType: 'Cost of Goods Sold',
    accountSubType: 'SuppliesMaterialsCogs',
    isSubCategory: false,
    description: 'Direct production costs attributable to the manufacturing of sold goods.'
  },
  {
    id: '0b5e8a50-1eb5-4d8d-b8ec-94db8f2bb9d5',
    name: 'Equipment rental (COGS)',
    classification: 'Cost of Goods Sold',
    accountType: 'Cost of Goods Sold',
    accountSubType: 'EquipmentRentalCogs',
    parentCategory: 'Cost of goods sold',
    isSubCategory: true,
    description: 'Direct project equipment and heavy machinery leased for client job sites.'
  },
  {
    id: '8442f9bc-f9fd-466e-a5ce-b170ad368b05',
    name: 'Subcontractor expenses',
    classification: 'Cost of Goods Sold',
    accountType: 'Cost of Goods Sold',
    accountSubType: 'CostOfLaborCos',
    parentCategory: 'Cost of goods sold',
    isSubCategory: true,
    description: 'External specialist contract labor assigned to billable projects.'
  },
  {
    id: '17d845da-5697-485d-ab6a-4dcb84dcbb9a',
    name: 'Supplies & materials (COGS)',
    classification: 'Cost of Goods Sold',
    accountType: 'Cost of Goods Sold',
    accountSubType: 'SuppliesMaterialsCogs',
    parentCategory: 'Cost of goods sold',
    isSubCategory: true,
    description: 'Raw components, hardware, and physical ingredients consumed in production.'
  },

  // Expenses: Advertising & Marketing
  {
    id: '8dd7fe50-7e8f-466c-b414-75250f335d1d',
    name: 'Advertising & marketing',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'AdvertisingPromotional',
    isSubCategory: false,
    description: 'Campaigns, agency fees, and customer outreach expenditures.'
  },
  {
    id: '3e526370-7380-4bc2-87ea-a644bf9fabe1',
    name: 'Advertising',
    code: '600',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'AdvertisingPromotional',
    isSubCategory: false,
    description: 'Chart of Accounts code 600 general brand and advertising campaigns.'
  },
  {
    id: 'e3200ecd-ee94-4c44-833d-19c97479e97d',
    name: 'Listing fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'AdvertisingPromotional',
    parentCategory: 'Advertising & marketing',
    isSubCategory: true,
    description: 'Marketplace, real estate MLS, and e-commerce listing charges.'
  },
  {
    id: '924af953-495d-4c86-8492-a79eba4ec990',
    name: 'Social media',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'AdvertisingPromotional',
    parentCategory: 'Advertising & marketing',
    isSubCategory: true,
    description: 'Paid social media campaigns across LinkedIn, Meta, X, and YouTube.'
  },
  {
    id: '8ba865a1-3525-4113-8a39-6336d819796d',
    name: 'Website ads',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'AdvertisingPromotional',
    parentCategory: 'Advertising & marketing',
    isSubCategory: true,
    description: 'Pay-per-click Google Search, programmatic display, and banner ads.'
  },

  // Rent & Facility
  {
    id: 'e4683ef1-60fd-4b26-a63c-0f80617c2700',
    name: 'Building & property rent',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'RentOrLeaseOfBuildings',
    isSubCategory: false,
    description: 'Lease payments for commercial office suites, warehouses, and branches.'
  },
  {
    id: 'd32b0ced-4969-4570-abdb-7f6d1091f19b',
    name: 'Rent',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'RentOrLeaseOfBuildings',
    isSubCategory: false,
    description: 'Facility occupancy and workstation rental fees.'
  },
  {
    id: '99c5ac4e-2e6a-4b07-8f40-44d5689a2c33',
    name: 'Home office',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    isSubCategory: false,
    description: 'Tax-deductible home office apportioned space expenses.'
  },
  {
    id: '8f50ea6a-e1fa-4cc2-b439-941c79e6ba04',
    name: 'Home utilities',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Home office',
    isSubCategory: true,
    description: 'Apportioned residential heating, cooling, and power for home office.'
  },
  {
    id: '111fc185-1f90-444f-9632-b811e75e2814',
    name: 'Homeowner & rental insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Home office',
    isSubCategory: true,
    description: 'Residential property coverage attributable to home office.'
  },
  {
    id: 'fbd0879d-363a-463c-acb7-faf2a9706436',
    name: 'Home office Mortgage interest',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    parentCategory: 'Home office',
    isSubCategory: true,
    description: 'Deductible residential mortgage interest apportioned to home office.'
  },
  {
    id: '09df0c47-a9cd-4a6c-bb20-b25b02141697',
    name: 'Home office Property taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    parentCategory: 'Home office',
    isSubCategory: true,
    description: 'Local municipal property levies apportioned to home business space.'
  },
  {
    id: 'a539885b-8748-47ab-9d62-dad8deaa103b',
    name: 'Home office Repairs & maintenance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'RepairMaintenance',
    parentCategory: 'Home office',
    isSubCategory: true,
    description: 'Servicing and structural repairs made to designated home office space.'
  },

  // Operations, Fees & Licenses
  {
    id: 'a90a398a-0a9d-4550-af4f-3d085cc7e3cf',
    name: 'Business licences',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    isSubCategory: false,
    description: 'State corporate filings, municipal business permits, and regulatory fees.'
  },
  {
    id: '62e8d1dc-d6b6-46c6-8778-95061de9af18',
    name: 'Commissions & fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'LegalProfessionalFees',
    isSubCategory: false,
    description: 'Third-party agent commissions, brokerage charges, and referral payouts.'
  },
  {
    id: '0dc58fb2-c68e-4241-b3e9-0637a14fe9b1',
    name: 'Contract labor',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'CostOfLabor',
    isSubCategory: false,
    description: '1099 independent contractor invoices and professional services.'
  },
  {
    id: 'a8588955-8595-45fd-aed5-47e2d4108511',
    name: 'Contributions to charities',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'CharitableContributions',
    isSubCategory: false,
    description: 'Tax-deductible 501(c)(3) corporate charitable gifts and philanthropy.'
  },
  {
    id: '5b2d4693-6787-4f7c-a150-d19773c30658',
    name: 'Depreciation',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Depreciation',
    isSubCategory: false,
    description: 'Periodic GAAP amortization of capitalized tangible equipment.'
  },
  {
    id: '4ac8836c-c793-472a-ba65-ce0ebffe41e0',
    name: 'Equipment rental',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EquipmentRental',
    isSubCategory: false,
    description: 'Operational leases for temporary office or field equipment.'
  },

  // Employee Benefits
  {
    id: 'dbeec0dd-f7ed-4c74-9041-1bd80d29d2eb',
    name: 'Employee benefits',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EmployeeBenefits',
    isSubCategory: false,
    description: 'Corporate sponsored healthcare, retirement, and wellness plans.'
  },
  {
    id: '39fbfe99-e301-424d-9851-da28193302bf',
    name: 'Employee retirement plans',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EmployeeBenefits',
    parentCategory: 'Employee benefits',
    isSubCategory: true,
    description: '401(k) employer matching and pension fund administrative fees.'
  },
  {
    id: 'dab80887-bc40-477c-b883-c70c99212258',
    name: 'Group term life insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EmployeeBenefits',
    parentCategory: 'Employee benefits',
    isSubCategory: true,
    description: 'Employer-paid life and accidental death & dismemberment policies.'
  },
  {
    id: '12a77065-bc58-4a97-bb03-c16166e683b1',
    name: 'Health & accident plans',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EmployeeBenefits',
    parentCategory: 'Employee benefits',
    isSubCategory: true,
    description: 'Group medical, dental, and vision insurance premiums.'
  },
  {
    id: '04a193e4-70b1-4b84-a03e-f0eeb9b0b23c',
    name: "Worker's compensation insurance",
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Employee benefits',
    isSubCategory: true,
    description: 'State-mandated workplace injury liability policy premiums.'
  },

  // General Business Expenses & Bank Fees
  {
    id: '9dedce58-b073-49d0-9235-0ac93eddbb13',
    name: 'General business expenses',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    isSubCategory: false,
    description: 'Day-to-day administrative and sundry operational outlays.'
  },
  {
    id: '30ee4818-3d80-4463-b48c-843759f44360',
    name: 'General Expenses',
    code: '628',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    isSubCategory: false,
    description: 'Chart of Accounts code 628 standard business operational overhead.'
  },
  {
    id: 'dbb308da-0e57-488b-8f62-ec5bab9d9836',
    name: 'Bad Debt',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'BadDebt',
    parentCategory: 'General business expenses',
    isSubCategory: true,
    description: 'Uncollectible customer receivables written off.'
  },
  {
    id: 'cabcd0f1-2431-4e8d-b3c3-e4d48b32481a',
    name: 'Bad Debts',
    code: '690',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'BadDebt',
    isSubCategory: false,
    description: 'Chart of Accounts code 690 bad debt write-offs.'
  },
  {
    id: '2f0fe6fa-d492-4483-9f9d-95b536f4ae4d',
    name: 'Bank fees & service charges',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'BankCharges',
    parentCategory: 'General business expenses',
    isSubCategory: true,
    description: 'Wire fees, monthly account maintenance, and institutional bank tolls.'
  },
  {
    id: '0dd2c690-749b-4658-acb1-18570b4d2775',
    name: 'Bank Service Charges',
    code: '604',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'BankCharges',
    isSubCategory: false,
    description: 'Chart of Accounts code 604 standard bank transaction charges.'
  },
  {
    id: '8b05cf63-2f8a-4666-98f7-ceb004713803',
    name: 'Bank Revaluations',
    code: '810',
    classification: 'Expense',
    accountType: 'Other Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    isSubCategory: false,
    description: 'Foreign exchange and multi-currency treasury revaluation adjustments.'
  },
  {
    id: '49a4fdd3-241f-47ad-abc0-d0ba12aa6b69',
    name: 'Continuing education',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    parentCategory: 'General business expenses',
    isSubCategory: true,
    description: 'Staff certifications, executive courses, and technical workshops.'
  },
  {
    id: 'c904c568-a1a2-4a1d-bdad-10b4b79be8b1',
    name: 'Memberships & subscriptions',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'DuesSubscriptions',
    parentCategory: 'General business expenses',
    isSubCategory: true,
    description: 'Trade association dues, industry journals, and recurring subscriptions.'
  },
  {
    id: 'c7e947c0-f7f0-4a03-a665-71079dca3ac6',
    name: 'Dues & Subscriptions',
    code: '676',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'DuesSubscriptions',
    isSubCategory: false,
    description: 'Chart of Accounts code 676 professional membership fees.'
  },
  {
    id: '9050a6ac-19ce-4d3c-be52-176f54906dad',
    name: 'Uniforms',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    parentCategory: 'General business expenses',
    isSubCategory: true,
    description: 'Work uniforms, safety attire, and company branded apparel.'
  },

  // Insurance
  {
    id: 'd8b20c3a-53ca-443f-8b4a-a86553520a57',
    name: 'Insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    isSubCategory: false,
    description: 'Comprehensive risk management and business insurance coverage.'
  },
  {
    id: '5b81c383-a504-49b6-83b0-17f3b67e9ec8',
    name: 'Business insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Insurance',
    isSubCategory: true,
    description: 'Key man, cyber liability, and general commercial business policies.'
  },
  {
    id: 'e92d0218-c7d2-4a1b-814f-a857935dbc19',
    name: 'Liability insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Insurance',
    isSubCategory: true,
    description: 'Commercial general liability (CGL) coverage.'
  },
  {
    id: '28bf535d-b4a9-460a-931a-27f287dd3e48',
    name: 'Property insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Insurance',
    isSubCategory: true,
    description: 'Physical building, equipment casualty, and hazard risk coverage.'
  },
  {
    id: 'aa7543e7-6e9f-4ebf-9375-c086beed9e12',
    name: 'Rental insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Insurance',
    isSubCategory: true,
    description: 'Tenant lease insurance for commercial leased facilities.'
  },

  // Interest Paid
  {
    id: '3ecb2ca5-e8c1-4ff7-896c-275b589990d0',
    name: 'Interest paid',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    isSubCategory: false,
    description: 'Debt service interest expense on debt facilities and commercial cards.'
  },
  {
    id: '7abeca3a-ca2e-47d5-8d2d-69a63f775fd3',
    name: 'Business loan interest',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    parentCategory: 'Interest paid',
    isSubCategory: true,
    description: 'Interest on commercial term credit facilities and lines.'
  },
  {
    id: '94fba20b-ae01-4576-8486-839eb51e729e',
    name: 'Credit card interest',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    parentCategory: 'Interest paid',
    isSubCategory: true,
    description: 'Finance charges and interest on corporate credit card balances.'
  },
  {
    id: 'f6dec116-c270-4ea8-88e0-fa507f274bad',
    name: 'Commercial Mortgage interest',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    parentCategory: 'Interest paid',
    isSubCategory: true,
    description: 'Interest expense accrued on commercial real estate mortgages.'
  },

  // Legal & Accounting
  {
    id: '1ea12350-17fa-4f5b-af2f-7a5efc1b0b2d',
    name: 'Legal & accounting services',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'LegalProfessionalFees',
    isSubCategory: false,
    description: 'Attorney counsel, CPA audits, tax preparation, and advisory retainers.'
  },
  {
    id: '14ab0035-ca8a-4a91-a8ee-d27c0da2748f',
    name: 'Consulting & Accounting',
    code: '612',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'LegalProfessionalFees',
    isSubCategory: false,
    description: 'Chart of Accounts code 612 advisory and CPA accounting services.'
  },
  {
    id: 'b9a58a87-2752-4e89-a0a1-941955c83495',
    name: 'Accounting fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'LegalProfessionalFees',
    parentCategory: 'Legal & accounting services',
    isSubCategory: true,
    description: 'Financial statement audits, bookkeeper retainers, and tax returns.'
  },
  {
    id: '58c9873c-2427-405e-972f-4c87546469a0',
    name: 'Legal fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'LegalProfessionalFees',
    parentCategory: 'Legal & accounting services',
    isSubCategory: true,
    description: 'Corporate law firm retainers, patent filings, and contract review.'
  },

  // Meals & Entertainment
  {
    id: '1240f2bc-e64b-437b-9338-ca7f2bcf3510',
    name: 'Meals',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EntertainmentMeals',
    isSubCategory: false,
    description: 'Business food and beverage expenditures subject to 50% deduction.'
  },
  {
    id: '7899a73a-7862-44dd-8830-bdafbe0df6f6',
    name: 'Meals with clients',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EntertainmentMeals',
    parentCategory: 'Meals',
    isSubCategory: true,
    description: 'Dining with prospective and existing clients during business meetings.'
  },
  {
    id: '90ae1ecf-9a57-498b-be17-01a7f66aa827',
    name: 'Travel meals',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EntertainmentMeals',
    parentCategory: 'Meals',
    isSubCategory: true,
    description: 'Per diem dining expenses incurred while traveling out of town.'
  },
  {
    id: '512201d9-ba24-4c35-a19e-0424a9f6a47a',
    name: 'Entertainment with clients',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EntertainmentMeals',
    isSubCategory: false,
    description: 'Client sporting events, cultural performances, and hospitality.'
  },
  {
    id: '33ac25df-f982-428a-bb62-d8d96ca6fd9c',
    name: 'Entertainment',
    code: '620',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'EntertainmentMeals',
    isSubCategory: false,
    description: 'Chart of Accounts code 620 corporate client entertainment.'
  },

  // Office Expenses
  {
    id: 'c80b7878-f102-4866-91b7-9bdeb8123f44',
    name: 'Office expenses',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OfficeGeneralAdministrativeExpenses',
    isSubCategory: false,
    description: 'General workspace operating supplies, postage, printing, and SaaS.'
  },
  {
    id: '8cb94739-14f1-43fc-8afa-fa5b1ba1703d',
    name: 'Merchant account fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'BankCharges',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'Stripe, PayPal, Visa, and POS interchange processing fees.'
  },
  {
    id: '1c0a473c-134f-426a-a14b-9871b4b3c2d7',
    name: 'Office supplies',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Supplies',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'Paper, toner, stationery, desk essentials, and small consumables.'
  },
  {
    id: 'a7ab9694-9970-4627-9c11-2442d34077fb',
    name: 'Printing & photocopying',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OfficeGeneralAdministrativeExpenses',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'Commercial printing, binding, document duplication, and blueprints.'
  },
  {
    id: '7cc85385-a5d5-41d0-8ca2-7f7886c2b7af',
    name: 'Shipping & postage',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'ShippingFreightDelivery',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'FedEx, UPS, courier, and USPS postage delivery costs.'
  },
  {
    id: 'd6e1ace7-b7c4-4a49-b581-c2e72b060261',
    name: 'Small tools and equipment',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Supplies',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'Non-capitalized tools and accessories under capitalization threshold.'
  },
  {
    id: '476ac78f-29a2-4db6-bedc-ae7f3f6b5453',
    name: 'Software & apps',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OfficeGeneralAdministrativeExpenses',
    parentCategory: 'Office expenses',
    isSubCategory: true,
    description: 'Cloud subscriptions, GitHub, AWS, Google Workspace, and AI API costs.'
  },
  {
    id: '2e4f463c-ac83-424d-95f5-35850660d769',
    name: 'Supplies',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Supplies',
    isSubCategory: false,
    description: 'Routine workplace operational supplies and consumable stock.'
  },
  {
    id: 'd193f0c4-146f-4e29-9835-01f6a533f63c',
    name: 'Supplies & materials',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Supplies',
    isSubCategory: false,
    description: 'Operating supplies, packaging, and non-inventory materials.'
  },

  // Payroll Expenses
  {
    id: '59367170-7f90-402e-b9ce-81984a58416b',
    name: 'Payroll expenses',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'PayrollExpenses',
    isSubCategory: false,
    description: 'Total compensation paid to W-2 corporate executives and employees.'
  },
  {
    id: '80b63e0a-2417-4e3b-9991-0822952269d7',
    name: 'Wages',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'PayrollExpenses',
    parentCategory: 'Payroll expenses',
    isSubCategory: true,
    description: 'Base salaries, hourly wages, overtime, and performance bonuses.'
  },

  // Personal Expenses (Owner / Non-Deductible)
  {
    id: '92f4512a-2a9d-4d77-a9cf-be2f4ae2e764',
    name: 'Personal expenses',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    isSubCategory: false,
    description: 'Non-deductible personal expenditures flagged for owner reimbursement.'
  },
  {
    id: '9971e710-1b0a-4537-a641-5bdf041971b7',
    name: 'Personal Federal taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    parentCategory: 'Personal expenses',
    isSubCategory: true,
    description: 'Individual personal income tax payments made via corporate funds.'
  },
  {
    id: '281009e5-8e57-4afe-99de-c7987440daaf',
    name: 'Owner retirement plans',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    parentCategory: 'Personal expenses',
    isSubCategory: true,
    description: 'SEP-IRA or Solo 401(k) personal retirement contributions.'
  },
  {
    id: 'b9715f72-3251-4b3f-90b7-36b3691ea476',
    name: 'Personal State taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    parentCategory: 'Personal expenses',
    isSubCategory: true,
    description: 'Personal state income tax payments.'
  },
  {
    id: 'f6509b23-a20a-4791-a68e-acb2376bf29d',
    name: 'Personal healthcare',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    parentCategory: 'Personal expenses',
    isSubCategory: true,
    description: 'Non-group personal medical costs and direct pharmacy purchases.'
  },
  {
    id: '7edd5846-cc42-402b-b016-e50acdc659f0',
    name: 'Health insurance premiums',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Personal healthcare',
    isSubCategory: true,
    description: 'Self-employed health insurance premiums paid.'
  },
  {
    id: '5b5180ea-463b-4e97-8629-3e4fa6dc688d',
    name: 'HSA contributions',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    parentCategory: 'Personal healthcare',
    isSubCategory: true,
    description: 'Tax-favored Health Savings Account deposits.'
  },

  // Purchases & Repairs
  {
    id: 'fac270a2-d512-4e49-a184-31a805212b7c',
    name: 'Purchases',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Supplies',
    isSubCategory: false,
    description: 'Direct procurement of goods and hardware materials.'
  },
  {
    id: 'cfb97506-67ce-40c7-9648-d0a80c436cf2',
    name: 'Repairs & maintenance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'RepairMaintenance',
    isSubCategory: false,
    description: 'Routine upkeep, HVAC servicing, plumbing, and structural upkeep.'
  },

  // Taxes Paid & Estimated Taxes
  {
    id: '1212d8f8-243f-4039-b64c-0482e43b36ad',
    name: 'Taxes paid',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    isSubCategory: false,
    description: 'Corporate state, local, and regulatory taxes disbursed.'
  },
  {
    id: 'cc445f56-9e1a-48eb-915c-c9093f77014b',
    name: 'Payroll taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    parentCategory: 'Taxes paid',
    isSubCategory: true,
    description: 'Employer FICA, FUTA, and state SUI unemployment contributions.'
  },
  {
    id: '1b3838de-c882-4ff6-816b-7a81d7ed3ba9',
    name: 'Property taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    parentCategory: 'Taxes paid',
    isSubCategory: true,
    description: 'Annual commercial real estate property taxes paid to counties.'
  },
  {
    id: 'f269cbb8-ee28-42e5-adbd-b433f903bc42',
    name: 'Federal estimated taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    isSubCategory: false,
    description: 'Quarterly Form 1120-W estimated federal corporate tax installments.'
  },
  {
    id: '8f3ae5cd-3acd-4875-b8cb-61ea8e8c8894',
    name: 'State estimated taxes',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'TaxesPaid',
    isSubCategory: false,
    description: 'Quarterly state franchise and corporate income tax prepayments.'
  },

  // Travel Expenses
  {
    id: 'a2403e4d-09ca-4fdd-acac-bf654af50fa0',
    name: 'Travel',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Travel',
    isSubCategory: false,
    description: 'Out-of-town corporate travel logistics, flights, and accommodations.'
  },
  {
    id: '69aeb025-c3b7-4bed-9242-9dc8b18ad3d2',
    name: 'Airfare',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Travel',
    parentCategory: 'Travel',
    isSubCategory: true,
    description: 'Commercial airline flights and baggage fees for corporate trips.'
  },
  {
    id: 'c7a968e4-e55f-4309-ad08-2db6f7a94503',
    name: 'Hotels',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Travel',
    parentCategory: 'Travel',
    isSubCategory: true,
    description: 'Hotel lodging, conference accommodations, and room taxes.'
  },
  {
    id: 'bfb9de41-beb2-4327-896a-fc98fd505810',
    name: 'Taxis or shared rides',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Travel',
    parentCategory: 'Travel',
    isSubCategory: true,
    description: 'Uber, Lyft, yellow cabs, and airport ground shuttles.'
  },
  {
    id: 'bca33ec8-c817-4b6f-b598-564caee7a924',
    name: 'Vehicle rental',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Travel',
    parentCategory: 'Travel',
    isSubCategory: true,
    description: 'Rental cars leased through Hertz, Enterprise, or Avis during trips.'
  },

  // Utilities
  {
    id: '61668b24-5439-4f5b-9dd0-d3bde805846c',
    name: 'Utilities',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    isSubCategory: false,
    description: 'Commercial facilities water, electricity, gas, internet, and sewer.'
  },
  {
    id: 'd61d48ce-151c-4949-90d6-3594f55982cf',
    name: 'Disposal & waste fees',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Commercial dumpster, recycling, and hazardous waste removal.'
  },
  {
    id: '5fb08260-c406-4b7e-84f8-f6a07123fc10',
    name: 'Electricity',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Electric utility grid power for data centers, offices, and retail.'
  },
  {
    id: 'b7a7a39b-4adf-4275-abb7-983a64e1e2c0',
    name: 'Heating & cooling',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Natural gas, heating oil, and central cooling facility utilities.'
  },
  {
    id: '7fd0915e-04ed-48f2-bd5a-145ec72c9fa8',
    name: 'Internet & TV services',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Fiber-optic broadband, dedicated IP transit, and office TV media.'
  },
  {
    id: '416269d8-197f-47d6-982d-9475c66eda26',
    name: 'Phone service',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Corporate mobile cellular carriers and cloud PBX SIP lines.'
  },
  {
    id: 'fddd0cdf-92e2-4a82-b652-2b984a641ca7',
    name: 'Water & sewer',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Utilities',
    parentCategory: 'Utilities',
    isSubCategory: true,
    description: 'Municipal water supply and drainage sewer utility bills.'
  },

  // Vehicle Expenses
  {
    id: 'fa762acb-5d6f-4069-89ba-cc53131c1e2e',
    name: 'Vehicle expenses',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    isSubCategory: false,
    description: 'Fleet vehicle maintenance, gasoline, registration, and toll fees.'
  },
  {
    id: '7f921d3e-77aa-4620-95a7-d80622530fca',
    name: 'Automobile Expenses',
    code: '648',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    isSubCategory: false,
    description: 'Chart of Accounts code 648 vehicle operating expenditures.'
  },
  {
    id: '34690829-1e19-4e8b-bf6b-f4b077d282d8',
    name: 'Parking & tolls',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'E-ZPass expressway tolls, airport parking, and meter fees.'
  },
  {
    id: '8ad47174-591b-41c6-a5c6-be002d6e5081',
    name: 'Vehicle gas & fuel',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Gasoline, diesel, and EV supercharging for company vehicles.'
  },
  {
    id: 'f1a3c953-f09d-4ea1-b620-c662e1b74358',
    name: 'Vehicle insurance',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Insurance',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Commercial auto collision, comprehensive, and fleet liability policy.'
  },
  {
    id: '67814a4f-306d-414f-9034-39898406afa2',
    name: 'Vehicle leases',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Monthly capital and operating leases on executive and logistics cars.'
  },
  {
    id: '5cc5a1bb-ea03-4e04-9b5e-0f61d2b97b68',
    name: 'Vehicle loan interest paid',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'InterestPaid',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Interest portions of monthly fleet auto financing notes.'
  },
  {
    id: 'd5716fc0-b596-41ca-acd7-6d65bc00f9b7',
    name: 'Vehicle registration',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'DMV license plates, annual vehicle registration tags, and titles.'
  },
  {
    id: '9138eaa9-053b-4114-9dd9-ac637a8b12a0',
    name: 'Vehicle repairs',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'RepairMaintenance',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Tire rotations, brake overhauls, engine servicing, and bodywork.'
  },
  {
    id: '4b56cee0-5ade-447c-84be-a445537cd34c',
    name: 'Vehicle wash & road services',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'Auto',
    parentCategory: 'Vehicle expenses',
    isSubCategory: true,
    description: 'Detailing, fleet car washes, and AAA roadside assistance.'
  },

  // Reconciliation Discrepancies & Holding
  {
    id: '6a5b3b55-4f54-4d8c-a375-de07eb85b43f',
    name: 'Reconciliation Discrepancies',
    classification: 'Expense',
    accountType: 'Other Expense',
    accountSubType: 'OtherMiscellaneousExpense',
    isSubCategory: false,
    description: 'Adjustments made when reconciling bank and credit card accounts.'
  },
  {
    id: 'da4c7fbe-f702-4f29-95c2-9f4b8742b4c6',
    name: 'Uncategorized Expense',
    classification: 'Expense',
    accountType: 'Expense',
    accountSubType: 'OtherBusinessExpenses',
    isSubCategory: false,
    description: 'Holding account for disbursements awaiting general ledger allocation.'
  }
];

export const ACCOUNTING_CATEGORY_MAP = new Map<string, AccountingCategory>(
  ACCOUNTING_CATEGORIES.map(cat => [cat.id, cat])
);

export const getCategoryById = (id: string): AccountingCategory | undefined => {
  return ACCOUNTING_CATEGORY_MAP.get(id);
};

export const searchCategories = (query: string): AccountingCategory[] => {
  const q = query.toLowerCase().trim();
  if (!q) return ACCOUNTING_CATEGORIES;
  return ACCOUNTING_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(q) ||
    cat.id.toLowerCase().includes(q) ||
    (cat.code && cat.code.includes(q)) ||
    cat.classification.toLowerCase().includes(q) ||
    cat.description.toLowerCase().includes(q)
  );
};
