import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Download, 
  Sparkles, 
  Loader2, 
  AlertCircle
} from "lucide-react";
import Footer from "../components/Footer";
import CTAButton from "../components/CTAbutton";
import { fetchDocumentById, summarizeDocument, downloadDocument } from "../api";

interface DocDetail {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  uploadedAt: string;
  // Title might not be in the DTO based on backend code, but handling it just in case
  title?: string;
}

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [documentMeta, setDocumentMeta] = useState<DocDetail | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dark mode logic reused from other pages
  const [dark] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      } catch { return true; }
    }
    return true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#0f172a";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f4f4f5";
    }
    return () => { document.body.style.backgroundColor = ""; };
  }, [dark]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const doc = await fetchDocumentById(id);
        setDocumentMeta(doc);
        
        // Try to load existing summary from localStorage since backend doesn't have GET /summary
        const savedSummary = localStorage.getItem(`summary-${id}`);
        if (savedSummary) {
          setSummary(savedSummary);
        }
      } catch (err) {
        setError("Failed to load document details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSummarize = async () => {
    if (!id || !documentMeta) return;
    
    setIsSummarizing(true);
    try {
      // Optimistic update
      setDocumentMeta({ ...documentMeta, status: "PROCESSING" });
      
      const data = await summarizeDocument(id, "general");
      
      if (data && data.message) {
        localStorage.setItem(`summary-${id}`, data.message);
        setSummary(data.message);
        setDocumentMeta({ ...documentMeta, status: "COMPLETED" });
      }
    } catch (err) {
      alert("Failed to generate summary. Please try again.");
      setDocumentMeta({ ...documentMeta, status: "PENDING" }); // Revert on fail
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDownload = async () => {
    if (!documentMeta) return;
    try {
        await downloadDocument(documentMeta.id, documentMeta.fileName);
    } catch (e) {
        alert("Download failed");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-slate-900 text-white' : 'bg-zinc-200 text-black'}`}>
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
      </div>
    );
  }

  if (error || !documentMeta) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${dark ? 'bg-slate-900 text-white' : 'bg-zinc-200 text-black'}`}>
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Document not found</h2>
        <button onClick={() => navigate("/documents")} className="text-blue-500 hover:underline">Return to Documents</button>
      </div>
    );
  }

  return (
    <div className={dark ? "min-h-screen bg-slate-900 text-white flex flex-col items-center px-6 pt-24 relative pb-20" : "min-h-screen bg-zinc-200 text-black flex flex-col items-center px-6 pt-24 relative pb-20"}>
      
      {/* Navigation Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/documents")}
          className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Documents
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Document Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-2xl border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-xl ${dark ? 'bg-slate-700' : 'bg-zinc-100'}`}>
                <FileText className={`w-12 h-12 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            
            <h1 className="text-xl font-bold text-center mb-1 wrap-break-words">
              {documentMeta.title || documentMeta.fileName}
            </h1>
            <p className="text-center text-sm opacity-60 mb-6 break-all">
              {documentMeta.fileName}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60 flex items-center gap-2"><Calendar className="w-4 h-4"/> Uploaded</span>
                <span>{new Date(documentMeta.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Type</span>
                <span className="uppercase">{documentMeta.fileType.split('/').pop() || 'FILE'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <span className="opacity-60">Status</span>
                 {/* UPDATED: Displays "SUMMARIZED" when status is "COMPLETED" */}
                 <span className={`px-2 py-0.5 rounded text-xs font-medium 
                    ${documentMeta.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                      documentMeta.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-500' : 
                      'bg-yellow-500/10 text-yellow-500'}`}>
                    {documentMeta.status === 'COMPLETED' ? 'SUMMARIZED' : documentMeta.status}
                 </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={handleDownload}
                className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                  ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-zinc-100 hover:bg-zinc-200'}
                `}
              >
                <Download className="w-4 h-4" /> Download File
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Summarization */}
        <div className="lg:col-span-2">
          <div className={`h-full min-h-[500px] p-8 rounded-2xl border flex flex-col ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-zinc-200'}`}>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Document Summary
              </h2>
              
              {!summary && (
                <CTAButton 
                  dark={dark} 
                  size="small"
                  onClick={handleSummarize}
                  disabled={isSummarizing || documentMeta.status === "PROCESSING"}
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>Generate Summary</>
                  )}
                </CTAButton>
              )}
              
              {summary && (
                 <button 
                 onClick={handleSummarize}
                 disabled={isSummarizing}
                 className="text-sm text-purple-500 hover:text-purple-400 font-medium flex items-center gap-1"
               >
                 <Sparkles className="w-3 h-3" /> Regenerate
               </button>
              )}
            </div>

            <div className="flex-1">
              {summary ? (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed opacity-90 animate-in fade-in duration-500">
                  {summary}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-8">
                  {isSummarizing ? (
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                        <p>Analyzing document...</p>
                     </div>
                  ) : (
                    <>
                      <FileText className="w-16 h-16 mb-4" />
                      <p>No summary generated yet.</p>
                      <p className="text-sm">Click "Generate Summary" to process this document.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer dark={dark} />
    </div>
  );
}