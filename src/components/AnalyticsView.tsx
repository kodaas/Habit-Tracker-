"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Calendar, Award, Target } from "lucide-react";

interface AnalyticsViewProps {
  grids: {
    _id: string;
    title: string;
    streakMode: string;
    streakGoalPerWeek?: number;
    gridData: {
      completedDates: string[];
    };
    stats: {
      currentStreak: number;
      bestStreak: number;
      totalDays: number;
    };
    createdAt: number;
    updatedAt: number;
  }[];
}

type TimePeriod = "day" | "week" | "month" | "year";

export default function AnalyticsView({ grids }: AnalyticsViewProps) {
  const [selectedGridId, setSelectedGridId] = useState<string>(
    grids[0]?._id || "",
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const selectedGrid = grids.find((g) => g._id === selectedGridId);

  if (!selectedGrid) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No grids available</h2>
        <p className="text-muted-foreground max-w-md">
          Create a habit grid to view analytics and insights!
        </p>
      </div>
    );
  }

  // Calculate analytics based on time period
  const getDateRange = () => {
    const now = new Date();
    const start = new Date();

    switch (timePeriod) {
      case "day":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  };

  const calculateAnalytics = () => {
    const { start, end } = getDateRange();
    const completedDates = selectedGrid.gridData.completedDates.map(
      (d: string) => new Date(d),
    );
    const datesInRange = completedDates.filter(
      (d: Date) => d >= start && d <= end,
    );

    // Calculate total possible days in range
    const daysDiff =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalPossibleDays = timePeriod === "day" ? 1 : daysDiff;

    // Completion rate
    const completionRate =
      totalPossibleDays > 0
        ? Math.round((datesInRange.length / totalPossibleDays) * 100)
        : 0;

    // Day of week breakdown
    const dayOfWeekCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
    completedDates.forEach((date: Date) => {
      dayOfWeekCounts[date.getDay()]++;
    });

    const maxDayCount = Math.max(...dayOfWeekCounts, 1);

    // Consistency score (based on how evenly distributed completions are)
    const avgPerDay = datesInRange.length / totalPossibleDays;
    const variance =
      dayOfWeekCounts.reduce((sum, count) => {
        const diff = count - avgPerDay;
        return sum + diff * diff;
      }, 0) / 7;
    const consistencyScore = Math.max(0, 100 - variance * 5);

    return {
      totalCompleted: datesInRange.length,
      totalPossible: totalPossibleDays,
      completionRate,
      currentStreak: selectedGrid.stats.currentStreak,
      bestStreak: selectedGrid.stats.bestStreak,
      totalDays: selectedGrid.stats.totalDays,
      dayOfWeekCounts,
      maxDayCount,
      consistencyScore: Math.round(consistencyScore),
    };
  };

  const analytics = calculateAnalytics();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label
            htmlFor="grid-select"
            className="block text-sm font-bold mb-2 text-muted-foreground"
          >
            SELECT GRID
          </label>
          <select
            id="grid-select"
            value={selectedGridId}
            onChange={(e) => setSelectedGridId(e.target.value)}
            className="w-full p-3 border-2 border-foreground bg-background font-bold"
          >
            {grids.map((grid) => (
              <option key={grid._id} value={grid._id}>
                {grid.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="time-period"
            className="block text-sm font-bold mb-2 text-muted-foreground"
          >
            TIME PERIOD
          </label>
          <div className="flex gap-2">
            {(["day", "week", "month", "year"] as TimePeriod[]).map(
              (period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setTimePeriod(period)}
                  className={cn(
                    "px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                    timePeriod === period
                      ? "bg-foreground text-background"
                      : "border-2 border-foreground hover:bg-muted",
                  )}
                >
                  {period}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-foreground p-6 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase">
              Completion
            </h3>
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics.completionRate}%
          </div>
          <div className="text-xs text-muted-foreground">
            {analytics.totalCompleted} of {analytics.totalPossible} days
          </div>
        </div>

        <div className="border-2 border-foreground p-6 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase">
              Current Streak
            </h3>
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics.currentStreak}
          </div>
          <div className="text-xs text-muted-foreground">days in a row</div>
        </div>

        <div className="border-2 border-foreground p-6 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase">
              Best Streak
            </h3>
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.bestStreak}</div>
          <div className="text-xs text-muted-foreground">personal record</div>
        </div>

        <div className="border-2 border-foreground p-6 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase">
              Total Days
            </h3>
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalDays}</div>
          <div className="text-xs text-muted-foreground">all time</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-2 border-foreground p-6 mb-8">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
          Progress Overview
        </h3>
        <div className="relative h-8 bg-muted border-2 border-foreground/20">
          <div
            className="h-full bg-accent transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${analytics.completionRate}%` }}
          >
            {analytics.completionRate > 10 && (
              <span className="text-xs font-bold text-accent-foreground">
                {analytics.completionRate}%
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Start</span>
          <span>Goal: 100%</span>
        </div>
      </div>

      {/* Day of Week Distribution */}
      <div className="border-2 border-foreground p-6 mb-8">
        <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">
          Day of Week Distribution
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {dayNames.map((day, index) => {
            const count = analytics.dayOfWeekCounts[index];
            const percentage =
              analytics.maxDayCount > 0
                ? (count / analytics.maxDayCount) * 100
                : 0;

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-muted-foreground">
                  {day}
                </div>
                <div className="relative w-12 h-32 bg-muted border-2 border-foreground/20 flex flex-col justify-end">
                  <div
                    className="w-full bg-accent transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm font-bold">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-foreground p-6">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
            Consistency Score
          </h3>
          <div className="text-6xl font-bold mb-2">
            {analytics.consistencyScore}
          </div>
          <div className="text-sm text-muted-foreground mb-4">out of 100</div>
          <div className="h-2 bg-muted border-2 border-foreground/20">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${analytics.consistencyScore}%` }}
            />
          </div>
        </div>

        <div className="border-2 border-foreground p-6">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
            Streak Mode
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Mode</div>
              <div className="font-bold">
                {selectedGrid.streakMode === "DAILY" && "Daily"}
                {selectedGrid.streakMode === "WEEKLY" && "Weekly"}
                {selectedGrid.streakMode === "MONTHLY" && "Monthly"}
                {selectedGrid.streakMode === "TWICE_WEEKLY" && "Twice a Week"}
                {selectedGrid.streakMode === "THRICE_WEEKLY" && "Thrice a Week"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Created</div>
              <div className="font-bold">
                {new Date(selectedGrid.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Last Updated
              </div>
              <div className="font-bold">
                {new Date(selectedGrid.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
