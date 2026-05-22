import React from "react";
import { Link } from "react-router-dom";

type Props = {
    dark?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
};

export default function Footer({ dark = true, onClick, children }: Props) {
	return (
        <footer 
            className={`absolute bottom-6 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center transition-colors ${dark ? "text-neutral-400/80" : "text-neutral-500"}`} 
            onClick={onClick}
        >
            { children ?? (
                <>
                    <span>© 2026 Summary Sphere. All rights reserved.</span>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                        <Link to="/privacy" className="hover:underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                        <span className="opacity-30">•</span>
                        <Link to="/terms" className="hover:underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Terms</Link>
                        <span className="opacity-30">•</span>
                        <Link to="/gdpr" className="hover:underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors">GDPR</Link>
                        <span className="opacity-30">•</span>
                        <Link to="/legal" className="hover:underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Legal Notice</Link>
                    </div>
                </>
            ) }
        </footer>
    );
}