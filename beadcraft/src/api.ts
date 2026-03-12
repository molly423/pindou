export type ApiClient = {
  get<T>(path: string): Promise<T>;
  put<T>(path: string, body: unknown): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  del<T>(path: string, body?: unknown): Promise<T>;
};

async function request<T>(method: string, path: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

export function createApiClient(getToken: () => string | null): ApiClient {
  const withToken = () => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    return token;
  };
  return {
    get: <T,>(path: string) => request<T>('GET', path, withToken()),
    put: <T,>(path: string, body: unknown) => request<T>('PUT', path, withToken(), body),
    post: <T,>(path: string, body: unknown) => request<T>('POST', path, withToken(), body),
    del: <T,>(path: string, body?: unknown) => request<T>('DELETE', path, withToken(), body),
  };
}

