export async function POST(req: Request) {
    const formjson = await req.json()

    const formData = new FormData();
    for (const key in formjson) {
      formData.append(key, formjson[key]);
    }
    const params = new URLSearchParams(formData as any);
    


  const res = await fetch("http://localhost:8080/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString(),
    credentials: "include",
    
  })
  console.log(res);
  return new Response(res.body, {
    status: res.status,
    headers: res.headers, // forwards Set-Cookie
  })
}
