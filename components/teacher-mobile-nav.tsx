"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, BarChart3, Calendar, Home } from "lucide-react"

export function TeacherMobileNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/teacher", icon: Home, label: "Início", active: pathname === "/teacher" },
    {
      href: "/teacher/activities",
      icon: BookOpen,
      label: "Atividades",
      active: pathname.startsWith("/teacher/activities"),
    },
    { href: "/teacher/students", icon: Users, label: "Alunos", active: pathname.startsWith("/teacher/students") },
    {
      href: "/teacher/attendance",
      icon: Calendar,
      label: "Chamadas",
      active: pathname.startsWith("/teacher/attendance"),
    },
    { href: "/teacher/reports", icon: BarChart3, label: "Relatórios", active: pathname.startsWith("/teacher/reports") },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${
                item.active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TeacherMobileNav
