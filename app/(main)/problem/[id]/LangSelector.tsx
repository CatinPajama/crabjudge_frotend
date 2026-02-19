import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

export default function LangeSelector({ SetCurrLang, Languages }) {
	const handleSelect = (curr: string) => {
		console.log(curr);
		SetCurrLang(curr);
	}
	return (
		<Select onValueChange={handleSelect} defaultValue={Object.keys(Languages)[0]}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{Object.keys(Languages).map((language: string) =>
						<SelectItem value={language} key={language}>{language}</SelectItem>
					)}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
