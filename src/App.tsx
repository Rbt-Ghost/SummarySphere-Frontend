import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import LoadingPage from "./pages/Loading.tsx";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Upload = lazy(() => import("./pages/Upload.tsx"));

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Suspense>
  );
}
