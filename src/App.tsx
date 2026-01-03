import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import LoadingPage from "./pages/Loading.tsx";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Upload = lazy(() => import("./pages/Upload.tsx"));
const Documents = lazy(() => import("./pages/Documents.tsx"));
const DocumentDetails = lazy(() => import("./pages/DocumentDetails.tsx"));

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/upload" element={<Upload />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
      </Routes>
    </Suspense>
  );
}