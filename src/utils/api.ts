import { toast } from './toast';

export type ApiErrorType =
  | '404_SERVER_ENDPOINT'
  | '404_CLIENT_ROUTE'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'INVALID_JSON';

export class ApiError extends Error {
  public status: number;
  public is404: boolean;
  public errorType: ApiErrorType;
  public endpoint: string;
  public originalError: string | null;

  constructor(
    message: string,
    status: number,
    errorType: ApiErrorType,
    endpoint: string,
    originalError: string | null = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.is404 = status === 404;
    this.errorType = errorType;
    this.endpoint = endpoint;
    this.originalError = originalError;
  }
}

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  showToastOnError?: boolean;
  safe?: boolean;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
  status: number;
  is404: boolean;
  errorType: ApiErrorType | null;
}

function getResponseHeadersObj(headers?: Headers): Record<string, string> {
  if (!headers) return {};
  const obj: Record<string, string> = {};
  headers.forEach((val, key) => {
    obj[key] = val;
  });
  return obj;
}

/**
 * Development-only Logging Utility for API Requests & Header Diagnostics.
 * Captures and logs request and response headers exclusively in development mode
 * to help identify the source of 404 errors (e.g. Client-Side SPA Fallback vs Server 404).
 */
export const apiDevLogger = {
  /**
   * Check if running in development mode
   */
  isDev(): boolean {
    return Boolean((import.meta as any).env?.DEV || process.env.NODE_ENV !== 'production');
  },

  /**
   * Helper to format Headers object or record to plain key-value map
   */
  formatHeaders(headers?: Headers | Record<string, string> | null): Record<string, string> {
    if (!headers) return {};
    if (typeof (headers as Headers).forEach === 'function') {
      const obj: Record<string, string> = {};
      (headers as Headers).forEach((val, key) => {
        obj[key] = val;
      });
      return obj;
    }
    return { ...(headers as Record<string, string>) };
  },

  /**
   * Captures and logs request/response headers and diagnostics exclusively in dev mode.
   */
  logHeaders(info: {
    method: string;
    url: string;
    status: number;
    requestHeaders: Headers | Record<string, string>;
    responseHeaders?: Headers | Record<string, string>;
    errorType?: ApiErrorType | null;
    requestBody?: any;
    responseBody?: any;
    message?: string;
  }) {
    if (!this.isDev()) return;

    const {
      method,
      url,
      status,
      requestHeaders,
      responseHeaders,
      errorType,
      requestBody,
      responseBody,
      message,
    } = info;

    const reqHeadersObj = this.formatHeaders(requestHeaders);
    const resHeadersObj = responseHeaders ? this.formatHeaders(responseHeaders) : null;

    const isClient404 = errorType === '404_CLIENT_ROUTE';
    const isServer404 = errorType === '404_SERVER_ENDPOINT';

    let badgeColor = '#3b82f6'; // Blue default
    if (status >= 500) badgeColor = '#ef4444'; // Red
    else if (status === 404) badgeColor = '#f59e0b'; // Amber

    const title = `%c[API ${status || 'NET_ERR'}] ${method} ${url}`;
    const badgeStyle = `color: white; background: ${badgeColor}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`;

    console.groupCollapsed(title, badgeStyle);

    if (message) {
      console.log('%cSummary Message:', 'font-weight: bold;', message);
    }

    if (status === 404) {
      console.warn(
        `%c[404 Diagnostic Header Tracing]:`,
        'font-weight: bold; color: #f59e0b;',
        isClient404
          ? 'CLIENT ROUTE FALLBACK (Returned HTML). The request URL was caught by SPA static fallback. Verify route exists in server.ts.'
          : isServer404
          ? 'SERVER ENDPOINT NOT FOUND (Returned JSON/Text 404). Backend was hit but no matching handler was registered.'
          : '404 Endpoint Not Found.'
      );
    }

    console.group('%cRequest Headers', 'font-weight: bold; color: #6366f1;');
    if (console.table && Object.keys(reqHeadersObj).length > 0) {
      console.table(reqHeadersObj);
    } else {
      console.log(reqHeadersObj);
    }
    console.groupEnd();

    if (resHeadersObj) {
      console.group('%cResponse Headers', 'font-weight: bold; color: #10b981;');
      if (console.table && Object.keys(resHeadersObj).length > 0) {
        console.table(resHeadersObj);
      } else {
        console.log(resHeadersObj);
      }
      console.groupEnd();
    }

    if (requestBody !== undefined) {
      console.log('%cRequest Body:', 'font-weight: bold;', requestBody);
    }

    if (responseBody !== undefined) {
      console.log('%cResponse Body:', 'font-weight: bold;', responseBody);
    }

    console.groupEnd();
  },
};

function logDevFailure(details: {
  method: string;
  url: string;
  status: number;
  errorType: ApiErrorType;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  message: string;
}) {
  apiDevLogger.logHeaders({
    method: details.method,
    url: details.url,
    status: details.status,
    requestHeaders: details.requestHeaders,
    responseHeaders: details.responseHeaders,
    errorType: details.errorType,
    requestBody: details.requestBody,
    responseBody: details.responseBody,
    message: details.message,
  });
}

/**
 * Unified API Client interceptor for backend requests.
 * Differentiates client-side route mismatches vs backend server endpoint 404s.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    params,
    showToastOnError = true,
    safe = true,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const method = (fetchOptions.method || 'GET').toUpperCase();

  // Build URL query params if provided
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Construct request headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(customHeaders as Record<string, string> || {}),
  };

  let formattedBody: any = body;
  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
      headers['Content-Type'] = 'application/json';
      formattedBody = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method,
      headers,
      body: formattedBody,
    });

    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    const resHeadersObj = getResponseHeadersObj(response.headers);

    // Handle HTTP 404 specifically by differentiating client route vs server endpoint
    if (status === 404) {
      const textPreview = await response.text();
      const isHtmlResponse =
        contentType.includes('text/html') ||
        textPreview.trim().startsWith('<!DOCTYPE') ||
        textPreview.trim().startsWith('<html');

      let errorType: ApiErrorType = '404_SERVER_ENDPOINT';
      let errorMsg = '';

      if (isHtmlResponse) {
        errorType = '404_CLIENT_ROUTE';
        errorMsg = `Client-side route issue: Endpoint "${endpoint}" returned HTML fallback instead of API JSON. Ensure the route is mounted in backend server.ts.`;
        if (showToastOnError) {
          toast.client404(
            endpoint,
            `Interrupted by SPA fallback. The requested path "${endpoint}" was handled as a client route rather than a server API endpoint.`
          );
        }
      } else {
        errorType = '404_SERVER_ENDPOINT';
        let serverDetail = '';
        try {
          const parsed = JSON.parse(textPreview);
          if (parsed.error) serverDetail = parsed.error;
        } catch {
          // not json
        }
        errorMsg = serverDetail || `Server endpoint failure: Backend API endpoint "${endpoint}" was not found (HTTP 404).`;
        if (showToastOnError) {
          toast.server404(
            endpoint,
            serverDetail || `The backend server does not have a route registered for "${endpoint}".`
          );
        }
      }

      logDevFailure({
        method,
        url,
        status: 404,
        errorType,
        requestHeaders: headers,
        requestBody: body,
        responseHeaders: resHeadersObj,
        responseBody: textPreview,
        message: errorMsg,
      });

      const apiErr = new ApiError(errorMsg, 404, errorType, endpoint, textPreview);

      if (!safe) {
        throw apiErr;
      }

      return {
        ok: false,
        data: null,
        error: errorMsg,
        status: 404,
        is404: true,
        errorType,
      };
    }

    // Handle other non-2xx responses (e.g. 400, 401, 403, 500)
    if (!response.ok) {
      let errorMsg = `HTTP Error ${status}: ${response.statusText || 'Request failed'}`;
      let errorType: ApiErrorType = 'SERVER_ERROR';
      let rawText = '';

      try {
        if (contentType.includes('application/json')) {
          const jsonErr = await response.json();
          rawText = JSON.stringify(jsonErr);
          if (jsonErr.error) errorMsg = jsonErr.error;
          else if (jsonErr.message) errorMsg = jsonErr.message;
        } else {
          rawText = await response.text();
          errorType = 'INVALID_JSON';
          errorMsg = `Server returned invalid response format (HTTP ${status}).`;
        }
      } catch (err: any) {
        errorMsg = err.message || errorMsg;
      }

      if (showToastOnError) {
        toast.error(errorMsg, `Request Failed (HTTP ${status})`);
      }

      logDevFailure({
        method,
        url,
        status,
        errorType,
        requestHeaders: headers,
        requestBody: body,
        responseHeaders: resHeadersObj,
        responseBody: rawText,
        message: errorMsg,
      });

      const apiErr = new ApiError(errorMsg, status, errorType, endpoint, rawText);

      if (!safe) {
        throw apiErr;
      }

      return {
        ok: false,
        data: null,
        error: errorMsg,
        status,
        is404: false,
        errorType,
      };
    }

    // Parse successful 2xx response
    if (status === 204) {
      return {
        ok: true,
        data: null,
        error: null,
        status: 204,
        is404: false,
        errorType: null,
      };
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      // If endpoint returned text instead of json, handle gracefully
      return {
        ok: true,
        data: text as unknown as T,
        error: null,
        status,
        is404: false,
        errorType: null,
      };
    }

    const data: T = await response.json();
    return {
      ok: true,
      data,
      error: null,
      status,
      is404: false,
      errorType: null,
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      if (!safe) throw err;
      return {
        ok: false,
        data: null,
        error: err.message,
        status: err.status,
        is404: err.is404,
        errorType: err.errorType,
      };
    }

    const networkErrorMsg = err.message || 'Network request failed. Please check your internet connection.';
    if (showToastOnError) {
      toast.error(networkErrorMsg, 'Network Error');
    }

    logDevFailure({
      method,
      url,
      status: 0,
      errorType: 'NETWORK_ERROR',
      requestHeaders: headers,
      requestBody: body,
      message: networkErrorMsg,
    });

    const apiErr = new ApiError(networkErrorMsg, 0, 'NETWORK_ERROR', endpoint, err.toString());
    if (!safe) throw apiErr;

    return {
      ok: false,
      data: null,
      error: networkErrorMsg,
      status: 0,
      is404: false,
      errorType: 'NETWORK_ERROR',
    };
  }
}

/**
 * Convenient API object with standard HTTP methods
 */
export const api = {
  fetch: apiFetch,

  get<T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'PUT', body });
  },

  delete<T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
  },

  patch<T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'PATCH', body });
  },
};
