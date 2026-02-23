"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation";

import React from "react";


export function SignupForm({
    className,
    ...props
}: React.FormHTMLAttributes<HTMLDivElement>) {

    const [error, setError] = React.useState<string | null>(null);
    const [sent, setSent] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include',
            })

            if (response.ok) {
                setSent(true)
            } else {
                const text = await response.text()
                setError(text || 'Signup failed. Please try again.')
            }
        } catch (err) {
            setError('Network error. Please try again.')
        }
    }
    return (

        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>

                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="text-center">
                            <p className="mb-2">Check your email — we sent a verification link.</p>
                            <p className="text-sm text-muted-foreground">Open the email and follow the link to complete signup.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                                </Field>
                                {error && <p className="text-red-500">{error}</p>}
                                <Field>
                                    <Button type="submit">Send verification email</Button>
                                    <FieldDescription className="text-center">
                                        Already have an account? <Link href="/login">Sign in</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
