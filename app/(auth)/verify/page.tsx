"use client"

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function VerifyPage() {
    const router = useRouter();
    const params = useSearchParams();
    const token = params?.get("verification_token") || "";
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        const username = form.get("username") as string;
        const password = form.get("password") as string;

        if (!token) {
            setError("Missing verification token in the URL.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, username, password }),
                credentials: "include",
            });
            console.log("res2-----------------------------", res);
            if (res.ok) {
                router.push("/login");
            } else {
                const text = await res.text();
                setError(text || "Verification failed. Please try again.");
            }
        } catch (err) {
            console.log(err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete signup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input id="username" name="username" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" name="password" type="password" required />
                            </Field>
                            {error && <div className="text-red-500">{error}</div>}
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify and create account"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
