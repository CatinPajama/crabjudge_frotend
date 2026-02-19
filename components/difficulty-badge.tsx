import { Badge } from "./ui/badge";

const Difficulty = {
    "easy" : "bg-green-200 text-green-800",
    "medium" : "bg-yellow-200 text-yellow-800",
    "hard" : "bg-red-200 text-red-800",

}

export function DifficultyBadge({difficulty} : {difficulty : string}) {
    return (
        <Badge className={Difficulty[difficulty]}>
            {difficulty}
            <div className="text-green"></div>
        </Badge>
    )
}