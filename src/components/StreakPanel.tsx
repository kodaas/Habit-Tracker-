"use client";

import { useLocalMutation } from "@/hooks/use-local-storage";
import { updateGridSettings } from "@/lib/grid-mutations";

interface StreakPanelProps {
    gridId: any; // Id<"grids">
    stats: {
        currentStreak: number;
        bestStreak: number;
        totalDays: number;
    };
    streakMode: string;
    streakGoalPerWeek?: number;
    customDaysOfWeek?: number[];
}

export default function StreakPanel({ gridId, stats, streakMode, streakGoalPerWeek, customDaysOfWeek }: StreakPanelProps) {
    const updateSettings = useLocalMutation(updateGridSettings);

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSettings({ gridId, streakMode: e.target.value as any });
    };

    const modeLabel = {
        "EVERY_DAY": "Every day",
        "TWICE_DAILY": "Twice daily",
        "TIMES_PER_WEEK": "Times / week",
        "EVERY_WEEKDAY": "Weekdays",
        "EVERY_OTHER_DAY": "Every other day",
        "WEEKENDS_ONLY": "Weekends only"
    }[streakMode] || streakMode;

    return (
        <div className="flex items-end justify-between">
            <div className="flex gap-12">
                <div className="flex flex-col">
                    <span className="text-4xl font-bold leading-none">{stats.totalDays}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Total Days</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-4xl font-bold leading-none">{stats.currentStreak}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Current Streak</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-4xl font-bold leading-none">{stats.bestStreak}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Best Streak</span>
                </div>
            </div>

            <div className="relative">
                <div className="border-2 border-foreground rounded-lg px-4 py-2 flex items-center gap-2 bg-background hover:bg-muted/20 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">Streak: {modeLabel}</span>
                    <select
                        value={streakMode}
                        onChange={handleModeChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    >
                        <option value="EVERY_DAY">Every Day</option>
                        <option value="TWICE_DAILY">Twice Daily</option>
                        <option value="TIMES_PER_WEEK">Times / Week</option>
                        <option value="EVERY_WEEKDAY">Weekdays</option>
                        <option value="EVERY_OTHER_DAY">Every Other Day</option>
                        <option value="WEEKENDS_ONLY">Weekends Only</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
