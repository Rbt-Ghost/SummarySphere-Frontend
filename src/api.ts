const BASE_URL = "/api/documents"; 

const throwError = async (response: Response, defaultMsg: string) => {
    let errorMsg = defaultMsg;
    const text = await response.text().catch(() => "");
    
    if (text) {
        try {
            const json = JSON.parse(text);
            if (json.status === 500) {
                errorMsg = "Error. Please try again later.";
            } else if (json.message) {
                errorMsg = json.message;
            } else if (json.error) {
                 errorMsg = json.error;
            }
        } catch {
            errorMsg = text;
        }
    }
    throw new Error(errorMsg);
}

export const uploadFile = async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        await throwError(response, `Upload failed: ${response.statusText}`);
    }

    return response.text();
};

export const fetchDocuments = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) await throwError(response, "Failed to fetch documents");
  return response.json();
};

export const fetchDocumentById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) await throwError(response, "Failed to fetch document details");
  return response.json();
};

export const deleteDocument = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) await throwError(response, "Failed to delete document");
};

export const downloadDocument = async (id: string, filename: string) => {
  const response = await fetch(`${BASE_URL}/${id}/file`);
  
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
  const response = await fetch(`${BASE_URL}/${id}/summarize`, { 
    method: "POST", 
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ summaryType }) 
  });
  
  if (!response.ok) {
    await throwError(response, "Failed to summarize document");
  }

  return response.json();
};