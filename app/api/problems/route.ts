import { headers } from "next/headers";

export async function GET() {
	const res = await fetch('http://localhost:8080/problems', {
		method: "GET"
	});
	const data = await res.json();
	console.log(data);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		}
	});
}
