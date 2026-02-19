import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {cookies} from "next/headers";
const fetchSubmissions = async (id) => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const cookieStore = await cookies();
	const res = await fetch(`${origin}/api/submissions/${id}`, {
		method: "GET",
        credentials : "include",
        headers : {
            "Cookie" : cookieStore.toString(),
        }
        // cookies : cookieStore.toString(),
	});
    console.log(res);
	const data = await res.json();
    console.log(data);
	// for (let i = 0; i < 100; i++) {
	// 	data.push({
	// 		problem_id: i + 3,
	// 		title: `lol ${i}`,
	// 		difficulty: "easy"
	// 	})
	// }
	// console.log(data);
	return data;
}
export default async function Problems({params}) {
    const { id } = await params;

	const data = (await fetchSubmissions(id)).reverse();
	return (
        <div className="h-full bg-background">
		<Table className="overflow-y-auto">
			<TableHeader >
				<TableRow className="bg-muted">
					<TableHead className="w-[25]">Submission ID</TableHead>
					<TableHead>Output</TableHead>
					<TableHead className="text-right">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{
					data.map((submission) =>
						<TableRow key={submission.submission_id} className="overflow-hidden">
							<TableCell className="font-medium">
								{submission.submission_id}
							</TableCell>
							<TableCell className="max-w-3xs">
                                <div className="truncate">
									{submission.output}

                                </div>
							</TableCell>
							<TableCell className="text-right">{submission.status}</TableCell>
						</TableRow>
					)
				}
			</TableBody>
		</Table>
        </div>
	)
}
