import React from "react";
import { motion } from "framer-motion";

type Props = {
	dark?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
    size?: "small" | "medium" | "large";
};

export default function CTAButton({ dark = true, onClick, children, size = "large" }: Props) {
    // Define styles for each size
    const sizeStyles = {
        small: "px-4 py-2 text-sm rounded-lg",
        medium: "px-8 py-3 text-base rounded-xl",
        large: "px-10 py-4 text-lg rounded-2xl"
    };

	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			onClick={onClick}
			className={`
                ${sizeStyles[size]} 
                ${dark ? "bg-neutral-100 text-black" : "bg-neutral-900 text-white"} 
                shadow-2xl font-semibold hover:scale-105 transition-transform 
                flex items-center gap-2
            `}
		>
			{children ?? "Button"}
		</motion.button>
	);
}