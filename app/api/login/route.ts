import { verifyCsrf } from "@/lib/csrf";

export async function POST(req: Request) {
  const csrf = verifyCsrf(req);
  if (!csrf.valid) {
    return new Response(csrf.error, { status: 403 });
  }

  const formjson = await req.json()

  console.log(formjson);
  const be = Buffer.from(`${formjson.username}:${formjson.password}`).toString("base64");

  console.log("Encoded string: ", be);
  const basic_auth = "Basic " + be;
  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Authorization": basic_auth,
    },
    body: JSON.stringify({}),
    credentials: "include",

  })
  console.log(res);
  return new Response(res.body, {
    status: res.status,
    headers: res.headers, // forwards Set-Cookie
  })
}
