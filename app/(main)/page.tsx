"use client";
import { ComponentExample } from "@/components/component-example";
import { useEffect } from "react";
import "../globals.css";


export default function Page() {
    return (
        <div className="h-full flex justify-center items-center flex-col gap-4">
            <div className="text-9xl text-primary">CrabJudge</div>
            <div className="text-2xl">Online Judge powered by Rust and Next JS</div>
        </div>
    )
}