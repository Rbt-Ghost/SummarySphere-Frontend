import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { toast } from "../components/Toast";
import { authApi } from "../services/authApi";

export default function ForgotPassword() {
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

	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			toast.error("Please enter your email address");
			return;
		}

		setIsSubmitting(true);
		try {
			await authApi.forgotPassword(email.trim());
			setSubmitted(true);
			toast.success("Password reset link sent to your email");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to send reset email");
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
				onClick={() => navigate("/login")}
				className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Login
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
				<h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
				<p className={dark ? "text-center text-sm text-slate-400 mb-8" : "text-center text-sm text-zinc-600 mb-8"}>
					Enter your email and we'll send you a reset link
				</p>

				{submitted ? (
					<div className="text-center space-y-4">
						<div className={dark ? "text-slate-300 text-sm" : "text-zinc-600 text-sm"}>
							If an account with <span className="font-semibold">{email}</span> exists, a password reset link has been sent.
						</div>
						<Link
							to="/login"
							className={dark ? "text-sm underline text-slate-200 hover:text-white" : "text-sm underline text-black hover:opacity-80"}
						>
							Back to Login
						</Link>
					</div>
				) : (
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
							<Mail className="w-5 h-5" />
							{isSubmitting ? "Sending..." : "Send Reset Link"}
						</button>
					</form>
				)}

				{!submitted && (
					<div className="mt-6 text-center">
						<span className={dark ? "text-sm text-slate-400" : "text-sm text-zinc-600"}>Remembered your password? </span>
						<Link
							to="/login"
							className={dark ? "text-sm underline text-slate-200 hover:text-white" : "text-sm underline text-black hover:opacity-80"}
						>
							Login
						</Link>
					</div>
				)}
			</motion.div>

			<Footer dark={dark} />
		</div>
	);
}
