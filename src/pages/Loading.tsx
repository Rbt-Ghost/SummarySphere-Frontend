import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white dark:bg-black dark:text-white transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-semibold tracking-wide mb-8"
      >
        Loading...
      </motion.div>

      <motion.div
        className="w-12 h-12 rounded-full border-4 border-neutral-600 border-t-white dark:border-t-black animate-spin"
      />
    </div>
  );
}
