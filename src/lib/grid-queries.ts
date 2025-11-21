import { computeStreaks } from "./streaks";
import { getGrids, getGrid, Grid } from "./local-storage";

export interface GridWithStats extends Grid {
    stats: {
        currentStreak: number;
        bestStreak: number;
        totalDays: number;
    };
}

export function listGridsByUser(): GridWithStats[] {
    const grids = getGrids();
    const todayIso = new Date().toISOString().slice(0, 10);

    return grids.map(g => ({
        ...g,
        stats: computeStreaks({
            streakMode: g.streakMode,
            streakGoalPerWeek: g.streakGoalPerWeek,
            customDaysOfWeek: g.customDaysOfWeek,
            completedDates: g.gridData.completedDates,
            todayIso
        })
    }));
}

export function getGridById(gridId: string): GridWithStats | null {
    const grid = getGrid(gridId);
    if (!grid) return null;

    const todayIso = new Date().toISOString().slice(0, 10);

    return {
        ...grid,
        stats: computeStreaks({
            streakMode: grid.streakMode,
            streakGoalPerWeek: grid.streakGoalPerWeek,
            customDaysOfWeek: grid.customDaysOfWeek,
            completedDates: grid.gridData.completedDates,
            todayIso
        })
    };
}
