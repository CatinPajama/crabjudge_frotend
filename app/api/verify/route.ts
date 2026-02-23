import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, username, password } = body || {};

        if (!token) {
            return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Forward POST to backend signup confirmation endpoint with token in query string
        const backendUrl = `http://localhost:8080/signup/confirmation?verification_token=${encodeURIComponent(token)}`;

        const headerList = await headers();
        // Backend expects form-encoded data for username/password
        const params = new URLSearchParams();
        if (username !== undefined) params.append("username", String(username));
        if (password !== undefined) params.append("password", String(password));

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // Forward cookies if any
                Cookie: headerList.get("cookie") || "",
            },
            body: params.toString(),
            credentials: "include",
        });
        const res_body = await res.text();
        // Proxy the backend response back to the client
        return new Response(res_body, {
            status: res.status,
            headers: res.headers,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
