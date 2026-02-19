import { Navbar } from "@/components/navbar";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen w-full overflow-hidden flex flex-col p-4 bg-background">
			<Navbar></Navbar>
			<main className="h-full overflow-y-auto p-2">
				{children}
			</main>
		</div>
	);
}