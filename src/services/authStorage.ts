import type { AuthSession } from "../types/auth";

const STORAGE_KEY = "authSession";

const AUTH_CHANGED_EVENT = "authSessionChanged";

const notifyAuthChanged = () => {
  try {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  } catch {
    // ignore
  }
};

const base64UrlDecode = (input: string): string => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    const payload = JSON.parse(json) as unknown;
    return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const isJwtExpired = (token: string, skewSeconds: number = 30): boolean | null => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const exp = payload.exp;
  if (typeof exp !== "number") return null;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds + skewSeconds;
};

export const authStorage = {
  eventName: AUTH_CHANGED_EVENT,

  get(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.token || typeof parsed.token !== "string") return null;

      const expired = isJwtExpired(parsed.token);
      if (expired === true) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        notifyAuthChanged();
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  set(session: AuthSession) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      notifyAuthChanged();
    } catch {
      // ignore
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      notifyAuthChanged();
    } catch {
      // ignore
    }
  },

  getToken(): string | null {
    return this.get()?.token ?? null;
  },
};
