// src/api.ts
const BASE_URL = "/api/documents"; 

export const uploadFile = async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: formData,
    });

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

// NEW: Fetch single document metadata
export const fetchDocumentById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch document details");
  return response.json();
};

export const deleteDocument = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete document");
};

export const downloadDocument = async (id: string, filename: string) => {
  const response = await fetch(`${BASE_URL}/${id}/file`);
  
  if (!response.ok) {
      throw new Error("Failed to download file");
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

  return response.json();
};