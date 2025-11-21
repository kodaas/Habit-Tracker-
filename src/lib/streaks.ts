type Mode = "DAILY" | "WEEKLY" | "MONTHLY" | "TWICE_WEEKLY" | "THRICE_WEEKLY";

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
    let best = 0,
      curr = 0,
      prev: Date | null = null;
    for (const iso of sorted) {
      const [y, m, d] = iso.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      if (prev && dt.getTime() - prev.getTime() === oneDayMs) {
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
    const cursor = new Date(today);
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
    const dates = [...set]
      .map((iso) => new Date(iso))
      .sort((a, b) => a.getTime() - b.getTime());
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
    let best = 0,
      curr = 0,
      prevStart: Date | null = null;
    for (const key of keys) {
      const [y, m, dd] = key.split("-").map(Number);
      const start = new Date(y, m - 1, dd);
      const qualifies = (counts.get(key) ?? 0) >= goal;
      const isConsecutive =
        prevStart && start.getTime() - prevStart.getTime() === 7 * oneDayMs;
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

  const monthlyCurrent = () => {
    let streak = 0;
    const cursor = new Date(today);

    while (true) {
      const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

      let hasCompleted = false;
      for (
        let d = new Date(monthStart);
        d <= monthEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const iso = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        if (isCompleted(iso)) {
          hasCompleted = true;
          break;
        }
      }

      if (hasCompleted) {
        streak += 1;
        cursor.setMonth(cursor.getMonth() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const monthlyBest = () => {
    const dates = [...set]
      .map((iso) => new Date(iso))
      .sort((a, b) => a.getTime() - b.getTime());
    const monthKey = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;

    const months = new Set<string>();
    for (const d of dates) {
      months.add(monthKey(d));
    }

    const sortedMonths = [...months].sort();
    let best = 0,
      curr = 0,
      prevMonth: string | null = null;

    for (const month of sortedMonths) {
      const [year, monthNum] = month.split("-").map(Number);
      const currentMonth = new Date(year, monthNum - 1, 1);

      if (prevMonth) {
        const [prevYear, prevMonthNum] = prevMonth.split("-").map(Number);
        const prevMonthDate = new Date(prevYear, prevMonthNum - 1, 1);
        const expectedMonth = new Date(prevMonthDate);
        expectedMonth.setMonth(prevMonthDate.getMonth() + 1);

        if (currentMonth.getTime() === expectedMonth.getTime()) {
          curr += 1;
        } else {
          curr = 1;
        }
      } else {
        curr = 1;
      }

      best = Math.max(best, curr);
      prevMonth = month;
    }

    return best;
  };

  let currentStreak = 0;
  let bestStreak = 0;

  switch (params.streakMode) {
    case "DAILY":
      currentStreak = everyDayCurrent();
      bestStreak = everyDayBest();
      break;
    case "WEEKLY": {
      const goal = 7; // Complete all 7 days in a week
      currentStreak = timesPerWeekCurrent(goal);
      bestStreak = timesPerWeekBest(goal);
      break;
    }
    case "MONTHLY":
      currentStreak = monthlyCurrent();
      bestStreak = monthlyBest();
      break;
    case "TWICE_WEEKLY": {
      const goal = 2;
      currentStreak = timesPerWeekCurrent(goal);
      bestStreak = timesPerWeekBest(goal);
      break;
    }
    case "THRICE_WEEKLY": {
      const goal = 3;
      currentStreak = timesPerWeekCurrent(goal);
      bestStreak = timesPerWeekBest(goal);
      break;
    }
  }

  return { currentStreak, bestStreak, totalDays };
}
