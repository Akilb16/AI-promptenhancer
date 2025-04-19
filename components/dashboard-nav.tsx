"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, History, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
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
