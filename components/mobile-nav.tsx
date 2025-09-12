"use client"

import { Home, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  userType: "student" | "professor" | "admin"
}

export function MobileNav({ userType }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const getNavItems = () => {
    switch (userType) {
      case "admin":
        return [
          { href: "/admin", icon: Home, label: "Dashboard" },
          { href: "/admin/users", icon: User, label: "Usuários" },
          { href: "/admin/activities", icon: Settings, label: "Atividades" },
        ]
      case "professor":
        return [
          { href: "/professor", icon: Home, label: "Dashboard" },
          { href: "/professor/activities", icon: Settings, label: "Atividades" },
          { href: "/professor/students", icon: User, label: "Alunos" },
        ]
      default:
        return [
          { href: "/student", icon: Home, label: "Dashboard" },
          { href: "/student/activities", icon: Settings, label: "Atividades" },
          { href: "/student/profile", icon: User, label: "Perfil" },
        ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Sair</span>
        </Button>
      </div>
    </div>
  )
}
