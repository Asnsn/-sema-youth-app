"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Users, CheckCircle, XCircle, Search } from "lucide-react"
import TeacherMobileNav from "@/components/teacher-mobile-nav"
import TeacherSidebar from "@/components/teacher-sidebar"

const mockAttendanceData = [
  {
    id: 1,
    activity: {
      id: 1,
      name: "Yoga Matinal",
      schedule_time: "07:00 - 08:00",
    },
    date: "2024-12-09",
    total_students: 15,
    present_count: 12,
    absent_count: 3,
    status: "completed",
  },
  {
    id: 2,
    activity: {
      id: 2,
      name: "Pilates Avançado",
      schedule_time: "18:00 - 19:00",
    },
    date: "2024-12-09",
    total_students: 8,
    present_count: 7,
    absent_count: 1,
    status: "completed",
  },
  {
    id: 3,
    activity: {
      id: 1,
      name: "Yoga Matinal",
      schedule_time: "07:00 - 08:00",
    },
    date: "2024-12-11",
    total_students: 15,
    present_count: 0,
    absent_count: 0,
    status: "pending",
  },
]

const mockTodayActivities = [
  {
    id: 1,
    name: "Yoga Matinal",
    schedule_time: "07:00 - 08:00",
    enrolled_count: 15,
    status: "pending",
  },
  {
    id: 2,
    name: "Pilates Avançado",
    schedule_time: "18:00 - 19:00",
    enrolled_count: 8,
    status: "pending",
  },
]

export default function TeacherAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAttendance = mockAttendanceData.filter((record) => {
    const matchesSearch = record.activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = record.date === selectedDate
    return matchesSearch && matchesDate
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAttendanceRate = (present: number, total: number) => {
    if (total === 0) return 0
    return Math.round((present / total) * 100)
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Chamadas</h1>
                <p className="text-gray-600">Gerencie a presença dos alunos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Today's Activities */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades de Hoje</h2>
            {mockTodayActivities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockTodayActivities.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{activity.schedule_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{activity.enrolled_count} alunos</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {activity.status === "completed" ? "Concluída" : "Pendente"}
                      </span>
                    </div>
                    <Link
                      href={`/teacher/attendance/${activity.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block text-center"
                    >
                      Fazer Chamada
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade agendada para hoje.</p>
            )}
          </div>

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
              <div className="sm:w-48">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico - {formatDate(selectedDate)}</h2>

            {filteredAttendance.length > 0 ? (
              <div className="space-y-4">
                {filteredAttendance.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{record.activity.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{record.activity.schedule_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{record.total_students} alunos</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {record.status === "completed" ? (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} />
                              <span>{record.present_count} presentes</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle size={16} />
                              <span>{record.absent_count} ausentes</span>
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">
                                {getAttendanceRate(record.present_count, record.total_students)}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-yellow-600 text-sm font-medium">Chamada pendente</span>
                        )}

                        <Link
                          href={`/teacher/attendance/${record.activity.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {record.status === "completed" ? "Ver Detalhes" : "Fazer Chamada"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
                <p className="text-gray-600">Não há registros para a data selecionada.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <TeacherMobileNav />
      </div>
    </div>
  )
}
