"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@monaco-editor/react";
import CodeWorkspace from "./CodeWorkspace";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DifficultyBadge } from "@/components/difficulty-badge";
const queryClient = new QueryClient()

export default function ProblemWorkspace({ problem }: { problem: any }) {
    return (
        <div className="h-full">
            <ResizablePanelGroup orientation="horizontal" className="h-full gap-4">
                <ResizablePanel defaultSize={40} className="p-1">
                    <Card className="h-full overflow-y-auto">
                        <CardHeader>
                            <CardTitle>
                                <h1 className="text-2xl font-bold mb-4 text-primary">{problem.title}</h1>
                                <DifficultyBadge difficulty={problem.difficulty} />
                            </CardTitle>
                        </CardHeader>
                        {/* The statement is rendered here, but fetched on the server */}
                        <CardContent className="whitespace-pre-line">
                            {problem.statement}
                        </CardContent>
                    </Card>
                </ResizablePanel>

                {/* <ResizableHandle withHandle /> */}
                <ResizablePanel defaultSize={60} className="p-1">
                    <QueryClientProvider client={queryClient}>
                        <CodeWorkspace problem_id={problem.problem_id} />
                    </QueryClientProvider>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div >
    );
}
