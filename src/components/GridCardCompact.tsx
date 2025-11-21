"use client";

import { useLocalMutation } from "@/hooks/use-local-storage";
import { deleteGrid } from "@/lib/grid-mutations";

interface GridCardCompactProps {
    grid: {
        _id: string;
        title: string;
        streakMode: string;
        streakGoalPerWeek?: number;
        stats: {
            totalDays: number;
        };
        updatedAt: number;
    };
    onEdit: (gridId: string) => void;
}

export default function GridCardCompact({ grid, onEdit }: GridCardCompactProps) {
    const deleteGridMutation = useLocalMutation(deleteGrid);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${grid.title}"?`)) {
            deleteGridMutation({ gridId: grid._id });
        }
    };

    const getStreakModeLabel = () => {
        switch (grid.streakMode) {
            case "EVERY_DAY":
                return "Daily";
            case "TWICE_DAILY":
                return "2x Daily";
            case "TIMES_PER_WEEK":
                return `${grid.streakGoalPerWeek}x Week`;
            case "EVERY_WEEKDAY":
                return "Weekdays";
            case "EVERY_OTHER_DAY":
                return "Alternating";
            case "WEEKENDS_ONLY":
                return "Weekends";
            default:
                return grid.streakMode;
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="border-2 border-foreground rounded-2xl p-6 bg-background flex flex-col gap-4 min-w-[300px] max-w-[340px]">
            <div>
                <h3 className="text-xl font-bold mb-2">{grid.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{grid.stats.totalDays} days marked</span>
                    <span>•</span>
                    <span>{getStreakModeLabel()}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                    Updated {formatDate(grid.updatedAt)}
                </div>
            </div>

            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onEdit(grid._id)}
                    className="flex-1 bg-foreground text-background px-4 py-2 font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 font-bold text-sm tracking-wide border-2 border-foreground hover:bg-muted transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
