"use client";

import { useState } from "react";
import { useLocalMutation } from "@/hooks/use-local-storage";
import { createGrid } from "@/lib/grid-mutations";
import { X } from "lucide-react";

export default function CreateGridModal({ onClose }: { onClose: () => void }) {
    const createGridMutation = useLocalMutation(createGrid);
    const [title, setTitle] = useState("");
    const [streakMode, setStreakMode] = useState<"EVERY_DAY" | "TWICE_DAILY" | "TIMES_PER_WEEK" | "EVERY_WEEKDAY" | "EVERY_OTHER_DAY" | "WEEKENDS_ONLY">("EVERY_DAY");
    const [streakGoal, setStreakGoal] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createGridMutation({
                title,
                streakMode,
                streakGoalPerWeek: streakMode === "TIMES_PER_WEEK" ? streakGoal : undefined,
            });
            onClose();
        } catch (error) {
            console.error("Failed to create grid:", error);
            alert("Failed to create grid. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6">Create New Grid</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="e.g. Morning Coffee"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Streak Mode</label>
                        <select
                            value={streakMode}
                            onChange={(e) => setStreakMode(e.target.value as any)}
                            className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="EVERY_DAY">Every Day</option>
                            <option value="TWICE_DAILY">Twice Daily (Morning & Evening)</option>
                            <option value="TIMES_PER_WEEK">Times Per Week</option>
                            <option value="EVERY_WEEKDAY">Every Weekday (Mon-Fri)</option>
                            <option value="EVERY_OTHER_DAY">Every Other Day</option>
                            <option value="WEEKENDS_ONLY">Weekends Only (Sat-Sun)</option>
                        </select>
                    </div>

                    {streakMode === "TIMES_PER_WEEK" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Goal (times per week)</label>
                            <input
                                type="number"
                                min={1}
                                max={7}
                                value={streakGoal}
                                onChange={(e) => setStreakGoal(parseInt(e.target.value))}
                                className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Grid"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
