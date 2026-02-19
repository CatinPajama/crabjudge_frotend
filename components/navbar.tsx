import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export function Navbar() {
    return (
        <NavigationMenu className="mx-auto flex flex-row justify-end max-w-full">

            <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/profile" className={navigationMenuTriggerStyle()}>
                        Profile
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/problems" className={navigationMenuTriggerStyle()}>
                        Problems
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/signup" className={navigationMenuTriggerStyle()}>
                        Signup
                    </NavigationMenuLink>
                </NavigationMenuItem>


            </NavigationMenuList>
        </NavigationMenu>
    )
}
