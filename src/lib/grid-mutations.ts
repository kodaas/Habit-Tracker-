import { getGrid, saveGrid, deleteGrid as deleteGridStorage, generateId, Grid } from "./local-storage";

type StreakMode = "EVERY_DAY" | "TWICE_DAILY" | "TIMES_PER_WEEK" | "EVERY_WEEKDAY" | "EVERY_OTHER_DAY" | "WEEKENDS_ONLY";

export function createGrid(args: {
    title: string;
    streakMode: StreakMode;
    streakGoalPerWeek?: number;
    customDaysOfWeek?: number[];
}): string {
    if (args.title.trim().length === 0 || args.title.length > 100) {
        throw new Error("Title must be 1–100 chars");
    }

    if (args.streakMode === "TIMES_PER_WEEK") {
        const g = args.streakGoalPerWeek ?? 3;
        if (g < 1 || g > 7) throw new Error("streakGoalPerWeek must be 1–7");
    }

    const now = Date.now();
    const _id = generateId();

    const grid: Grid = {
        _id,
        title: args.title.trim(),
        streakMode: args.streakMode,
        streakGoalPerWeek: args.streakGoalPerWeek,
        customDaysOfWeek: args.customDaysOfWeek,
        gridData: { completedDates: [] },
        createdAt: now,
        updatedAt: now
    };

    saveGrid(grid);
    return _id;
}

export function toggleDate(args: { gridId: string; isoDate: string }): boolean {
    const grid = getGrid(args.gridId);
    if (!grid) throw new Error("Grid not found");

    // Validate isoDate
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.isoDate)) throw new Error("Invalid date format");

    const set = new Set(grid.gridData.completedDates);
    if (set.has(args.isoDate)) set.delete(args.isoDate);
    else set.add(args.isoDate);

    const updated = Array.from(set).sort();

    saveGrid({
        ...grid,
        gridData: { completedDates: updated },
        updatedAt: Date.now()
    });

    return true;
}

export function markToday(args: { gridId: string; useLocal?: boolean }): string {
    const grid = getGrid(args.gridId);
    if (!grid) throw new Error("Grid not found");

    const todayIso = new Date().toISOString().slice(0, 10);
    const set = new Set(grid.gridData.completedDates);
    set.add(todayIso);

    const updated = Array.from(set).sort();

    saveGrid({
        ...grid,
        gridData: { completedDates: updated },
        updatedAt: Date.now()
    });

    return todayIso;
}

export function updateGridSettings(args: {
    gridId: string;
    title?: string;
    streakMode?: StreakMode;
    streakGoalPerWeek?: number;
    customDaysOfWeek?: number[];
}): boolean {
    const grid = getGrid(args.gridId);
    if (!grid) throw new Error("Grid not found");

    const patch: Partial<Grid> = {};
    if (args.title !== undefined) {
        const t = args.title.trim();
        if (t.length === 0 || t.length > 100) throw new Error("Title must be 1–100 chars");
        patch.title = t;
    }
    if (args.streakMode !== undefined) patch.streakMode = args.streakMode;
    if (args.streakGoalPerWeek !== undefined) patch.streakGoalPerWeek = args.streakGoalPerWeek;
    if (args.customDaysOfWeek !== undefined) patch.customDaysOfWeek = args.customDaysOfWeek;

    saveGrid({
        ...grid,
        ...patch,
        updatedAt: Date.now()
    });

    return true;
}

export function deleteGrid(args: { gridId: string }): boolean {
    const grid = getGrid(args.gridId);
    if (!grid) throw new Error("Grid not found");

    deleteGridStorage(args.gridId);
    return true;
}
