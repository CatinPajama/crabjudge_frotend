"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("crabjudge_username");
        setUsername(stored);

        const handler = (event: StorageEvent) => {
            if (event.key === "crabjudge_username") {
                setUsername(event.newValue);
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return (
        <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-2 sm:px-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                        CJ
                    </span>
                    <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                        CrabJudge
                    </span>
                </Link>

                <NavigationMenu className="flex-1 justify-end">
                    <NavigationMenuList className="gap-2">
                        <NavigationMenuItem>
                            <Link href="/" className={navigationMenuTriggerStyle()}>
                                Home
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link
                                href="/problems"
                                className={navigationMenuTriggerStyle()}
                            >
                                Problems
                            </Link>
                        </NavigationMenuItem>
                        {username && (
                            <>
                                <NavigationMenuItem>
                                    <Link
                                        href="/profile"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <span className="flex items-center gap-1">
                                            <User2 className="h-4 w-4" />
                                            <span>{username}</span>
                                        </span>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        href="/logout"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Logout
                                    </Link>
                                </NavigationMenuItem>
                            </>
                        )}
                        {!username && (
                            <NavigationMenuItem>
                                <Link
                                    href="/signup"
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Signup
                                </Link>
                            </NavigationMenuItem>
                        )}
                        <NavigationMenuItem>
                            <ThemeToggle />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}
