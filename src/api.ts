// src/api.ts
const BASE_URL = "/api/documents"; 

export const uploadFile = async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    // CRITICAL FIX: Ensure we are hitting the correct endpoint. 
    // If your backend listens on "/api/upload", change this URL.
    // If it listens on "POST /api/documents", keep it as `BASE_URL`.
    // Assuming standard /upload pattern based on your previous code:
    const response = await fetch(`${BASE_URL}`, { // or `${BASE_URL}/upload` if needed
        method: "POST",
        body: formData,
    });

    // CRITICAL FIX: Check if the request was actually successful
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Upload failed: ${response.statusText}`);
    }

    return response.text();
};

export const fetchDocuments = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
};

export const deleteDocument = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete document");
};

export const downloadDocument = (id: string) => {
  window.open(`${BASE_URL}/${id}/file`, "_blank");
};

// NEW: open summary in a new tab (adjust endpoint if your backend differs)
export const viewSummary = (id: string) => {
  window.open(`${BASE_URL}/${id}/summary`, "_blank");
};

// UPDATED: Now accepts summaryType and sends a JSON body
export const summarizeDocument = async (id: string, summaryType: string = "general") => {
  const response = await fetch(`${BASE_URL}/${id}/summarize`, { 
    method: "POST", 
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ summaryType }) 
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Failed to summarize document");
  }
};