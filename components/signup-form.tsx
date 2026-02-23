"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

export function SignupForm({
    className,
    ...props
}: React.FormHTMLAttributes<HTMLDivElement>) {
    const [error, setError] = React.useState<string | null>(null);
    const [sent, setSent] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
                credentials: "include",
            });

            if (response.ok) {
                setSent(true);
            } else {
                const text = await response.text();
                setError(text || "Signup failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-6 w-full max-w-md mx-auto",
                className
            )}
            {...props}
        >
            <Card className="shadow-lg border">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        We&apos;ll send you a verification link to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {sent ? (
                        <div className="text-center space-y-1">
                            <p className="mb-1">
                                Check your email — we sent a verification link.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Open the email and follow the link to complete
                                signup.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </Field>

                                {error && (
                                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                        {error}
                                    </p>
                                )}

                                <Field>
                                    <Button type="submit" className="w-full">
                                        Send verification email
                                    </Button>
                                    <FieldDescription className="mt-2 text-center text-muted-foreground">
                                        Already have an account?{" "}
                                        <Link
                                            href="/login"
                                            className="underline underline-offset-4"
                                        >
                                            Sign in
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
