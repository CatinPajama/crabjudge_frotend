import type { NextApiRequest, NextApiResponse } from "next";
import { parseMaxPostponedStateSize } from "next/dist/server/config-shared";
import { headers } from "next/headers";

export async function GET(req  : Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const headerList = await headers();
    const cookie = headerList.get("cookie");
    const res = await fetch(`http://localhost:8080/${id}/status`, 
        { method: "GET",  headers : {
            "Cookie": cookie || "",
}});
        console.log(res);

    const data = await res.json();
    console.log(data);
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}