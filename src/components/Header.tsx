"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Header() {
    const { theme, setTheme } = useTheme();

    // Placeholder for auth sign out
    const handleSignOut = () => {
        // In a real app, call auth.signOut()
        // window.location.reload();
        console.log("Sign out clicked");
    };

    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight">Grid My Life</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-md hover:bg-muted transition-colors relative w-9 h-9 flex items-center justify-center"
                    aria-label="Toggle theme"
                >
                    <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                    <Moon className="w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                </button>

                <button
                    onClick={handleSignOut}
                    className="btn-outline text-sm rounded-lg"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
