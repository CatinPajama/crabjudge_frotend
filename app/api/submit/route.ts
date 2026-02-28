import { headers } from "next/headers";
import { verifyCsrf } from "@/lib/csrf";

export async function POST(req: Request) {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) {
        return new Response(csrf.error, { status: 403 });
    }

    const headerList = await headers();
    const cookie = headerList.get("cookie");
    const submit_data = await req.json();
    console.log(submit_data)

    const res = await fetch(`http://localhost:8080/${submit_data.problem_id}/submit`,
        {
            method: "POST",
            headers: {
                "Cookie": cookie || "",
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(submit_data),

        });
    console.log(res);
    const submission_id = await res.json();
    console.log("BODY", submission_id);
    return new Response(JSON.stringify(submission_id), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}