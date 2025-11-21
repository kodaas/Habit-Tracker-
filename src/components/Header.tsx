import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
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
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
