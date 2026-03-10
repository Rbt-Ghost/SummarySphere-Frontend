import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon, UserRound, ChevronDown, LogOut, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CTAButton from "../components/CTAbutton";
import Footer from "../components/Footer";
import { useAuth } from "../services/authContext";
import { toast } from "../components/Toast";
import { deleteMyAccount } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, session, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

  const displayName = useMemo(() => {
    const name = session?.user?.name?.trim();
    const email = session?.user?.email?.trim();
    return name || email || "Account";
  }, [session?.user?.name, session?.user?.email]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsProfileOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isProfileOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileOpen]);

  const onLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/", { replace: true });
  };

  const onDeleteAccount = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete your account.");
      return;
    }

    setIsDeleteAccountOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (isDeletingAccount) return;
    setIsDeletingAccount(true);
    try {
      await deleteMyAccount();
      setIsDeleteAccountOpen(false);
      logout();
      toast.success("Account deleted successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className={dark ? "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6" : "min-h-screen bg-zinc-200 text-black flex flex-col items-center justify-center px-6"}>
      <AnimatePresence>
        {isDeleteAccountOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (!isDeletingAccount) setIsDeleteAccountOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={
                `w-full max-w-md rounded-2xl shadow-2xl p-6 border ` +
                (dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-zinc-200 text-slate-900")
              }
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${dark ? "bg-red-900/30" : "bg-red-100"}`}>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold mb-2">Delete Account?</h3>
                  <p className="opacity-70 text-sm leading-relaxed">
                    This will permanently delete your account and all your documents. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteAccountOpen(false)}
                  disabled={isDeletingAccount}
                  className={
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ` +
                    (isDeletingAccount ? "opacity-50 cursor-not-allowed" : "") +
                    (dark ? " hover:bg-slate-700" : " hover:bg-zinc-100")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={isDeletingAccount}
                  className={
                    "px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 " +
                    (isDeletingAccount ? "opacity-80 cursor-not-allowed" : "")
                  }
                >
                  {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isAuthenticated ? (
        <div className="absolute top-6 left-6" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-neutral-200 shadow-xl border border-zinc-200 dark:border-transparent"
          >
            <UserRound className={dark ? "w-5 h-5 text-neutral-950" : "w-5 h-5 text-neutral-950"} />
            <span className={dark ? "text-sm font-medium text-neutral-950 max-w-[140px] truncate" : "text-sm font-medium text-neutral-950 max-w-[140px] truncate"}>
              {displayName}
            </span>
            <ChevronDown className={dark ? "w-4 h-4 text-neutral-950" : "w-4 h-4 text-neutral-950"} />
          </button>

          {isProfileOpen ? (
            <div
              role="menu"
              aria-label="User menu"
              className={
                "mt-3 w-64 rounded-2xl border shadow-xl overflow-hidden " +
                (dark ? "bg-slate-800 border-slate-700" : "bg-white border-zinc-200")
              }
            >
              <div className={"px-4 py-3 border-b " + (dark ? "border-slate-700" : "border-zinc-200")}>
                <div className="text-sm font-semibold truncate">{session?.user?.name || "Signed in"}</div>
                {session?.user?.email ? (
                  <div className={"text-xs truncate " + (dark ? "text-slate-300" : "text-zinc-600")}>
                    {session.user.email}
                  </div>
                ) : null}
              </div>

              <div className={"h-px " + (dark ? "bg-slate-700" : "bg-zinc-200")} />

              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className={
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors " +
                  (dark ? "hover:bg-slate-700" : "hover:bg-zinc-100")
                }
              >
                <LogOut className="w-4 h-4 opacity-80" />
                Logout
              </button>

              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  onDeleteAccount();
                }}
                className={
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors " +
                  (dark ? "hover:bg-slate-700 text-red-300" : "hover:bg-zinc-100 text-red-600")
                }
              >
                <Trash2 className="w-4 h-4 opacity-80" />
                Delete Account
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

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
        className="text-center text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-10"
      >
        Summary Sphere
      </motion.h1>

      <CTAButton 
        dark={dark}
        size="large"
        onClick={() => navigate("/upload")}
      >
        Let's get started
      </CTAButton>

      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2"
          onClick={() => navigate("/documents")}
        >
          <a href="#" className="text-sm underline opacity-70 hover:opacity-100 transition-opacity">
            View documents list
          </a>
        </motion.div>
      ) : null}

      <Footer dark={dark} />
    </div>
  );
}