"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

/* ---------------- types ---------------- */

interface DonutChartData {
    [key: string]: any
}

interface ChartPieDonutTextProps {
    chartData: DonutChartData[]
    chartConfig: ChartConfig
    dataKey: string
    nameKey: string

    title: string
    description?: string

    centerLabel: string

    footerTrendText?: string
    footerSubText?: string
}

/* ---------------- component ---------------- */

export function ChartPieDonutText({
    chartData,
    chartConfig,
    dataKey,
    nameKey,
    title,
    description,
    centerLabel,
    footerTrendText,
    footerSubText,
}: ChartPieDonutTextProps) {

    const totalValue = React.useMemo(() => {
        return chartData.reduce(
            (acc, curr) => acc + (curr[dataKey] ?? 0),
            0
        )
    }, [chartData, dataKey])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (!viewBox || !("cx" in viewBox)) return null

                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalValue.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy ?? 0) + 24}
                                                className="fill-muted-foreground text-sxl"
                                            >
                                                {centerLabel}
                                            </tspan>
                                        </text>
                                    )
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            {(footerTrendText || footerSubText) && (
                <CardFooter className="flex-col gap-2 text-sm">
                    {footerTrendText && (
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {footerTrendText}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    )}
                    {footerSubText && (
                        <div className="text-muted-foreground leading-none">
                            {footerSubText}
                        </div>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
