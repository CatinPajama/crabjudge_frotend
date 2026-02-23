import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import LangeSelector from "./LangSelector";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

const Languages: Record<string, string> = {
    "python:3.12": "python",
    "gcc": "cpp",
    "node": "javascript",
    "cpp17": "cpp",
};

const submitCode = ({
    code,
    problem_id,
    currLang,
}: {
    code: string;
    problem_id: string;
    currLang: string;
}) => {
    return fetch("/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
            env: currLang,
            problem_id,
        }),
        credentials: "include",
    }).then((res) => res.json());
};

export default function CodeWorkspace({ problem_id }: { problem_id: string }) {
    const [currSubmission, SetCurrSubmission] = useState<string | null>(null);
    const [currLang, SetCurrLang] = useState<string>(
        Object.keys(Languages)[0]
    );
    const [code, setCode] = useState<string>("");
    const editorRef = useRef<any>(null);
    const { resolvedTheme } = useTheme();

    const storageKey = `crabjudge_code_${problem_id}_${currLang}`;

    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(storageKey);
        setCode(stored ?? "");
    }, [storageKey]);

    const { data, isSuccess } = useQuery({
        queryKey: ["submission", currSubmission],
        queryFn: async () => {
            return fetch(`/api/status/${currSubmission}`).then((res) =>
                res.json()
            );
        },
        enabled: !!currSubmission,
        refetchInterval: (query) => {
            if (query.state.data?.status !== "PENDING") {
                return false;
            }
            return 2000;
        },
    });

    const isProcessing =
        !!currSubmission && (!data || data.status === "PENDING");

    useEffect(() => {
        if (isSuccess && data && data.status !== "PENDING") {
            toast(`Your code result for ${currSubmission}: ${data.status}`);
            SetCurrSubmission(null);
        }
    }, [isSuccess, data, currSubmission]);

    const mutation = useMutation({
        mutationFn: submitCode,
        onSuccess: async (data) => {
            const submission_id = await data.submission_id;
            SetCurrSubmission(submission_id);
        },
    });

    const handleSubmit = () => {
        mutation.mutate({ code, problem_id, currLang });
    };

    const handleEditorChange = (value?: string) => {
        const next = value ?? "";
        setCode(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(storageKey, next);
        }
    };

    return (
        <div className="flex h-full flex-col justify-start gap-4">
            <Card className="h-full">
                <Editor
                    theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                    className="flex-1"
                    options={{
                        minimap: { enabled: false },
                        padding: {
                            top: 8,
                            bottom: 8,
                        },
                        fontSize: 12,
                        fontFamily: "Ioesvka SS04",
                    }}
                    language={Languages[currLang]}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                />
            </Card>
            <div className="flex flex-row-reverse gap-2 text-center">
                <Button className="bg-accent text-foreground hover:text-background">
                    <Link href={`/submissions/${problem_id}`}>Submissions</Link>
                </Button>
                <LangeSelector SetCurrLang={SetCurrLang} Languages={Languages} />
                <Button onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing && <Spinner />}
                    Submit
                </Button>
            </div>
        </div>
    );
}
