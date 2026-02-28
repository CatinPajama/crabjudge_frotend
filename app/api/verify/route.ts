import { headers } from "next/headers";
import { verifyCsrf } from "@/lib/csrf";

interface VerifyRequestBody {
    token?: string;
    username?: string;
    password?: string;
}

const BACKEND_BASE_URL =
    process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: Request) {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) {
        return new Response(csrf.error, { status: 403 });
    }
    try {
        const body = (await req.json()) as Partial<VerifyRequestBody> | null;

        const token =
            typeof body?.token === "string" ? body.token : undefined;
        const username =
            typeof body?.username === "string" ? body.username : undefined;
        const password =
            typeof body?.password === "string" ? body.password : undefined;

        if (!token) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid token" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Forward POST to backend signup confirmation endpoint with token in query string
        const backendUrl = `${BACKEND_BASE_URL}/signup/confirmation?verification_token=${encodeURIComponent(
            token
        )}`;

        const headerList = await headers();

        // Backend expects form-encoded data for username/password
        const params = new URLSearchParams();
        if (username !== undefined) params.append("username", username);
        if (password !== undefined) params.append("password", password);

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // Forward cookies if any
                Cookie: headerList.get("cookie") || "",
            },
            body: params.toString(),
        });

        const resBody = await res.text();

        // Proxy the backend response back to the client
        return new Response(resBody, {
            status: res.status,
            headers: res.headers,
        });
    } catch (err) {
        console.error("Error in /api/verify:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
