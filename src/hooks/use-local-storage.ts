"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalQuery<T>(queryFn: () => T): T | undefined {
    const [data, setData] = useState<T | undefined>(undefined);

    const refreshData = useCallback(() => {
        try {
            const result = queryFn();
            setData(result);
        } catch (error) {
            console.error("Query error:", error);
        }
    }, [queryFn]);

    useEffect(() => {
        // Initial load
        refreshData();

        // Listen for updates
        const handleUpdate = () => refreshData();
        window.addEventListener("grids-updated", handleUpdate);

        return () => {
            window.removeEventListener("grids-updated", handleUpdate);
        };
    }, [refreshData]);

    return data;
}

export function useLocalMutation<TArgs, TResult>(
    mutationFn: (args: TArgs) => TResult
): (args: TArgs) => Promise<TResult> {
    return useCallback(
        async (args: TArgs) => {
            try {
                const result = mutationFn(args);
                return result;
            } catch (error) {
                console.error("Mutation error:", error);
                throw error;
            }
        },
        [mutationFn]
    );
}
