// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light" // Forces dark mode by default
			enableSystem={true} // Prevents the OS setting from overriding your "dark" choice
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}
