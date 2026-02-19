import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import LangeSelector from "./LangSelector";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const Languages = {
    "python:3.12": "python",
    "gcc": "cpp",
    "node": "javascript",
    "cpp17": "cpp",
}


const submitCode = ({ code, problem_id, currLang }: { code: string, problem_id: string, currLang: string }) => {
    return fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "code": code,
            "env": currLang,
            "problem_id": problem_id
        }),
        credentials: 'include',
    }).then(res => res.json());
}

export default function CodeWorkspace({ problem_id }) {
    const [submit, SetSubmit] = useState(false);
    const [currSubmission, SetCurrSubmission] = useState(null);
    const [currLang, SetCurrLang] = useState(Object.keys(Languages)[0]);
    const editorRef = useRef(null);
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }


    const { data, isFetching, isSuccess } = useQuery({
        queryKey: ['submission', currSubmission],
        queryFn: async () => {
            console.log(currSubmission);
            return fetch(`/api/status/${currSubmission}`).then(res => res.json())
        },
        enabled: !!currSubmission,

        refetchInterval: (query) => {
            if (query.state.data?.status !== "PENDING") {
                return false;
            }
            return 2000;
        },
    });
    const isProcessing = !!currSubmission && (!data || data.status === "PENDING");

    useEffect(() => {
        console.log("DATA IS ", data);
        if (isSuccess && data && data.status !== "PENDING") {
            toast(`Your code result for ${currSubmission}: ${data.status}`);
            SetCurrSubmission(null);
        }
    }, [isSuccess, data]);

    const mutation = useMutation({
        mutationFn: submitCode,
        onSuccess: async (data) => {
            console.log("submitted", data, currLang);

            const submission_id = await data.submission_id;
            SetCurrSubmission(submission_id);
            // toast(`Sucessfully Submitted: ID ${submission_id}`)
        },
    })

    const handleSubmit = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getValue(), problem_id, currLang);
            mutation.mutate({ code: editorRef.current.getValue(), problem_id, currLang });
        }
    }

    return (
        <div className="flex flex-col h-full justify-start gap-4">
            <Card className="h-full">
                <Editor theme="vs" className="flex-1" options={{
                    minimap: { enabled: false },
                    padding: {
                        top: 8,
                        bottom: 8,
                    },
                    fontSize: 12,
                    fontFamily: 'Ioesvka SS04',
                }} language={Languages[currLang]} onMount={handleEditorDidMount} />
            </Card>
            <div className="flex flex-row-reverse gap-2 text-center">
                <Button className="bg-accent text-foreground hover:text-background">
                    <Link href={`/submissions/${problem_id}`}>
                        Submissions
                    </Link>
                </Button>
                <LangeSelector SetCurrLang={SetCurrLang} Languages={Languages} />
                <Button onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing && <Spinner />}
                    Submit
                </Button>
            </div>
        </div>

    )
}
