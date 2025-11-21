import { dayOfWeekFromIso } from "./date";

type Mode = "EVERY_DAY" | "TIMES_PER_WEEK" | "EVERY_WEEKDAY" | "CUSTOM_DAYS";

export function computeStreaks(params: {
    streakMode: Mode;
    streakGoalPerWeek?: number;
    customDaysOfWeek?: number[];
    completedDates: string[];
    todayIso: string;
}): { currentStreak: number; bestStreak: number; totalDays: number } {
    const set = new Set(params.completedDates);
    const totalDays = set.size;
    const today = new Date(params.todayIso);
    const oneDayMs = 24 * 60 * 60 * 1000;

    const isCompleted = (iso: string) => set.has(iso);

    const prevIso = (base: Date, offsetDays: number) => {
        const d = new Date(base);
        d.setDate(base.getDate() - offsetDays);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, "0");
        const dd = d.getDate().toString().padStart(2, "0");
        return `${y}-${m}-${dd}`;
    };

    const everyDayCurrent = () => {
        let streak = 0;
        let offset = 0;
        while (true) {
            const iso = prevIso(today, offset);
            if (isCompleted(iso)) {
                streak += 1;
                offset += 1;
            } else {
                break;
            }
        }
        return streak;
    };

    const everyDayBest = () => {
        const sorted = [...set].sort();
        let best = 0, curr = 0, prev: Date | null = null;
        for (const iso of sorted) {
            const [y, m, d] = iso.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            if (prev && (dt.getTime() - prev.getTime()) === oneDayMs) {
                curr += 1;
            } else {
                curr = 1;
            }
            best = Math.max(best, curr);
            prev = dt;
        }
        return best;
    };

    const timesPerWeekCurrent = (goal: number) => {
        let streakWeeks = 0;
        let cursor = new Date(today);
        while (true) {
            const weekStart = new Date(cursor);
            weekStart.setDate(cursor.getDate() - weekStart.getDay());
            const count = Array.from({ length: 7 }).reduce((acc: number, _, i) => {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i);
                const iso = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                return acc + (isCompleted(iso) ? 1 : 0);
            }, 0);

            if (count >= goal) {
                streakWeeks += 1;
                cursor.setDate(weekStart.getDate() - 1);
            } else {
                break;
            }
        }
        return streakWeeks;
    };

    const timesPerWeekBest = (goal: number) => {
        const dates = [...set].map(iso => new Date(iso)).sort((a, b) => a.getTime() - b.getTime());
        const weekKey = (d: Date) => {
            const s = new Date(d);
            s.setDate(d.getDate() - d.getDay());
            return `${s.getFullYear()}-${(s.getMonth() + 1).toString().padStart(2, "0")}-${s.getDate().toString().padStart(2, "0")}`;
        };
        const counts = new Map<string, number>();
        for (const d of dates) {
            const key = weekKey(d);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        const keys = [...counts.keys()].sort();
        let best = 0, curr = 0, prevStart: Date | null = null;
        for (const key of keys) {
            const [y, m, dd] = key.split("-").map(Number);
            const start = new Date(y, m - 1, dd);
            const qualifies = (counts.get(key) ?? 0) >= goal;
            const isConsecutive = prevStart && (start.getTime() - prevStart.getTime() === 7 * oneDayMs);
            if (qualifies) {
                curr = isConsecutive ? curr + 1 : 1;
                best = Math.max(best, curr);
            } else {
                curr = 0;
            }
            prevStart = start;
        }
        return best;
    };

    const weekdaySet = new Set([1, 2, 3, 4, 5]); // Mon..Fri
    const customSet = new Set(params.customDaysOfWeek ?? []);
    const dayMatches = (iso: string, useCustom: boolean) => {
        const dow = dayOfWeekFromIso(iso);
        return useCustom ? customSet.has(dow) : weekdaySet.has(dow);
    };

    const scheduleCurrent = (useCustom: boolean) => {
        let streak = 0;
        let offset = 0;
        while (true) {
            const iso = prevIso(today, offset);
            const dowMatches = dayMatches(iso, useCustom);
            if (!dowMatches) {
                offset += 1;
                continue;
            }
            if (isCompleted(iso)) {
                streak += 1;
                offset += 1;
            } else {
                break;
            }
        }
        return streak;
    };

    const scheduleBest = (useCustom: boolean) => {
        const filtered = [...set].filter(iso => dayMatches(iso, useCustom)).sort();
        let best = 0, curr = 0, prev: Date | null = null;
        const isConsecutiveWithSkip = (a: Date, b: Date) => {
            return prev !== null && (b.getTime() - a.getTime() === oneDayMs);
        };
        for (const iso of filtered) {
            const [y, m, d] = iso.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            if (prev && isConsecutiveWithSkip(prev, dt)) {
                curr += 1;
            } else {
                curr = 1;
            }
            best = Math.max(best, curr);
            prev = dt;
        }
        return best;
    };

    let currentStreak = 0;
    let bestStreak = 0;

    switch (params.streakMode) {
        case "EVERY_DAY":
            currentStreak = everyDayCurrent();
            bestStreak = everyDayBest();
            break;
        case "TIMES_PER_WEEK": {
            const goal = Math.max(1, params.streakGoalPerWeek ?? 1);
            currentStreak = timesPerWeekCurrent(goal);
            bestStreak = timesPerWeekBest(goal);
            break;
        }
        case "EVERY_WEEKDAY":
            currentStreak = scheduleCurrent(false);
            bestStreak = scheduleBest(false);
            break;
        case "CUSTOM_DAYS":
            currentStreak = scheduleCurrent(true);
            bestStreak = scheduleBest(true);
            break;
    }

    return { currentStreak, bestStreak, totalDays };
}
