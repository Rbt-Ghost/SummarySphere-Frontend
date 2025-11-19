import React from "react";

type Props = {
    dark?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
};

export default function Footer({ dark = true, onClick, children }: Props) {
	return (
        <footer className={`absolute bottom-6 text-sm ${dark ? "text-neutral-400" : "text-neutral-900"}`} onClick={onClick}>
            { children ?? "© 2025 Summary Sphere. All rights reserved." }
        </footer>
    );
}