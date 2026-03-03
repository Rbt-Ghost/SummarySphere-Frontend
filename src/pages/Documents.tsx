import { useState, useEffect, useRef } from "react";
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
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import CTAButton from "../components/CTAbutton";
import { fetchDocuments, deleteDocument, summarizeDocument, downloadDocument, fetchDocumentSummary } from "../api";
import { toast } from "../components/Toast";

interface Doc {
  id: string;
  title?: string;
  fileName: string;
  fileType: string;
  status: string;
  uploadedAt: string;
}

type SummaryType = "detailed" | "concise" | "bullet-points";

const isValidSummaryType = (value: string | null): value is SummaryType => {
  return value === "detailed" || value === "concise" || value === "bullet-points";
};

const SUMMARY_TYPES: SummaryType[] = ["detailed", "concise", "bullet-points"];

const summaryStorageKey = (docId: string, summaryType: SummaryType) => {
  return `summary-${docId}-${summaryType}`;
};

const safeLocalStorageGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const lastSummarizedTypeKey = (docId: string) => {
  return `lastSummarizedType-${docId}`;
};

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [summaryTypeByDocId, setSummaryTypeByDocId] = useState<Record<string, SummaryType>>({});
  const [serverSummaryAvailable, setServerSummaryAvailable] = useState<
    Record<string, Partial<Record<SummaryType, boolean>>>
  >({});
  const summaryProbeInFlight = useRef<Set<string>>(new Set());

  const loadDocs = async () => {
    try {
      const apiDocs = await fetchDocuments();

      const sortedDocs = apiDocs.sort((a: Doc, b: Doc) => {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });

      setDocuments(sortedDocs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    if (documents.length === 0) return;

    setSummaryTypeByDocId((prev) => {
      let changed = false;
      const next: Record<string, SummaryType> = { ...prev };

      for (const doc of documents) {
        if (next[doc.id]) continue;

        const saved = localStorage.getItem(`summaryType-${doc.id}`);
        next[doc.id] = isValidSummaryType(saved) ? saved : "detailed";
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [documents]);

  useEffect(() => {
    if (documents.length === 0) return;

    let cancelled = false;

    const probe = async (docId: string, summaryType: SummaryType) => {
      const inFlightKey = `${docId}:${summaryType}`;
      if (summaryProbeInFlight.current.has(inFlightKey)) return;
      summaryProbeInFlight.current.add(inFlightKey);

      try {
        const summaryText = await fetchDocumentSummary(docId, summaryType);
        if (cancelled) return;
        const available = Boolean(summaryText && summaryText.trim());

        setServerSummaryAvailable((prev) => {
          const existingForDoc = prev[docId] || {};
          if (existingForDoc[summaryType] === available) return prev;
          return {
            ...prev,
            [docId]: {
              ...existingForDoc,
              [summaryType]: available,
            },
          };
        });

        if (available && summaryText) {
          try {
            localStorage.setItem(summaryStorageKey(docId, summaryType), summaryText);
            localStorage.setItem(lastSummarizedTypeKey(docId), summaryType);
          } catch {
            // ignore
          }
        }
      } catch {
        if (cancelled) return;
        setServerSummaryAvailable((prev) => {
          const existingForDoc = prev[docId] || {};
          if (existingForDoc[summaryType] === false) return prev;
          return {
            ...prev,
            [docId]: {
              ...existingForDoc,
              [summaryType]: false,
            },
          };
        });
      } finally {
        summaryProbeInFlight.current.delete(inFlightKey);
      }
    };

    for (const doc of documents) {
      if (doc.status !== "COMPLETED") continue;

      const selectedType: SummaryType = summaryTypeByDocId[doc.id] || "detailed";
      const localCached = Boolean(safeLocalStorageGet(summaryStorageKey(doc.id, selectedType)));
      if (localCached) continue;

      const alreadyProbed = serverSummaryAvailable[doc.id]?.[selectedType] !== undefined;
      if (alreadyProbed) continue;

      void probe(doc.id, selectedType);
    }

    return () => {
      cancelled = true;
    };
  }, [documents, summaryTypeByDocId, serverSummaryAvailable]);

  useEffect(() => {
    if (documents.length === 0) return;

    for (const doc of documents) {
      const legacy = safeLocalStorageGet(`summary-${doc.id}`);
      if (!legacy) continue;

      const inferred = safeLocalStorageGet(lastSummarizedTypeKey(doc.id)) || safeLocalStorageGet(`summaryType-${doc.id}`);
      if (!isValidSummaryType(inferred)) continue;

      const typedKey = summaryStorageKey(doc.id, inferred);
      if (safeLocalStorageGet(typedKey)) continue;

      try {
        localStorage.setItem(typedKey, legacy);
      } catch {
        // ignore
      }
    }
  }, [documents]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDocument(deleteId);

      setDocuments((prev) => prev.filter((doc) => doc.id !== deleteId));
      try {
        localStorage.removeItem(`summary-${deleteId}`);
        localStorage.removeItem(`summaryType-${deleteId}`);
        localStorage.removeItem(lastSummarizedTypeKey(deleteId));
        for (const type of SUMMARY_TYPES) {
          localStorage.removeItem(summaryStorageKey(deleteId, type));
        }
      } catch {
        // ignore
      }
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error deleting document");
      await loadDocs();
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownload = async (doc: Doc) => {
    try {
      await downloadDocument(doc.id, doc.fileName);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document.");
    }
  };

  const handleSummarize = async (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status: "PROCESSING" } : doc)));

    try {
      const summaryType: SummaryType = summaryTypeByDocId[id] || "detailed";
      const data = await summarizeDocument(id, summaryType);

      if (data && data.message) {
        try {
          localStorage.setItem(`summary-${id}`, data.message);
          localStorage.setItem(summaryStorageKey(id, summaryType), data.message);
          localStorage.setItem(lastSummarizedTypeKey(id), summaryType);
        } catch {
          // ignore
        }
        toast.success("Summary generated successfully!");
      }

      await loadDocs();

    } catch (error) {
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status: "PENDING" } : doc)));
      toast.error(error instanceof Error ? error.message : "Failed to summarize document");
    }
  };

  const handleSummaryTypeChange = (docId: string, summaryType: SummaryType) => {
    setSummaryTypeByDocId((prev) => ({ ...prev, [docId]: summaryType }));
    try {
      localStorage.setItem(`summaryType-${docId}`, summaryType);
    } catch {
      // ignore
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
      {/* ToastProvider is in App.tsx */}

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
        {/* Delete Confirmation Modal */}
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl shadow-2xl p-6 border ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-zinc-200 text-slate-900'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${dark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Delete Document?</h3>
                  <p className="opacity-70 text-sm leading-relaxed">
                    Are you sure you want to delete this document? This action cannot be undone and the summary will be lost.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete Document
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
              {documents.map((doc) => {
                const selectedType: SummaryType = summaryTypeByDocId[doc.id] || "detailed";
                const hasSelectedSummary = Boolean(
                  safeLocalStorageGet(summaryStorageKey(doc.id, selectedType)) ||
                  serverSummaryAvailable[doc.id]?.[selectedType]
                );
                const isProcessing = doc.status === "PROCESSING";

                return (
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
                          className="font-semibold truncate max-w-[200px] sm:max-w-xs"
                          title={doc.title || doc.fileName}
                        >
                          {doc.title || doc.fileName}
                        </h3>
                        <div className="flex items-center gap-3 text-xs opacity-60 mt-1">
                          <span className="truncate max-w-[150px]" title={doc.fileName}>{doc.fileName}</span>
                          <span>•</span>
                          <span>
                            {new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                      <div className={`
                            px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                            ${isProcessing
                          ? 'bg-blue-500/10 text-blue-500'
                          : hasSelectedSummary
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }
                        `}>
                        {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                        {!isProcessing && hasSelectedSummary && <CheckCircle2 className="w-3 h-3" />}
                        {!isProcessing && !hasSelectedSummary && <Clock className="w-3 h-3" />}
                        <span className="capitalize">
                          {isProcessing ? "Processing" : hasSelectedSummary ? "Summarized" : "Not summarized"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          aria-label="Summary type"
                          value={selectedType}
                          onChange={(e) => handleSummaryTypeChange(doc.id, e.target.value as SummaryType)}
                          disabled={doc.status === "PROCESSING"}
                          className={`
                              h-9 px-2 rounded-lg text-xs font-medium border transition-colors
                              ${doc.status === "PROCESSING" ? "opacity-50 cursor-not-allowed" : ""}
                              ${dark
                              ? "bg-slate-800 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
                              : "bg-white border-zinc-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                            }
                            `}
                          title="Choose summary type"
                        >
                          <option value="detailed">Detailed</option>
                          <option value="concise">Concise</option>
                          <option value="bullet-points">Bullet points</option>
                        </select>

                        {hasSelectedSummary ? (
                          <button
                            onClick={() => navigate(`/documents/${doc.id}?summaryType=${encodeURIComponent(selectedType)}`)}
                            title="View Summary"
                            className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-700" : "hover:bg-zinc-100"}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSummarize(doc.id)}
                            title={doc.status === "COMPLETED" ? "Generate this summary type" : "Summarize"}
                            disabled={doc.status === "PROCESSING"}
                            className={`
                                p-2 rounded-lg transition-colors
                                ${doc.status === "PROCESSING"
                                ? "opacity-50 cursor-not-allowed"
                                : dark
                                  ? "hover:bg-slate-700"
                                  : "hover:bg-zinc-100"
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
                          onClick={() => handleDeleteClick(doc.id)}
                          title="Delete"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <Footer dark={dark} />
    </div>
  );
}