import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../api"; // <-- add this import

export default function Upload() {
  const [dark] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {
      /* ignore */
    }
  }, [dark]);

  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recentFiles, setRecentFiles] = useState<File[]>([]);

  const processFiles = async (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList);
    const maxSize = 20 * 1024 * 1024; // 20MB
    
    const tooLarge = files.filter((f) => f.size > maxSize);
    if (tooLarge.length > 0) {
      alert(`Some files exceed the 20MB limit and were skipped.`);
    }

    const accepted = files.filter((f) => f.size <= maxSize);
    if (accepted.length === 0) return;

    // Iterate through each accepted file and upload to the backend
    for (const file of accepted) {
      try {
        const result = await uploadFile(file); // use the shared API function
        console.log("Upload successful:", result);

        // Update the UI with the successfully uploaded file metadata
        setRecentFiles((prev) => {
          const merged = [file, ...prev];
          return merged.slice(0, 6);
        });
      } catch (error: any) {
        console.error("Network error during upload:", error);
        alert(`Could not connect to the server to upload ${file.name}.`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // reset input so same file can be selected again if needed
    e.currentTarget.value = "";
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6"
          : "min-h-screen bg-zinc-200 text-black flex flex-col items-center justify-center px-6"
      }
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Upload Document</h2>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer
            ${
              dark
                ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500"
                : "border-zinc-400 bg-zinc-100/50 hover:bg-zinc-100 hover:border-zinc-600"
            }
            ${isDragging ? "scale-[1.02] border-blue-500 bg-blue-500/10" : ""}
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadCloud
              className={`w-12 h-12 mb-4 ${dark ? "text-slate-400" : "text-zinc-500"}`}
            />
            <p className="mb-2 text-lg font-semibold">
              <span className="font-bold">Click to upload</span> or drag and drop
            </p>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-zinc-500"}`}>
              PDF, DOCX, or TXT (MAX. 20MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
            multiple
          />
        </div>

        {/* Example of a recently uploaded file list */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium opacity-60 ml-1">Recent uploads</p>
          {recentFiles.length === 0 ? (
            <div className={`flex items-center p-3 rounded-lg ${dark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
              <span className="text-sm opacity-60">No uploads yet</span>
            </div>
          ) : (
            recentFiles.map((f, idx) => (
              <div key={idx} className={`flex items-center p-3 rounded-lg ${dark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-sm truncate" title={f.name}>{f.name}</span>
              </div>
            ))
          )} 
        </div>
      </motion.div>
    </div>
  );
}