type StreakMode = "EVERY_DAY" | "TIMES_PER_WEEK" | "EVERY_WEEKDAY" | "CUSTOM_DAYS";

export interface Grid {
    _id: string;
    title: string;
    streakMode: StreakMode;
    streakGoalPerWeek?: number;
    customDaysOfWeek?: number[];
    gridData: {
        completedDates: string[];
    };
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = "habit-tracker-grids";

export function getGrids(): Grid[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function getGrid(id: string): Grid | null {
    const grids = getGrids();
    return grids.find(g => g._id === id) ?? null;
}

export function saveGrid(grid: Grid): void {
    const grids = getGrids();
    const index = grids.findIndex(g => g._id === grid._id);
    if (index >= 0) {
        grids[index] = grid;
    } else {
        grids.push(grid);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grids));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("grids-updated"));
}

export function deleteGrid(id: string): void {
    const grids = getGrids();
    const filtered = grids.filter(g => g._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("grids-updated"));
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
