"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface UserMenuProps {
    userImage?: string | null;
    userName?: string | null;
    leetcodeUsername?: string | null;
    onConnectLeetCode: () => void;
}

export function UserMenu({ userImage, userName, leetcodeUsername, onConnectLeetCode }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                className="bg-transparent border-none p-0 cursor-pointer rounded-full relative group"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="absolute inset-0 rounded-full border border-accent-primary/50 group-hover:border-accent-primary transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors duration-300 blur-sm" />

                {userImage ? (
                    <img src={userImage} alt={userName ?? "User"} className="w-10 h-10 rounded-full object-cover relative z-10" />
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base text-white bg-bg-tertiary relative z-10 font-mono">
                        {userName?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[220px] bg-bg-secondary border border-border rounded-md shadow-2xl overflow-hidden z-50 p-1"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="p-md flex flex-col gap-xs border-b border-border/50 pb-sm mb-sm bg-bg-tertiary/30 rounded-t-sm">
                            <span className="font-mono font-bold text-sm text-text-primary">{userName ?? "User"}</span>
                            {leetcodeUsername ? (
                                <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                                    <span className="text-accent-secondary">@</span>
                                    {leetcodeUsername}
                                </span>
                            ) : (
                                <button
                                    className="bg-none border-none text-accent-cyan text-xs p-0 cursor-pointer text-left hover:underline font-mono"
                                    onClick={() => {
                                        onConnectLeetCode();
                                        setIsOpen(false);
                                    }}
                                >
                                    + Connect LeetCode
                                </button>
                            )}
                        </div>

                        <button
                            className="flex items-center gap-md w-full p-sm rounded-sm bg-transparent border-none text-text-secondary text-sm cursor-pointer transition-all hover:bg-accent-primary/10 hover:text-accent-primary group"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
                            <span className="font-mono">Sign Out</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
