"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, BarChart3, Building2, LogOut, Bell, TrendingUp, Activity } from "lucide-react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">SEMA Admin</h1>
              <p className="text-sm text-gray-500">Painel Administrativo</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Bell size={20} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-red-50 text-red-600">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do sistema SEMA</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-500">Alunos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-gray-500">Professores</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-500">Atividades</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-500">Presença</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/users"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Gerenciar Usuários</h3>
                    <p className="text-sm text-gray-500">Administrar alunos e professores</p>
                  </div>
                </Link>

                <Link
                  href="/admin/activities"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Gerenciar Atividades</h3>
                    <p className="text-sm text-gray-500">Modalidades e programas</p>
                  </div>
                </Link>

                <Link
                  href="/admin/reports"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <BarChart3 size={24} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Relatórios</h3>
                    <p className="text-sm text-gray-500">Análises e estatísticas</p>
                  </div>
                </Link>

                <Link
                  href="/admin/units"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Gerenciar Unidades</h3>
                    <p className="text-sm text-gray-500">SEMA Brasil e Angola</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Units Overview */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Unidades SEMA</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900">SEMA Brasil</h3>
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700 mb-3">São Paulo, Brasil</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-900">89</p>
                      <p className="text-xs text-blue-700">Alunos</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-900">8</p>
                      <p className="text-xs text-blue-700">Professores</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-900">SEMA Angola</h3>
                    <Activity size={20} className="text-green-600" />
                  </div>
                  <p className="text-sm text-green-700 mb-3">Luanda, Angola</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-green-900">67</p>
                      <p className="text-xs text-green-700">Alunos</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-green-900">16</p>
                      <p className="text-xs text-green-700">Professores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}
