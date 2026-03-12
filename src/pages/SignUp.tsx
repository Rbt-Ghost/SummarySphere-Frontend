import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, UserPlus, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { toast } from "../components/Toast";
import { useAuth } from "../services/authContext";

export default function SignUp() {
  const [dark] = useState(() => {
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
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {
      /* ignore */
    }
  }, [dark]);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signup } = useAuth();

  type LocationState = { from?: { pathname?: string } } | null;

  const fromPath = useMemo(() => {
    const state = (location.state ?? null) as LocationState;
    return state?.from?.pathname || "/";
  }, [location.state]);

  const rules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /\d/.test(p) },
    { label: "One special character (!@#$…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const ruleResults = useMemo(() => rules.map((r) => r.test(password)), [password]);
  const allRulesPassed = ruleResults.every(Boolean);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!allRulesPassed) {
      toast.error("Password does not meet the requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup({ fullName: name.trim(), email: email.trim(), password });
      if (result.autoLoggedIn) {
        toast.success("Account created. You are now logged in.");
        navigate(fromPath, { replace: true });
      } else {
        toast.success("Account created. Please log in.");
        navigate("/login", { replace: true, state: { from: { pathname: fromPath } } });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6 relative pb-20"
          : "min-h-screen bg-zinc-200 text-black flex flex-col items-center justify-center px-6 relative pb-20"
      }
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className={
          dark
            ? "w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-8"
            : "w-full max-w-md rounded-2xl border border-zinc-300 bg-white/70 p-8"
        }
      >
        <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
        <p className={dark ? "text-center text-sm text-slate-400 mb-8" : "text-center text-sm text-zinc-600 mb-8"}>
          Create your account
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className={dark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-zinc-700"}>
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={
                dark
                  ? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
                  : "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
              }
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className={dark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-zinc-700"}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={
                dark
                  ? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
                  : "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
              }
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={dark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-zinc-700"}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
              autoComplete="new-password"
              className={
                dark
                  ? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
                  : "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
              }
              placeholder="••••••••"
            />

            {passwordTouched && password.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {rules.map((rule, i) => (
                  <li key={rule.label} className="flex items-center gap-2 text-xs">
                    {ruleResults[i] ? (
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    )}
                    <span className={ruleResults[i] ? "text-green-500" : dark ? "text-slate-400" : "text-zinc-500"}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className={dark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-zinc-700"}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={
                dark
                  ? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
                  : "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
              }
              placeholder="Repeat password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={
              (dark
                ? "w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 bg-white text-black hover:bg-gray-200"
                : "w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 bg-black text-white hover:bg-gray-800") +
              (isSubmitting ? " opacity-50 cursor-not-allowed" : " hover:scale-[1.02]")
            }
          >
            <UserPlus className="w-5 h-5" />
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className={dark ? "text-sm text-slate-400" : "text-sm text-zinc-600"}>Already have an account? </span>
          <Link
            to="/login"
            className={dark ? "text-sm underline text-slate-200 hover:text-white" : "text-sm underline text-black hover:opacity-80"}
          >
            Login
          </Link>
        </div>
      </motion.div>

      <Footer dark={dark} />
    </div>
  );
}
