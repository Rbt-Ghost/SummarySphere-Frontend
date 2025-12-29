// src/api.ts
const BASE_URL = "/api/documents"; 

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Hits POST /api/documents (mapped to backend port 8080)
    const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: formData,
    });
    return response.json();
};

export const fetchDocuments = async () => {
  // Hits GET /api/documents
  const response = await fetch(BASE_URL);
  return response.json();
};

export const deleteDocument = async (id: string) => {
  // Hits DELETE /api/documents/{id}
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};

export const downloadDocument = (id: string) => {
  // Hits GET /api/documents/{id}/file to match the backend's downloadFile method
  window.open(`${BASE_URL}/${id}/file`, "_blank");
};