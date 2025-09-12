"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, BarChart3, Settings } from "lucide-react"

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", icon: Home, label: "Início" },
    { href: "/admin/users", icon: Users, label: "Usuários" },
    { href: "/admin/activities", icon: Calendar, label: "Atividades" },
    { href: "/admin/reports", icon: BarChart3, label: "Relatórios" },
    { href: "/admin/units", icon: Settings, label: "Unidades" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
