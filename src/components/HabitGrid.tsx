"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toIsoDateLocal } from "@/lib/date";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HabitGridProps {
    completedDates: Set<string>;
    onToggle: (isoDate: string) => void;
}

type ViewMode = "yearly" | "monthly" | "weekly" | "daily";

export default function HabitGrid({ completedDates, onToggle }: HabitGridProps) {
    const today = new Date();
    const todayIso = toIsoDateLocal(today);

    // Load persisted view state from localStorage
    const getInitialViewMode = (): ViewMode => {
        if (typeof window === 'undefined') return "yearly";
        const saved = localStorage.getItem('habit-grid-view-mode');
        return (saved as ViewMode) || "yearly";
    };

    const getInitialDate = (): Date => {
        if (typeof window === 'undefined') return new Date();
        const saved = localStorage.getItem('habit-grid-current-date');
        return saved ? new Date(saved) : new Date();
    };

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
    const [currentDate, setCurrentDate] = useState<Date>(getInitialDate);

    // Drag selection state
    const [isDragging, setIsDragging] = useState(false);
    const [dragAction, setDragAction] = useState<'mark' | 'unmark'>('mark');
    const draggedDates = useRef<Set<string>>(new Set());

    // Persist view mode changes to localStorage
    useEffect(() => {
        localStorage.setItem('habit-grid-view-mode', viewMode);
    }, [viewMode]);

    // Persist current date changes to localStorage
    useEffect(() => {
        localStorage.setItem('habit-grid-current-date', currentDate.toISOString());
    }, [currentDate]);

    const handleMouseDown = (iso: string) => {
        setIsDragging(true);
        draggedDates.current = new Set([iso]);
        const isCurrentlyCompleted = completedDates.has(iso);
        setDragAction(isCurrentlyCompleted ? 'unmark' : 'mark');
        onToggle(iso);
    };

    const handleMouseEnter = (iso: string) => {
        if (isDragging && !draggedDates.current.has(iso)) {
            draggedDates.current.add(iso);
            const isCompleted = completedDates.has(iso);
            const shouldToggle = (dragAction === 'mark' && !isCompleted) || (dragAction === 'unmark' && isCompleted);
            if (shouldToggle) {
                onToggle(iso);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        draggedDates.current = new Set();
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            return () => window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging]);

    const renderDateCell = (date: Date, size: "small" | "medium" | "large" = "small") => {
        const iso = toIsoDateLocal(date);
        const isToday = iso === todayIso;
        const isCompleted = completedDates.has(iso);

        const sizeClasses = {
            small: "w-4 h-4",
            medium: "w-12 h-12 text-sm",
            large: "w-24 h-24 text-2xl"
        };

        return (
            <button
                key={iso}
                onMouseDown={() => handleMouseDown(iso)}
                onMouseEnter={() => handleMouseEnter(iso)}
                className={cn(
                    sizeClasses[size],
                    "transition-all duration-200 group relative flex items-center justify-center",
                    isToday ? "rounded-md" : "rounded-full",
                    "border-2",
                    isToday && isCompleted ? "bg-accent border-accent text-accent-foreground" :
                        isToday && !isCompleted ? "bg-transparent border-accent" :
                            isCompleted ? "bg-foreground border-foreground text-background" :
                                "bg-transparent border-muted-foreground/30 hover:border-foreground",
                )}
                title={`${date.toDateString()}`}
                aria-label={`Toggle ${date.toDateString()}`}
            >
                {size !== "small" && <span className="font-bold">{date.getDate()}</span>}
                {size === "small" && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-bold bg-foreground text-background rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                        {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                )}
            </button>
        );
    };

    const renderYearlyView = () => {
        const year = currentDate.getFullYear();
        const startDate = new Date(year, 0, 1);
        const weeks: Date[][] = [];
        let current = new Date(startDate);
        current.setDate(current.getDate() - current.getDay());

        while (current.getFullYear() <= year || (current.getFullYear() === year + 1 && current.getMonth() === 0 && current.getDate() < 7)) {
            const week: Date[] = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
            if (current.getFullYear() > year) break;
        }

        return (
            <div className="flex gap-1 min-w-max">
                <div className="flex flex-col gap-1 pt-6 pr-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <div className="h-4"></div>
                    <div className="h-4 leading-4">Mon</div>
                    <div className="h-4"></div>
                    <div className="h-4 leading-4">Wed</div>
                    <div className="h-4"></div>
                    <div className="h-4 leading-4">Fri</div>
                    <div className="h-4"></div>
                </div>
                <div className="flex gap-1">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1">
                            <div className="h-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                {week[0].getDate() <= 7 && week[0].getMonth() !== (weeks[wIndex - 1]?.[0]?.getMonth() ?? -1) ?
                                    week[0].toLocaleString("default", { month: "short" }) : ""}
                            </div>
                            {week.map((date) => {
                                if (date.getFullYear() !== year) return <div key={toIsoDateLocal(date)} className="w-4 h-4" />;
                                return renderDateCell(date, "small");
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthlyView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const weeks: Date[][] = [];
        let current = new Date(startDate);

        while (current <= lastDay || current.getDay() !== 0) {
            const week: Date[] = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
            if (current.getDay() === 0 && current > lastDay) break;
        }

        return (
            <div className="w-full">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-center text-sm font-bold text-muted-foreground">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {weeks.flat().map(date => {
                        const isCurrentMonth = date.getMonth() === month;
                        return (
                            <div key={toIsoDateLocal(date)} className={cn("flex justify-center", !isCurrentMonth && "opacity-30")}>
                                {renderDateCell(date, "medium")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeeklyView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }

        return (
            <div className="w-full">
                <div className="grid grid-cols-7 gap-4">
                    {week.map(date => (
                        <div key={toIsoDateLocal(date)} className="flex flex-col items-center gap-2">
                            <div className="text-sm font-bold text-muted-foreground">
                                {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                            {renderDateCell(date, "medium")}
                            <div className="text-xs text-muted-foreground">
                                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDailyView = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">
                    {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </div>
                {renderDateCell(currentDate, "large")}
            </div>
        );
    };

    const navigatePrev = () => {
        const newDate = new Date(currentDate);
        switch (viewMode) {
            case "yearly":
                newDate.setFullYear(newDate.getFullYear() - 1);
                break;
            case "monthly":
                newDate.setMonth(newDate.getMonth() - 1);
                break;
            case "weekly":
                newDate.setDate(newDate.getDate() - 7);
                break;
            case "daily":
                newDate.setDate(newDate.getDate() - 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        switch (viewMode) {
            case "yearly":
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
            case "monthly":
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case "weekly":
                newDate.setDate(newDate.getDate() + 7);
                break;
            case "daily":
                newDate.setDate(newDate.getDate() + 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const getViewTitle = () => {
        switch (viewMode) {
            case "yearly":
                return currentDate.getFullYear().toString();
            case "monthly":
                return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            case "weekly":
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
            case "daily":
                return currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        }
    };

    return (
        <div style={{ userSelect: 'none' }}>
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("yearly")}
                        className={cn(
                            "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors rounded",
                            viewMode === "yearly" ? "bg-foreground text-background" : "border border-foreground hover:bg-muted"
                        )}
                    >
                        Year
                    </button>
                    <button
                        onClick={() => setViewMode("monthly")}
                        className={cn(
                            "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors rounded",
                            viewMode === "monthly" ? "bg-foreground text-background" : "border border-foreground hover:bg-muted"
                        )}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode("weekly")}
                        className={cn(
                            "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors rounded",
                            viewMode === "weekly" ? "bg-foreground text-background" : "border border-foreground hover:bg-muted"
                        )}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setViewMode("daily")}
                        className={cn(
                            "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors rounded",
                            viewMode === "daily" ? "bg-foreground text-background" : "border border-foreground hover:bg-muted"
                        )}
                    >
                        Day
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={navigatePrev}
                        className="p-1 hover:bg-muted rounded transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-sm font-bold min-w-[200px] text-center">
                        {getViewTitle()}
                    </div>
                    <button
                        onClick={navigateNext}
                        className="p-1 hover:bg-muted rounded transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="ml-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-accent-foreground hover:opacity-90 transition-opacity rounded"
                    >
                        Go to Today
                    </button>
                </div>
            </div>

            {/* Grid View */}
            <div className="overflow-x-auto pb-2">
                {viewMode === "yearly" && renderYearlyView()}
                {viewMode === "monthly" && renderMonthlyView()}
                {viewMode === "weekly" && renderWeeklyView()}
                {viewMode === "daily" && renderDailyView()}
            </div>
        </div>
    );
}
