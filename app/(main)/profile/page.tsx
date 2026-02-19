import { GET } from "@/app/api/stats/route"
import Chart from "./Chart";
const getProfileData = async () => {
    const data = await GET();
    return data.json();
}

export default async function Profile() {
    const data = await getProfileData();
    console.log(data);
    return (
        <Chart data={data} />
    )
}

