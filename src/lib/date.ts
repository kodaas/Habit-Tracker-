export function toIsoDateUTC(date: Date): string {
    // Format YYYY-MM-DD in UTC
    const y = date.getUTCFullYear();
    const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const d = date.getUTCDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function toIsoDateLocal(date: Date): string {
    // Format YYYY-MM-DD in local time
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function dayOfWeekFromIso(iso: string): number {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).getDay(); // 0..6
}

export function startOfWeekIso(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const diff = dt.getDay(); // 0..6
    const mondayBased = false; // use Sunday start; adjust if needed
    const start = new Date(dt);
    start.setDate(dt.getDate() - (mondayBased ? ((diff + 6) % 7) : diff));
    const y2 = start.getFullYear();
    const m2 = (start.getMonth() + 1).toString().padStart(2, "0");
    const d2 = start.getDate().toString().padStart(2, "0");
    return `${y2}-${m2}-${d2}`;
}
