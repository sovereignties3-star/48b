# CDP Error Handling Reference

## API Errors (HTTP 4xx/5xx)
CDP uses standard HTTP response codes.
- **400 (Invalid Request)**: Malformed JSON, missing fields, or invalid parameter formats.
- **401 (Unauthorized)**: Invalid API key or expired/invalid JWT.
- **402 (Payment Required)**: x402 payment required for the resource.
- **403 (Forbidden)**: Missing permissions or scopes.
- **404 (Not Found)**: Resource (account/customer) does not exist or access denied.
- **429 (Rate Limit)**: Exceeded request limits. Use exponential backoff.
- **5xx (Server Error)**: Operational status unknown; treat as failure but operation *might* have succeeded.

## Common Error Types
- `invalid_request`: Malformed parameters.
- `unsupported_tos_language`: Invalid language tag for TOS acceptance.
- `malformed_transaction`: Invalid hex/base64 encoding or parameters for EVM/Solana.
- `invalid_signature`: Signature does not match the user operation.
- `policy_in_use`: Cannot delete a policy referenced by project/accounts.
- `invalid_sql_query`: Invalid SQL, unsupported statements, or syntax errors.
- `customer_not_authorized`: Missing capabilities (e.g., `custodyCrypto`).
- `delegation_not_found` / `expired` / `revoked`: Issues with delegation grants.
- `account_not_ready`: Account is still provisioning.
- `already_exists`: Resource creation conflict.
- `idempotency_error`: Reuse of idempotency key with different payload.
- `faucet_limit_exceeded`: Too many requests for testnet funds.
- `client_closed_request`: Client disconnected before response (HTTP 499).

## Network Errors
Network-layer errors occur before reaching the CDP API.
- `network_ip_blocked`: Restricted region, VPN/proxy, or security policy.
- `network_connection_failed`: DNS issues, connectivity drops, or firewall blocking HTTPS.
- `network_timeout`: Request terminated due to duration.
- `network_dns_failure`: DNS resolution failure.

## Handling Strategies
1. **Exponential Backoff**: Essential for `429`, `5xx`, and retryable network errors (`connection_failed`, `timeout`).
2. **Signature Verification**: Always verify webhook payloads using the `X-CDP-Webhook-Signature` header (HMAC SHA-256 with subscription secret).
3. **Idempotency**: Use unique UUID v4 idempotency keys for write operations to prevent duplicate execution during retries.
4. **Delegation**: Check `requirements.due` on customers or verify delegation status before performing actions on behalf of end-users.
