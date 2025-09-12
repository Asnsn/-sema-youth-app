"use client"

import { useState } from "react"
import { Search, Users, Phone, Calendar, Mail } from "lucide-react"
import TeacherMobileNav from "@/components/teacher-mobile-nav"
import TeacherSidebar from "@/components/teacher-sidebar"

const mockStudents = [
  {
    id: 1,
    full_name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 99999-9999",
    date_of_birth: "1995-05-15",
    activities: ["Yoga Matinal", "Meditação"],
    enrollment_date: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    full_name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 88888-8888",
    date_of_birth: "1992-08-20",
    activities: ["Yoga Matinal"],
    enrollment_date: "2024-02-01",
    status: "active",
  },
  {
    id: 3,
    full_name: "Maria Costa",
    email: "maria.costa@email.com",
    phone: "(11) 77777-7777",
    date_of_birth: "1988-12-10",
    activities: ["Pilates Avançado"],
    enrollment_date: "2024-01-20",
    status: "active",
  },
  {
    id: 4,
    full_name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(11) 66666-6666",
    date_of_birth: "1990-03-25",
    activities: ["Yoga Matinal", "Pilates Avançado"],
    enrollment_date: "2024-03-01",
    status: "inactive",
  },
]

export default function TeacherStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && student.status === "active") ||
      (filterStatus === "inactive" && student.status === "inactive")

    return matchesSearch && matchesFilter
  })

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Meus Alunos</h1>
                <p className="text-gray-600">Lista de alunos inscritos nas suas atividades</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={20} />
                <span>{filteredStudents.length} alunos</span>
              </div>
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
                    placeholder="Buscar alunos por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ativos
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "inactive"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Inativos
                </button>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{student.full_name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{calculateAge(student.date_of_birth)} anos</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Atividades:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.activities.map((activity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Ver Perfil
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Histórico
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
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
