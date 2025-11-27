import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [dark] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) return JSON.parse(saved);
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

  return (
    <div className={dark ? "min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white transition-colors" : "min-h-screen flex flex-col items-center justify-center bg-zinc-200 text-black transition-colors"}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-semibold tracking-wide mb-8"
      >
        Loading...
      </motion.div>

      <motion.div
        className={`w-12 h-12 rounded-full border-4 animate-spin ${dark ? "border-neutral-600 border-t-white" : "border-neutral-400 border-t-black"}`}
      />
    </div>
  );
}
