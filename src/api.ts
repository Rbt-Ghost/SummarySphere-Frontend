const BASE_URL = "http://localhost:8000/api/documents";

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch('${BASE_URL}/upload', {
        method: "POST",
        body: formData,
    });
    return response.json();
};

export const fetchDocuments = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const deleteDocument = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};

export const downloadDocument = (id: string, fileName: string) => {
  window.open(`${BASE_URL}/download/${id}`, "_blank");
};