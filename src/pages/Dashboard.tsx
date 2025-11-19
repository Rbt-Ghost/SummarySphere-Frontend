import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "min-h-screen bg-black text-white flex flex-col items-center justify-center px-6" : "min-h-screen bg-white text-black flex flex-col items-center justify-center px-6"}>
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

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-10 py-4 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black shadow-2xl text-lg font-semibold hover:scale-105 transition-transform"
      >
        Let's get started
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <a
          href="#"
          className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
        >
          View other courses
        </a>
      </motion.div>
    </div>
  );
}
