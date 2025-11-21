"use client";

import { useLocalMutation } from "@/hooks/use-local-storage";
import * as mutations from "@/lib/grid-mutations";
import HabitGrid from "./HabitGrid";
import StreakPanel from "./StreakPanel";
import { Trash2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GridCard({ grid }: { grid: any }) {
    const toggleDate = useLocalMutation(mutations.toggleDate);
    const markToday = useLocalMutation(mutations.markToday);
    const deleteGrid = useLocalMutation(mutations.deleteGrid);
    const updateSettings = useLocalMutation(mutations.updateGridSettings);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(grid.title);

    const completedDates = new Set<string>(grid.gridData.completedDates);
    const todayIso = new Date().toISOString().slice(0, 10);
    const isTodayMarked = completedDates.has(todayIso);

    const handleToggle = (isoDate: string) => {
        toggleDate({ gridId: grid._id, isoDate });
    };

    const handleMarkToday = () => {
        markToday({ gridId: grid._id, useLocal: true });
        // Play sound
        const audio = new Audio("/click.mp3"); // Need to add this file or use oscillator
        // Simple oscillator fallback
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this grid?")) {
            deleteGrid({ gridId: grid._id });
        }
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        if (title.trim() !== grid.title) {
            updateSettings({ gridId: grid._id, title: title.trim() });
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="card w-full bg-background relative">
                <div className="flex justify-between items-center mb-8">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                            autoFocus
                            className="text-3xl font-bold bg-transparent border-b-2 border-foreground focus:outline-none w-full max-w-md"
                        />
                    ) : (
                        <h2
                            onClick={() => setIsEditingTitle(true)}
                            className="text-3xl font-bold cursor-pointer hover:opacity-70 transition-opacity tracking-tight"
                        >
                            {grid.title}
                        </h2>
                    )}

                    <button
                        onClick={handleMarkToday}
                        disabled={isTodayMarked}
                        className={cn(
                            "px-6 py-2 font-bold text-sm uppercase tracking-wider transition-all border-2 border-transparent",
                            isTodayMarked
                                ? "bg-foreground text-background cursor-not-allowed opacity-50"
                                : "bg-black text-white dark:bg-white dark:text-black hover:scale-105"
                        )}
                    >
                        {isTodayMarked ? "DONE" : "MARK TODAY"}
                    </button>
                </div>

                <div className="mb-8">
                    <HabitGrid completedDates={completedDates} onToggle={handleToggle} />
                </div>

                <div className="border-t-2 border-muted pt-6">
                    <StreakPanel
                        gridId={grid._id}
                        stats={grid.stats}
                        streakMode={grid.streakMode}
                        streakGoalPerWeek={grid.streakGoalPerWeek}
                        customDaysOfWeek={grid.customDaysOfWeek}
                    />
                </div>
            </div>

            <button
                onClick={handleDelete}
                className="btn-outline text-xs py-1 px-3 rounded-md opacity-50 hover:opacity-100 transition-opacity"
            >
                Delete
            </button>
        </div>
    );
}
