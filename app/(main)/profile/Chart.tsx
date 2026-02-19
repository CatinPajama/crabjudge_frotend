"use client";

import { ChartPieDonutText } from "@/components/barchart";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    count: {
        label: "Count",
    },
    easy: {
        label: "Easy",
        color: "var(--color-green-600)", // Use hex or tailwind colors for better results
    },
    medium: {
        label: "Medium",
        color: "var(--color-yellow-600)", // Use hex or tailwind colors for better results
    },
    hard: {
        label: "Hard",
        color: "red",
        color: "var(--color-red-600)", // Use hex or tailwind colors for better results

    },
} satisfies ChartConfig

export default function Chart({ data }) {
    // We transform the data to include the 'fill' property automatically
    // This looks for var(--color-easy), var(--color-medium), etc.
    const processedData = data.map((item) => ({
        ...item,
        fill: `var(--color-${item.difficulty})`,
    }));

    return (
        <ChartPieDonutText
            chartConfig={chartConfig}
            chartData={processedData}
            dataKey="count"
            nameKey="difficulty"
            description="Solve count"
            centerLabel="Total Solves"
        />
    )
}
