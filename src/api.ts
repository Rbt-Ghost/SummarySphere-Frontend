// src/api.ts
const BASE_URL = "/api/documents"; 

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: formData,
    });

    // The backend returns a raw string (e.g. "{message=...}"), not valid JSON.
    // using .text() prevents the parsing error.
    return response.text();
};

export const fetchDocuments = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const deleteDocument = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};

export const downloadDocument = (id: string) => {
  window.open(`${BASE_URL}/${id}/file`, "_blank");
};