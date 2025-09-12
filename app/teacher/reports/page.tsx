"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react"
import TeacherMobileNav from "@/components/teacher-mobile-nav"
import TeacherSidebar from "@/components/teacher-sidebar"

const mockReportsData = {
  overview: {
    total_activities: 3,
    total_students: 24,
    average_attendance: 87,
    classes_this_month: 18,
  },
  attendance_by_activity: [
    { name: "Yoga Matinal", attendance_rate: 92, total_classes: 12, avg_students: 15 },
    { name: "Pilates Avançado", attendance_rate: 85, total_classes: 8, avg_students: 8 },
    { name: "Meditação", attendance_rate: 78, total_classes: 4, avg_students: 12 },
  ],
  monthly_stats: [
    { month: "Janeiro", classes: 16, attendance: 89 },
    { month: "Fevereiro", classes: 18, attendance: 85 },
    { month: "Março", classes: 20, attendance: 91 },
    { month: "Abril", classes: 17, attendance: 87 },
  ],
  top_students: [
    { name: "Ana Silva", attendance_rate: 98, total_classes: 45 },
    { name: "João Santos", attendance_rate: 95, total_classes: 42 },
    { name: "Maria Costa", attendance_rate: 92, total_classes: 38 },
    { name: "Pedro Oliveira", attendance_rate: 88, total_classes: 35 },
  ],
}

export default function TeacherReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedActivity, setSelectedActivity] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Relatórios</h1>
                <p className="text-gray-600">Análises e estatísticas das suas atividades</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Download size={20} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Ano</option>
                </select>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as Atividades</option>
                  <option value="yoga">Yoga Matinal</option>
                  <option value="pilates">Pilates Avançado</option>
                  <option value="meditation">Meditação</option>
                </select>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {mockReportsData.overview.total_activities}
                  </p>
                  <p className="text-sm text-gray-500">Atividades</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {mockReportsData.overview.total_students}
                  </p>
                  <p className="text-sm text-gray-500">Alunos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {mockReportsData.overview.average_attendance}%
                  </p>
                  <p className="text-sm text-gray-500">Presença Média</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {mockReportsData.overview.classes_this_month}
                  </p>
                  <p className="text-sm text-gray-500">Aulas no Mês</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance by Activity */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Presença por Atividade</h2>
              <div className="space-y-4">
                {mockReportsData.attendance_by_activity.map((activity, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{activity.name}</h3>
                      <span className="text-sm font-semibold text-gray-700">{activity.attendance_rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.attendance_rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{activity.total_classes} aulas</span>
                      <span>Média: {activity.avg_students} alunos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alunos Mais Assíduos</h2>
              <div className="space-y-4">
                {mockReportsData.top_students.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.total_classes} aulas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{student.attendance_rate}%</p>
                      <p className="text-xs text-gray-500">presença</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendências Mensais</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {mockReportsData.monthly_stats.map((month, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{month.month}</h3>
                    <div className="space-y-1">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{month.classes}</p>
                        <p className="text-xs text-gray-500">aulas</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">{month.attendance}%</p>
                        <p className="text-xs text-gray-500">presença</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <TeacherMobileNav />
      </div>
    </div>
  )
}
