import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, KeyRound, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../components/Footer";
import { toast } from "../components/Toast";
import { authApi } from "../services/authApi";

const rules = [
	{ label: "At least 8 characters", test: (p: string) => p.length >= 8 },
	{ label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
	{ label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
	{ label: "One number", test: (p: string) => /\d/.test(p) },
	{ label: "One special character (!@#$…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPassword() {
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
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);

	const ruleResults = useMemo(() => rules.map((r) => r.test(newPassword)), [newPassword]);
	const allRulesPassed = ruleResults.every(Boolean);
	const passwordsMatch = newPassword === confirmPassword;

	useEffect(() => {
		if (!token) {
			toast.error("Invalid or missing reset token");
			navigate("/forgot-password", { replace: true });
		}
	}, [token, navigate]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordTouched(true);

		if (!newPassword) {
			toast.error("Please enter a new password");
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
			await authApi.resetPassword(token, newPassword);
			toast.success("Password reset successfully");
			navigate("/login", { replace: true });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to reset password");
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
				<h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
				<p className={dark ? "text-center text-sm text-slate-400 mb-8" : "text-center text-sm text-zinc-600 mb-8"}>
					Enter your new password below
				</p>

				<form onSubmit={onSubmit} className="space-y-5">
					<div>
						<label className={dark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-zinc-700"}>
							New Password
						</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => { setNewPassword(e.target.value); setPasswordTouched(true); }}
							autoComplete="new-password"
							className={
								dark
									? "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-blue-500"
									: "w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-black outline-none focus:border-blue-500"
							}
							placeholder="••••••••"
						/>

						{passwordTouched && newPassword.length > 0 && (
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
							Confirm Password
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
							placeholder="••••••••"
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
						<KeyRound className="w-5 h-5" />
						{isSubmitting ? "Resetting..." : "Reset Password"}
					</button>
				</form>
			</motion.div>

			<Footer dark={dark} />
		</div>
	);
}
