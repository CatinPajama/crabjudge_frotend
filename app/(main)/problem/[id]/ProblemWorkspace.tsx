"use client";

import { Button } from "@/components/ui/button";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@monaco-editor/react";
import CodeWorkspace from "./CodeWorkspace";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DifficultyBadge } from "@/components/difficulty-badge";
const queryClient = new QueryClient()

export default function ProblemWorkspace({ problem }: { problem: any }) {
    return (
        <div className="h-full max-w-6xl mx-auto py-4">
            <ResizablePanelGroup
                orientation="horizontal"
                className="h-full gap-4 rounded-xl border bg-background/70 p-2 shadow-sm backdrop-blur"
            >
                <ResizablePanel defaultSize={42} className="min-w-[260px]">
                    <Card className="h-full overflow-y-auto border-none bg-card/80 shadow-sm">
                        <CardHeader className="pb-3 border-b flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Problem #{problem.problem_id}
                                </p>
                                <CardTitle className="mt-1 text-xl font-semibold text-primary">
                                    {problem.title}
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs text-muted-foreground">
                                    Read the statement on the left, then write and submit your code on the right.
                                </CardDescription>
                            </div>
                            <DifficultyBadge difficulty={problem.difficulty} />
                        </CardHeader>
                        <CardContent className="whitespace-pre-line text-sm leading-relaxed space-y-4 py-4">
                            {problem.statement}
                        </CardContent>
                    </Card>
                </ResizablePanel>

                <ResizableHandle withHandle className="mx-1" />

                <ResizablePanel defaultSize={58} className="min-w-[260px]">
                    <QueryClientProvider client={queryClient}>
                        <CodeWorkspace problem_id={problem.problem_id} />
                    </QueryClientProvider>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
