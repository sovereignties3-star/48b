/**
 * Auto-generated Multi-Spec API Client
 * Generated: 2026-10-05T03:34:40.554Z
 */

export interface ClientConfig {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  customHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  path: string;
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
  durationMs: number;
}

export class WorkbenchApiClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = {
      timeoutMs: 30000,
      ...config,
    };
  }

  public updateConfig(newConfig: Partial<ClientConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    let targetUrl = options.path;

    // Substitute path params
    if (options.pathParams) {
      for (const [key, val] of Object.entries(options.pathParams)) {
        targetUrl = targetUrl.replace(new RegExp(`\\{${key}\\}|:${key}`, 'g'), encodeURIComponent(String(val)));
      }
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      const base = this.config.baseUrl.endsWith('/') ? this.config.baseUrl.slice(0, -1) : this.config.baseUrl;
      const subPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
      targetUrl = `${base}${subPath}`;
    }

    if (options.queryParams && Object.keys(options.queryParams).length > 0) {
      const urlObj = new URL(targetUrl);
      for (const [k, v] of Object.entries(options.queryParams)) {
        if (v !== undefined && v !== null && v !== '') {
          urlObj.searchParams.append(k, String(v));
        }
      }
      targetUrl = urlObj.toString();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...this.config.customHeaders,
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['x-api-key'] = this.config.apiKey;
    }

    if (this.config.bearerToken) {
      headers['Authorization'] = `Bearer ${this.config.bearerToken}`;
    }

    const startTime = performance.now();

    const fetchInit: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
      fetchInit.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    try {
      const res = await fetch(targetUrl, fetchInit);
      const durationMs = Math.round(performance.now() - startTime);

      const respHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        respHeaders[key] = val;
      });

      let data: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = await res.text();
        }
      } else {
        data = await res.text();
      }

      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        data,
        headers: respHeaders,
        durationMs,
      };
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return {
        ok: false,
        status: 0,
        statusText: err.name || 'Network Error',
        data: { error: err.message } as any,
        headers: {},
        durationMs,
      };
    }
  }
}

export function createWorkbenchClient(config: ClientConfig): WorkbenchApiClient {
  return new WorkbenchApiClient(config);
}
