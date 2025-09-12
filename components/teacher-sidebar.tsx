"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { BookOpen, Users, BarChart3, Calendar, LogOut, Home, Bell } from "lucide-react"
import { useSidebar } from "@/contexts/sidebar-context"

export function TeacherSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const menuItems = [
    { href: "/teacher", icon: Home, label: "Dashboard", active: pathname === "/teacher" },
    {
      href: "/teacher/activities",
      icon: BookOpen,
      label: "Minhas Atividades",
      active: pathname.startsWith("/teacher/activities"),
    },
    { href: "/teacher/students", icon: Users, label: "Meus Alunos", active: pathname.startsWith("/teacher/students") },
    {
      href: "/teacher/attendance",
      icon: Calendar,
      label: "Chamadas",
      active: pathname.startsWith("/teacher/attendance"),
    },
    { href: "/teacher/reports", icon: BarChart3, label: "Relatórios", active: pathname.startsWith("/teacher/reports") },
  ]

  return (
    <div
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 transition-all duration-300 z-30 ${
        isCollapsed ? "lg:w-16" : "lg:w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">SEMA</h1>
            <span className="ml-2 text-sm text-gray-500">Professor</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <h1 className="text-xl font-bold text-blue-600">S</h1>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <span className="text-gray-600 font-bold">→</span>
          ) : (
            <span className="text-gray-600 font-bold">←</span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <button className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell size={16} />
              Notificações
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              title="Notificações"
            >
              <Bell size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherSidebar
