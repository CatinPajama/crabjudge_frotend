import { Badge } from "./ui/badge";

const difficultyStyles: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    medium: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
    hard: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const key = difficulty.toLowerCase();
    const classes =
        difficultyStyles[key] ??
        "bg-muted text-muted-foreground dark:bg-muted/40 dark:text-muted-foreground";

    return <Badge className={classes}>{difficulty}</Badge>;
}
