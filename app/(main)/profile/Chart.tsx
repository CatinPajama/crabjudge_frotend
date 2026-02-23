"use client";

import { useEffect, useState } from "react";
import { ChartPieDonutText } from "@/components/barchart";
import { ChartConfig } from "@/components/ui/chart";

type DifficultyKey = "easy" | "medium" | "hard";

interface StatItem {
    difficulty: DifficultyKey | string;
    count: number;
}

const chartConfig = {
    count: {
        label: "Count",
    },
    easy: {
        label: "Easy",
        // emerald-500 for stronger contrast
        color: "#22c55e",
    },
    medium: {
        label: "Medium",
        // amber-500 for stronger contrast
        color: "#f59e0b",
    },
    hard: {
        label: "Hard",
        // red-500 for stronger contrast
        color: "#ef4444",
    },
} satisfies ChartConfig;

export default function Chart({ data }: { data: StatItem[] }) {
    const safeData = Array.isArray(data) ? data : [];
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("crabjudge_username");
        setUsername(stored);
    }, []);

    const processedData = safeData.map((item) => {
        const difficultyKey = String(item.difficulty).toLowerCase() as DifficultyKey;
        return {
            ...item,
            difficulty: difficultyKey,
            fill: `var(--color-${difficultyKey})`,
        };
    });

    return (
        <div className="space-y-3">
            {username && (
                <p className="text-sm text-muted-foreground">
                    Signed in as <span className="font-medium">{username}</span>
                </p>
            )}
            <ChartPieDonutText
                chartConfig={chartConfig}
                chartData={processedData}
                dataKey="count"
                nameKey="difficulty"
                title="Solved problems by difficulty"
                description="Breakdown of problems you have solved."
                centerLabel="Total solves"
                footerSubText="Only accepted submissions are counted."
            />
        </div>
    );
}
