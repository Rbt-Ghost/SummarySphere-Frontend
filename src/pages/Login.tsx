import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { toast } from "../components/Toast";
import { useAuth } from "../services/authContext";

export default function Login() {
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
	const { isAuthenticated, login } = useAuth();

	type LocationState = { from?: { pathname?: string } } | null;

	const fromPath = useMemo(() => {
		const state = (location.state ?? null) as LocationState;
		return state?.from?.pathname || "/";
	}, [location.state]);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			navigate(fromPath, { replace: true });
		}
	}, [isAuthenticated, navigate, fromPath]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !password) {
			toast.error("Please enter email and password");
			return;
		}

		setIsSubmitting(true);
		try {
			await login({ email: email.trim(), password });
			toast.success("Logged in successfully");
			navigate(fromPath, { replace: true });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Login failed");
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
				<h1 className="text-3xl font-bold text-center mb-2">Login</h1>
				<p className={dark ? "text-center text-sm text-slate-400 mb-8" : "text-center text-sm text-zinc-600 mb-8"}>
					Sign in to continue
				</p>

				<form onSubmit={onSubmit} className="space-y-5">
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
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
							className={
								dark
									? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
									: "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
							}
							placeholder="••••••••"
						/>
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
						<LogIn className="w-5 h-5" />
						{isSubmitting ? "Signing in..." : "Login"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<span className={dark ? "text-sm text-slate-400" : "text-sm text-zinc-600"}>Don’t have an account? </span>
					<Link
						to="/signup"
						className={dark ? "text-sm underline text-slate-200 hover:text-white" : "text-sm underline text-black hover:opacity-80"}
					>
						Sign Up
					</Link>
				</div>
			</motion.div>

			<Footer dark={dark} />
		</div>
	);
}
