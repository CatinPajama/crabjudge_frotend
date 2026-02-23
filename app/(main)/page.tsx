"use client";

export default function Page() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="relative max-w-3xl w-full rounded-2xl border bg-background/80 px-6 py-10 shadow-md backdrop-blur">
                {/* <div className="absolute inset-x-8 -top-6 h-10 rounded-xl bg-gradient-to-r from-orange-500/40 via-amber-500/30 to-rose-500/30 blur-2" /> */}

                <div className="relative space-y-4 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance">
                        CrabJudge
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        A minimalist online judge powered by Rust and Next.js.
                        Practice problems, submit code, and track your progress
                        with a clean, focused interface.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Rust backend
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            Next.js frontend
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Live judging
                        </span>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <a
                            href="/problems"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                        >
                            Browse problems
                        </a>
                        <a
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/60"
                        >
                            Get started
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}