import { DifficultyBadge } from "@/components/difficulty-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const fetchProblems = async () => {
	const res = await fetch("http://localhost:8080/problems", {
		method: "GET",
	});
	const data = await res.json();

	return data;
};

export default async function Problems() {
	const data = await fetchProblems();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Problems
					</h1>
					<p className="text-sm text-muted-foreground">
						Browse problems and pick one to start solving.
					</p>
				</div>
			</div>

			<div className="rounded-lg border bg-card shadow-sm overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/60">
							<TableHead className="w-[96px] font-semibold">
								Problem ID
							</TableHead>
							<TableHead className="font-semibold">
								Title
							</TableHead>
							<TableHead className="text-right font-semibold">
								Difficulty
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((problem: any) => (
							<TableRow
								key={problem.problem_id}
								className="hover:bg-muted/60 transition-colors"
							>
								<TableCell className="font-medium">
									{problem.problem_id}
								</TableCell>
								<TableCell>
									<Link
										href={`/problem/${problem.problem_id}`}
										className="font-medium hover:underline"
									>
										{problem.title}
									</Link>
								</TableCell>
								<TableCell className="text-right">
									<DifficultyBadge
										difficulty={problem.difficulty}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
