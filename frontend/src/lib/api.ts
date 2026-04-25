// Thin fetch wrapper with automatic JWT attachment and transparent refresh-on-401.
// Refresh tokens live in an httpOnly cookie — this file never touches them directly.

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000";
const TOKEN_KEY = "access_token";

// ── Token storage ──────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Refresh (singleton promise prevents thundering herd on concurrent 401s) ──

let pendingRefresh: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (pendingRefresh) return pendingRefresh;

  pendingRefresh = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include", // sends the httpOnly refresh-token cookie
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const { accessToken } = (await res.json()) as { accessToken: string };
      setStoredToken(accessToken);
      return accessToken;
    })
    .catch(() => null)
    .finally(() => {
      pendingRefresh = null;
    });

  return pendingRefresh;
}

// ── Main fetch wrapper ─────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: { error?: { code?: string; message?: string } }
  ) {
    super(data?.error?.message ?? `Request failed with status ${status}`);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Transparent token refresh — try once, then fail cleanly
  if (res.status === 401 && !_isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, options, true);
    }
    // Refresh also failed: signal global logout so AuthContext can react
    clearStoredToken();
    window.dispatchEvent(new Event("auth:logout"));
    throw new ApiError(401, { error: { code: "SESSION_EXPIRED", message: "Session expired, please log in again" } });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: { code?: string; message?: string } };
    throw new ApiError(res.status, data);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
