import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, ArrowLeft, X, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../api";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert(`File ${file.name} exceeds the 20MB limit.`);
      return;
    }
    setSelectedFile(file);
    setStatus(null);
    
    // Auto-fill title if empty
    if (!title) {
        setTitle(file.name.split('.')[0]);
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
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
    e.currentTarget.value = "";
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
        setStatus({ type: 'error', message: "Please select a file first." });
        return;
    }
    if (!title.trim()) {
        setStatus({ type: 'error', message: "Please enter a document title." });
        return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      // Call the updated API with both file and title
      await uploadFile(selectedFile, title);
      
      setStatus({ type: 'success', message: "Document uploaded successfully" });
      setSelectedFile(null);
      setTitle("");
    } catch (error: any) {
      console.error("Network error during upload:", error);
      setStatus({ type: 'error', message: "Failed to upload document. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6"
          : "min-h-screen bg-zinc-200 text-black flex flex-col items-center justify-center px-6"
      }
    >
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
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed transition-all 
            ${
              dark
                ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500"
                : "border-zinc-400 bg-zinc-100/50 hover:bg-zinc-100 hover:border-zinc-600"
            }
            ${isDragging ? "scale-[1.02] border-blue-500 bg-blue-500/10" : ""}
            ${selectedFile ? "cursor-default border-blue-500/50" : "cursor-pointer"}
          `}
        >
          {selectedFile ? (
             <div className="flex flex-col items-center p-4">
                <FileText className="w-12 h-12 text-blue-500 mb-2" />
                <p className="font-semibold text-lg text-center break-all">{selectedFile.name}</p>
                <p className="text-sm opacity-60 mb-4">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                    <X className="w-4 h-4" /> Remove
                </button>
             </div>
          ) : (
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
          )}
          <input
            id="dropzone-file"
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${dark ? "text-slate-300" : "text-zinc-700"}`}>
                Document Title
            </label>
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Artificial Intelligence"
                className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-all
                    ${dark 
                        ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-black focus:border-blue-500"
                    }
                `}
            />
        </div>

        <AnimatePresence>
            {status && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
                        status.type === 'success' 
                            ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                >
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{status.message}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
            <button
                onClick={handleUploadClick}
                disabled={isUploading || !selectedFile}
                className={`
                    w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2
                    ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}
                    ${(isUploading || !selectedFile) ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}
                `}
            >
                {isUploading ? "Uploading..." : "Upload Document"}
            </button>
        </div>

      </motion.div>
    </div>
  );
}