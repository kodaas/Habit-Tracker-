"use client";

import { useLocalMutation } from "@/hooks/use-local-storage";
import { updateGridSettings } from "@/lib/grid-mutations";

interface StreakPanelProps {
  gridId: string;
  stats: {
    currentStreak: number;
    bestStreak: number;
    totalDays: number;
  };
  streakMode: string;
  streakGoalPerWeek?: number;
  customDaysOfWeek?: number[];
}

export default function StreakPanel({
  gridId,
  stats,
  streakMode,
}: StreakPanelProps) {
  const updateSettings = useLocalMutation(updateGridSettings);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      gridId,
      streakMode: e.target.value as
        | "DAILY"
        | "WEEKLY"
        | "MONTHLY"
        | "TWICE_WEEKLY"
        | "THRICE_WEEKLY",
    });
  };

  const modeLabel =
    {
      DAILY: "Daily",
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
      TWICE_WEEKLY: "Twice a week",
      THRICE_WEEKLY: "Thrice a week",
    }[streakMode] || streakMode;

  return (
    <div className="flex items-end justify-between">
      <div className="flex gap-12">
        <div className="flex flex-col">
          <span className="text-4xl font-bold leading-none">
            {stats.totalDays}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
            Total Days
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold leading-none">
            {stats.currentStreak}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
            Current Streak
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold leading-none">
            {stats.bestStreak}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
            Best Streak
          </span>
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
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="TWICE_WEEKLY">Twice a Week</option>
            <option value="THRICE_WEEKLY">Thrice a Week</option>
          </select>
        </div>
      </div>
    </div>
  );
}
