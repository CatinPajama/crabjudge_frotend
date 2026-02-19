import ProblemWorkspace from "./ProblemWorkspace";



interface Props {
	params: Promise<{ id: string }>;
}
const fetchProblems = async (problemid: string) => {

	// Note: Always use absolute URLs in Server Components
	const res = await fetch(`http://localhost:8080/problem/${problemid}`, {
		method: "GET",
		cache: 'no-store'
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch problem: ${res.status}`);
	}

	return res.json();
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
	const { id } = await params;
	const problem = await fetchProblems(id);
	return <ProblemWorkspace problem={problem} />;
}
