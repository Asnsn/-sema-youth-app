"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Users, Calendar, BarChart3, Building2, LogOut, Home, Bell } from "lucide-react"

export default function DesktopSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const menuItems = [
    { href: "/admin", icon: Home, label: "Dashboard", active: pathname === "/admin" },
    { href: "/admin/users", icon: Users, label: "Usuários", active: pathname.startsWith("/admin/users") },
    {
      href: "/admin/activities",
      icon: Calendar,
      label: "Atividades",
      active: pathname.startsWith("/admin/activities"),
    },
    { href: "/admin/reports", icon: BarChart3, label: "Relatórios", active: pathname.startsWith("/admin/reports") },
    { href: "/admin/units", icon: Building2, label: "Unidades", active: pathname.startsWith("/admin/units") },
  ]

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">SEMA</h1>
        <span className="ml-2 text-sm text-gray-500">Admin</span>
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
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-gray-200">
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
      </div>
    </div>
  )
}
