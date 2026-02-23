import { DifficultyBadge } from "@/components/difficulty-badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const fetchProblems = async () => {
	const res = await fetch('http://localhost:8080/problems', {
		method: "GET"
	});
	const data = await res.json();

	return data;
}
export default async function Problems() {
	const data = await fetchProblems();
	return (
		<Table className="overflow-y-auto">
			<TableHeader >
				<TableRow className="bg-muted">
					<TableHead className="w-[25] font-bold">Problem ID</TableHead>
					<TableHead className="font-bold">Title</TableHead>
					<TableHead className="text-right font-bold">Difficulty</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{
					data.map((problem) =>
						<TableRow key={problem.problem_id}>
							<TableCell className="font-medium">
								{problem.problem_id}
							</TableCell>
							<TableCell>
								<Link href={`/problem/${problem.problem_id}`} className="font-medium">
									{problem.title}
								</Link>
							</TableCell>
							<TableCell className="text-right" >
								<DifficultyBadge difficulty={problem.difficulty} />
							</TableCell>
						</TableRow>
					)
				}
			</TableBody>
		</Table>
	)
}
