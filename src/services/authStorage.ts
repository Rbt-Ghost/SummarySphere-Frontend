import type { AuthSession } from "../types/auth";

const STORAGE_KEY = "authSession";

export const authStorage = {
  get(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.token || typeof parsed.token !== "string") return null;
      return parsed;
    } catch {
      return null;
    }
  },

  set(session: AuthSession) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  getToken(): string | null {
    return this.get()?.token ?? null;
  },
};
