"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, History, Settings, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive",
      })
      // Even if there's an error, redirect to home
      router.push("/")
    }
  }

  return (
    <nav className="grid gap-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant={pathname === item.href ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2")}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
      <Button variant="ghost" className="w-full justify-start gap-2 text-red-500" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </nav>
  )
}
