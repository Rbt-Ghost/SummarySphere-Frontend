import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ArrowLeft, 
  Trash2,
  Download, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Plus,
  Sparkles,
  Eye,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import CTAButton from "../components/CTAbutton"; 
import { summarizeDocument, downloadDocument } from "../api"; 
import { toast, ToastProvider } from "../components/Toast";

interface Doc {
  id: string;
  title?: string;
  fileName: string;
  fileType: string;
  status: string;
  uploadedAt: string; 
}

export default function Documents() {
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
      if (dark) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#0f172a"; 
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#f4f4f5"; 
      }
    } catch { /* ignore */ }
    return () => { document.body.style.backgroundColor = ""; };
  }, [dark]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<{title: string, content: string} | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const apiDocs = await response.json();
          setDocuments(apiDocs.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this document?")) {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setDocuments((prev) => prev.filter((doc) => doc.id !== id));
          localStorage.removeItem(`summary-${id}`);
          toast.success("Document deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting document");
      }
    }
  };

  const handleDownload = async (doc: Doc) => {
    try {
        // UPDATED: Always use the original fileName
        await downloadDocument(doc.id, doc.fileName);
    } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download document.");
    }
  };

  const handleSummarize = async (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status: "PROCESSING" } : doc)));

    try {
      const data = await summarizeDocument(id, "general");

      if (data && data.message) {
        localStorage.setItem(`summary-${id}`, data.message);
        
        const docTitle = documents.find(d => d.id === id)?.fileName || "Document";
        setSelectedSummary({ title: `Summary: ${docTitle}`, content: data.message });
        toast.success("Summary generated successfully!");
      }

      const response = await fetch("/api/documents");
      if (response.ok) {
        const apiDocs = await response.json();
        setDocuments(apiDocs.reverse());
      }
    } catch (error) {
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status: "PENDING" } : doc)));
      toast.error(error instanceof Error ? error.message : "Failed to summarize document");
    }
  };

  const handleViewSummary = (id: string) => {
    const summaryText = localStorage.getItem(`summary-${id}`);
    const docTitle = documents.find(d => d.id === id)?.fileName || "Document";

    if (summaryText) {
      setSelectedSummary({ title: `Summary: ${docTitle}`, content: summaryText });
    } else {
      toast.error("Summary content not found. Please summarize again.");
    }
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-white flex flex-col items-center px-6 pt-24 relative pb-20"
          : "min-h-screen bg-zinc-200 text-black flex flex-col items-center px-6 pt-24 relative pb-20"
      }
    >
      <ToastProvider dark={dark} />

      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        
        <CTAButton 
            dark={dark} 
            size="small"
            onClick={() => navigate("/upload")}
        >
          <Plus className="w-4 h-4" />
          Upload New
        </CTAButton>
      </div>

      <AnimatePresence>
        {selectedSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSummary(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl p-6 ${dark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
            >
              <button 
                onClick={() => setSelectedSummary(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold mb-4 pr-8">{selectedSummary.title}</h3>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed opacity-90">
                {selectedSummary.content}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                    onClick={() => setSelectedSummary(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                >
                    Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold mb-6">My Documents</h2>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin opacity-50 mb-4" />
                <p className="opacity-50">Loading documents from server...</p>
            </div>
        ) : documents.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${dark ? 'border-slate-800' : 'border-zinc-300'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-medium mb-1">No documents found</h3>
                <p className="opacity-60 text-sm">Upload a document to get started.</p>
            </div>
        ) : (
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
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-zinc-100'}`}>
                            <FileText className={`w-6 h-6 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h3 
                                onClick={() => navigate(`/documents/${doc.id}`)}
                                className="font-semibold truncate max-w-[200px] sm:max-w-xs cursor-pointer hover:text-blue-500 hover:underline transition-colors" 
                                title="Click to view details"
                            >
                                {doc.title || doc.fileName}
                            </h3>
                            <div className="flex items-center gap-3 text-xs opacity-60 mt-1">
                                <span className="truncate max-w-[150px]" title={doc.fileName}>{doc.fileName}</span>
                                <span>•</span>
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                        <div className={`
                            px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                            ${doc.status === 'COMPLETED' 
                                ? 'bg-green-500/10 text-green-500' 
                                : doc.status === 'PROCESSING'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }
                        `}>
                            {doc.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                            {doc.status === 'PROCESSING' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {(doc.status === 'PENDING' || !doc.status) && <Clock className="w-3 h-3" />}
                            <span className="capitalize">{doc.status === 'COMPLETED' ? 'SUMMARIZED' : (doc.status || 'Pending')}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {doc.status === "COMPLETED" ? (
                                <button
                                    onClick={() => handleViewSummary(doc.id)}
                                    title="View Summary"
                                    className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'}`}
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSummarize(doc.id)}
                                    title="Summarize"
                                    disabled={doc.status === "PROCESSING"}
                                    className={`
                                        p-2 rounded-lg transition-colors
                                        ${doc.status === "PROCESSING"
                                            ? 'opacity-50 cursor-not-allowed'
                                            : (dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100')
                                        }
                                    `}
                                >
                                    <Sparkles className="w-4 h-4" />
                                </button>
                            )}

                            <button 
                                onClick={() => handleDownload(doc)}
                                title="Download"
                                className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'}`}
                            >
                                <Download className="w-4 h-4" />
                            </button>

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

      <Footer dark={dark} />
    </div>
  );
}