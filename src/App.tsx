import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import LoadingPage from "./pages/Loading.tsx";
import { ToastProvider } from "./components/Toast";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Upload = lazy(() => import("./pages/Upload.tsx"));
const Documents = lazy(() => import("./pages/Documents.tsx"));
const DocumentDetails = lazy(() => import("./pages/DocumentDetails.tsx"));

export default function App() {
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

  return (
    <Suspense fallback={<LoadingPage />}>
      {/* Global Toaster mounted once */}
      <ToastProvider dark={dark} />
      
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/upload" element={<Upload />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
      </Routes>
    </Suspense>
  );
}