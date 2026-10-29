# 📖 Universal Endpoint Catalog & API Reference

This document provides a complete, exhaustive catalog of all 176 endpoints and schemas available on the Visa & Financial Services Developer Workbench, grouped by Specification.

## 📂 Quick Navigation
* [1. Access Online Transactions and Orders](#1-access-online-transactions-and-orders)
* [2. Account Statements](#2-account-statements)
* [3. Accounts & Financial Details](#3-accounts--financial-details)
* [4. B2B Virtual Account Payment Method](#4-b2b-virtual-account-payment-method)
* [5. Broker API](#5-broker-api)
* [6. Card on File Data Inquiry](#6-card-on-file-data-inquiry)
* [7. Card Account Balance Transfer Eligibility](#7-card-account-balance-transfer-eligibility)
* [8. Click to Pay](#8-click-to-pay)
* [9. Consent Authorization](#9-consent-authorization)
* [10. Corporate Account Information](#10-corporate-account-information)
* [11. Custody](#11-custody)
* [12. Customers Profiles](#12-customers-profiles)
* [13. DPS Card and Account Services](#13-dps-card-and-account-services)
* [14. Finicity API](#14-finicity-api)
* [15. Foreign Exchange Rates](#15-foreign-exchange-rates)
* [16. IAM Token Management Partner OAuth2](#16-iam-token-management-partner-oauth2)
* [17. Incoming Webhooks](#17-incoming-webhooks)
* [18. Kernel in the Cloud](#18-kernel-in-the-cloud)
* [19. PayPal APIs](#19-paypal-apis)
* [20. Reward Linkage Shop With Points](#20-reward-linkage-shop-with-points)
* [21. Reward Redemption Select And Credit](#21-reward-redemption-select-and-credit)
* [22. Security E2E Key Exchange PreLogin](#22-security-e2e-key-exchange-prelogin)
* [23. Tax Statement Digital Orchestration](#23-tax-statement-digital-orchestration)
* [24. Token Authorization](#24-token-authorization)
* [25. Virtual Card Payments](#25-virtual-card-payments)
* [26. Visa Accounts Receivable Manager](#26-visa-accounts-receivable-manager)
* [27. Visa BIN Attribute Sharing Service](#27-visa-bin-attribute-sharing-service)
* [28. Visa Card Program Management](#28-visa-card-program-management)
* [29. Visa Consumer Authentication Service](#29-visa-consumer-authentication-service)
* [30. Visa Credit Card Application](#30-visa-credit-card-application)
* [31. Visa DCVV2 Generate](#31-visa-dcvv2-generate)
* [32. Visa Direct Connect](#32-visa-direct-connect)
* [33. Visa Direct](#33-visa-direct)
* [34. Visa Pay](#34-visa-pay)
* [35. Visa Payment Passkey](#35-visa-payment-passkey)
* [36. Visa Travel Notification Service](#36-visa-travel-notification-service)
* [37. VisaNet Connect Issuing](#37-visanet-connect-issuing)
* [38. XML Schema: Common ComplexTypes](#38-xml-schema-common-complextypes)
* [39. XML Schema: Common Groups](#39-xml-schema-common-groups)

---

## 1. Access Online Transactions and Orders
**Spec ID:** `access-online-transactions-and-orders`  
**Category:** Transactions & Orders

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v1/transactions` | Search transaction history |
| GET | `/v1/transactions/{transactionId}` | Retrieve transaction by ID |
| POST | `/v1/orders/reconcile` | Submit order reconciliation batch |
| GET | `/v1/orders/{orderId}/status` | Check order fulfillment status |
| POST | `/v1/disputes/inquire` | Inquire cardholder dispute details |
| GET | `/v1/settlements/summary` | Daily batch settlement summary |

---

## 2. Account Statements
**Spec ID:** `account-statements`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v2/statements/accounts/{accountId}` | Get billing cycles for account |
| GET | `/v2/statements/{statementId}/pdf` | Download statement PDF |
| GET | `/v2/statements/current-balance` | Get real-time ledger balance |
| POST | `/v2/statements/delivery-preferences` | Update statement delivery channel |

---

## 3. Accounts & Financial Details
**Spec ID:** `accounts-financial-details`  
**Category:** Open Banking & Data

| Method | Route Path | Summary |
|---|---|---|
| GET | `/digital/v3/accounts` | List linked financial accounts |
| GET | `/digital/v3/accounts/{accountId}/balances` | Get ledger and available balances |
| GET | `/digital/v3/accounts/{accountId}/transactions` | Get posted and pending transactions |
| GET | `/digital/v3/accounts/{accountId}/details` | Get routing, IBAN, and account numbers |
| POST | `/digital/v3/accounts/sync` | Trigger instantaneous core bank sync |
| GET | `/digital/v3/accounts/{accountId}/interest` | Year-to-date accrued interest |
| GET | `/digital/v3/accounts/{accountId}/overdraft` | Overdraft protection limits |
| POST | `/digital/v3/accounts/categorize` | Trigger automated transaction tagging |

---

## 4. B2B Virtual Account Payment Method
**Spec ID:** `b2b-virtual-account-payment-method`  
**Category:** Virtual Cards & B2B

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/b2b/accounts/create` | Issue single-use virtual account |
| GET | `/v1/b2b/accounts/{accountNumber}/details` | Query virtual account spend metrics |
| PUT | `/v1/b2b/accounts/{accountNumber}/spend-limit` | Update dynamic spend ceiling |
| POST | `/v1/b2b/accounts/{accountNumber}/cancel` | Deactivate virtual card number |
| GET | `/v1/b2b/suppliers/directory` | Search supplier acceptance directory |
| POST | `/v1/b2b/remittance/advise` | Send automated remittance advice to payee |
| GET | `/v1/b2b/reconciliation/report` | Retrieve ERP reconciliation matching file |

---

## 5. Broker API
**Spec ID:** `broker-api`  
**Category:** Broker & Financial Services

| Method | Route Path | Summary |
|---|---|---|
| GET | `/broker/v2/accounts` | List brokerage accounts |
| POST | `/broker/v2/orders` | Place equity or ETF market order |
| GET | `/broker/v2/orders/{orderId}` | Get order execution status |
| DELETE | `/broker/v2/orders/{orderId}` | Cancel open order |
| GET | `/broker/v2/positions` | Get client open positions and cost basis |
| GET | `/broker/v2/quotes/{symbol}` | Get real-time level 1 market quote |
| GET | `/broker/v2/history/trades` | Historical trade execution blotter |
| POST | `/broker/v2/transfers/ach` | Initiate ACH bank deposit to trading balance |

---

## 6. Card on File Data Inquiry
**Spec ID:** `card-on-file-data-inquiry`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/cof/inquire` | Inquire stored cardholder credential status |
| GET | `/v1/cof/merchant/{merchantId}/tokens` | List merchant token credentials |
| POST | `/v1/cof/update-notification` | Subscribe to automated card update push |

---

## 7. Card Account Balance Transfer Eligibility
**Spec ID:** `card-account-balance-transfer-eligibility`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/balance-transfer/check-eligibility` | Check account balance transfer eligibility |
| POST | `/v1/balance-transfer/simulate-terms` | Simulate promo APR and monthly schedule |
| POST | `/v1/balance-transfer/submit` | Submit transfer request to creditor |
| GET | `/v1/balance-transfer/{transferId}/status` | Track transfer settlement status |

---

## 8. Click to Pay
**Spec ID:** `click-to-pay`  
**Category:** Digital Solutions & Payments

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v2/src/profile/lookup` | Lookup consumer Click to Pay profile by email |
| POST | `/v2/src/checkout/initiate` | Initiate SRC checkout payload |
| POST | `/v2/src/tokens/decrypt` | Decrypt secure card payload for merchant gateway |
| GET | `/v2/src/cards/enrolled` | Retrieve masked enrolled card cards list |
| POST | `/v2/src/checkout/confirm` | Confirm payment authorization |

---

## 9. Consent Authorization
**Spec ID:** `consent-authorization`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/consent/grants` | Create explicit customer data sharing grant |
| GET | `/v1/consent/grants/{grantId}` | Inspect active consent grant status |
| DELETE | `/v1/consent/grants/{grantId}` | Revoke consent grant immediately |
| GET | `/v1/consent/audit-log` | Retrieve access compliance audit log |

---

## 10. Corporate Account Information
**Spec ID:** `corporate-account-information`  
**Category:** Corporate & Commercial

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v2/corporate/enterprises/{enterpriseId}` | Get corporate entity profile |
| GET | `/v2/corporate/subsidiaries` | List child entities and departments |
| GET | `/v2/corporate/credit-lines` | Query corporate credit facilities and sub-limits |
| POST | `/v2/corporate/sub-limits/allocate` | Allocate budget limit to cost center |
| GET | `/v2/corporate/spend-analysis` | Executive corporate spend breakdown |

---

## 11. Custody
**Spec ID:** `custody`  
**Category:** Broker & Financial Services

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v1/custody/vaults` | List institutional custody vaults |
| GET | `/v1/custody/assets/{assetId}` | Get segregated asset balance & proof of reserves |
| POST | `/v1/custody/transfers/inbound` | Generate cold vault deposit address |
| POST | `/v1/custody/transfers/outbound` | Initiate multi-sig approval withdrawal |
| GET | `/v1/custody/approvals/pending` | List pending policy approval quorums |
| POST | `/v1/custody/keys/rotate` | Schedule cryptographic key rotation |

---

## 12. Customers Profiles
**Spec ID:** `customers-profiles`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v3/customers/create` | Create verified customer profile |
| GET | `/v3/customers/{customerId}` | Retrieve customer demographic record |
| PUT | `/v3/customers/{customerId}/kyc` | Submit identity KYC verification documents |
| GET | `/v3/customers/{customerId}/cards` | List payment cards issued to customer |
| POST | `/v3/customers/{customerId}/preferences` | Update communication and notification preferences |
| GET | `/v3/customers/sanctions-check` | Run OFAC / PEP automated screening |

---

## 13. DPS Card and Account Services
**Spec ID:** `dps-card-and-account-services`  
**Category:** Issuing & Processing

| Method | Route Path | Summary |
|---|---|---|
| POST | `/dps/v4/cards/activate` | Activate physical debit card |
| PUT | `/dps/v4/cards/{cardId}/status` | Update card block status (Lost/Stolen/Frozen) |
| POST | `/dps/v4/cards/{cardId}/pin/set` | Set or reset card encrypted PIN |
| GET | `/dps/v4/cards/{cardId}/velocity-limits` | Query daily ATM and POS spend caps |
| PUT | `/dps/v4/cards/{cardId}/velocity-limits` | Adjust dynamic transaction limits |
| POST | `/dps/v4/cards/reissue` | Order replacement card |
| GET | `/dps/v4/authorizations/real-time` | Live authorization stream query |
| POST | `/dps/v4/stand-in/rules` | Configure STIP stand-in fallback logic |

---

## 14. Finicity API
**Spec ID:** `finicity-api`  
**Category:** Open Banking & Data

| Method | Route Path | Summary |
|---|---|---|
| POST | `/aggregation/v1/customers` | Enroll Finicity consumer |
| GET | `/aggregation/v1/institutions` | Search financial institutions directory |
| POST | `/aggregation/v1/connect/url` | Generate Finicity Connect webview URL |
| GET | `/aggregation/v1/customers/{customerId}/accounts` | Retrieve consumer aggregated accounts |
| GET | `/aggregation/v1/customers/{customerId}/transactions` | Download verified bank statement transactions |
| POST | `/decisioning/v2/reports/voa` | Generate Verification of Assets (VOA) report |
| POST | `/decisioning/v2/reports/voi` | Generate Verification of Income (VOI) report |

---

## 15. Foreign Exchange Rates
**Spec ID:** `foreign-exchange-rates`  
**Category:** Transactions & Orders

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v1/forex/rates/latest` | Get latest interbank FX quotes |
| POST | `/v1/forex/quotes/guaranteed` | Lock in guaranteed cross-border rate for 15 mins |
| GET | `/v1/forex/pairs/{pair}/history` | Historical daily FX settlement rates |
| POST | `/v1/forex/contracts/execute` | Execute FX forward or spot contract |

---

## 16. IAM Token Management Partner OAuth2
**Spec ID:** `iam-token-management-partner-oauth2`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/oauth2/v2/token` | Mint partner OAuth2 Bearer token |
| POST | `/oauth2/v2/authorize/code` | PKCE authorization code redemption |
| POST | `/oauth2/v2/revoke` | Revoke active token pair |
| POST | `/oauth2/v2/introspect` | RFC 7662 token introspection |
| GET | `/oauth2/v2/certs` | JSON Web Key Set (JWKS) public keys |

---

## 17. Incoming Webhooks
**Spec ID:** `incoming-webhooks`  
**Category:** Developer Tools

| Method | Route Path | Summary |
|---|---|---|
| POST | `/webhooks/v1/endpoints` | Register webhook listener URL |
| GET | `/webhooks/v1/deliveries/failed` | List failed events and retry triggers |
| POST | `/webhooks/v1/test-event` | Dispatch simulated sample event payload |

---

## 18. Kernel in the Cloud
**Spec ID:** `kernel-in-the-cloud`  
**Category:** Issuing & Processing

| Method | Route Path | Summary |
|---|---|---|
| POST | `/kernel/v1/sessions/initiate` | Initiate cloud terminal kernel session |
| POST | `/kernel/v1/emv/process-apdu` | Process EMV chip APDU command script |
| POST | `/kernel/v1/nfc/contactless-read` | Process contactless NFC tag payload |
| GET | `/kernel/v1/terminals/{terminalId}/health` | Check POS terminal attestation & key state |
| POST | `/kernel/v1/certificates/inject` | Inject CA public key certificate |

---

## 19. PayPal APIs
**Spec ID:** `paypal-apis`  
**Category:** Digital Solutions & Payments

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v2/checkout/orders` | Create PayPal wallet order |
| POST | `/v2/checkout/orders/{orderId}/capture` | Capture authorized payment |
| POST | `/v2/payments/captures/{captureId}/refund` | Issue partial or full refund |
| GET | `/v2/checkout/orders/{orderId}` | Inspect order details and shipping |
| POST | `/v1/payments/payouts` | Send batch payouts to multiple recipients |

---

## 20. Reward Linkage Shop With Points
**Spec ID:** `reward-linkage-shop-with-points`  
**Category:** Rewards & Loyalty

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/rewards/link` | Link reward program to card account |
| GET | `/v1/rewards/balance` | Get spendable points balance & conversion value |
| POST | `/v1/rewards/quote` | Quote point redemption rate for merchant cart |
| DELETE | `/v1/rewards/unlink` | Unlink merchant loyalty program |

---

## 21. Reward Redemption Select And Credit
**Spec ID:** `reward-redemption-select-and-credit`  
**Category:** Rewards & Loyalty

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/redemptions/statement-credit` | Redeem points for statement credit |
| POST | `/v1/redemptions/cashback` | Disburse cash back to checking account |
| GET | `/v1/redemptions/history` | Query past redemption transaction logs |
| POST | `/v1/redemptions/cancel` | Cancel pending unposted redemption |

---

## 22. Security E2E Key Exchange PreLogin
**Spec ID:** `security-e2e-key-exchange-prelogin`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/security/v2/key-exchange/initiate` | Initiate ECDH Diffie-Hellman handshake |
| POST | `/security/v2/key-exchange/finalize` | Finalize shared secret and session token |
| POST | `/security/v2/payload/encrypt` | Encrypt sensitive cardholder fields |
| POST | `/security/v2/session/validate` | Validate cryptographic session heartbeat |

---

## 23. Tax Statement Digital Orchestration
**Spec ID:** `tax-statement-digital-orchestration`  
**Category:** Corporate & Commercial

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/taxes/1099/generate` | Generate IRS 1099-K electronic statement |
| GET | `/v1/taxes/documents/{documentId}` | Download encrypted PDF tax slip |
| POST | `/v1/taxes/w8ben/submit` | Submit foreign entity W-8BEN withholding certification |
| GET | `/v1/taxes/withholding/summary` | Annual withholding tax ledger breakdown |

---

## 24. Token Authorization
**Spec ID:** `token-authorization`  
**Category:** Digital Solutions & Payments

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v3/tokens/authorize` | Authorize digital wallet payment token |
| POST | `/v3/tokens/cryptogram/verify` | Verify 3DS / TAVV cryptographic payload |
| GET | `/v3/tokens/{tokenReferenceId}/status` | Query VTS token status and PAN lifecycle |
| POST | `/v3/tokens/{tokenReferenceId}/suspend` | Suspend token immediately |
| POST | `/v3/tokens/{tokenReferenceId}/resume` | Resume suspended token |

---

## 25. Virtual Card Payments
**Spec ID:** `virtual-card-payments`  
**Category:** Virtual Cards & B2B

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v2/virtual-cards/issue` | Generate single or multi-use virtual card |
| GET | `/v2/virtual-cards/{cardId}` | Get masked card number, CVV, and expiration |
| PUT | `/v2/virtual-cards/{cardId}/controls` | Set Merchant Category Code (MCC) filters |
| POST | `/v2/virtual-cards/{cardId}/cancel` | Cancel virtual card upon invoice match |
| GET | `/v2/virtual-cards/transactions` | Search transactions across all virtual cards |

---

## 26. Visa Accounts Receivable Manager
**Spec ID:** `visa-accounts-receivable-manager`  
**Category:** Corporate & Commercial

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/arm/invoices/upload` | Upload enterprise ERP invoice batch |
| GET | `/v1/arm/invoices/{invoiceId}/status` | Check matching and settlement status |
| POST | `/v1/arm/remittance/match` | Trigger automated ML invoice reconciliation |
| GET | `/v1/arm/discrepancies` | List payment underpayment / overpayment exceptions |

---

## 27. Visa BIN Attribute Sharing Service
**Spec ID:** `visa-bin-attribute-sharing-service`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v2/bin/inquire` | Inquire 6-digit or 8-digit BIN table metadata |
| GET | `/v2/bin/ranges/{binNumber}` | Get card brand, product code, issuing bank, country |
| GET | `/v2/bin/routing/fast-path` | Identify low-cost domestic routing eligibility |
| GET | `/v2/bin/commercial-indicator` | Check if card is Corporate, Fleet, or Purchasing |

---

## 28. Visa Card Program Management
**Spec ID:** `visa-card-program-management`  
**Category:** Issuing & Processing

| Method | Route Path | Summary |
|---|---|---|
| GET | `/v3/programs` | List active card programs |
| POST | `/v3/programs/create` | Configure new card product definition |
| PUT | `/v3/programs/{programId}/limits` | Update default daily authorization caps |
| POST | `/v3/programs/{programId}/art-profiles` | Upload digital wallet card artwork asset |
| GET | `/v3/programs/{programId}/metrics` | Query cardholder activation and interchange revenue |

---

## 29. Visa Consumer Authentication Service
**Spec ID:** `visa-consumer-authentication-service`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v2/vcas/auth-request` | Submit 3-D Secure 2.2 authentication request |
| POST | `/v2/vcas/challenge/result` | Resolve cardholder OTP or biometric challenge |
| GET | `/v2/vcas/risk-score/{transactionId}` | Retrieve ML risk evaluation score |
| POST | `/v2/vcas/exemptions/request` | Request PSD2 Low-Value Transaction Exemption |

---

## 30. Visa Credit Card Application
**Spec ID:** `visa-credit-card-application`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/applications/submit` | Submit digital credit card application |
| GET | `/v1/applications/{applicationId}/status` | Query real-time automated decision |
| POST | `/v1/applications/{applicationId}/accept-terms` | Record disclosures consent |
| POST | `/v1/applications/{applicationId}/instant-issue` | Provision digital card instantly |

---

## 31. Visa DCVV2 Generate
**Spec ID:** `visa-dcvv2-generate`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/dcvv2/generate` | Generate dynamic CVV2 security code |
| POST | `/v1/dcvv2/verify` | Verify incoming dynamic CVV2 |
| GET | `/v1/dcvv2/keys/{keyId}` | Check HSM symmetric encryption key status |

---

## 32. Visa Direct Connect
**Spec ID:** `visa-direct-connect`  
**Category:** Transactions & Orders

| Method | Route Path | Summary |
|---|---|---|
| POST | `/direct-connect/v2/funds-transfer` | High-throughput funds disbursement |
| POST | `/direct-connect/v2/network-query` | Low-latency network gateway query |
| GET | `/direct-connect/v2/routes/health` | Direct data center gateway ping |

---

## 33. Visa Direct
**Spec ID:** `visa-direct`  
**Category:** Transactions & Orders

| Method | Route Path | Summary |
|---|---|---|
| POST | `/visadirect/v3/push-funds` | Push Funds Original Credit Transaction (OCT) |
| POST | `/visadirect/v3/pull-funds` | Pull Funds Account Funding Transaction (AFT) |
| POST | `/visadirect/v3/card-query` | Query cardholder fast-funds capability |
| POST | `/visadirect/v3/cross-border/quote` | Obtain cross-border exchange fee quote |
| GET | `/visadirect/v3/transactions/{transactionId}` | Track real-time disbursement status |

---

## 34. Visa Pay
**Spec ID:** `visa-pay`  
**Category:** Digital Solutions & Payments

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/pay/qr/generate` | Generate EMVCo dynamic QR code |
| POST | `/v1/pay/qr/scan-and-pay` | Authorize payment against QR |
| POST | `/v1/pay/aliases/resolve` | Resolve alias to PAN |
| GET | `/v1/pay/notifications/status` | Push notification status |

---

## 35. Visa Payment Passkey
**Spec ID:** `visa-payment-passkey`  
**Category:** Risk & Identity

| Method | Route Path | Summary |
|---|---|---|
| POST | `/passkey/v1/registration/options` | Request WebAuthn registration challenge |
| POST | `/passkey/v1/registration/verify` | Verify credential & bind to card |
| POST | `/passkey/v1/assertion/options` | Request biometric login challenge |
| POST | `/passkey/v1/assertion/verify` | Verify biometric signature |

---

## 36. Visa Travel Notification Service
**Spec ID:** `visa-travel-notification-service`  
**Category:** Card & Account Services

| Method | Route Path | Summary |
|---|---|---|
| POST | `/v1/travel/itineraries` | Register traveler itinerary |
| GET | `/v1/travel/itineraries/active` | List active itineraries |
| DELETE | `/v1/travel/itineraries/{itineraryId}` | Cancel travel itinerary |

---

## 37. VisaNet Connect Issuing
**Spec ID:** `visanet-connect-issuing`  
**Category:** Issuing & Processing

| Method | Route Path | Summary |
|---|---|---|
| POST | `/visanet/v2/dual-message/authorize` | Dual-message 0100 authorization |
| POST | `/visanet/v2/clearing/submit` | 0200 clearing capture |
| POST | `/visanet/v2/reversals` | 0400 transaction reversal |
| GET | `/visanet/v2/interchange/qualification` | Determine fee program qualification |

---

## 38. XML Schema: Common ComplexTypes
**Spec ID:** `xml-schema-common-complextypes`  
**Category:** Schemas & XSD

* **Total Custom Types:** 42 ComplexTypes
* **Description:** Standardized ISO 8583 / ISO 20022 XML Complex Type definitions for payment payloads and message routing.

---

## 39. XML Schema: Common Groups
**Spec ID:** `xml-schema-common-groups`  
**Category:** Schemas & XSD

* **Total Groups:** 28 ModelGroups
* **Description:** Reusable element groups and model groups for XML document schema validation.
