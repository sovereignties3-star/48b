import { InsuranceBookingPayload, RequestHeadersConfig, ApiCallResult } from './types';

export function buildCurlCommand(
  url: string,
  headers: RequestHeadersConfig,
  payload: InsuranceBookingPayload
): string {
  const parts: string[] = [`curl -X POST "${url}"`];

  if (headers.accept) parts.push(`-H "Accept: ${headers.accept}"`);
  if (headers.contentType) parts.push(`-H "Content-Type: ${headers.contentType}"`);
  if (headers.clientId) parts.push(`-H "client_id: ${headers.clientId}"`);
  if (headers.uuid) parts.push(`-H "uuid: ${headers.uuid}"`);
  if (headers.bearerToken) parts.push(`-H "Authorization: Bearer ${headers.bearerToken}"`);

  parts.push(`-d '${JSON.stringify(payload, null, 2)}'`);
  return parts.join(' \\\n  ');
}

export async function fetchEnvConfig(): Promise<any> {
  try {
    const res = await fetch('/api/env-config');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      apiUrl: 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments',
      clientId: '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      uuid: '4fd8eb84-cf25-4be1-ab36-e52c7fc8cb52',
      bearerToken: '',
      accept: 'application/json',
      contentType: 'application/json'
    };
  }
}

export async function sendProxyBookingRequest(
  url: string,
  headers: RequestHeadersConfig,
  payload: InsuranceBookingPayload
): Promise<ApiCallResult> {
  const start = Date.now();
  try {
    const res = await fetch('/api/proxy-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl: url, headers, payload })
    });
    const data = await res.json();
    return {
      status: res.status,
      statusText: res.statusText,
      durationMs: Date.now() - start,
      responseHeaders: {},
      data,
      isError: !res.ok,
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      status: 500,
      statusText: 'Internal Error',
      durationMs: Date.now() - start,
      responseHeaders: {},
      data: { error: err.message },
      isError: true,
      timestamp: new Date().toISOString()
    };
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

