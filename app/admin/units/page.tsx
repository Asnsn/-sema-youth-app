"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Users, Calendar, TrendingUp, ArrowLeft, Plus, Edit, Eye } from "lucide-react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default function AdminUnits() {
  const [units, setUnits] = useState([
    {
      id: 1,
      name: "Pilar Brasil",
      location: "São Paulo",
      country: "Brasil",
      students: 89,
      teachers: 8,
      activities: 6,
      attendance: 92,
    },
    {
      id: 2,
      name: "Pilar Angola",
      location: "Luanda",
      country: "Angola",
      students: 67,
      teachers: 16,
      activities: 8,
      attendance: 85,
    },
  ])

  const handleNewUnit = () => {
    // Redireciona para a página de nova unidade
    window.location.href = "/admin/units/new"
  }

  const handleViewDetails = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    if (unit) {
      alert(
        `Detalhes da Unidade:\n\nNome: ${unit.name}\nLocalização: ${unit.location}, ${unit.country}\nAlunos: ${unit.students}\nProfessores: ${unit.teachers}\nAtividades: ${unit.activities}\nPresença: ${unit.attendance}%`,
      )
    }
  }

  const handleEditUnit = (unitId: number) => {
    // Redireciona para a página de edição
    window.location.href = `/admin/units/edit/${unitId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Unidades</h1>
                <p className="text-sm text-gray-500">Pilar Brasil e Angola</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Unidades</h1>
                <p className="text-gray-600">Administre todas as unidades Pilar</p>
              </div>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="mb-6">
            <button
              onClick={handleNewUnit}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Plus size={16} />
              Nova Unidade
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{unit.name}</h3>
                    <p className="text-sm text-gray-500">
                      {unit.location}, {unit.country}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-blue-900">{unit.students}</p>
                    <p className="text-xs text-blue-700">Alunos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-green-900">{unit.teachers}</p>
                    <p className="text-xs text-green-700">Professores</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar size={16} className="text-orange-600" />
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-orange-900">{unit.activities}</p>
                    <p className="text-xs text-orange-700">Atividades</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={16} className="text-purple-600" />
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-purple-900">{unit.attendance}%</p>
                    <p className="text-xs text-purple-700">Presença</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(unit.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye size={14} />
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => handleEditUnit(unit.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                </div>
              </div>
            ))}
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
