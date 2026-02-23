import { GET } from "@/app/api/stats/route";
import Chart from "./Chart";

const getProfileData = async () => {
    try {
        const res = await GET();
        return await res.json();
    } catch {
        return [];
    }
};

export default async function Profile() {
    const data = await getProfileData();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                    See how many problems you&apos;ve solved at each
                    difficulty.
                </p>
            </div>

            <div className="max-w-xl">
                <Chart data={data} />
            </div>
        </div>
    );
}

