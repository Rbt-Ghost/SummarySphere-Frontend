import React from "react";
import { motion } from "framer-motion";

type Props = {
	dark?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
};

export default function CTAButton({ dark = true, onClick, children }: Props) {
	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			onClick={onClick}
			className={`px-10 py-4 rounded-2xl ${dark ? "bg-neutral-100 text-black" : "bg-neutral-900 text-white"} shadow-2xl text-lg font-semibold hover:scale-105 transition-transform`}
		>
			{children ?? "Button"}
		</motion.button>
	);
}

