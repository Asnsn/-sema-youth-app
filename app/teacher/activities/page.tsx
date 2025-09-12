"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Users, Calendar, Clock, Plus, Search } from "lucide-react"
import TeacherMobileNav from "@/components/teacher-mobile-nav"
import TeacherSidebar from "@/components/teacher-sidebar"

const mockActivities = [
  {
    id: 1,
    name: "Yoga Matinal",
    description: "Aula de yoga para iniciantes",
    category: "fitness",
    max_participants: 20,
    schedule_days: ["Segunda", "Quarta", "Sexta"],
    schedule_time: "07:00 - 08:00",
    is_active: true,
    enrollments: [
      { id: 1, profiles: { full_name: "Ana Silva" } },
      { id: 2, profiles: { full_name: "João Santos" } },
    ],
  },
  {
    id: 2,
    name: "Pilates Avançado",
    description: "Aula de pilates para praticantes experientes",
    category: "fitness",
    max_participants: 15,
    schedule_days: ["Terça", "Quinta"],
    schedule_time: "18:00 - 19:00",
    is_active: true,
    enrollments: [{ id: 3, profiles: { full_name: "Maria Costa" } }],
  },
  {
    id: 3,
    name: "Meditação",
    description: "Sessão de meditação guiada",
    category: "wellness",
    max_participants: 30,
    schedule_days: ["Sábado"],
    schedule_time: "09:00 - 10:00",
    is_active: false,
    enrollments: [],
  },
]

export default function TeacherActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState("all")

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && activity.is_active) ||
      (filterActive === "inactive" && !activity.is_active)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Minhas Atividades</h1>
                <p className="text-gray-600">Gerencie suas atividades e turmas</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus size={20} />
                <span className="hidden sm:inline">Nova Atividade</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar atividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterActive("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterActive === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterActive("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterActive === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ativas
                </button>
                <button
                  onClick={() => setFilterActive("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterActive === "inactive"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Inativas
                </button>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{activity.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.is_active ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{activity.schedule_days.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{activity.schedule_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>
                      {activity.enrollments?.length || 0}/{activity.max_participants} alunos
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/teacher/attendance/${activity.id}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Chamada
                  </Link>
                  <Link
                    href={`/teacher/activities/${activity.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou criar uma nova atividade.</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <TeacherMobileNav />
      </div>
    </div>
  )
}
