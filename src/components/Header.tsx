"use client";

import Link from "next/link";
import { BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="border-b-2 border-foreground bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                    Grid My Life
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href="/docs"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-wider border-2 border-foreground hover:bg-muted transition-colors rounded"
                    >
                        <BookOpen className="w-4 h-4" />
                        Docs
                    </Link>
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-md hover:bg-muted transition-colors relative w-9 h-9 flex items-center justify-center border-2 border-foreground"
                        aria-label="Toggle theme"
                    >
                        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                        <Moon className="w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                    </button>
                </div>
            </div>
        </header>
    );
}
