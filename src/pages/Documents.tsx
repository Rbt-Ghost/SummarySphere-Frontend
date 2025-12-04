import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ArrowLeft, 
  Trash2, 
  Eye, 
  PlayCircle, 
  Download, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types for our mock data
interface Doc {
  id: string;
  title: string;
  type: string;
  size: string;
  status: "pending" | "processing" | "completed";
  uploadDate: string;
}

export default function Documents() {
  // --- Dark Mode Logic (Matching your Upload.tsx pattern) ---
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
    } catch { /* ignore */ }
  }, [dark]);
  // -----------------------------------------------------------

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Doc[]>([]);

  // Simulate fetching data from API
  useEffect(() => {
    const fetchDocs = () => {
      setTimeout(() => {
        setDocuments([
          {
            id: "1",
            title: "Intro to Artificial Intelligence.pdf",
            type: "PDF",
            size: "2.4 MB",
            status: "completed",
            uploadDate: "2023-10-24",
          },
          {
            id: "2",
            title: "History_of_Rome_Notes.docx",
            type: "DOCX",
            size: "1.1 MB",
            status: "pending",
            uploadDate: "2023-10-25",
          },
          {
            id: "3",
            title: "Quantum_Physics_Abstract.txt",
            type: "TXT",
            size: "15 KB",
            status: "processing",
            uploadDate: "2023-10-26",
          },
        ]);
        setIsLoading(false);
      }, 800);
    };

    fetchDocs();
  }, []);

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const handleSummarize = (id: string) => {
    // Optimistic update to show "Processing" UI immediately
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: "processing" } : doc))
    );
    
    // Simulate API call to summarize
    setTimeout(() => {
        setDocuments((prev) =>
            prev.map((doc) => (doc.id === id ? { ...doc, status: "completed" } : doc))
        );
    }, 2000);
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-white flex flex-col items-center px-6 pt-24" // Added pt-24 for top spacing
          : "min-h-screen bg-zinc-200 text-black flex flex-col items-center px-6 pt-24"
      }
    >
      {/* Navigation Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => navigate("/upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            dark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="w-4 h-4" />
          Upload New
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold mb-6">My Documents</h2>

        {/* Loading State */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin opacity-50 mb-4" />
                <p className="opacity-50">Loading documents...</p>
            </div>
        ) : documents.length === 0 ? (
            /* Empty State */
            <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${dark ? 'border-slate-800' : 'border-zinc-300'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-medium mb-1">No documents found</h3>
                <p className="opacity-60 text-sm">Upload a document to get started.</p>
            </div>
        ) : (
            /* Document List */
            <div className="space-y-4">
            <AnimatePresence>
                {documents.map((doc) => (
                <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`
                        group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border transition-all
                        ${dark 
                            ? "bg-slate-800 border-slate-700 hover:border-slate-600" 
                            : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"
                        }
                    `}
                >
                    {/* File Info */}
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-zinc-100'}`}>
                            <FileText className={`w-6 h-6 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold truncate max-w-[200px] sm:max-w-xs">{doc.title}</h3>
                            <div className="flex items-center gap-3 text-xs opacity-60 mt-1">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.uploadDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                        
                        {/* Status Badge */}
                        <div className={`
                            px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                            ${doc.status === 'completed' 
                                ? 'bg-green-500/10 text-green-500' 
                                : doc.status === 'processing'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }
                        `}>
                            {doc.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                            {doc.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                            <span className="capitalize">{doc.status}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {doc.status === 'completed' ? (
                                <>
                                    <button 
                                        title="View Summary"
                                        className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'}`}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        title="Download PDF"
                                        className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'}`}
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </>
                            ) : doc.status === 'pending' ? (
                                <button
                                    onClick={() => handleSummarize(doc.id)}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                        ${dark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                                    `}
                                >
                                    <PlayCircle className="w-3 h-3" />
                                    Summarize
                                </button>
                            ) : null}

                            <div className={`w-px h-6 mx-1 ${dark ? 'bg-slate-700' : 'bg-zinc-200'}`}></div>

                            <button 
                                onClick={() => handleDelete(doc.id)}
                                title="Delete"
                                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            </div>
        )}
      </motion.div>
    </div>
  );
}