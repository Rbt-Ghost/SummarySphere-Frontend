import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

import CTAButton from "../components/CTAbutton";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [dark, setDark] = useState(() => {
    if(typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      if(savedMode !== null) {
        return JSON.parse(savedMode);
      }
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className={dark ? "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6" : "min-h-screen bg-zinc-200 text-black flex flex-col items-center justify-center px-6"}>
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-6 right-6 p-3 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow-xl"
      >
        {dark ? <Sun className="w-5 h-5 text-neutral-950" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold tracking-tight mb-10"
      >
        Summary Sphere
      </motion.h1>

      <CTAButton 
        dark={dark}
        onClick={() => window.location.href = "/upload"}
      >
        Let's get started
      </CTAButton>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-2"
        onClick={() => window.location.href = "/documents"}
      >
        <a
          href="#"
          className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
        >
          View documents list
        </a>
      </motion.div>

      <Footer dark={dark} />
    </div>
  );
}
