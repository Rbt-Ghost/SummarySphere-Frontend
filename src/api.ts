import { authStorage } from "./services/authStorage";

const DOCUMENTS_BASE_URL = (import.meta.env.VITE_DOCUMENTS_BASE_URL as string | undefined) ?? "/api/documents";
const USERS_BASE_URL = (import.meta.env.VITE_USERS_BASE_URL as string | undefined) ?? "/api/users";

const throwError = async (response: Response, defaultMsg: string) => {
    // If the token is expired/invalid, clear it so the app can re-authenticate.
    if (response.status === 401) {
        authStorage.clear();
    }

    let errorMsg = defaultMsg;
    const text = await response.text().catch(() => "");
    
    if (text) {
        if (text.includes("Quota exceeded") || text.includes("429") || text.includes("Too Many Requests")) {
            throw new Error("⚠️ AI Usage Limit Reached. Please wait 15 seconds and try again.");
        }

        try {
            const json = JSON.parse(text);
            if (json.message) {
                errorMsg = json.message;
            } else if (json.error) {
                 errorMsg = json.error;
            } else if (json.status === 500) {
                errorMsg = "Internal Server Error. Please try again later.";
            }
        } catch {
            if (text.length < 200) {
                errorMsg = text;
            }
        }
    }
    throw new Error(errorMsg);
}

const NO_CACHE_HEADERS: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};

const authHeaders = (): Record<string, string> => {
    const token = authStorage.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

// Some backends may not implement GET /summary/{type} (or may error on it).
// Cache a simple runtime health flag so we don't spam the endpoint on every switch.
let typedSummaryEndpointHealth: "unknown" | "ok" | "bad" = "unknown";

export const uploadFile = async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await fetch(`${DOCUMENTS_BASE_URL}`, {
        method: "POST",
        body: formData,
        headers: {
            ...NO_CACHE_HEADERS,
            ...authHeaders()
        }
    });

    if (!response.ok) {
        await throwError(response, `Upload failed: ${response.statusText}`);
    }

    return response.text();
};

export const fetchDocuments = async () => {
    // Backend (SummarySphere-BackEnd) exposes a user-scoped list at:
    //   GET /api/users/me/documents
    // while GET /api/documents is admin-only.
    // Try the scoped endpoint first, then fall back for older/other backends.
    const scoped = await fetch(`${USERS_BASE_URL}/me/documents?t=${Date.now()}`, {
        headers: {
            ...NO_CACHE_HEADERS,
            ...authHeaders(),
        },
    });

    if (scoped.status !== 404) {
        if (!scoped.ok) await throwError(scoped, "Failed to fetch documents");
        return scoped.json();
    }

    const legacy = await fetch(`${DOCUMENTS_BASE_URL}?t=${Date.now()}`, {
        headers: {
            ...NO_CACHE_HEADERS,
            ...authHeaders(),
        },
    });
    if (!legacy.ok) await throwError(legacy, "Failed to fetch documents");
    return legacy.json();
};

export const fetchDocumentById = async (id: string) => {
    const response = await fetch(`${DOCUMENTS_BASE_URL}/${id}?t=${Date.now()}`, {
            headers: {
                    ...NO_CACHE_HEADERS,
                    ...authHeaders()
            }
  });
  if (!response.ok) await throwError(response, "Failed to fetch document details");
  return response.json();
};

export const deleteDocument = async (id: string) => {
    const response = await fetch(`${DOCUMENTS_BASE_URL}/${id}`, { 
      method: "DELETE",
            headers: {
                    ...NO_CACHE_HEADERS,
                    ...authHeaders()
            }
  });
  if (!response.ok) await throwError(response, "Failed to delete document");
};

export const downloadDocument = async (id: string, filename: string) => {
        const response = await fetch(`${DOCUMENTS_BASE_URL}/${id}/file`, {
            headers: {
                    ...authHeaders()
            }
    });
  
  if (!response.ok) {
      await throwError(response, "Failed to download file");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; 
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const summarizeDocument = async (id: string, summaryType: string = "general") => {
    const response = await fetch(`${DOCUMENTS_BASE_URL}/${id}/summarize`, { 
    method: "POST", 
    headers: {
        "Content-Type": "application/json",
                ...NO_CACHE_HEADERS,
                ...authHeaders()
    },
    body: JSON.stringify({ summaryType }) 
  });
  
  if (!response.ok) {
    await throwError(response, "Failed to summarize document");
  }

  return response.json();
};

type DocumentSummaryResponse = {
    documentId?: string;
    summaryType?: string;
    summaryText?: string;
    status?: string;
    createdAt?: string;
    message?: string;
};

const extractSummaryText = (payload: unknown): string | null => {
    if (!payload || typeof payload !== "object") return null;
    const maybe = payload as Record<string, unknown>;
    const summaryText = maybe.summaryText;
    if (typeof summaryText === "string" && summaryText.trim()) return summaryText;
    const message = maybe.message;
    if (typeof message === "string" && message.trim()) return message;
    const summary = maybe.summary;
    if (typeof summary === "string" && summary.trim()) return summary;
    return null;
};

/**
 * Tries to fetch an existing summary from backend.
 * Primary: GET /api/documents/{id}/summary/{summaryType}
 * Fallback: GET /api/documents/{id}/summary (returns latest), shown only if types match.
 */
export const fetchDocumentSummary = async (id: string, summaryType: string): Promise<string | null> => {
    const encodedType = encodeURIComponent(summaryType);

    const tryFallback = async (): Promise<string | null> => {
        const fallback = await fetch(`${DOCUMENTS_BASE_URL}/${id}/summary?t=${Date.now()}`, {
            headers: {
                ...NO_CACHE_HEADERS,
                ...authHeaders(),
            },
        });

        if (fallback.status === 404) return null;
        if (!fallback.ok) await throwError(fallback, "Failed to fetch document summary");

        const payload: DocumentSummaryResponse = await fallback.json().catch(() => ({} as DocumentSummaryResponse));
        const returnedType = typeof payload.summaryType === "string" ? payload.summaryType : "";
        if (returnedType && returnedType.toLowerCase() !== summaryType.toLowerCase()) return null;
        return extractSummaryText(payload);
    };

    // Prefer the stable "latest summary" endpoint first.
    // On some backends, the typed endpoint /summary/{type} may be missing or may error (500),
    // especially when the requested type doesn't exist. Avoid hitting it unless we know it's healthy.
    const latest = await tryFallback();
    if (latest !== null) return latest;

    // If we haven't proven the typed endpoint works, don't call it.
    if (typedSummaryEndpointHealth !== "ok") {
        return null;
    }

    const primary = await fetch(`${DOCUMENTS_BASE_URL}/${id}/summary/${encodedType}?t=${Date.now()}`, {
        headers: {
            ...NO_CACHE_HEADERS,
            ...authHeaders(),
        },
    });

    // Prefer the typed endpoint; if it isn't available (404) or fails, fall back to latest summary.
    if (primary.status === 404 || primary.status === 405) {
        typedSummaryEndpointHealth = "bad";
        return null;
    }

    if (!primary.ok) {
        // If auth is invalid, surface the error so the app can react appropriately.
        if (primary.status === 401 || primary.status === 403) {
            await throwError(primary, "Failed to fetch document summary");
        }

        if (primary.status >= 500) {
            typedSummaryEndpointHealth = "bad";
        }

        // Some backends may not implement the typed route and respond with non-404 errors.
        // For summary display, treat other errors as "no summary available".
        // This avoids breaking the details view due to a backend mismatch.
        return null;
    }

    typedSummaryEndpointHealth = "ok";

    const payload: DocumentSummaryResponse = await primary.json().catch(() => ({} as DocumentSummaryResponse));
    return extractSummaryText(payload);
};

export const deleteMyAccount = async () => {
    const response = await fetch(`${USERS_BASE_URL}/me`, {
        method: "DELETE",
        headers: {
            ...NO_CACHE_HEADERS,
            ...authHeaders(),
        },
    });

    if (!response.ok) {
        await throwError(response, "Failed to delete account");
    }
};