"use client";

import { useLocalQuery } from "@/hooks/use-local-storage";
import { listGridsByUser } from "@/lib/grid-queries";
import Header from "@/components/Header";
import GridCard from "@/components/GridCard";
import GridCardCompact from "@/components/GridCardCompact";
import GridDetailModal from "@/components/GridDetailModal";
import AnalyticsView from "@/components/AnalyticsView";
import { Loader2, Maximize2, LayoutGrid, BarChart3 } from "lucide-react";
import { useState } from "react";
import CreateGridModal from "@/components/CreateGridModal";
import { cn } from "@/lib/utils";

type ViewMode = "fullscreen" | "cards" | "analytics";

export default function Home() {
  const grids = useLocalQuery(listGridsByUser);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGridId, setSelectedGridId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("fullscreen");

  const selectedGrid = grids?.find(g => g._id === selectedGridId);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Grids</h1>
            <p className="text-muted-foreground">{grids?.length || 0} grids</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("fullscreen")}
              className={cn(
                "rounded-lg flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors",
                viewMode === "fullscreen"
                  ? "bg-foreground text-background"
                  : "border-2 border-foreground hover:bg-muted"
              )}
            >
              <Maximize2 className="w-4 h-4" />
              Full Screen
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "rounded-lg flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors",
                viewMode === "cards"
                  ? "bg-foreground text-background"
                  : "border-2 border-foreground hover:bg-muted"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={cn(
                "rounded-lg flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors",
                viewMode === "analytics"
                  ? "bg-foreground text-background"
                  : "border-2 border-foreground hover:bg-muted"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        <div className="mb-12">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-bold text-sm tracking-wider hover:opacity-90 transition-opacity shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          >
            + CREATE NEW GRID
          </button>
        </div>

        {grids === undefined ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : grids.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
            <h2 className="text-2xl font-bold">No grids yet</h2>
            <p className="text-muted-foreground max-w-md">
              Create your first habit grid to start tracking your progress!
            </p>
          </div>
        ) : viewMode === "analytics" ? (
          <AnalyticsView grids={grids} />
        ) : viewMode === "cards" ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {grids.map((grid: any) => (
              <GridCardCompact
                key={grid._id}
                grid={grid}
                onEdit={(id) => setSelectedGridId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-12">
            {grids.map((grid: any) => (
              <GridCard key={grid._id} grid={grid} />
            ))}
          </div>
        )}
      </main>

      {isCreateModalOpen && <CreateGridModal onClose={() => setIsCreateModalOpen(false)} />}
      {selectedGrid && (
        <GridDetailModal
          grid={selectedGrid}
          onClose={() => setSelectedGridId(null)}
        />
      )}
    </div>
  );
}
