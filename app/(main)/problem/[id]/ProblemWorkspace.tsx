"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import CodeWorkspace from "./CodeWorkspace";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { cn } from "@/lib/utils";

type Problem = {
    problem_id: string | number;
    title: string;
    statement: string;
    difficulty: string;
};

type Submission = {
    submission_id: string | number;
    output: string | null;
    status: string;
};

type StatementParts = {
    intro: string;
    input: string;
    output: string;
    hasTestcase: boolean;
};

type ActiveTab = "statement" | "submissions";

type SubmissionsPanelProps = {
    submissions: Submission[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
};

const queryClient = new QueryClient();

const tabs: ReadonlyArray<{ key: ActiveTab; label: string }> = [
    { key: "statement", label: "Problem Statement" },
    { key: "submissions", label: "Submissions" },
];

const panelMinWidthClass = "min-w-[260px]";

const statusVariant = (
    status: string
): "default" | "secondary" | "destructive" | "outline" => {
    const normalized = status.toUpperCase();
    if (normalized === "ACCEPTED" || normalized === "SUCCESS") {
        return "default";
    }
    if (normalized === "PENDING" || normalized === "RUNNING") {
        return "secondary";
    }
    if (
        normalized === "WRONG_ANSWER" ||
        normalized === "RUNTIME_ERROR" ||
        normalized === "TIME_LIMIT_EXCEEDED" ||
        normalized === "MEMORY_LIMIT_EXCEEDED" ||
        normalized === "COMPILATION_ERROR" ||
        normalized === "FAILED"
    ) {
        return "destructive";
    }
    return "outline";
};

const SAMPLE_INPUT_LABEL = "Sample Input:";
const SAMPLE_OUTPUT_LABEL = "Sample Output:";

const parseStatement = (statement: string): StatementParts => {
    const normalized = statement.replace(/\r/g, "");
    const inputIndex = normalized.indexOf(SAMPLE_INPUT_LABEL);

    if (inputIndex === -1) {
        return {
            intro: "",
            input: "",
            output: "",
            hasTestcase: false,
        };
    }

    const outputIndex = normalized.indexOf(
        SAMPLE_OUTPUT_LABEL,
        inputIndex + SAMPLE_INPUT_LABEL.length
    );

    if (outputIndex === -1) {
        return {
            intro: "",
            input: "",
            output: "",
            hasTestcase: false,
        };
    }

    return {
        intro: normalized.slice(0, inputIndex).trim(),
        input: normalized
            .slice(inputIndex + SAMPLE_INPUT_LABEL.length, outputIndex)
            .trim(),
        output: normalized
            .slice(outputIndex + SAMPLE_OUTPUT_LABEL.length)
            .trim(),
        hasTestcase: true,
    };
};

const normalizeSubmissions = (payload: unknown): Submission[] => {
    if (!Array.isArray(payload)) {
        return [];
    }

    return [...payload]
        .map((item) => {
            const entry = item as Partial<Submission>;
            return {
                submission_id: entry.submission_id ?? "unknown",
                output: typeof entry.output === "string" ? entry.output : null,
                status: typeof entry.status === "string" ? entry.status : "UNKNOWN",
            };
        })
        .reverse();
};

const submissionCountLabel = (count: number) =>
    count > 0 ? `${count} submission${count === 1 ? "" : "s"}` : "No submissions yet";

const statusText = (status: string) => status.replace(/_/g, " ");

function ProblemSectionTabs({
    activeTab,
    onTabChange,
}: {
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
}) {
    return (
        <div
            role="tablist"
            aria-label="Problem sections"
            className="mt-3 grid grid-cols-2 rounded-lg bg-muted/60 p-1"
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`${tab.key}-panel`}
                        className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => onTabChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

function StatementPanel({
    statement,
    parsed,
}: {
    statement: string;
    parsed: StatementParts;
}) {
    if (!parsed.hasTestcase) {
        return (
            <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {statement}
            </div>
        );
    }

    return (
        <>
            {parsed.intro ? (
                <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                    {parsed.intro}
                </div>
            ) : null}

            <article className="rounded-xl border border-primary/25 bg-linear-to-br from-primary/8 via-primary/4 to-transparent p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Testcase
                    </p>
                    <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wide"
                    >
                        Input/Output
                    </Badge>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Input
                    </p>
                    <pre className="overflow-x-auto rounded-md border bg-background/90 px-3 py-2 font-mono text-xs leading-relaxed text-foreground">
                        {parsed.input}
                    </pre>
                </div>
                <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Output
                    </p>
                    <pre className="overflow-x-auto rounded-md border bg-background/90 px-3 py-2 font-mono text-xs leading-relaxed text-foreground">
                        {parsed.output}
                    </pre>
                </div>
            </article>
        </>
    );
}

function SubmissionCard({ submission }: { submission: Submission }) {
    const hasOutput = Boolean(submission.output && submission.output.trim());

    return (
        <article className="rounded-xl border border-border/80 bg-background/90 p-3 shadow-sm transition-colors hover:border-primary/40">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                    Submission #{submission.submission_id}
                </p>
                <Badge
                    variant={statusVariant(submission.status)}
                    className="uppercase"
                >
                    {statusText(submission.status)}
                </Badge>
            </div>
            <div className="mt-2 max-h-28 overflow-y-auto rounded-md bg-muted/40 px-2 py-1.5 text-xs leading-relaxed text-muted-foreground">
                {hasOutput
                    ? submission.output
                    : "No output available for this submission."}
            </div>
        </article>
    );
}

function SubmissionsPanel({
    submissions,
    isLoading,
    isError,
    isFetching,
}: SubmissionsPanelProps) {
    return (
        <div id="submissions-panel" role="tabpanel" className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg border bg-muted/35 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                    {submissionCountLabel(submissions.length)}
                </p>
                {isFetching && !isLoading ? (
                    <p className="text-xs text-muted-foreground">Refreshing...</p>
                ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Spinner />
                    </div>
                ) : null}

                {isError ? (
                    <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
                        Unable to load submissions right now.
                    </div>
                ) : null}

                {!isLoading && !isError && submissions.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                        Submit code to see submission.
                    </div>
                ) : null}

                {!isLoading && !isError && submissions.length > 0 ? (
                    <div className="grid gap-3">
                        {submissions.map((submission, index) => (
                            <SubmissionCard
                                key={`${submission.submission_id}-${index}`}
                                submission={submission}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function ProblemPanels({ problem }: { problem: Problem }) {
    const problemId = String(problem.problem_id);
    const [activeTab, setActiveTab] = useState<ActiveTab>("statement");
    const statementParts = useMemo(
        () => parseStatement(problem.statement),
        [problem.statement]
    );

    const {
        data: submissions = [],
        isLoading,
        isError,
        isFetching,
    } = useQuery<Submission[]>({
        queryKey: ["problem-submissions", problemId],
        queryFn: async () => {
            const res = await fetch(`/api/submissions/${problemId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch submissions.");
            }

            const payload: unknown = await res.json();
            return normalizeSubmissions(payload);
        },
        refetchInterval: 3000,
    });

    return (
        <div className="h-full max-w-6xl mx-auto py-4">
            <ResizablePanelGroup
                orientation="horizontal"
                className="h-full gap-4 rounded-xl border bg-background/70 p-2 shadow-sm backdrop-blur"
            >
                <ResizablePanel defaultSize={42} className={panelMinWidthClass}>
                    <Card className="flex h-full flex-col overflow-hidden border-none bg-card/80 shadow-sm">
                        <CardHeader className="border-b pb-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Problem #{problem.problem_id}
                                    </p>
                                    <CardTitle className="mt-1 text-xl font-semibold text-primary">
                                        {problem.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-xs text-muted-foreground">
                                        Switch between statement and submissions from the tabs below.
                                    </CardDescription>
                                </div>
                                <DifficultyBadge difficulty={problem.difficulty} />
                            </div>
                            <ProblemSectionTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden px-4 pb-4 pt-3">
                            {activeTab === "statement" ? (
                                <div
                                    id="statement-panel"
                                    role="tabpanel"
                                    className="h-full overflow-y-auto pr-1"
                                >
                                    <div className="space-y-4">
                                        <StatementPanel
                                            statement={problem.statement}
                                            parsed={statementParts}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <SubmissionsPanel
                                    submissions={submissions}
                                    isLoading={isLoading}
                                    isError={isError}
                                    isFetching={isFetching}
                                />
                            )}
                        </CardContent>
                    </Card>
                </ResizablePanel>

                <ResizableHandle withHandle className="mx-1" />

                <ResizablePanel defaultSize={58} className={panelMinWidthClass}>
                    <CodeWorkspace problem_id={problemId} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default function ProblemWorkspace({ problem }: { problem: Problem }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ProblemPanels problem={problem} />
        </QueryClientProvider>
    );
}
