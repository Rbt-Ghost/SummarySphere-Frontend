import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

type LegalLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
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
      localStorage.setItem("darkMode", JSON.stringify(dark));
      if (dark) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#0f172a";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#f4f4f5";
      }
    } catch { /* ignore */ }
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [dark]);

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 sm:px-6 pt-24 relative pb-28"
          : "min-h-screen bg-zinc-100 text-slate-900 flex flex-col items-center px-4 sm:px-6 pt-24 relative pb-28"
      }
    >
      {/* Top Header Controls */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <button
        onClick={() => setDark(!dark)}
        className="absolute top-6 right-6 p-3 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow-xl transition-transform hover:scale-105"
        title="Toggle Theme"
      >
        {dark ? <Sun className="w-5 h-5 text-neutral-950" /> : <Moon className="w-5 h-5 text-neutral-950" />}
      </button>

      {/* Main Layout Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex flex-col"
      >
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {title}
          </h1>
          <div className={`h-1 w-20 bg-blue-600 rounded-full ${dark ? "opacity-85" : ""}`} />
        </header>

        <div
          className={`
            p-6 sm:p-10 rounded-2xl border transition-colors leading-relaxed text-sm sm:text-base space-y-6 shadow-xl
            ${
              dark
                ? "bg-slate-800/50 border-slate-700/80 text-slate-300"
                : "bg-white border-zinc-200 text-slate-700"
            }
          `}
        >
          {children}
        </div>
      </motion.div>

      {/* Styled Footer at the bottom */}
      <Footer dark={dark} />
    </div>
  );
}
