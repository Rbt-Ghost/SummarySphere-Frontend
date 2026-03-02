import type { AuthSession, LoginRequest, SignupRequest } from "../types/auth";

const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_BASE_URL as string | undefined) ?? "/api/auth";

const throwError = async (response: Response, defaultMsg: string) => {
  let errorMsg = defaultMsg;

  const text = await response.text().catch(() => "");
  if (text) {
    try {
      const json = JSON.parse(text);
      if (json?.message) errorMsg = json.message;
      else if (json?.error) errorMsg = json.error;
      else if (typeof json === "string") errorMsg = json;
    } catch {
      if (text.length < 200) errorMsg = text;
    }
  }

  throw new Error(errorMsg);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const readString = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

const extractSession = (payload: unknown): AuthSession => {
  const root = isRecord(payload) ? payload : {};
  const data = isRecord(root.data) ? root.data : {};

  const token =
    readString(root.token) ??
    readString(root.accessToken) ??
    readString(root.jwt) ??
    readString(data.token) ??
    readString(data.accessToken);

  if (!token) {
    throw new Error("Invalid login response: missing token");
  }

  const embeddedUser = (isRecord(root.user) ? root.user : undefined) ?? (isRecord(data.user) ? data.user : undefined);
  const email =
    readString((embeddedUser as Record<string, unknown> | undefined)?.email) ??
    readString(root.email) ??
    readString(data.email);

  const name =
    readString((embeddedUser as Record<string, unknown> | undefined)?.name) ??
    readString((embeddedUser as Record<string, unknown> | undefined)?.fullName) ??
    readString(root.fullName) ??
    readString(data.fullName);

  const role =
    readString((embeddedUser as Record<string, unknown> | undefined)?.role) ??
    readString(root.role) ??
    readString(data.role);

  const user = email || name || role ? ({ email: email ?? undefined, name: name ?? undefined, role: role ?? undefined } as const) : undefined;
  return { token, user };
};

const safeJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const postJson = async (url: string, body: unknown) => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

const tryPost = async <T>(
  urls: string[],
  body: unknown,
  defaultErrorMessage: string,
  map: (payload: unknown) => T
): Promise<T> => {
  let lastResponse: Response | null = null;

  for (const url of urls) {
    const response = await postJson(url, body);
    lastResponse = response;

    // If route not found, try next common path.
    if (response.status === 404) continue;

    if (!response.ok) {
      await throwError(response, defaultErrorMessage);
    }

    const payload = await safeJson(response);
    return map(payload);
  }

  if (lastResponse) {
    await throwError(lastResponse, defaultErrorMessage);
  }
  throw new Error(defaultErrorMessage);
};

export const authApi = {
  async login(body: LoginRequest): Promise<AuthSession> {
    return tryPost(
      [`${AUTH_BASE_URL}/login`, `${AUTH_BASE_URL}/signin`],
      body,
      "Login failed",
      extractSession
    );
  },

  async signup(body: SignupRequest): Promise<AuthSession | null> {
    return tryPost(
      [`${AUTH_BASE_URL}/register`, `${AUTH_BASE_URL}/signup`],
      body,
      "Sign up failed",
      (payload) => {
        // Some backends return {message: "created"} and require login afterwards.
        try {
          return extractSession(payload);
        } catch {
          return null;
        }
      }
    );
  },
};
