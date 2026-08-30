import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MailWarning, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../services/authContext";

type VerificationState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, confirmEmailVerification } = useAuth();
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setMessage("This verification link is incomplete.");
      return;
    }

    void confirmEmailVerification(token)
      .then(() => {
        setState("success");
        setMessage("Your email is verified. All SummarySphere features are now available.");
      })
      .catch((error: unknown) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "The verification link is invalid or expired.");
      });
  }, [confirmEmailVerification, searchParams]);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/70">
          {state === "loading" ? <Loader2 className="h-8 w-8 animate-spin text-blue-400" /> : null}
          {state === "success" ? <CheckCircle2 className="h-9 w-9 text-emerald-400" /> : null}
          {state === "error" ? <XCircle className="h-9 w-9 text-red-400" /> : null}
        </div>
        <h1 className="text-2xl font-bold">{state === "success" ? "Email verified" : state === "error" ? "Verification failed" : "Verify your email"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>

        {state !== "loading" ? (
          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/" : "/login", { replace: true })}
            className="mt-7 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
          >
            {isAuthenticated ? "Go to dashboard" : "Go to login"}
          </button>
        ) : null}

        {state === "error" && isAuthenticated ? (
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-amber-300">
            <MailWarning className="h-4 w-4" />
            Request a new link from your account menu.
          </div>
        ) : null}
      </section>
    </main>
  );
}
