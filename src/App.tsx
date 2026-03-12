import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import LoadingPage from "./pages/Loading.tsx";
import { ToastProvider } from "./components/Toast";
import RequireAuth from "./components/RequireAuth";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Upload = lazy(() => import("./pages/Upload.tsx"));
const Documents = lazy(() => import("./pages/Documents.tsx"));
const DocumentDetails = lazy(() => import("./pages/DocumentDetails.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
        </Route>
      </Routes>
    </Suspense>
  );
}